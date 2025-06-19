import { useState } from "react";
import LoggedInView from "./views/LoggedInView";
import LoggedOutView from "./views/LoggedOutView";
import RegisterView from "./views/RegisterView";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("login"); // "login", "register"
  const [userInfo, setUserInfo] = useState(null); // 新增用戶資訊狀態

  return (
    <div className="app">
      {isLoggedIn ? (
        <LoggedInView
          setIsLoggedIn={setIsLoggedIn}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
        />
      ) : currentPage === "register" ? (
        <RegisterView
          setIsLoggedIn={setIsLoggedIn}
          setCurrentPage={setCurrentPage}
        />
      ) : (
        <LoggedOutView
          setIsLoggedIn={setIsLoggedIn}
          setCurrentPage={setCurrentPage}
          setUserInfo={setUserInfo}
        />
      )}
    </div>
  );
}

export default App;
