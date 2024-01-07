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
import { Timestamp, addDoc, doc, collection, setDoc } from "firebase/firestore";
import { useState } from "react";

function SignUp() {
  const [fireBaseSuccMessage, setFireBaseSuccMessage] = useState("");
  const [fireBaseError, setFireBaseError] = useState("");

  const { register, formState, isLoading, handleSubmit, reset } = useForm();
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

  function onSubmit({ fullName, email, password }) {
    console.log(fullName, email, password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(auth.currentUser, {
          displayName: fullName,
        });

        const us = userCredential.user;
        const user = {
          name: fullName,
          uid: us.uid,
          email: us.email,
          time: Timestamp.now(),
        };

        console.log(user);
        addUser(user);

        setFireBaseSuccMessage("Account created successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })

      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode.includes("auth/email-already-in-use")) {
          setFireBaseError("Email Already in use, Try another one");
        }
      });
  }

  return (
    <div className={styles.mainbox}>
      <div className={styles.formBox}>
        <Logo />
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formDiv}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              placeholder="Enter Full Name"
              id="fullName"
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
            <Button type="primary" disable={isLoading}>
              SignUp
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
