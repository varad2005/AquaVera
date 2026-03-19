import { Switch, Route, Router as WouterRouter } from "wouter";
import { LangProvider } from "./context/LangContext";
import { AppProvider } from "./context/AppContext";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import DashboardPage from "./pages/DashboardPage";
import RequestFormPage from "./pages/RequestFormPage";
import RequestsPage from "./pages/RequestsPage";
import BillingPage from "./pages/BillingPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/profile" component={ProfileSetupPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/request" component={RequestFormPage} />
      <Route path="/requests" component={RequestsPage} />
      <Route path="/billing" component={BillingPage} />
    </Switch>
  );
}

function AppContent() {
  const { loading } = useApp() || {};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F4]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B5E37]"></div>
      </div>
    );
  }

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

function App() {
  return (
    <LangProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LangProvider>
  );
}

export default App;
