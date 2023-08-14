import { useEffect, useState } from "react";
import { auth } from "../../config/Firebase";

function useAuth() {
  const [email, setEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user && user.email !== null) {
        setEmail(user.email);
      }
    });
  }, []);

  return email;
}

export default useAuth;
