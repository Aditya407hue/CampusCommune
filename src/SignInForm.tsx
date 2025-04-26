import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UserIcon, KeyIcon } from "lucide-react";


export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    formData.set("flow", flow);

    void (async () => {
      try {
        await signIn("password", formData);
      } catch {
        const toastTitle =
          flow === "signIn"
            ? "Could not sign in, did you mean to sign up?"
            : "Could not sign up, did you mean to sign in?";
        toast.error(toastTitle);
        setError(toastTitle);
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl border-0">
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {flow === "signIn" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-600">
              {flow === "signIn"
                ? "Sign in to access your account"
                : "Sign up to get started with Campus Commune"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
              <div className="relative">
                <KeyIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">◌</span>
                  {flow === "signIn" ? "Signing in..." : "Signing up..."}
                </span>
              ) : flow === "signIn" ? (
                "Sign in"
              ) : (
                "Sign up"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <span>
                {flow === "signIn"
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </span>
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
                onClick={() => {
                  setFlow(flow === "signIn" ? "signUp" : "signIn");
                  setError(null);
                }}
              >
                {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
              </button>
            </div>
          </form>

          {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-50 text-gray-600"
            onClick={() => void signIn("anonymous")}
          >
            Continue as guest
          </Button> */}
        </CardContent>
      </Card>
    </div>
  );
}
