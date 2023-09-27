import React, { useState } from "react";
import { auth, db } from "../../../config/Firebase";
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
import classNames from "classnames";
import { Conversation } from "../../conversation/ConversationUtils";
import { toTitleCase } from "../../../functions/Functions";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Form } from "react-bootstrap";
import DashboardHeader from "../dashboardHeader/DashboardHeader";
import "./DashboardMain.css";
import ConversationCard from "../../conversation/conversationCard/ConversationCard";

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
    console.log("Clicked Id:", id);
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
    // Todo: Remove when Tailwind Dashboard has been properly installed
    // <div className="dashboard-main-wrapper">
    //   <DashboardHeader id={clickedId} />
    //   {conversationsList.length === 0 ? (
    //     <h1>No conversations found.</h1>
    //   ) : (
    //     <h1 className="text-3xl">
    //       {conversationsList.length}{" "}
    //       {conversationsList.length === 1 ? "Conversation" : "Conversations"}
    //     </h1>
    //   )}

    //   <div className="dashboard-main-stories-wrapper">
    //     {conversationsList.map(({ id, title }) => (
    //       <div
    //         key={id}
    //         className={classNames("dashboard-main-story", {
    //           active: clickedId === id,
    //         })}
    //         onClick={() => setClickedId(id)}
    //         onDoubleClick={() => redirectUserToDestination(id)}
    //       >
    //         {toTitleCase(title)}
    //       </div>
    //     ))}
    //   </div>

    //   <Card>
    //     <Card.Body>
    //       <h2 className="text-center mb-4">Profile</h2>
    //       {error && <Alert variant="danger">{error}</Alert>}
    //       <strong>Email:</strong> {email === null ? "Loading" : email}
    //       <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
    //         Update Profile
    //       </Link>
    //     </Card.Body>
    //   </Card>
    //   <div className="w-100 text-center mt-2">
    //     <Button variant="link" onClick={handleLogout}>
    //       Log Out
    //     </Button>
    //   </div>

    //   {isAdmin && (
    //     <Card>
    //       <Card.Body>
    //         <h2 className="text-center mb-4">Grant Admin Access</h2>
    //         <Form onSubmit={makeUserAdmin}>
    //           <Form.Group id="email" className="mb-4">
    //             <Form.Label htmlFor="email">Email</Form.Label>
    //             <Form.Control
    //               type="email"
    //               id="email"
    //               value={emailRef}
    //               onChange={(e) => setEmailRef(e.target.value)}
    //               required
    //             />
    //           </Form.Group>
    //           <Button className="w-100 mt-3" type="submit">
    //             Make Admin
    //           </Button>
    //         </Form>
    //       </Card.Body>
    //     </Card>
    //   )}
    // </div>

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
