// Uses the same styles as Product
import styles from "./Product.module.css";
import PageNav from "../components/PageNav";
export default function Product() {
  return (
    <main className={styles.product}>
      <PageNav />
      <section>
        <div>
          <h2>
            Simple pricing.
            <br />
            Just $9/year.
          </h2>
          <p>
            Its Just for the memory that you are storing over time by visiting different places with your family and friends.
          </p>
        </div>
        <img src="img-2.jpg" alt="overview of a large city with skyscrapers" />
      </section>
    </main>
  );
}
