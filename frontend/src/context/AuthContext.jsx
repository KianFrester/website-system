import { createContext, useEffect, useState, useContext, useRef } from "react";
import { supabase } from "../api/CreateClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [showInactivityModal, setShowInactivityModal] = useState(false);

  const inactivityTimer = useRef(null);

  // Sign up function
  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("There was an error signing up:", error);
      return { success: false, error: error.message };
    }

    const user = data.user;

    const { error: insertError } = await supabase
      .from("users")
      .insert({ id: user.id, email: user.email });

    if (insertError) {
      console.error("Error inserting into users table:", insertError);
      return { success: false, error: insertError.message };
    }

    return { success: true, user };
  };

  // Sign in function
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const userId = data.user.id;
      setRoles(userId);

      const { data: userData, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (roleError || !userData?.role) {
        return { success: false, error: "Failed to retrieve user role." };
      }

      return { success: true, role: userData.role.toLowerCase() };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Get session and role
  useEffect(() => {
    let hasInitialized = false;

    const getSessionAndRole = async (incomingSession = null) => {
      if (!hasInitialized) setLoading(true);

      const sessionToUse =
        incomingSession ?? (await supabase.auth.getSession()).data.session;

      setSession(sessionToUse);

      if (sessionToUse?.user) {
        const user = sessionToUse.user;

        // Step 1: Try to fetch user (allow multiple or none to avoid 406)
        let { data: userData, error: fetchError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id);

        if (fetchError) {
          console.error("Error fetching role:", fetchError.message);
          setRoles([]);
          return;
        }

        if (!userData || userData.length === 0) {
          // Step 2: Insert user if not found
          const { error: insertError } = await supabase.from("users").insert({
            id: user.id,
            email: user.email,
            role: "user",
          });

          if (insertError) {
            console.error("Error inserting new user:", insertError.message);
            setRoles([]);
            return;
          }

          // Step 3: Re-fetch single row after insert
          const { data: newUserData, error: newFetchError } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();

          if (newFetchError) {
            console.error(
              "Error fetching inserted user:",
              newFetchError.message
            );
            setRoles([]);
            return;
          }

          const role = newUserData?.role?.toLowerCase() || "user";
          setRoles([role]);
        } else {
          // User exists; get role
          const role = userData[0].role?.toLowerCase() || "user";
          setRoles([role]);
        }
      }

      if (!hasInitialized) {
        setLoading(false);
        hasInitialized = true;
      }
    };

    getSessionAndRole();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        getSessionAndRole(session);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Sign out
  const signOut = () => {
    supabase.auth.signOut().catch((error) => {
      console.error("There was an error signing out", error);
    });
    console.clear();
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  };

  // Inactivity timer logic 2mins.
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);

    inactivityTimer.current = setTimeout(() => {
      signOut();
      setShowInactivityModal(true);
    }, 2 * 60 * 1000);
  };

  useEffect(() => {
    if (!session) return;

    const events = ["mousemove", "keydown", "scroll", "click"];
    const activityListener = () => resetInactivityTimer();

    events.forEach((event) => {
      window.addEventListener(event, activityListener);
    });

    resetInactivityTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, activityListener);
      });
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [session]);

  // Google sign in
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/booking",
        },
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      return { success: false, error };
    }
  };

  //sign up
  const signUpWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/booking",
        },
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      return { success: false, error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        signUpNewUser,
        signOut,
        signInUser,
        roles,
        loading,
        signInWithGoogle,
        signUpWithGoogle,
      }}
    >
      {children}

      {showInactivityModal && (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-black/90 via-orange-900/90 to-yellow-700/90 flex items-center justify-center p-4">
          <div className="flex flex-col items-center bg-black/40 backdrop-blur-sm p-6 rounded-xl shadow-xl">
            <p className="mt-6 text-white text-lg font-semibold text-center">
              You have been logged out
            </p>
            <p className="text-yellow-100 text-sm text-center mt-2 max-w-xs">
              Due to 2 minutes of inactivity, your session has ended for
              security purposes.
            </p>
            <button
              onClick={() => setShowInactivityModal(false)}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
