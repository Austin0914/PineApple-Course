import "./Title.css";
import pineappleLogo from "../assets/pineapple_1.svg";

function Title() {
  return (
    <div className="title-conatiner">
      <div className="logo-container">
        <img src={pineappleLogo} className="logo" alt="Pineapple Logo" />
      </div>
      <h1>鳳梨選課系統</h1>
    </div>
  );
}
export default Title;
