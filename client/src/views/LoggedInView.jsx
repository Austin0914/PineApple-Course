import { useState } from "react";
import Sidebar from "../components/Sidebar";
import TimeLine from "../components/TimeLine";
import Announce from "../components/Announce";
import Title from "../components/Title";
import CourseSelection from "../components/CourseSelection";
import CurrentSchedule from "../components/CurrentSchedule";
import AnnouncementManagementComplete from "../components/AnnouncementManagementComplete";
import CourseManagement from "../components/CourseManagement";
import Statistics from "../components/Statistics";

import "./LoggedInView.css";

function LoggedInView({ setIsLoggedIn, userInfo, setUserInfo }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentView, setCurrentView] = useState("announce"); // 預設顯示公告

  const renderCurrentView = () => {
    switch (currentView) {
      case "announce":
        return (
          <>
            <Title />
            <TimeLine />
            <Announce />
          </>
        );
      case "course-selection":
        return <CourseSelection userInfo={userInfo} />;
      case "current-schedule":
        return (
          <CurrentSchedule userInfo={userInfo} currentView={currentView} />
        );
      case "course-history":
        return <div>選課紀錄功能開發中...</div>; // 管理員功能
      case "announce-management":
        return <AnnouncementManagementComplete userInfo={userInfo} />;
      case "user-management":
        return <div>用戶管理功能開發中...</div>;
      case "course-management":
        return <CourseManagement userInfo={userInfo} />;
      case "statistics":
        return <Statistics userInfo={userInfo} />;
      default:
        return (
          <>
            <Title />
            <TimeLine />
            <Announce />
          </>
        );
    }
  };

  return (
    <div style={{ width: "100vw", display: "flex", flexDirection: "row" }}>
      <Sidebar
        setIsLoggedIn={setIsLoggedIn}
        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <div
        className={`function-views ${
          isSidebarExpanded ? "function-views-collapsed" : ""
        }`}
      >
        {renderCurrentView()}
      </div>
    </div>
  );
}
export default LoggedInView;
