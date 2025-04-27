import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { CLIENT_RENEG_LIMIT } from "tls";

const http = httpRouter();

auth.addHttpRoutes(http);

// Route to save mail data from Make.com webhook
http.route({
  path: "/saveMail",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
    const expectedApiKey = "abcd";
    console.log(apiKey, expectedApiKey);
    if (!apiKey || apiKey !== expectedApiKey) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const data = await request.json();

      // Basic validation for required mail fields
      if (
        !data.mailContent ||
        !Array.isArray(data.attachmentLinks) ||
        !data.classification ||
        !data.subject ||
        !data.reason
      ) {
        return new Response(
          JSON.stringify({
            success: false,
            error:
              "Missing required fields: mailContent, noOfAttachments, attachmentLinks, classification, reason",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Call the internal mutation to save the mail
      const mailId = await ctx.runMutation(api.mails.create, {
        subject: data.subject,
        companyName: data.companyName,
        mailContent: data.mailContent,
        attachmentLinks: data.attachmentLinks,
        classification: data.classification,
        reason: data.reason,
      });

      return new Response(
        JSON.stringify({ success: true, mailId: mailId.toString() }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error: any) {
      console.error("Error processing saveMail request:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Internal Server Error";
      return new Response(
        JSON.stringify({ success: false, error: errorMessage }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});
http.route({
  path: "/createJob",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
    const expectedApiKey = "abcd";

    if (!apiKey || apiKey !== expectedApiKey) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const data = await request.json();

      // Validate required fields
      //   if (!data.jobId) {
      //     return new Response("Missing required field: jobId", { status: 400 });
      //   }

      // Validate optional fields according to schema
      const updateData: any = {};
      if (data.title) updateData.title = data.title;
      if (data.company) updateData.company = data.company;
      if (data.description) updateData.description = data.description;
      if (data.location) updateData.location = data.location;
      if (data.type) updateData.type = data.type;
      if (data.skills) updateData.skills = data.skills;
      if (data.salary) {
        updateData.salary = {
          stipend: data.salary.stipend,
          postConfirmationCTC: data.salary.postConfirmationCTC,
        };
      }
      if (data.deadline) updateData.deadline = data.deadline;
      if (data.mailId) updateData.mailId = data.mailId;

      //   console.log(data.mailId);
      // Call the mutation

      const result = await ctx.runMutation(api.jobs.create, {
        ...updateData,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("Error updating job via HTTP action:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Internal Server Error";
      const statusCode = errorMessage.includes("Invalid API Key")
        ? 401
        : errorMessage.includes("not found")
          ? 404
          : 500;
      return new Response(errorMessage, { status: statusCode });
    }
  }),
});

// http.route({
//   path: "/updateJobStatus",
//   method: "POST",
//   handler: httpAction(async (ctx, request) => {
//     const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
//     const expectedApiKey = process.env.MAKE_COM_API_KEY;

//     if (!apiKey || apiKey !== expectedApiKey) {
//       return new Response("Unauthorized", { status: 401 });
//     }

//     try {
//       const data = await request.json();

//       // Basic validation
//       if (!data.jobId) {
//         return new Response("Missing required field: jobId", { status: 400 });
//       }

//       // Validate status
//       const validStatuses = ["active", "inactive", "filled"];
//       if (data.status && !validStatuses.includes(data.status)) {
//           return new Response(`Invalid status: ${data.status}`, { status: 400 });
//       }

//       // Validate isApproved if provided
//       if (data.isApproved !== undefined && typeof data.isApproved !== 'boolean') {
//         return new Response("Invalid isApproved value: must be boolean", { status: 400 });
//       }

//       // Prepare update data
//       const updateData: any = {};
//       if (data.status) updateData.status = data.status;
//       if (data.isApproved !== undefined) updateData.isApproved = data.isApproved;
//       if (data.approvedBy) updateData.approvedBy = data.approvedBy;

//       // Call the mutation
//       const result = await ctx.runMutation(api.jobs.updateJobStatusFromWebhook, {
//         jobId: data.jobId,
//         ...updateData
//       });

//       return new Response(JSON.stringify(result), {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       });

//     } catch (error: any) {
//       console.error("Error updating job status via HTTP action:", error);
//       const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
//       const statusCode = errorMessage.includes("Invalid API Key") ? 401
//                        : errorMessage.includes("not found") ? 404
//                        : 500;
//       return new Response(errorMessage, { status: statusCode });
//     }
//   }),
// });

http.route({
  path: "/jobUpdate",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
    const expectedApiKey = "abcd";

    if (!apiKey || apiKey !== expectedApiKey) {
      return new Response("Unauthorized", { status: 401 });
    }

    // console.log(await request.json());

    try {
      const { summary, mailId, companyName } = await request.json();
      console.log(summary, mailId, companyName);

      // Basic validation
      if (!summary || !mailId || !companyName) {
        return new Response("Missing required fields: jobId, summary, mailId", {
          status: 400,
        });
      }

      // Call the mutation
      const result = await ctx.runMutation(api.jobUpdates.create, {
        summary,
        mailId,
        companyName,
      });

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("Error updating job via HTTP action:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Internal Server Error";
      const statusCode = errorMessage.includes("Invalid API Key")
        ? 401
        : errorMessage.includes("not found")
          ? 404
          : 500;
      return new Response(errorMessage, { status: statusCode });
    }
  }),
});

http.route({
  path: "/getActiveCompanies",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
    const expectedApiKey = "abcd";
    if (!apiKey || apiKey !== expectedApiKey) {
      return new Response("Unauthorized", { status: 401 });
    }
    try {
      // Query your Convex function that returns active jobs
      const activeJobs = await ctx.runQuery(api.jobs.listActiveCompanies, {});
      const companies = activeJobs.map((job) => job.company);
      return new Response(JSON.stringify({ success: true, companies }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("Error fetching active companies:", error);
      const message =
        error instanceof Error ? error.message : "Internal Server Error";
      return new Response(JSON.stringify({ success: false, error: message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

http.route({
  path: "/uploadAttachments",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");
    const expectedApiKey = "abcd";
    console.log(apiKey, expectedApiKey);
    if (!apiKey || apiKey !== expectedApiKey) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const data = await request.json();

      // Basic validation for required mail fields
      if (!data.mailId) {
        return new Response(
          JSON.stringify({
            success: false,
            error:
              "Missing required fields: mailId",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const attachmentLinks=data.attachmentLinks;


      // const extractedLinks = attachmentLinks.map((link:string)=>{
      // // The original string (might vary slightly based on exact source)
      //         const inputString = link;

      //         let cleanedString = inputString.trim();

      //         const jsonStart = cleanedString.indexOf('{');
      //         const jsonEnd = cleanedString.lastIndexOf('}');

      //         if (jsonStart !== -1 && jsonEnd !== -1) {
      //           cleanedString = cleanedString.substring(jsonStart, jsonEnd + 1);
      //         }
      //         cleanedString = cleanedString.replace(/`([^`]*)`/g, '$1');

      //         // console.log("Cleaned String:", cleanedString);

      //         try {
      //           const dataObject = JSON.parse(cleanedString);
      //         //   console.log("Parsed Object:", dataObject);
      //           // Access the link:
      //           const link = dataObject.webViewLink;
      //           console.log("Extracted Link:", link);
      //           return link;

      //         } catch (error) {
      //           console.error("Failed to parse JSON:", error);
      //           console.error("Ensure the cleaned string is valid JSON:", cleanedString);
      //         }
  
      // })

      console.log(attachmentLinks);
      const extractedLinks = attachmentLinks.map((link: {webViewLink: string}) => {
        return link.webViewLink;
      })

      console.log(extractedLinks);


      // Call the internal mutation to save the mail
      const mailId = await ctx.runMutation(api.mails.uploadAttachments, {
        mailId: data.mailId,
        attachmentLinks: extractedLinks
      });

      return new Response(
        JSON.stringify({ success: true, mailId: mailId.toString() }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error: any) {
      console.error("Error processing saveMail request:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Internal Server Error";
      return new Response(
        JSON.stringify({ success: false, error: errorMessage }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }),
});

export default http;
