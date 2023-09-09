import { useEffect, useState } from "react";
import { auth } from "../../config/Firebase";

function useAuthEmail(): string {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user && user.email !== null) {
        setEmail(user.email);
      }
    });
  }, []);

  return email;
}

export default useAuthEmail;
