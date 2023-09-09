import { useEffect, useState } from "react";
import { db } from "../../config/Firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Conversation } from "../conversation/ConversationUtils";

function useFetchConversationById(conversationId: string): Conversation | null {
  const conversationDocRef = doc(db, "conversations", conversationId);
  const [conversation, setConversation] = useState<Conversation | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(conversationDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const conversationData = docSnap.data() as Conversation;
        setConversation({
          ...conversationData,
          id: docSnap.id,
        });
      } else {
        // Document does not exist
        setConversation(null);
      }
    });

    return () => {
      unsubscribe(); // Unsubscribe when the component unmounts or the ID changes
    };
  }, [conversationId]);

  return conversation;
}

export default useFetchConversationById;
