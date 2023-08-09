import React, { useEffect, useState } from "react";
import "./DashboardHeader.css";
import { useNavigate } from "react-router-dom";

interface Story {
  title: string;
}

export default function DashboardHeader() {
  const [stories, setStories] = useState<Story[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve stories from localStorage and parse it to a JavaScript array
    const storedStories = localStorage.getItem("stories");
    if (storedStories) {
      const parsedStories: Story[] = JSON.parse(storedStories);
      setStories(parsedStories);
    } else {
      // If "stories" key is not set in localStorage, initialize it with an empty array
      localStorage.setItem("stories", JSON.stringify([]));
    }
  }, []);

  const handleNewButtonClick = () => {
    let title = prompt(
      "What should your story be named? You can change this later.",
      ""
    );
    let id = crypto.randomUUID();

    if (title) {
      const newStory = {
        title: title,
        id: id,
      };
      setStories((prevStories) => [...prevStories, newStory]);
      localStorage.setItem(id, JSON.stringify([title]));

      // Retrieve existing stories from localStorage and parse it to a JavaScript array
      const storedStories = localStorage.getItem("stories");
      if (storedStories) {
        const parsedStories: Story[] = JSON.parse(storedStories);
        // Append the new story to the existing stories and store it back in localStorage
        localStorage.setItem(
          "stories",
          JSON.stringify([...parsedStories, newStory])
        );
      }

      navigate(`/edit/${id}`);
    }
  };

  const buttonOptions = [
    {
      name: "New",
      icon: undefined,
      onClick: handleNewButtonClick,
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
