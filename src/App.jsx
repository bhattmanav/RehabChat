import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import EditConversation from "./components/editConversation/EditConversation";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/edit/:id" element={<EditConversation />} />
    </Routes>
  );
}

export default App;
