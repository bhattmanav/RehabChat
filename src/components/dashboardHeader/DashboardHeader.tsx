import React, { useEffect, useState } from "react";
import "./DashboardHeader.css";
import { useNavigate } from "react-router-dom";
import useFetchConversations from "../hooks/useFetchConversations";
import { db } from "../../config/Firebase";
import { addDoc, collection } from "firebase/firestore";

export default function DashboardHeader() {
  const conversationsList = useFetchConversations();
  const conversationsCollectionRef = collection(db, "conversations");
  const navigate = useNavigate();

  // TODO: Finish handleNewButtonClick Functionality For Firebase Database
  async function onSubmitConversation() {
    // const id = crypto.randomUUID();
    const title = prompt(
      "What should your conversation be named? You can change this later.",
      ""
    );

    try {
      await addDoc(conversationsCollectionRef, {
        questions: [],
        title: title,
      });
      // Todo: Fix up the navigation functionality so that users are taken to the respective conversation once added.
      // navigate(`/edit/${id}`);
    } catch (error) {
      console.error(error);
    }
  }

  const buttonOptions = [
    {
      name: "New",
      icon: undefined,
      onClick: onSubmitConversation,
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
