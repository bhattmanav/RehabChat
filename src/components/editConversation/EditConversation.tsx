import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./EditConversation.css";
import useFetchConversationById from "../hooks/useFetchConversationById";
import { toTitleCase } from "../../functions/Functions";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/Firebase";

interface QuestionObject {
  [questionID: string]: {
    title: string;
    type: string;
    serverResponse: string;
    options?: Array<MultipleChoiceOptionObject>;
  };
}

interface MultipleChoiceOptionObject {
  [optionID: string]: {
    title: string;
    reference: string;
  };
}

function EditConversation() {
  const defaultQuestion = {
    questionID: {
      title: "",
      type: "Short Answer",
      serverResponse: "",
      options: [],
    },
  };
  const defaultMultipleChoiceObject = {
    optionID: {
      title: "",
      reference: "question_id_",
    },
  };

  const { id } = useParams<{ id?: string }>();
  const conversation = useFetchConversationById(id as string);
  const conversationTitle = toTitleCase(conversation?.title);
  const questionDocRef = doc(db, "conversations", id as string);
  const [question, setQuestion] = useState<QuestionObject>(defaultQuestion);
  const [multipleChoiceObject, setMultipleChoiceObject] =
    useState<MultipleChoiceOptionObject>(defaultMultipleChoiceObject);
  const [multipleChoiceArrayObject, setMultipleChoiceArrayObject] = useState<
    Array<MultipleChoiceOptionObject>
  >([]);

  async function onSubmitQuestion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const questionId = Number(conversation?.questions.length) || 0;
    const questionObject = question.questionID;

    if (questionObject) {
      const newQuestionObject = { ...question };
      delete newQuestionObject.questionID;
      newQuestionObject[`question_id_${questionId + 1}`] = {
        ...questionObject,
        options: multipleChoiceArrayObject,
      };

      try {
        await updateDoc(questionDocRef, {
          questions: arrayUnion(newQuestionObject),
        });
        setMultipleChoiceArrayObject([]);
      } catch (error) {
        console.error(error);
      }
    }

    setQuestion(defaultQuestion);
  }

  function onSubmitMultipleChoice(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    const optionId = Number(multipleChoiceArrayObject?.length) || 0;
    const optionObject = multipleChoiceObject.optionID;

    if (optionObject) {
      const newOptionObject = { ...multipleChoiceObject };
      delete newOptionObject.optionID;
      newOptionObject[`option_id_${optionId + 1}`] = optionObject;

      setMultipleChoiceArrayObject([
        ...multipleChoiceArrayObject,
        newOptionObject,
      ]);
    }

    setMultipleChoiceObject(defaultMultipleChoiceObject);
  }

  return (
    <div>
      {conversation ? (
        <form className="edit-conversation-wrapper" onSubmit={onSubmitQuestion}>
          <h1>{`${conversationTitle} Conversation`}</h1>
          <label htmlFor="">Question</label>
          <input
            type="text"
            required
            value={question.questionID.title}
            onChange={(e) =>
              setQuestion({
                ...question,
                questionID: { ...question.questionID, title: e.target.value },
              })
            }
          />
          <label htmlFor="">Type</label>
          <select
            name=""
            id=""
            required
            value={question.questionID.type}
            onChange={(e) =>
              setQuestion({
                ...question,
                questionID: { ...question.questionID, type: e.target.value },
              })
            }
          >
            <option value="Short Answer">Short Answer</option>
            <option value="Long Answer">Long Answer</option>
            <option value="Multiple Choice">Multiple Choice</option>
          </select>
          {question.questionID.type === "Multiple Choice" && (
            <div className="edit-conversation-multiple-choice-wrapper">
              <span>Add Multiple Choice Options?</span>
              <div className="edit-conversation-add-multiple-choice-wrapper">
                <label htmlFor="">Option Title</label>
                <input
                  type="text"
                  value={multipleChoiceObject?.optionID.title}
                  name=""
                  id=""
                  onChange={(e) =>
                    setMultipleChoiceObject({
                      ...multipleChoiceObject,
                      optionID: {
                        ...multipleChoiceObject.optionID,
                        title: e.target.value,
                      },
                    })
                  }
                />
                <label htmlFor="">Link To</label>
                <input
                  type="number"
                  value={multipleChoiceObject?.optionID.reference.slice(12)} // Remove the prefix
                  name=""
                  id=""
                  onChange={(e) =>
                    setMultipleChoiceObject({
                      ...multipleChoiceObject,
                      optionID: {
                        ...multipleChoiceObject.optionID,
                        reference: `question_id_${e.target.value}`,
                      },
                    })
                  }
                />
                <button onClick={(e) => onSubmitMultipleChoice(e)}>add</button>
              </div>
            </div>
          )}
          <label htmlFor="">Sever Response</label>
          <textarea
            name=""
            id=""
            required
            value={question.questionID.serverResponse}
            cols={30}
            rows={10}
            onChange={(e) => {
              setQuestion({
                ...question,
                questionID: {
                  ...question.questionID,
                  serverResponse: e.target.value,
                },
              });
            }}
          ></textarea>
          <button>Add</button>
        </form>
      ) : (
        <div>Content could not be found</div>
      )}
    </div>
  );
}

export default EditConversation;
