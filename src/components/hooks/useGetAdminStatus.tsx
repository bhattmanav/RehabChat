import { useEffect, useState } from "react";
import { auth, db } from "../../config/Firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

function useGetAdminStatus() {
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setUserIsAdmin(false);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);

    const fetchData = async () => {
      try {
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const isAdminUser = docSnap.data().isAdmin === true;
          setUserIsAdmin(isAdminUser);
        } else {
          console.log("Document does not exist for user:", user.uid);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    fetchData();

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const isAdminUser = docSnap.data().isAdmin === true;
        setUserIsAdmin(isAdminUser);
      } else {
        console.log("Document does not exist for user:", user.uid);
        setUserIsAdmin(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return userIsAdmin;
}

export default useGetAdminStatus;
