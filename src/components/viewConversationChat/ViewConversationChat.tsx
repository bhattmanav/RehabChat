import React, { useEffect, useState } from "react";

import useFetchConversationById from "../hooks/useFetchConversationById";
import ConversationBubble from "../conversationBubble/ConversationBubble";
import { Form, Button } from "react-bootstrap";
import { generateRandomId } from "../../functions/Functions";
import classNames from "classnames";
import {
  DocumentData,
  DocumentReference,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/Firebase";
import "./ViewConversationChat.css";
import { getAuth } from "firebase/auth";

interface ViewConversationChatProps {
  id?: string;
}

interface QuestionObject {
  [questionID: string]:
    | {
        title: string;
        type: string;
        serverResponse: string;
        options?: Array<MultipleChoiceOptionObject>;
      }
    | string;
}

interface MultipleChoiceOptionObject {
  [optionID: string]: {
    title: string;
    reference: string;
  };
}

interface QuestionData {
  options: Array<string>;
  serverResponse: string;
  userResponse?: string;
  title: string;
  type: string;
}

interface MessageObject {
  type: "question" | "response";
  text: string;
  format?: string;
  options?: Array<MultipleChoiceOptionObject>;
}

export default function ViewConversationChat({
  id,
}: ViewConversationChatProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionObject>();

  const [addedQuestionIds, setAddedQuestionIds] = useState<Set<string>>(
    new Set()
  );
  const [userResponse, setUserResponse] = useState<string>("");
  const [messageList, setMessageList] = useState<Array<MessageObject>>([]);
  const [userResponses, setUserResponses] = useState<Array<QuestionObject>>([]);

  const conversation = useFetchConversationById(id as string);
  const conversationTitle = conversation?.title;
  const questions = conversation?.questions || [];
  const auth = getAuth();
  const user = auth.currentUser;
  let userDocRef;

  if (user && user.uid) {
    userDocRef = doc(db, "users", user?.uid!);
  }

  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    setCurrentQuestion(currentQuestion);

    if (currentQuestion) {
      const questionID = Object.keys(currentQuestion)[0];

      if (!addedQuestionIds.has(questionID)) {
        const questionData = currentQuestion[questionID];

        setMessageList((prevMessages) => [
          ...prevMessages,
          {
            type: "question",
            text: questionData.title,
            format: questionData.type,
            options: questionData.options,
          },
        ]);
        setAddedQuestionIds((prevSet) => prevSet.add(questionID));
      }
    }
  }, [currentQuestionIndex, questions, addedQuestionIds]);

  function addUserResponse(e: React.FormEvent) {
    e.preventDefault();
    if (currentQuestion) {
      if (userResponse !== undefined) {
        const userResponseObject = { ...currentQuestion };
        userResponseObject.userResponse = userResponse;
        setUserResponses((prevResponses) => {
          // Create a new set of responses and add the userResponseObject
          const newResponsesSet = new Set(
            prevResponses.map((response) => JSON.stringify(response))
          );
          newResponsesSet.add(JSON.stringify(userResponseObject));

          // Convert the set back to an array of objects
          return Array.from(newResponsesSet).map((responseString) =>
            JSON.parse(responseString)
          );
        });
        setMessageList((prevMessages) => [
          ...prevMessages,
          { type: "response", text: userResponse },
        ]);
        setUserResponse("");
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      }
    }
  }

  function addMultipleChoiceUserResponse(
    selectedResponse: string,
    reference: string
  ) {
    const questionNumber = parseInt(reference.split("_").pop() || "0");
    const userResponseObject = { ...currentQuestion };
    userResponseObject.userResponse = selectedResponse;
    setUserResponses((prevResponses) => {
      // Create a new set of responses and add the userResponseObject
      const newResponsesSet = new Set(
        prevResponses.map((response) => JSON.stringify(response))
      );
      newResponsesSet.add(JSON.stringify(userResponseObject));

      // Convert the set back to an array of objects
      return Array.from(newResponsesSet).map((responseString) =>
        JSON.parse(responseString)
      );
    });
    setMessageList((prevMessages) => [
      ...prevMessages,
      { type: "response", text: selectedResponse },
    ]);
    setUserResponse("");
    setCurrentQuestionIndex(questionNumber - 1);
  }

  async function submitUserResponse() {
    // const data = {
    //   responses: {
    //     [conversationTitle as string]: JSON.stringify(userResponses),
    //   },
    // };

    try {
      // Step 1: Retrieve the existing data from the document
      const docSnap = await getDoc(userDocRef);
      const existingData = docSnap.data();

      const newData = {
        responses: {
          ...existingData?.responses,
          [conversationTitle as string]: userResponses,
        },
      };

      await updateDoc(userDocRef, newData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="view-conversation-chat-wrapper">
      <div className="view-conversation-chat-header">{`RehabChat - ${conversationTitle}`}</div>
      <div className="view-conversation-chat-inner-wrapper">
        <div className="view-conversation-chat-character"></div>
        <div className="view-conversation-chat-right-wrapper">
          <div className="view-conversation-chat">
            {messageList.map((message, index) => (
              <React.Fragment key={generateRandomId()}>
                <ConversationBubble
                  key={index}
                  role={message.type === "question" ? "agent" : "user"}
                  message={message.text}
                />
                {message.type === "question" &&
                  (message.format === "Multiple Choice" ||
                    message.format === "multiple choice") &&
                  message.options && (
                    <div style={{ display: "flex", gap: "2rem" }}>
                      {message.options.map((obj, index) => {
                        const option = Object.values(obj)[0];
                        const title = option.title;
                        const reference = option.reference;
                        return (
                          <ConversationBubble
                            key={generateRandomId()}
                            role="agent"
                            message={title}
                            onClick={() =>
                              addMultipleChoiceUserResponse(title, reference)
                            }
                          />
                        );
                      })}
                    </div>
                  )}
              </React.Fragment>
            ))}
            {currentQuestionIndex === questions.length && (
              <Button className="" type="submit" onClick={submitUserResponse}>
                Finish
              </Button>
            )}
          </div>
          <div className="view-conversation-chat-response">
            <Form onSubmit={addUserResponse}>
              <Form.Group id="response">
                <Form.Label htmlFor="instructions">
                  First or nick name. (Don't use surname)
                </Form.Label>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <Form.Control
                    type="text"
                    id="input-response"
                    className={classNames("w-100")}
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    required
                  />
                  <Button className="" type="submit">
                    Send
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
