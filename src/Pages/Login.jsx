import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../firebase.config";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { useAuthContext } from "../Contexts/FakeAuthContext";
import PageNav from "../components/PageNav";
import styles from "./Login.module.css";
import Button from "../components/Button";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  // const [email, setEmail] = useState("jack@example.com");
  // const [password, setPassword] = useState("qwerty");

  const { register, formState, isLoading, handleSubmit } = useForm();
  const { errors } = formState;

  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  function onSubmit({ email, password }) {
    // console.log(email, password);

    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
      login(user);
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
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
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
            {...register("password", { required: "This field is required" })}
          />
          {errors.password && (
            <p className={styles.errormsg}>{errors.password.message}</p>
          )}
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
