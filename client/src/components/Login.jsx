import { useState } from "react";
import LoginInput from "./LoginInput";
import { IoWarning } from "react-icons/io5";
import { MdOutlineDownloadDone } from "react-icons/md";
import "../style/index.css";
import { API_BASE_URL } from "../config/config";

function Login({ setIsLoggedIn, setCurrentPage, setUserInfo }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function changeUsername(e) {
    setUsername(e.target.value);
  }
  function changePassword(e) {
    setPassword(e.target.value);
  }
  function handleSubmit_SignIN(e) {
    e.preventDefault();

    const data = {
      username: username,
      password: password,
    };
    const url = `${API_BASE_URL}sessions`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          clearInput();
          throw new Error("SIGN_IN failed");
        }
      })
      .then((result) => {
        clearInput();
        setPasswordError("登入成功!");
        console.log(result); // 儲存用戶資訊
        if (result.user) {
          setUserInfo({
            id: result.user.id,
            role: result.user.role,
            name: result.user.name,
            publicNumber: result.user.public_number,
          });
        }

        setIsLoggedIn(true);
      })
      .catch((error) => {
        clearInput();
        setPasswordError(" 帳號或密碼錯誤");
        console.error("Error:", error);
      });
  }

  function clearInput() {
    setPassword("");
  }
  function goToRegister() {
    setCurrentPage("register");
  }

  return (
    <div className="login-card function-card">
      <h1 className="login-title">多元入口</h1>
      <div className="login-container">
        {passwordError != "" && (
          <div
            className="login-reminder"
            style={
              passwordError === "註冊成功!"
                ? { backgroundColor: "var(--style_check)" }
                : {}
            }
          >
            {passwordError === "註冊成功!" ? (
              <MdOutlineDownloadDone style={{ marginRight: "0.8rem" }} />
            ) : (
              <IoWarning />
            )}

            {passwordError}
          </div>
        )}
        <form className="login-form">
          <LoginInput
            type="text"
            placeholder="帳號"
            name="username"
            value={username}
            onChange={changeUsername}
            required="required"
          />
          <LoginInput
            type="password"
            placeholder="密碼"
            name="password"
            value={password}
            onChange={changePassword}
            required="required"
          />
          <button
            type="submit"
            className="login-button"
            onClick={handleSubmit_SignIN}
          >
            登入
          </button>
          <div className="login-footer">
            <a>忘記密碼</a>
            <a onClick={goToRegister}>註冊</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
