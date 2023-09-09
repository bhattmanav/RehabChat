import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import AuthSignUp from "./components/authentication/signUp/AuthSignUp";
import AuthSignIn from "./components/authentication/signIn/AuthSignIn";
import EditConversation from "./components/conversation/editConversation/EditConversation";
import ViewConversation from "./components/conversation/viewConversation/ViewConversation";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/signup" element={<AuthSignUp />} />
      <Route path="/signin" element={<AuthSignIn />} />
      <Route path="/conversation/edit/:id" element={<EditConversation />} />
      <Route path="/conversation/view/:id" element={<ViewConversation />} />
    </Routes>
  );
}

export default App;
