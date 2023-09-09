import React from "react";
import classNames from "classnames";
import "./ConversationBubble.css";

type Role = "agent" | "user";

interface ConversationBubbleProps {
  role: Role;
  message: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export default function ConversationBubble({
  role,
  message,
  onClick,
}: ConversationBubbleProps) {
  return (
    <p
      onClick={onClick || (() => {})}
      className={classNames("conversation-bubble", {
        agent: role === "agent",
        user: role === "user",
      })}
    >
      {message}
    </p>
  );
}
