import { QueryClient } from "@tanstack/query-core";
import { aiDevtoolsPlugin } from "@tanstack/react-ai-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { HotkeysProvider, useHotkey } from "@tanstack/react-hotkeys";
import { hotkeysDevtoolsPlugin } from "@tanstack/react-hotkeys-devtools";
import { pacerDevtoolsPlugin } from "@tanstack/react-pacer-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { tableDevtoolsPlugin } from "@tanstack/react-table-devtools";
import { LenisRef, ReactLenis } from "lenis/react";
import { cancelFrame, frame } from "motion";
import { useEffect, useRef } from "react";

import { SanityVisualEditing } from "@/components/sanity/SanityVisualEditing";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/sonner";

import "lenis/dist/lenis.css";
import { QueryProvider } from "@/components/web/query-provider";

import "../styles.css";
import { Session, User } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth.function";
import { initStoryblok } from "@/lib/storyblok";
import { checkSanityPreview } from "@/server/sanity";

export interface RouterContext {
  user: User | null;
  session: Session | null;
  queryClient: QueryClient;
}
export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const data = await getSession();
    if (!data) {
      return {
        user: null,
        session: null,
      };
    }
    // whatever returned here automatically merges into the Route Context!
    return {
      user: data.user,
      session: data.session,
    };
  },
  loader: async () => {
    const { isPreview } = await checkSanityPreview();
    return { isPreview };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: `Envostart`,
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Sora:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootDocument,
});
function RootDocument({ children }: { children: React.ReactNode }) {
  initStoryblok();
  const router = useRouter();
  const lenisRef = useRef<LenisRef>(null);
  const { isPreview } = Route.useLoaderData();
  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp;
      lenisRef.current?.lenis?.raf(time);
    }

    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);
  // Hotkeys
  useHotkey(
    "Alt+H",
    () => {
      void router.navigate({
        to: "/",
      });
    },
    {
      meta: {
        name: "Home Shortcut",
        description: "Shortcut hotkeys to home page",
      },
    },
  );
  useHotkey(
    "Alt+S",
    () => {
      void router.navigate({
        to: "/dashboard",
      });
    },
    {
      meta: {
        name: "Dashboard Shortcut",
        description: "Shortcut hotkeys to dashboard page",
      },
    },
  );
  useHotkey(
    "Alt+1",
    () => {
      void router.navigate({
        to: "/dashboard/task-tracker",
      });
    },
    {
      meta: {
        name: "Task Tracker Shortcut",
        description: "Shortcut hotkeys to task tracker page",
      },
    },
  );
  useHotkey(
    "Alt+2",
    () => {
      void router.navigate({
        to: "/dashboard/quran-tracker",
      });
    },
    {
      meta: {
        name: `Qur'an Tracker Shortcut`,
        description: `Shortcut hotkeys to qur'an tracker page`,
      },
    },
  );
  useHotkey(
    "Alt+3",
    () => {
      void router.navigate({
        to: "/dashboard/blog",
      });
    },
    {
      meta: {
        name: `Dashboard Blog Shortcut`,
        description: `Shortcut hotkeys to dashboard blog page`,
      },
    },
  );
  useHotkey(
    "Alt+4",
    () => {
      void router.navigate({
        to: "/blog",
      });
    },
    {
      meta: {
        name: `Blog Shortcut`,
        description: `Shortcut hotkeys to blog page`,
      },
    },
  );
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryProvider>
          <HotkeysProvider
            defaultOptions={{
              hotkey: {
                preventDefault: true,
              },
              hotkeySequence: {
                timeout: 1500,
              },
              hotkeyRecorder: {
                onCancel: () => console.warn("Recording cancelled"),
              },
            }}
          >
            <ReactLenis
              root
              options={{
                autoRaf: false,
                autoToggle: true,
                anchors: true,
                allowNestedScroll: true,
                naiveDimensions: true,
                stopInertiaOnNavigate: true,
              }}
              ref={lenisRef}
            />
            <Provider defaultTheme="dark">
              <main className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background antialiased">
                {children}
              </main>
            </Provider>
            <Toaster closeButton position="top-center" />
            <TanStackDevtools
              config={{
                position: "bottom-right",
                defaultOpen: false,
                hideUntilHover: true,
                panelLocation: "bottom",
              }}
              plugins={[
                {
                  name: "TanStack Query",
                  render: <ReactQueryDevtoolsPanel />,
                  defaultOpen: true,
                },
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                  defaultOpen: true,
                },
                formDevtoolsPlugin(),
                pacerDevtoolsPlugin(),
                hotkeysDevtoolsPlugin(),
                aiDevtoolsPlugin(),
                tableDevtoolsPlugin(),
              ]}
              // this config is important to connect to the server event bus
              eventBusConfig={{
                connectToServerBus: true,
              }}
            />
            {isPreview && <SanityVisualEditing />}
            <Scripts />
          </HotkeysProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
