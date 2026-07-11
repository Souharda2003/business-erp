import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../css/backbutton.css";

function BackButton() {

  const navigate = useNavigate();

  return (

    <button
      className="back-btn"
      onClick={() => navigate("/dashboard")}
    >

      <FaArrowLeft />

      <span>Back</span>

    </button>

  );

}

export default BackButton;
