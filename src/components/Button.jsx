import styles from "./Button.module.css";
function Button({ children, onClick, type, disabled }) {
  return (
    <button
      onClick={!disabled && onClick}
      className={`${styles.btn} ${styles[type]}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
