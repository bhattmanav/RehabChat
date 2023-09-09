import React, { useEffect, useState } from "react";
import { db } from "../../../config/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import classNames from "classnames";
import useFetchConversationById from "../../hooks/useFetchConversationById";
import { generateRandomId } from "../../../functions/Functions";
import {
  QuestionData,
  Question,
  MultipleChoiceOption,
  Conversation,
} from "../ConversationUtils";
import { Form, Button } from "react-bootstrap";
import ConversationBubble from "../conversationBubble/ConversationBubble";
import "./ViewConversationChat.css";

interface ViewConversationChatProps {
  id?: string;
}

interface MessageObject {
  type: "question" | "response";
  text: string;
  format?: string;
  options?: Array<MultipleChoiceOption>;
}

export default function ViewConversationChat({
  id,
}: ViewConversationChatProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(
    null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [addedQuestionIds, setAddedQuestionIds] = useState<Set<string>>(
    new Set<string>()
  );
  const [userResponse, setUserResponse] = useState<string>("");
  const [userResponses, setUserResponses] = useState<Array<QuestionData>>([]);
  const [messageList, setMessageList] = useState<Array<MessageObject>>([]);
  const conversation: Conversation | null = useFetchConversationById(
    id as string
  );
  const conversationTitle: string =
    conversation?.title || "no conversation found";
  const questions: Array<QuestionData> = conversation?.questions ?? [];
  const auth = getAuth();
  const user = auth.currentUser;
  const userDocRef = user?.uid && doc(db, "users", user?.uid);

  useEffect(() => {
    setCurrentQuestion(questions[currentQuestionIndex]);

    if (currentQuestion) {
      const questionId = Object.keys(currentQuestion)[0];

      if (!addedQuestionIds.has(questionId)) {
        const questionData = currentQuestion[questionId] as Question;

        setMessageList((prevMessages) => [
          ...prevMessages,
          {
            type: "question",
            text: questionData.title,
            format: questionData.type,
            options: questionData.options,
          },
        ]);
        setAddedQuestionIds((prevSet) => prevSet.add(questionId));
      }
    }
  }, [currentQuestion, currentQuestionIndex, questions, addedQuestionIds]);

  function addUserResponse(userResponse: string): void {
    const userResponseObject = { ...currentQuestion, userResponse };

    setUserResponses((prevResponses) => {
      const newResponsesSet = new Set(
        prevResponses.map((response) => JSON.stringify(response))
      );
      newResponsesSet.add(JSON.stringify(userResponseObject));
      return Array.from(
        newResponsesSet,
        (responseString) => JSON.parse(responseString) as QuestionData
      );
    });
    setMessageList((prevMessages) => [
      ...prevMessages,
      { type: "response", text: userResponse },
    ]);
    setUserResponse("");
  }

  function processWrittenUserResponse(e: React.FormEvent): void {
    e.preventDefault();
    if (!currentQuestion && userResponse === undefined) {
      return;
    }
    addUserResponse(userResponse);
    setCurrentQuestionIndex((prevQuestionIndex) => prevQuestionIndex + 1);
  }

  function processMultipleChoiceUserResponse(
    selectedResponse: string,
    questionReference: string
  ): void {
    const questionNumber = parseInt(questionReference.split("_").pop() || "0");

    if (isNaN(questionNumber) || questionNumber <= 0) {
      console.error("Invalid question number:", questionNumber);
      return;
    }

    addUserResponse(selectedResponse);
    setCurrentQuestionIndex(questionNumber - 1);
  }

  async function submitUserResponse(): Promise<void> {
    try {
      if (userDocRef) {
        const docSnap = await getDoc(userDocRef);
        const existingData = docSnap.data();

        if (existingData) {
          const newData = {
            responses: {
              ...existingData?.responses,
              [conversationTitle as string]: userResponses,
            },
          };

          await updateDoc(userDocRef, newData);
        }
      }
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
                              processMultipleChoiceUserResponse(
                                title,
                                reference
                              )
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
            <Form onSubmit={processWrittenUserResponse}>
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
