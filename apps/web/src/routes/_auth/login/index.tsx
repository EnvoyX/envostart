import { createFileRoute, redirect } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-adapter";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/schemas/auth";

export const Route = createFileRoute("/_auth/login/")({
  beforeLoad: async ({ context }) => {
    if (context?.user) throw redirect({ to: "/dashboard" });
    return;
  },
  loader: ({ context }) => {
    return { user: context?.user };
  },
  validateSearch: zodValidator(
    z.object({
      callbackUrl: z.string().optional().default("/dashboard"),
    }),
  ),
  head: () => ({
    meta: [
      { title: "Login | Envostart" },
      {
        name: "Envostart",
        content: "Welcome to TanStack Start playground!",
      },
      { property: "og:title", content: "Login | Envostart" },
      { property: "og:description", content: "Login to your account in Envostart" },
      { property: "og:image", content: "https://tanstack.com/assets/og-C0HGjoLl.png" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { callbackUrl } = Route.useSearch();
  const { user } = Route.useLoaderData();
  const [isPending, setIsPending] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setIsPending(true);

      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL: callbackUrl,
        },
        {
          onRequest: () => {
            toast.loading("Logging in...", { id: "email-login" });
          },
          onSuccess: () => {
            toast.dismiss("email-login");
            toast.success("Logged in successfully");
            setIsRedirecting(true);
            setIsPending(false);
          },
          onError: (ctx) => {
            toast.dismiss("email-login");
            const errorMessage = ctx.error.message || "Invalid email or password";
            setServerError(errorMessage);
            toast.error("Failed to login", {
              description: errorMessage,
            });
            setIsPending(false);
          },
        },
      );
    },
  });

  async function handleLogin(provider: "github" | "google" | "discord") {
    setIsPending(true);
    setServerError(null);

    await authClient.signIn.social({
      provider: provider,
      callbackURL: callbackUrl,
      fetchOptions: {
        onRequest() {
          toast.loading(`Logging in with ${provider.toUpperCase()}...`, {
            id: "login-oauth",
          });
        },
        onSuccess: () => {
          toast.dismiss("login-oauth");
          toast.success(`Logged in with ${provider.toUpperCase()} successfully`);
          setIsRedirecting(true);
          setIsPending(false);
        },
        onError: ({ error }: { error: Error }) => {
          toast.dismiss("login-oauth");
          toast.error(`Failed to login with ${provider.toUpperCase()}`, {
            description: error.message,
          });
          setIsPending(false);
        },
      },
    });
  }

  useEffect(() => {
    if (!user) {
      setIsRedirecting(false);
    }
  }, [user]);

  if (isRedirecting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-transparent">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-zinc-700" />
            <div className="absolute inset-0 rounded-full border-2 border-zinc-100 border-t-transparent animate-spin" />
          </div>
          <div className="mt-6 flex flex-col items-center">
            <p className="text-sm font-medium tracking-wide text-zinc-400 animate-pulse">
              Redirecting to workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[85vh] w-full items-center justify-center p-4 antialiased">
      <Card className="w-full max-w-[400px] border-zinc-800 bg-zinc-950/90 text-zinc-50 shadow-2xl backdrop-blur-md">
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="text-xl font-semibold tracking-tight text-zinc-100">
            Welcome back
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Log in to your account to access your projects
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {serverError && (
            <div className="rounded-md border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-400">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => handleLogin("google")}
              variant="outline"
              type="button"
              disabled={isPending}
              className="w-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white transition-colors hover:cursor-pointer"
            >
              <span className="icon-[material-icon-theme--google] size-4" />
            </Button>

            <Button
              onClick={() => handleLogin("github")}
              variant="outline"
              type="button"
              disabled={isPending}
              className="w-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white transition-colors hover:cursor-pointer"
            >
              <span className="icon-[mdi--github] size-4" />
            </Button>

            <Button
              onClick={() => handleLogin("discord")}
              variant="outline"
              type="button"
              disabled={isPending}
              className="w-full border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white transition-colors hover:cursor-pointer"
            >
              <span className="icon-[ic--baseline-discord] size-4" />
            </Button>
          </div>

          <div className="relative flex items-center justify-center py-1">
            <div className="w-full border-t border-zinc-800" />
            <span className="absolute bg-zinc-950 px-2 text-[10px] uppercase font-mono tracking-widest text-zinc-500">
              OR
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-3.5"
          >
            <FieldGroup className="space-y-3">
              <form.Field
                name="email"
                children={(field) => (
                  <Field className="space-y-1.5">
                    <label htmlFor={field.name} className="block text-xs font-medium text-zinc-300">
                      Email address
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="name@example.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-100 shadow-sm placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors disabled:opacity-50"
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-[11px] text-red-400">
                        {field.state.meta.errors.map((error) => error?.message)}
                      </p>
                    )}
                  </Field>
                )}
              />

              <form.Field
                name="password"
                children={(field) => (
                  <Field className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={field.name}
                        className="block text-xs font-medium text-zinc-300"
                      >
                        Password
                      </label>
                    </div>
                    <input
                      id={field.name}
                      name={field.name}
                      type="password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isPending}
                      className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-100 shadow-sm placeholder:text-zinc-600 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-colors disabled:opacity-50"
                    />
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-[11px] text-red-400">
                        {field.state.meta.errors.map((error) => error?.message).join(", ")}
                      </p>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || isPending}
                  className="w-full rounded-md bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-medium text-xs h-9 shadow transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting || isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent" />
                      Signing in...
                    </span>
                  ) : (
                    "Continue with Email"
                  )}
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
