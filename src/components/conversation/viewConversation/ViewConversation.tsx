import React from "react";
import { useParams } from "react-router-dom";
import ViewConversationChat from "../viewConversationChat/ViewConversationChat";
import "./ViewConversation.css";

export default function ViewConversation() {
  const { id } = useParams<{ id?: string }>();

  return (
    <div className="view-conversation-wrapper">
      <ViewConversationChat id={id} />
    </div>
  );
}
