import { useNavigate } from "react-router-dom";
import Button from "./Button";

function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      type="back"
      onClick={(e) => {
        e.preventDefault();
        navigate(-1); //-1 indicate to move one step back
      }}
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
