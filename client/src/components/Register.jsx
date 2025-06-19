import { useState } from "react";
import LoginInput from "./LoginInput";
import { IoWarning } from "react-icons/io5";
import { MdOutlineDownloadDone } from "react-icons/md";
import "../style/index.css";
import { API_BASE_URL } from "../config/config";

// 內聯樣式為select
const selectStyle = {
  width: "100%",
  padding: "12px 10px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "1rem",
  backgroundColor: "#f9f9f9",
  transition: "border-color 0.3s, box-shadow 0.3s",
  color: "black",
  cursor: "pointer",
  appearance: "none",
  backgroundImage:
    "url(\"data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  backgroundSize: "12px",
  paddingRight: "30px",
};

function Register({ setCurrentPage, setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setCheckPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [currentStep, setCurrentStep] = useState("register"); // "register" or "profile"
  const [userId, setUserId] = useState(null);

  // 個人資料狀態
  const [publicNumber, setPublicNumber] = useState("");
  const [name, setName] = useState("");
  const [departName, setDepartName] = useState("");
  const [grade, setGrade] = useState("");
  const [role, setRole] = useState("student");

  function changeUsername(e) {
    setUsername(e.target.value);
  }
  function changePassword(e) {
    setPassword(e.target.value);
  }
  function changePasswordCheck(e) {
    setCheckPassword(e.target.value);
  }
  // 個人資料輸入框的change函數
  function changePublicNumber(e) {
    setPublicNumber(e.target.value);
  }
  function changeName(e) {
    setName(e.target.value);
  }
  function changeDepartName(e) {
    setDepartName(e.target.value);
  }
  function changeGrade(e) {
    setGrade(e.target.value);
  }
  function changeRole(e) {
    setRole(e.target.value);
  }

  function handleSubmit_SignUP(e) {
    e.preventDefault();

    if (password !== password_confirmation) {
      setPasswordError(" 密碼不一致");
      return;
    }

    const url = `${API_BASE_URL}users`;
    const data = {
      username: username,
      password: password,
      password_confirmation: password_confirmation,
    };

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
          throw new Error("SIGN_UP failed");
        }
      })
      .then((data) => {
        clearInput();
        setPasswordError("註冊成功!");
        setUserId(data.user_id); // 假設後端返回user_id
        console.log("SIGN_UP successful:", data);
        setCurrentStep("profile");
      })
      .catch((error) => {
        clearInput();
        setPasswordError(" 註冊失敗");
        console.error("Error:", error);
      });
  }

  function clearInput() {
    setPassword("");
    setCheckPassword("");
  }

  function clearProfileInput() {
    setPublicNumber("");
    setName("");
    setDepartName("");
    setGrade("");
    setRole("student");
  }

  function goBackToLogin() {
    setCurrentPage("login");
  }

  function handleSubmit_Profile(e) {
    e.preventDefault();

    if (!publicNumber || !name || !role) {
      setPasswordError(" 請填寫必填欄位");
      return;
    }

    const userIdFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userID="))
      ?.split("=")[1];
    const url = `${API_BASE_URL}users/${userIdFromCookie}`;
    const data = {
      public_number: publicNumber,
      name: name,
      depart_name: departName || undefined,
      grade: grade ? parseInt(grade) : undefined,
      role: role,
    };
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
          // 如果是204 No Content，不需要解析JSON
          if (response.status === 204) {
            return {}; // 返回空對象
          }
          return response.json();
        } else {
          throw new Error("Profile update failed");
        }
      })
      .then((data) => {
        setPasswordError("個人資料設定成功！");
        console.log("Profile updated successfully:", data);
        // 延遲跳轉回登入頁面
        setTimeout(() => {
          setCurrentPage("login");
        }, 1000);
      })
      .catch((error) => {
        setPasswordError(" 個人資料設定失敗");
        console.error("Error:", error);
      });
  }
  return (
    <div className="register-card function-card" style={{ height: "70%" }}>
      <h1 className="login-title">
        {currentStep === "register" ? "會員註冊" : "個人資料設定"}
      </h1>
      <div className="login-container">
        {passwordError !== "" && (
          <div
            className="login-reminder"
            style={
              passwordError.includes("成功")
                ? { backgroundColor: "var(--style_check)" }
                : {}
            }
          >
            {passwordError.includes("成功") ? (
              <MdOutlineDownloadDone style={{ marginRight: "0.8rem" }} />
            ) : (
              <IoWarning />
            )}
            {passwordError}
          </div>
        )}

        {currentStep === "register" ? (
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
            <LoginInput
              type="password"
              placeholder="確認密碼"
              name="password_confirmation"
              value={password_confirmation}
              onChange={changePasswordCheck}
              required="required"
            />

            <button
              type="submit"
              className="login-button"
              onClick={handleSubmit_SignUP}
            >
              註冊
            </button>
            <div className="login-footer">
              <a onClick={goBackToLogin}>返回登入</a>
            </div>
          </form>
        ) : (
          <form className="login-form">
            <LoginInput
              type="text"
              placeholder="學號/員工編號"
              name="public_number"
              value={publicNumber}
              onChange={changePublicNumber}
              required="required"
            />
            <LoginInput
              type="text"
              placeholder="姓名"
              name="name"
              value={name}
              onChange={changeName}
              required="required"
            />
            <select
              style={selectStyle}
              value={departName}
              onChange={changeDepartName}
            >
              <option value="">請選擇系所（選填）</option>
              <option value="資訊管理學系">資訊管理學系</option>
              <option value="資訊工程學系">資訊工程學系</option>
              <option value="財務金融學系">財務金融學系</option>{" "}
            </select>
            <select style={selectStyle} value={grade} onChange={changeGrade}>
              <option value="">請選擇年級（選填）</option>
              <option value="1">大ㄧ</option>
              <option value="2">大二</option>
              <option value="3">大三</option>
              <option value="4">大四</option>
              <option value="5">碩一</option>
              <option value="6">碩二</option>
            </select>
            <select
              className="login-input"
              value={role}
              onChange={changeRole}
              required
              style={selectStyle}
            >
              <option value="student">學生</option>
              <option value="admin">管理員</option>
            </select>
            <button
              type="submit"
              className="login-button"
              onClick={handleSubmit_Profile}
            >
              完成設定
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
