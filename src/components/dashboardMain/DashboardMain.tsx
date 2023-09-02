import React, { useEffect, useState } from "react";
import { auth } from "../../config/Firebase";
import { Link, useNavigate } from "react-router-dom";

import { Alert, Button, Card } from "react-bootstrap";
import classNames from "classnames";
import "./DashboardMain.css";
import useAuthEmail from "../hooks/useAuthEmail";
import useFetchConversations from "../hooks/useFetchConversations";
import { toTitleCase } from "../../functions/Functions";

export default function DashboardMain() {
  const email = useAuthEmail();
  const conversationsList = useFetchConversations();
  const navigate = useNavigate();
  const [clickedId, setClickedId] = useState("");
  const [error, setError] = useState<string>("");

  function redirectUserToDestination(id: string) {
    navigate(`/conversation/edit/${id}`);
  }

  async function handleLogout() {
    await auth.signOut();
    navigate("/signin");
  }

  return (
    <div className="dashboard-main-wrapper">
      {conversationsList.length === 0 ? (
        <h1>No conversations found.</h1>
      ) : (
        <h1>
          {conversationsList.length}{" "}
          {conversationsList.length === 1 ? "Conversation" : "Conversations"}
        </h1>
      )}

      <div className="dashboard-main-stories-wrapper">
        {conversationsList.map(({ id, title }) => (
          <div
            key={id}
            className={classNames("dashboard-main-story", {
              active: clickedId === id,
            })}
            onClick={() => setClickedId(id)}
            onDoubleClick={() => redirectUserToDestination(id)}
          >
            {toTitleCase(title)}
          </div>
        ))}
      </div>

      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {email === null ? "Loading" : email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </div>
  );
}
