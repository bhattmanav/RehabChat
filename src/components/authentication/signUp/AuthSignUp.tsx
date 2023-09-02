import React, { useRef, useState } from "react";
import { auth, db } from "../../../config/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import "./AuthSignUp.css";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export default function AuthSignUp() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  async function signUp(email: string, password: string) {
    if (passwordRef.current && passwordConfirmRef.current) {
      if (passwordRef.current.value !== passwordConfirmRef.current.value) {
        return setError("Passwords do not match");
      }
    }

    try {
      setError("");
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        uid: user.uid,
        responses: [],
        isAdmin: false,
        created: serverTimestamp(),
      });
      navigate("/");
    } catch (error) {
      setError(error.message); // Display the error message
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (emailRef.current && passwordRef.current) {
      await signUp(emailRef.current.value, passwordRef.current.value);
    }
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "600px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email" className="mb-4">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control type="email" id="email" ref={emailRef} required />
              </Form.Group>

              <Form.Group id="password" className="mb-4">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                  type="password"
                  id="password"
                  ref={passwordRef}
                  required
                />
              </Form.Group>

              <Form.Group id="password-confirm" className="mb-4">
                <Form.Label htmlFor="password-confirm">
                  Password Confirmation
                </Form.Label>
                <Form.Control
                  type="password"
                  id="password-confirm"
                  ref={passwordConfirmRef}
                  required
                />
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-4" type="submit">
                {loading ? "Signing Up..." : "Sign Up"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          Already have an account? <Link to="/signin">Sign In</Link>
        </div>
      </div>
    </Container>
  );
}
