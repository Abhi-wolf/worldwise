// CitiesContext.jsx
import {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { auth, fireDB } from "../firebase.config";
import { useAuthContext } from "./FakeAuthContext";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const COLLECTION_NAME = "cities";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { user } = useAuthContext();
  //   console.log(user);
  if (user) console.log(user.uid);

  useEffect(
    function () {
      if (user) {
        const parentDocRef = doc(fireDB, "users", user.uid);
        const subcollection = collection(parentDocRef, "destinations");
        getDocs(subcollection)
          .then((snapshot) => {
            let dest = [];
            snapshot.docs.forEach((doc) => {
              // dest.push({ ...doc.data(), id: doc.id });
              dest.push(doc.data());
            });
            dispatch({ type: "cities/loaded", payload: dest });
            console.log(dest);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    [user]
  );

  const getCity = useCallback(
    async function getCity(id) {
      const city = state.cities.find((city) => city.id === Number(id));

      if (city) {
        dispatch({ type: "city/loaded", payload: city });
      } else {
        dispatch({
          type: "rejected",
          payload: "City not found in local storage...",
        });
      }
    },
    [state.cities]
  );

  const createCity = async (newCity) => {
    try {
      const parentDocRef = doc(fireDB, "users", user.uid);
      const subcollection = collection(parentDocRef, "destinations");

      const docRef = await addDoc(subcollection, {
        ...newCity,
        id: "",
      });
      const id = docRef.id;

      await updateDoc(docRef, { id });
      newCity = {
        ...newCity,
        id,
      };

      dispatch({ type: "city/created", payload: newCity });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  };

  const deleteCity = async (id) => {
    const parentDocRef = doc(fireDB, "users", user.uid);
    const subcollectionDocRef = doc(parentDocRef, "destinations", id);
    try {
      //   await fireDB.collection(COLLECTION_NAME).doc(id).delete();
      await deleteDoc(subcollectionDocRef);
      dispatch({ type: "city/deleted", payload: id });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }

    if (user) {
      const parentDocRef = doc(fireDB, "users", user.uid);
      const subcollection = collection(parentDocRef, "destinations");
      getDocs(subcollection)
        .then((snapshot) => {
          let dest = [];
          snapshot.docs.forEach((doc) => {
            dest.push({ ...doc.data(), id: doc.id });
          });
          dispatch({ type: "cities/loaded", payload: dest });
          console.log(dest);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        ...state,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("CitiesContext was used outside the CitiesProvider");
  }
  return context;
}

export { CitiesProvider, useCities };
