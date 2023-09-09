import { useEffect, useState } from "react";
import { db } from "../../config/Firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Conversation } from "../conversation/ConversationUtils";

function useFetchConversations(): Array<Conversation> {
  const [conversationsList, setConversationsList] = useState<
    Array<Conversation>
  >([]);
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
