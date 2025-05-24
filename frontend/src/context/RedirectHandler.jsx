import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/CreateClient";

const RedirectHandler = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      if (session) {
        const role = session.user.user_metadata?.role;
        if (role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/booking");
        }
      }
      setChecking(false);
    };
  
    checkSession();
  }, []);
};

export default RedirectHandler;