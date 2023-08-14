import React, { useEffect, useState } from "react";
import { auth } from "../../config/Firebase";
import { Link, useNavigate } from "react-router-dom";

import { Alert, Button, Card } from "react-bootstrap";
import classNames from "classnames";
import "./DashboardMain.css";
import useAuthEmail from "../hooks/useAuthEmail";

interface Story {
  title: string;
  id: string;
}

export default function DashboardMain() {
  const email = useAuthEmail();
  const navigate = useNavigate();

  const [stories, setStories] = useState<Story[]>([]);
  const [clickedId, setClickedId] = useState("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const storedStories = localStorage.getItem("stories");
    if (storedStories) {
      const parsedStories: Story[] = JSON.parse(storedStories);
      setStories(parsedStories);
    }
  }, [localStorage.getItem("stories")]);

  function redirectUserToDestination(id: string) {
    navigate(`/edit/${id}`);
  }

  async function handleLogout() {
    await auth.signOut();
    navigate("/signin");
  }

  return (
    <div className="dashboard-main-wrapper">
      {stories.length === 0 ? (
        <h1>No conversations found.</h1>
      ) : (
        <h1>
          {stories.length}{" "}
          {stories.length === 1 ? "Conversation" : "Conversations"}
        </h1>
      )}

      <div className="dashboard-main-stories-wrapper">
        {stories.map(({ id, title }) => (
          <div
            key={id}
            className={classNames("dashboard-main-story", {
              active: clickedId === id,
            })}
            onClick={() => setClickedId(id)}
            onDoubleClick={() => redirectUserToDestination(id)}
          >
            {title}
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
