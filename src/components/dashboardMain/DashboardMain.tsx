import React, { useEffect, useRef, useState } from "react";
import { auth, db } from "../../config/Firebase";
import { Link, useNavigate } from "react-router-dom";

import { Alert, Button, Card, Form } from "react-bootstrap";
import classNames from "classnames";
import "./DashboardMain.css";
import useAuthEmail from "../hooks/useAuthEmail";
import useFetchConversations from "../hooks/useFetchConversations";
import { toTitleCase } from "../../functions/Functions";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import useGetAdminStatus from "../hooks/useGetAdminStatus";

export default function DashboardMain() {
  const navigate = useNavigate();
  const email = useAuthEmail();
  const isAdmin = useGetAdminStatus();
  const conversationsList = useFetchConversations();
  const usersCollectionRef = collection(db, "users");
  const [clickedId, setClickedId] = useState("");
  const [error, setError] = useState<string>("");
  const [emailRef, setEmailRef] = useState("");

  function redirectUserToDestination(id: string) {
    navigate(`/conversation/edit/${id}`);
  }

  async function handleLogout() {
    await auth.signOut();
    navigate("/signin");
  }

  async function makeUserAdmin(e: React.FormEvent) {
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
    <div className="dashboard-main-wrapper">
      {conversationsList.length === 0 ? (
        <h1>No conversations found.</h1>
      ) : (
        <h1>
          {conversationsList.length}{" "}
          {conversationsList.length === 1 ? "Conversation" : "Conversations"}
        </h1>
      )}

      <div className="dashboard-main-stories-wrapper">
        {conversationsList.map(({ id, title }) => (
          <div
            key={id}
            className={classNames("dashboard-main-story", {
              active: clickedId === id,
            })}
            onClick={() => setClickedId(id)}
            onDoubleClick={() => redirectUserToDestination(id)}
          >
            {toTitleCase(title)}
          </div>
        ))}
      </div>

      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email:</strong> {email === null ? "Loading" : email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

      {isAdmin && (
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Grant Admin Access</h2>
            <Form onSubmit={makeUserAdmin}>
              <Form.Group id="email" className="mb-4">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                  type="email"
                  id="email"
                  value={emailRef}
                  onChange={(e) => setEmailRef(e.target.value)}
                  required
                />
              </Form.Group>
              <Button className="w-100 mt-3" type="submit">
                Make Admin
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
