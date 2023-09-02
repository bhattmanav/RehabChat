import { useEffect, useState } from "react";
import { db } from "../../config/Firebase";
import { collection, onSnapshot } from "firebase/firestore";

interface Conversation {
  id: string;
  title: string;
  questions: { [questionId: string]: Question };
}

interface Question {
  type: string;
  text: string;
}

function useFetchConversations() {
  const [conversationsList, setConversationsList] = useState<Conversation[]>(
    []
  );
  const conversationsCollectionRef = collection(db, "conversations");

  useEffect(() => {
    const unsubscribe = onSnapshot(conversationsCollectionRef, (snapshot) => {
      const updatedData: Conversation[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Conversation),
        id: doc.id,
      }));
      setConversationsList(updatedData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return conversationsList;
}

export default useFetchConversations;
