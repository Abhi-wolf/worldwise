import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../firebase.config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { useAuthContext } from "../Contexts/FakeAuthContext";
import PageNav from "../components/PageNav";
import styles from "./Login.module.css";
import Button from "../components/Button";
import { toast } from "react-toastify";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  // const [email, setEmail] = useState("jack@example.com");
  // const [password, setPassword] = useState("qwerty");

  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  // function onSubmit({ email, password }) {
  //   // console.log(email, password);

  //   signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
  //     const user = userCredential.user;
  //     console.log(user);
  //     login(user);
  //   });
  // }

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
      console.log("User:", user);

      // Perform further actions (e.g., login)
      login(user);
      toast.success("Logged in Successfully");
      setIsLoading(false);
      // reset();
    } catch (error) {
      // Handle any errors that occur during sign-in
      console.error("Sign-in error:", error);
      console.log(error.code);

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
    }
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
    </main>
  );
}
