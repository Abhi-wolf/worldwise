import { useForm } from "react-hook-form";
import styles from "./SignUp.module.css";
import Logo from "../components/Logo";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, fireDB } from "../firebase.config";
import { Timestamp, doc, collection, setDoc } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";

function SignUp() {
  const [fireBaseSuccMessage, setFireBaseSuccMessage] = useState("");
  const [fireBaseError, setFireBaseError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;

  const navigate = useNavigate();

  // ADD DESTINATIONS TO THE USER DOCUMENT
  const addCollection = async (id) => {
    const userDocRef = doc(fireDB, "users", id);
    const userCollectionRef = collection(userDocRef, "destinations");
  };

  // ADD USER TO FIREBASE STORE
  const addUser = async (user) => {
    try {
      const userRef = collection(fireDB, "users");
      const userDocRef = doc(userRef, user.uid);
      await setDoc(userDocRef, user);
      addCollection(user.uid);
    } catch (err) {
      console.log(err);
    }
  };

  // function onSubmit({ fullName, email, password }) {
  //   console.log(fullName, email, password);
  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       updateProfile(auth.currentUser, {
  //         displayName: fullName,
  //       });

  //       const us = userCredential.user;
  //       const user = {
  //         name: fullName,
  //         uid: us.uid,
  //         email: us.email,
  //         time: Timestamp.now(),
  //       };

  //       console.log(user);
  //       addUser(user);

  //       setFireBaseSuccMessage("Account created successfully");
  //       setTimeout(() => {
  //         navigate("/login");
  //       }, 2000);
  //     })

  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       if (errorCode.includes("auth/email-already-in-use")) {
  //         setFireBaseError("Email Already in use, Try another one");
  //       }
  //     });
  // }

  async function onSubmit({ fullName, email, password }) {
    try {
      setIsLoading(true);
      console.log(fullName, email, password);

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update user profile with full name
      await updateProfile(auth.currentUser, { displayName: fullName });

      // Construct user object
      const user = {
        name: fullName,
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        time: Timestamp.now(),
      };

      console.log("User:", user);

      addUser(user);

      setFireBaseSuccMessage("Account created successfully");
      toast.success("Account Successfully created");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      setIsLoading(false);
      reset();
    } catch (error) {
      setIsLoading(false);
      console.error("Authentication error:", error);
      if (error.code.includes("auth/email-already-in-use")) {
        toast.error("Email Already in use, Try another one");
      } else {
        // Handle other authentication errors
        toast.error("An error occurred. Please try again later.");
      }
      // toast.error(error.message);
      reset();
    }
  }

  return (
    <div className={styles.mainbox}>
      <div className={styles.formBox}>
        <Logo />
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          disable={isLoading}
        >
          <div className={styles.formDiv}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              id="fullName"
              disabled={isLoading}
              {...register("fullName", { required: "This field is required" })}
            />
            {errors.fullName && (
              <p className={styles.errormsg}>{errors.fullName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="email"> Email Address</label>
            <input
              type="email"
              placeholder="Enter Email Id"
              id="email"
              disabled={isLoading}
              {...register("email", {
                required: "This field is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please provide a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className={styles.errormsg}>{errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password"> Password (minimum 8 characters)</label>
            <input
              type="password"
              placeholder="Enter Password"
              id="password"
              disabled={isLoading}
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
            />
            {errors.password && (
              <p className={styles.errormsg}>{errors.password.message}</p>
            )}
          </div>

          <div className={styles.btnGroup}>
            <Button type="primary" disabled={isLoading}>
              {isLoading ? "Loading Please wait" : "SignUp"}
            </Button>
          </div>

          <div className={styles.loginMess}>
            <p>
              Aleardy have an account?{" "}
              <span onClick={() => navigate("/login", { replace: true })}>
                Sign In
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
