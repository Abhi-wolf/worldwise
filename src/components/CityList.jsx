import styles from "./CityList.module.css";
import Cityitem from "./Cityitem";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../Contexts/CitiesContext";

function CityList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  return (
    <div className={styles.cityList}>
      {cities.map((city, index) => (
        <Cityitem key={index} city={city} />
      ))}
    </div>
  );
}

export default CityList;
