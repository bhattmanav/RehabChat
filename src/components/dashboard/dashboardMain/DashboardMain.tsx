import React, { useState } from "react";
import { db } from "../../../config/Firebase";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import useAuthEmail from "../../hooks/useAuthEmail";
import useFetchConversations from "../../hooks/useFetchConversations";
import useGetAdminStatus from "../../hooks/useGetAdminStatus";
import { Conversation } from "../../conversation/ConversationUtils";
import { toTitleCase } from "../../../functions/Functions";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../dashboardHeader/DashboardHeader";
import ConversationCard from "../../conversation/conversationCard/ConversationCard";
import "./DashboardMain.css";

export default function DashboardMain() {
  const [clickedId, setClickedId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [emailRef, setEmailRef] = useState<string>("");
  const conversationsList: Array<Conversation> = useFetchConversations();
  const email: string = useAuthEmail();
  const isAdmin: boolean = useGetAdminStatus();
  const navigate = useNavigate();
  const usersCollectionRef = collection(db, "users");

  const handleCardClick = (id: string) => {
    setClickedId(id);
  };

  async function makeUserAdmin(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();

    try {
      const userDocs = await getDocs(
        query(usersCollectionRef, where("email", "==", emailRef))
      );
      const userDoc = userDocs.docs[0];

      if (userDoc) {
        await updateDoc(userDoc.ref, { isAdmin: true });
        setEmailRef("");
        console.log(`User with email ${emailRef} is now an admin.`);
      } else {
        console.log(`No user found with email: ${emailRef}`);
      }
    } catch (error) {
      console.error(
        `Error making user with email ${emailRef} an admin:`,
        error
      );
    }
  }

  return (
    <div className="min-h-full">
      <DashboardHeader id={clickedId} />
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {conversationsList.length === 0 ? (
              "No conversations found."
            ) : (
              <>
                {conversationsList.length}{" "}
                {conversationsList.length === 1
                  ? "Conversation"
                  : "Conversations"}
              </>
            )}
          </h1>
        </div>
      </header>
      <main>
        <div className="grid grid-cols-3 gap-4 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {conversationsList.map(({ id, title, createdAt, questions }) => (
            <ConversationCard
              key={id}
              id={id}
              title={toTitleCase(title)}
              createdAt={createdAt as any}
              questions={questions}
              isActive={clickedId === id}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
