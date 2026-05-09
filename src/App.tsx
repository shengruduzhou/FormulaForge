import { PageShell } from "./components/layout/PageShell";
import { DocsPage } from "./app/routes/DocsPage";
import { ExamplesPage } from "./app/routes/ExamplesPage";
import { LandingPage } from "./app/routes/LandingPage";
import { WorkspacePage } from "./app/routes/WorkspacePage";

function getRoute() {
  const path = window.location.pathname;
  if (path.startsWith("/app")) return "app";
  if (path.startsWith("/examples")) return "examples";
  if (path.startsWith("/docs")) return "docs";
  return "landing";
}

export default function App() {
  const route = getRoute();

  return (
    <PageShell>
      {route === "landing" && <LandingPage />}
      {route === "app" && <WorkspacePage />}
      {route === "examples" && <ExamplesPage />}
      {route === "docs" && <DocsPage />}
    </PageShell>
  );
}
