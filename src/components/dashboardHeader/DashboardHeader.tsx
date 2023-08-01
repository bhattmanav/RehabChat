import React, { useState } from "react";
import "./DashboardHeader.css";

interface Story {
  title: string;
}

export default function DashboardHeader() {
  const [stories, setStories] = useState<Story[]>([]);
  const buttonOptions = [
    {
      name: "New",
      icon: undefined,
      onClick: () => {
        const title = prompt(
          "What should your story be named? You can change this later.",
          ""
        );
        if (title) {
          const newStory = {
            title: title,
          };
          setStories([...stories, newStory]);
          localStorage.setItem(
            "stories",
            JSON.stringify([...stories, newStory])
          );
        }
      },
    },
    {
      name: "Edit",
      icon: undefined,
      onClick: undefined,
    },
    {
      name: "Tag",
      icon: undefined,
      onClick: undefined,
    },
    {
      name: "Rename",
      icon: undefined,
      onClick: undefined,
    },
    {
      name: "Duplicate",
      icon: undefined,
      onClick: undefined,
    },
    {
      name: "Delete",
      icon: undefined,
      onClick: undefined,
    },
  ];

  return (
    <div className="dashboard-header-wrapper">
      {buttonOptions.map(({ name, onClick }) => (
        <button
          key={name}
          className="dashboard-header-button"
          onClick={onClick}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
