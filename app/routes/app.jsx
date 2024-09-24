import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";

// Add this early to suppress WebSocket errors related to Shopify monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message.includes("argus.shopifycloud.com/graphql")) {
      event.preventDefault(); // Ignore WebSocket connection errors
    }
  });
}

// Links for Polaris CSS
export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

// Loader function to authenticate and retrieve Shopify API key
export const loader = async ({ request }) => {
  await authenticate.admin(request); // Ensures the user is authenticated with Shopify

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

// Main App Component
export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/badges">Badges</Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
  );
}

// Error Boundary for catching errors in the app
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

// Custom headers required by Shopify
export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
