import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./EditConversation.css";

interface QuestionObject {
  question: string;
  type: string;
  response: string;
}

function EditConversation() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState([JSON.parse(localStorage.getItem(id))]);
  const [question, setQuestion] = useState<QuestionObject | undefined>();

  console.log(data);

  useEffect(() => {
    if (id && localStorage.getItem(id) !== null) {
      const conversation = localStorage.getItem(id);
      setData(JSON.parse(conversation!));
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem(id, JSON.stringify(data));
  }, [data, id]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setData((prevData) => [...prevData, question]);
    setQuestion({ question: "", type: "", response: "" });
  }

  return (
    <div>
      {data ? (
        <form
          className="edit-conversation-wrapper"
          onSubmit={(e) => handleSubmit(e)}
        >
          <h1>{`${data[0]} Conversation`}</h1>
          <label htmlFor="">Question</label>
          <input
            type="text"
            value={question?.question}
            onChange={(e) =>
              setQuestion((prevQuestion) => ({
                ...prevQuestion,
                question: e.target.value,
              }))
            }
          />
          <label htmlFor="">Type</label>
          <select
            name=""
            id=""
            onChange={(e) =>
              setQuestion((prevQuestion) => ({
                ...prevQuestion,
                type: e.target.value,
              }))
            }
          >
            <option value="Multiple Choice">Multiple Choice</option>
            <option value="Short Answer">Short Answer</option>
            <option value="Long Answer">Long Answer</option>
          </select>
          <label htmlFor="">Response</label>
          <textarea
            name=""
            id=""
            value={question?.response}
            cols="30"
            rows="10"
            onChange={(e) =>
              setQuestion((prevQuestion) => ({
                ...prevQuestion,
                response: e.target.value,
              }))
            }
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
