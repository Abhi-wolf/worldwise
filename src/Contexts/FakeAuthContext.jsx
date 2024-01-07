import { createContext, useContext, useReducer } from "react";
import { getAuth, signOut } from "firebase/auth";

const AuthContext = createContext();

const initialstate = {
  user: null,
  isAuthenticated: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case "logout":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      throw new Error("unknown action");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialstate
  );

  function login(USER) {
    dispatch({ type: "login", payload: USER });
  }

  function logout() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("signed out successfully");
      })
      .catch((error) => {
        console.log(error);
      });
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was sused outside the AuthProvider");

  return context;
}

export { AuthProvider, useAuthContext };
