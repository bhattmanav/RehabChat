import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import AuthSignUp from "./components/authentication/signUp/AuthSignUp";
import AuthSignIn from "./components/authentication/signIn/AuthSignIn";
import EditConversation from "./components/editConversation/EditConversation";
import PrivateRoute from "./components/route/PrivateRoute";

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
    </Routes>
  );
}

export default App;
