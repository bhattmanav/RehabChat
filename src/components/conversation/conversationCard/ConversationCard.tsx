import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionData } from "../ConversationUtils";
import classNames from "classnames";
import { Timestamp } from "firebase/firestore";

interface ConversationCard {
  id: string;
  title: string;
  createdAt: Timestamp;
  questions: Array<QuestionData>;
  isActive: boolean;
  onClick: any;
}

export default function ConversationCard({
  id,
  title,
  createdAt,
  questions,
  isActive,
  onClick,
}: ConversationCard) {
  const navigate = useNavigate();

  function redirectUserToDestination(id: string): void {
    try {
      navigate(`/conversation/edit/${id}`);
    } catch (error) {
      console.error(`Error redirecting user to destination: ${error}`);
    }
  }

  function formatFirestoreDate(timestamp: Timestamp): string {
    const date = timestamp.toDate();
    const day = date.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    const dayWithSuffix = addOrdinalSuffix(day);

    return `${dayWithSuffix} ${month} ${year}`;
  }

  function addOrdinalSuffix(n: number): string {
    if (n % 10 === 1 && n % 100 !== 11) {
      return n + "st";
    } else if (n % 10 === 2 && n % 100 !== 12) {
      return n + "nd";
    } else if (n % 10 === 3 && n % 100 !== 13) {
      return n + "rd";
    } else {
      return n + "th";
    }
  }

  return (
    <article
      className={classNames(
        "cursor-pointer hover:animate-background rounded-xl border-solid border-2",
        {
          "border-solid border-2 border-blue-500": isActive,
          "border-purple-500": !isActive,
        }
      )}
      onClick={() => onClick(id)}
      onDoubleClick={() => redirectUserToDestination(id)}
    >
      <div
        className={classNames("rounded-[10px] p-4 !pt-20 sm:p-6", {
          "bg-blue-200": isActive,
        })}
      >
        <time
          // datetime="2022-10-10"
          className="block text-xs text-gray-500"
        >
          {createdAt !== undefined
            ? formatFirestoreDate(createdAt)
            : "16th Oct 2023"}
        </time>

        <a href="#">
          <h3 className="mt-0.5 text-lg font-medium text-gray-900">{title}</h3>
        </a>

        <div className="mt-4 flex flex-wrap gap-1">
          <span
            className={classNames(
              "whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600",
              {
                "bg-blue-100 px-2.5 py-0.5 text-xs text-blue-600": isActive,
              }
            )}
          >
            {id}
          </span>

          <span
            className={classNames(
              "whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-xs text-purple-600",
              {
                "bg-blue-100 px-2.5 py-0.5 text-xs text-blue-600": isActive,
              }
            )}
          >
            {questions.length} Questions
          </span>
        </div>
      </div>
    </article>
  );
}
