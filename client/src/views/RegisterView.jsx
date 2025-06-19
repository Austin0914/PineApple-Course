import Register from "../components/Register";
import Title from "../components/Title";
import "./RegisterView.css";

function RegisterView({ setCurrentPage, setIsLoggedIn }) {
  return (
    <div className="RegisterViewMainContainer">
      <Title />
      <div className="register-only-container">
        <Register
          setCurrentPage={setCurrentPage}
          setIsLoggedIn={setIsLoggedIn}
        />
      </div>
    </div>
  );
}

export default RegisterView;
