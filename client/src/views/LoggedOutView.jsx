import Login from "../components/Login";
import TimeLine from "../components/TimeLine";
import Announce from "../components/Announce";
import Title from "../components/Title";
import "./LoggedOutView.css";

function LoggedOutView({ setIsLoggedIn, setCurrentPage, setUserInfo }) {
  return (
    <div className="LoggedOutViewMainContainer">
      <Title />
      <div className="functionContainer">
        <div className="login-flex">
          <Login
            setIsLoggedIn={setIsLoggedIn}
            setCurrentPage={setCurrentPage}
            setUserInfo={setUserInfo}
          />
        </div>
        <div className="timeline-flex">
          <TimeLine className="timeline-flex" />
        </div>
      </div>
      <Announce />
    </div>
  );
}

export default LoggedOutView;
