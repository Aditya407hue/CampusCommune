# Convex Database Seed Data

This directory contains a seed script that populates the Convex database with test data for the job portal application.

## What's Included

The seed data includes:
- 1 admin user profile
- 3 student profiles with different skills and departments
- 4 job listings (full-time, part-time, and internship positions)
- 3 job applications with different statuses
- 2 notifications

## How to Use

You can run the seed script from the Convex dashboard or by making a mutation call to the `runSeed` function.

### From the Convex Dashboard

1. Navigate to your Convex project dashboard
2. Go to the "Functions" tab
3. Find the `seed:runSeed` function
4. Click "Run" to execute the seed script

### From Your Application

You can also run the seed script programmatically:

```typescript
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function SeedButton() {
  const runSeed = useMutation(api.seed.runSeed);
  
  return (
    <button onClick={() => runSeed()}>Seed Database</button>
  );
}
```

## Important Notes

- The seed script uses dummy user IDs that would normally come from your auth provider (like Clerk)
- Running the seed multiple times will create duplicate data
- In a production environment, you would want to add checks to prevent duplicate seeding
- The resume file IDs are placeholders and would need to be replaced with actual storage IDs in a real application

## Customizing the Seed Data

You can modify the `seed.ts` file to add more test data or change the existing data to better match your testing needs.