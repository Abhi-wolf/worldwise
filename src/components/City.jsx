import { useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import { getDoc, doc } from "firebase/firestore";

import { fireDB } from "../firebase.config";
import { useAuthContext } from "../Contexts/FakeAuthContext";

const dateFormate = (date) =>
  new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

const formatDate = (date) => {
  // convert date to milliseconds and create a new date object
  date = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
  // formate date
  let formattedDate = dateFormate(date);
  return formattedDate;
};

function City() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [{ cityName, emoji, date, notes }, setCurrCity] = useState([]);

  const { user } = useAuthContext();

  useEffect(
    function () {
      const parentDocRef = doc(fireDB, "users", user.uid);
      const subcollectionDocRef = doc(parentDocRef, "destinations", id);
      setIsLoading(true);
      async function fetchCity() {
        const docSnap = await getDoc(subcollectionDocRef);
        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setCurrCity({ ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
        setIsLoading(false);
      }

      fetchCity();
    },
    [id]
  );

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
