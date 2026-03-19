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

function App() {
  return (
    <LangProvider>
      <AppProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </AppProvider>
    </LangProvider>
  );
}

export default App;
