import React, { useEffect, useState } from "react";
import { db } from "../../../config/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import useFetchConversationById from "../../hooks/useFetchConversationById";
import {
  generateRandomId,
  playTextToSpeech,
} from "../../../functions/Functions";
import {
  QuestionData,
  Question,
  MultipleChoiceOption,
  Conversation,
} from "../ConversationUtils";
import { Form, Button } from "react-bootstrap";
import ConversationBubble from "../conversationBubble/ConversationBubble";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import "./ViewConversationChat.css";

interface ViewConversationChatProps {
  id?: string;
}

interface MessageObject {
  type: "question" | "response" | "server";
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
  const [questionData, setQuestionData] = useState<Question>();
  const [messageList, setMessageList] = useState<Array<MessageObject>>([]);
  const [textToSpeech, setTextToSpeech] = useState<boolean>(false);
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
        setQuestionData(questionData);

        setMessageList((prevMessages) => [
          ...prevMessages,
          {
            type: "question",
            text: questionData.title,
            format: questionData.type,
            options: questionData.options,
          },
        ]);

        if (textToSpeech) {
          playTextToSpeech(questionData.title);
        }

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
      { type: "server", text: questionData.serverResponse },
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
      <div className="view-conversation-chat-header">{`RehabChat - [${conversationTitle}]`}</div>
      <div className="view-conversation-chat-inner-wrapper">
        <div className="view-conversation-chat-character">
          <FontAwesomeIcon
            className="view-conversation-chat-text-to-speech fa-fw"
            onClick={() => setTextToSpeech((prev) => !prev)}
            icon={textToSpeech ? faVolumeHigh : faVolumeXmark}
          />
        </div>
        <div className="view-conversation-chat-right-wrapper">
          <div className="view-conversation-chat">
            <ConversationBubble
              key={1}
              role="agent"
              message={`This is the RehabChat ${conversationTitle} Module.\n\nAnswer the questions below when you are ready to start.`}
            />

            {messageList.map((message, index) => (
              <React.Fragment key={generateRandomId()}>
                <ConversationBubble
                  key={index}
                  role={
                    message.type === "question" || message.type === "server"
                      ? "agent"
                      : "user"
                  }
                  message={message.text}
                />
                {message.type === "question" &&
                  (message.format === "Multiple Choice" ||
                    message.format === "multiple choice") &&
                  message.options && (
                    <div style={{ display: "flex", gap: "2rem" }}>
                      {message.options.map((obj, index) => {
                        console.log(message.format);

                        const option = Object.values(obj)[0];
                        const title = option.title;
                        const reference = option.reference;

                        return (
                          <ConversationBubble
                            key={generateRandomId()}
                            role="agent"
                            format={message.format}
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
              <Button
                className="text-lg text-white rounded bg-buttonColor px-6 py-1"
                type="submit"
                onClick={submitUserResponse}
              >
                Finish
              </Button>
            )}
          </div>
          <div className="view-conversation-chat-response">
            <Form onSubmit={processWrittenUserResponse}>
              <Form.Group id="response">
                <Form.Label htmlFor="instructions">
                  {questionData?.instruction}
                </Form.Label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "1rem",
                  }}
                >
                  <Form.Control
                    type="text"
                    id="input-response"
                    className="w-full px-2 py-1 border-solid border border-black"
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    required
                  />
                  <Button
                    className="text-lg text-white rounded bg-buttonColor px-6 py-1"
                    type="submit"
                  >
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
