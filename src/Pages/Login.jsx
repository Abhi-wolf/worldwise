import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../firebase.config";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { useAuthContext } from "../Contexts/FakeAuthContext";
import PageNav from "../components/PageNav";
import styles from "./Login.module.css";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { sendEvent } from "../libs/analyticFeedback";

export default function Login() {
  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  async function onSubmit({ email, password }) {
    try {
      setIsLoading(true);
      // Attempt to sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // If sign-in is successful, get the user object
      const user = userCredential.user;
      // console.log("User:", user);

      // Perform further actions (e.g., login)
      login(user);

      const event = {
        eventName: "logins", // required
        domain: "worldwise-eta.vercel.app",
        eventDescription: `${email} logged in`,
      };
      await sendEvent(event);

      // console.log(user);
      toast.success("Logged in Successfully");
      setIsLoading(false);
      // reset();
    } catch (error) {
      // Handle any errors that occur during sign-in
      console.error("Sign-in error:", error);
      // console.log(error.code);

      // Determine error code and display appropriate message
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        // Handle incorrect email or password error
        // Display appropriate message to the user
        toast.error("Invalid email or password. Please try again.");
      } else {
        // Handle other authentication errors
        // Display a generic error message to the user
        toast.error(
          "An error occurred during sign-in. Please try again later."
        );
      }
      // reset();
      setIsLoading(false);
      reset();
    }
  }

  function handleSignUpWithGoogle() {
    let google_provider = new GoogleAuthProvider();
    signInWithPopup(auth, google_provider)
      .then((res) => {
        // console.log("google signin response ", res.user);
        login(res.user);
        toast.success("Signed Up Successfully");
      })
      .catch((err) => {
        // console.log("sign in with google error : ", err);
        toast.error(err);
      });
  }

  useEffect(
    function () {
      if (isAuthenticated) navigate("/app", { replace: true });
    },
    [isAuthenticated, navigate]
  );

  return (
    <main className={styles.login}>
      <PageNav />
      <div className={styles.loginDiv}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.row}>
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              disabled={isLoading}
              placeholder="Email"
              {...register("email", { required: "This field is required" })}
            />

            {errors.email && (
              <p className={styles.errormsg}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.row}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              disabled={isLoading}
              placeholder="Password"
              {...register("password", { required: "This field is required" })}
            />
            {errors.password && (
              <p className={styles.errormsg}>{errors.password.message}</p>
            )}
          </div>

          <div>
            <Button type="primary" disabled={isLoading}>
              Login
            </Button>
          </div>
        </form>

        <div className={styles.signingooglebtn}>
          <Button type="secondary" onClick={handleSignUpWithGoogle}>
            SignIn with Google
          </Button>
        </div>

        <div className={styles.loginMess}>
          <p>
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup", { replace: true })}>
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
