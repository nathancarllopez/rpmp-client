import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";
import '@mantine/dates/styles.css';
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme";

import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

import { TanStackQueryProvider } from "./tanstack-query/QueryClientProvider.tsx";
import { queryClient } from "./tanstack-query/QueryClientProvider.tsx";

const router = createRouter({ routeTree, context: {
  userId: null,
  queryClient
}, defaultPreload: "intent", scrollRestoration: true })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <MantineProvider theme={theme}>
        <Notifications/>
        <TanStackQueryProvider>
          <RouterProvider router={router} />
        </TanStackQueryProvider>
      </MantineProvider>
    </StrictMode>,
  )
}