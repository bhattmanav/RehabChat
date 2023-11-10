import React from "react";
import classNames from "classnames";
import "./ConversationBubble.css";

type Role = "agent" | "user";

interface ConversationBubbleProps {
  role: Role;
  message: string;
  format?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export default function ConversationBubble({
  role,
  message,
  format,
  onClick,
}: ConversationBubbleProps) {
  return (
    <div className="conversation-bubble-wrapper">
      {role === "agent" && format !== "Multiple Choice" && (
        <span className="conversation-bubble-name">Jo</span>
      )}
      <p
        onClick={onClick || (() => {})}
        className={classNames("conversation-bubble", {
          agent: role === "agent",
          user: role === "user",
        })}
      >
        {message.split("\n").map((paragraph, index) => (
          <React.Fragment key={index}>
            {paragraph}
            <br />
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
