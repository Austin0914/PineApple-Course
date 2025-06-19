import { useState, useEffect } from "react";
import { FaBook } from "react-icons/fa";
import { MdOutlineHistory } from "react-icons/md";
import { MdChecklist } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { FaBullhorn } from "react-icons/fa6";
import { FaUsers, FaCog, FaChartBar } from "react-icons/fa";
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import PineappleIcon from "../assets/pineapple_white.svg";
import { API_BASE_URL } from "../config/config";
import "./Sidebar.css";

function Sidebar({
  setIsLoggedIn,
  isSidebarExpanded,
  setIsSidebarExpanded,
  userInfo,
  setUserInfo,
  currentView,
  setCurrentView,
}) {
  const toggleSidebar = () => {
    console.log("toggleSidebar");
    setIsSidebarExpanded(!isSidebarExpanded);
  };
  // 處理導航點擊
  const handleNavClick = (viewName) => {
    if (setCurrentView) {
      setCurrentView(viewName);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}sessions`, {
        method: "DELETE",
        credentials: "include", // 包含 cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("登出成功:", result.message);

        // 清除前端狀態
        setIsLoggedIn(false);
        if (setUserInfo) {
          setUserInfo(null);
        }
      } else {
        console.error("登出失敗:", response.statusText);
        // 即使後端登出失敗，也清除前端狀態
        setIsLoggedIn(false);
        if (setUserInfo) {
          setUserInfo(null);
        }
      }
    } catch (error) {
      console.error("登出請求發送失敗:", error);
      // 即使請求失敗，也清除前端狀態
      setIsLoggedIn(false);
      if (setUserInfo) {
        setUserInfo(null);
      }
    }
  };

  // 檢查用戶角色是否為管理員
  const isAdmin = userInfo?.role === "admin";

  // 取得用戶名稱的第一個字元作為頭像
  const getUserInitial = () => {
    if (!userInfo?.name) return "無";
    return userInfo.name.charAt(0);
  };

  return (
    <>
      <div
        className={`sidebar ${isSidebarExpanded ? "sidebar-collapsed" : ""}`}
      >
        <div className="sidebar-header">
          <div
            style={{
              display: "flex",
              direction: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={PineappleIcon} alt="Pineapple Logo" />
            <p
              style={{
                color: "white",
                paddingLeft: "0.4rem",
              }}
            >
              鳳梨選課系統
            </p>
          </div>
          <TbLayoutSidebarLeftCollapseFilled
            className="sidebar-header-expand-btn"
            onClick={toggleSidebar}
          />
        </div>
        <div className="sidebar-personal-info">
          <div className="sidebar-personal-info-header"></div>
          <div className="sidebar-personal-info-content">
            <div className="sidebar-personal-info-img">{getUserInitial()}</div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "1rem",
              }}
            >
              <p id="sidebat-personal-info-name">{userInfo?.name || "用戶"}</p>
              <p>{userInfo?.publicNumber || "學號未知"}</p>
            </div>
          </div>
        </div>{" "}
        {isAdmin ? (
          // 管理員功能選單
          <>
            <div className="sidebar-course">
              <p>管理功能</p>
              <div
                className={`sidebar-button-container ${
                  currentView === "announce-management" ? "active" : ""
                }`}
                onClick={() => handleNavClick("announce-management")}
              >
                <FaBullhorn className="sidebar-button-icon" />
                <div className="sidebar-button-text">公告管理</div>
              </div>
              <div
                className={`sidebar-button-container ${
                  currentView === "course-management" ? "active" : ""
                }`}
                onClick={() => handleNavClick("course-management")}
              >
                <FaBook className="sidebar-button-icon" />
                <div className="sidebar-button-text">課程管理</div>
              </div>
            </div>
            <div className="sidebar-course">
              <p>進階查詢</p>
              <div
                className={`sidebar-button-container ${
                  currentView === "statistics" ? "active" : ""
                }`}
                onClick={() => handleNavClick("statistics")}
              >
                <FaChartBar className="sidebar-button-icon" />
                <div className="sidebar-button-text">統計報表</div>
              </div>
            </div>
          </>
        ) : (
          // 學生功能選單
          <>
            <div className="sidebar-course">
              <p>首頁</p>
              <div
                className={`sidebar-button-container ${
                  currentView === "announce" ? "active" : ""
                }`}
                onClick={() => handleNavClick("announce")}
              >
                <FaBullhorn className="sidebar-button-icon" />
                <div className="sidebar-button-text">公告</div>
              </div>
            </div>
            <div className="sidebar-course">
              <p>選課</p>
              <div
                className={`sidebar-button-container ${
                  currentView === "course-selection" ? "active" : ""
                }`}
                onClick={() => handleNavClick("course-selection")}
              >
                <FaBook className="sidebar-button-icon" />
                <div className="sidebar-button-text">選課</div>
              </div>
              <div
                className={`sidebar-button-container ${
                  currentView === "current-schedule" ? "active" : ""
                }`}
                onClick={() => handleNavClick("current-schedule")}
              >
                <MdChecklist className="sidebar-button-icon" />
                <div className="sidebar-button-text">目前課表</div>
              </div>
            </div>
          </>
        )}{" "}
        <div className="sidebar-loggout" onClick={handleLogout}>
          <div className="sidebar-loggout-content">
            <BiLogOut style={{ fill: "var(--style_one)" }} />
            <p>登出</p>
          </div>
        </div>
      </div>{" "}
      {isSidebarExpanded && (
        <div className="sidebar-line-container">
          <TbLayoutSidebarLeftExpandFilled
            className="sidebar-header-expand-btn"
            onClick={toggleSidebar}
          />
          {isAdmin ? (
            // 管理員收合選單圖示
            <>
              <FaBullhorn className="sidebar-button-icon" />
              <FaUsers className="sidebar-button-icon" />
              <FaChartBar className="sidebar-button-icon" />
            </>
          ) : (
            // 學生收合選單圖示
            <>
              <FaBullhorn className="sidebar-button-icon" />
              <FaBook className="sidebar-button-icon" />
              <MdChecklist className="sidebar-button-icon" />
              <MdOutlineHistory className="sidebar-button-icon" />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Sidebar;
