import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import "./DashboardMain.css";

interface Story {
  title: string;
  id: string;
}

export default function DashboardMain() {
  const [stories, setStories] = useState<Story[]>([]);
  const [clickedId, setClickedId] = useState("");

  const navigate = useNavigate();

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
    </div>
  );
}
