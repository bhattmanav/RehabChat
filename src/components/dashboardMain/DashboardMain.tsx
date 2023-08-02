import React, { useEffect, useState } from "react";
import "./DashboardMain.css";

interface Story {
  title: string;
}

export default function DashboardMain() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const storedStories = localStorage.getItem("stories");
    if (storedStories) {
      const parsedStories: Story[] = JSON.parse(storedStories);
      setStories(parsedStories);
    }
  }, [localStorage.getItem("stories")]);

  return (
    <div className="dashboard-main-wrapper">
      {stories.length === 0 ? (
        <h1>No stories found.</h1>
      ) : (
        <h1>
          {stories.length} {stories.length === 1 ? "Story" : "Stories"}
        </h1>
      )}

      <div className="dashboard-main-stories-wrapper">
        {stories.map((story) => (
          <div className="dashboard-main-story">{story.title}</div>
        ))}
      </div>
    </div>
  );
}
