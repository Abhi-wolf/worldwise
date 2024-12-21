import { useState } from "react";
import styles from "./FeedbackForm.module.css";
import { sendFeedback } from "../libs/analyticFeedback";

export function FeedbackForm() {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(4);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !feedback) {
      return;
    }

    const data = {
      userName: name,
      feedback,
      rating,
      domain: "worldwise-eta.vercel.app",
    };
    sendFeedback(data);

    console.log("Feedback submitted:", { name, feedback });
    setName("");
    setFeedback("");
    setIsSubmitted(true);
    setRating(4);

    setTimeout(() => {
      setIsSubmitted(false);
      setIsOpen(false);
    }, 3000);
  };

  const toggleForm = () => {
    setIsOpen(!isOpen);
    setIsSubmitted(false);
  };

  return (
    <div className={styles.container}>
      <button onClick={toggleForm} className={styles.floatingButton}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.feedbackIcon}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Feedback
      </button>
      {isOpen && (
        <div className={styles.formContainer}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Feedback</h2>
              <p className={styles.cardDescription}>
                We value your input. Your feedback helps us improve our service.
              </p>
              <button onClick={toggleForm} className={styles.closeButton}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.cardContent}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Your Name
                  </label>
                  <input
                    id="name"
                    className={styles.input}
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="feedback" className={styles.label}>
                    Your Feedback
                  </label>
                  <textarea
                    id="feedback"
                    className={styles.textarea}
                    placeholder="Tell us what you think..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Your Rating</label>
                  <div className={styles.starRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`${styles.starButton} ${
                          star <= rating ? styles.starFilled : ""
                        }`}
                        onClick={() => handleRatingChange(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button type="submit" className={styles.button}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.sendIcon}
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Submit Feedback
                </button>
              </div>
            </form>
            {isSubmitted && (
              <div className={styles.successMessage}>
                Thank you for your feedback!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
