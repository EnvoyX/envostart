import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import React from 'react';

import { allowedRoles } from '@/lib/constants';

export const Route = createFileRoute('/dashboard/admin')({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (!allowedRoles.includes(context?.user?.role as string)) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
});

function RouteComponent() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
}
