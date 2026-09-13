import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { createUserSchema } from "@/types/user";
import { toast } from "sonner";
import { createUserServerFn } from "@/data/user";

export const Route = createFileRoute("/dashboard/admin/create-user/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "Admin Ganteng",
      email: "admin123@gmail.com",
      password: "admin123",
    },
    validators: {
      onChange: createUserSchema,
      onSubmit: createUserSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const loading = toast.loading("Creating user...");
      await createUserServerFn({
        data: {
          name: value.name,
          email: value.email,
          password: value.password,
        },
      });
      toast.dismiss(loading);
      toast.success("User created successfully");
      navigate({ to: "/dashboard/admin" });
    },
  });

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mb-6 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            Create New User
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Add a new user to your organization with specific roles.
          </p>
        </div>

        {serverError && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            {serverError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            children={(field) => (
              <div className="space-y-1.5">
                <label
                  htmlFor={field.name}
                  className="block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Full Name
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  placeholder="Jane Doe"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 shadow-sm transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100 dark:focus:ring-neutral-100"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-red-500">{field.state.meta.errors.join(", ")}</p>
                )}
              </div>
            )}
          />

          <form.Field
            name="email"
            children={(field) => (
              <div className="space-y-1.5">
                <label
                  htmlFor={field.name}
                  className="block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Email Address
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="jane@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 shadow-sm transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100 dark:focus:ring-neutral-100"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-red-500">{field.state.meta.errors.join(", ")}</p>
                )}
              </div>
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <div className="space-y-1.5">
                <label
                  htmlFor={field.name}
                  className="block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Password
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 shadow-sm transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-neutral-100 dark:focus:ring-neutral-100"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-red-500">{field.state.meta.errors.join(", ")}</p>
                )}
              </div>
            )}
          />

          {/* <form.Field
            name="role"
            children={(field) => (
              <div className="space-y-1.5">
                <label
                  htmlFor={field.name}
                  className="block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Role
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value as "USER" | "ADMIN")}
                  className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 shadow-sm transition-colors focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-neutral-100 dark:focus:ring-neutral-100"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-red-500">{field.state.meta.errors.join(", ")}</p>
                )}
              </div>
            )}
          /> */}

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="mt-2 flex w-full items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:focus:ring-neutral-100 dark:focus:ring-offset-neutral-950"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  "Create Account"
                )}
              </button>
            )}
          />
        </form>
      </div>
    </div>
  );
}
