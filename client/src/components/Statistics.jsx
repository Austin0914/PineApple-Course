import { useState, useEffect } from "react";
import { statisticsAPI } from "../services/api";
import { API_BASE_URL } from "../config/config";
import {
  FaUsers,
  FaBook,
  FaGraduationCap,
  FaChartBar,
  FaBuilding,
  FaUserGraduate,
} from "react-icons/fa";
import { IoWarning, IoCheckmarkCircle } from "react-icons/io5";
import "./Statistics.css";

function Statistics({ userInfo }) {
  // 權限檢查 - 只允許管理員訪問
  const isAdmin = userInfo?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="statistics">
        <div className="access-denied">
          <IoWarning className="warning-icon" />
          <h2>訪問被拒絕</h2>
          <p>您沒有權限訪問統計報表功能</p>
          <p>請聯繫系統管理員獲取相關權限</p>
        </div>
      </div>
    );
  }

  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalTeachers: 0,
    totalDepartments: 0,
    departmentStats: [],
    enrollmentStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userInfo?.role === "admin") return;

    const fetchStatistics = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await statisticsAPI.getStatistics();
        setStatistics(response.data);
      } catch (err) {
        setError("無法載入統計數據");
        console.error("Error fetching statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [userInfo]);

  if (loading) {
    return (
      <div className="statistics">
        <div className="statistics-header">
          <h2>統計報表</h2>
        </div>
        <div className="loading">載入統計數據中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics">
        <div className="statistics-header">
          <h2>統計報表</h2>
        </div>
        <div className="error-message">
          <IoWarning />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics">
      <div className="statistics-header">
        <h2>統計報表</h2>
        <p>系統統計資訊總覽</p>
      </div>

      {/* 總體統計卡片 */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon users">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>{statistics.totalUsers}</h3>
            <p>註冊人數</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon courses">
            <FaBook />
          </div>
          <div className="stat-info">
            <h3>{statistics.totalCourses}</h3>
            <p>開課數量</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon teachers">
            <FaGraduationCap />
          </div>
          <div className="stat-info">
            <h3>{statistics.totalTeachers}</h3>
            <p>授課教師</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon departments">
            <FaBuilding />
          </div>
          <div className="stat-info">
            <h3>{statistics.totalDepartments}</h3>
            <p>系所數量</p>
          </div>
        </div>
      </div>

      {/* 系所統計表格 */}
      <div className="stats-section">
        <h3>各系所統計</h3>
        <div className="stats-table">
          <table>
            <thead>
              <tr>
                <th>系所名稱</th>
                <th>開課數量</th>
                <th>學生人數</th>
                <th>平均每課程人數</th>
              </tr>
            </thead>
            <tbody>
              {statistics.departmentStats.map((dept) => (
                <tr key={dept.id}>
                  <td>{dept.name}</td>
                  <td>{dept.courseCount}</td>
                  <td>{dept.studentCount}</td>
                  <td>{dept.averagePerCourse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 選課統計 */}
      <div className="stats-section">
        <h3>歷年選課統計</h3>
        <div className="enrollment-stats">
          {statistics.enrollmentStats.map((stat, index) => (
            <div key={index} className="enrollment-card">
              <div className="enrollment-header">
                <h4>{stat.semester} 學期</h4>
              </div>
              <div className="enrollment-details">
                <div className="enrollment-item">
                  <span className="label">總選課人次:</span>
                  <span className="value">{stat.totalEnrollments}</span>
                </div>
                <div className="enrollment-item">
                  <span className="label">平均每課程:</span>
                  <span className="value">{stat.averagePerCourse} 人</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 系統使用率 */}
      <div className="stats-section">
        <h3>系統使用概況</h3>
        <div className="usage-stats">
          <div className="usage-item">
            <span className="usage-label">課程滿班率:</span>
            <div className="usage-bar">
              <div
                className="usage-fill"
                style={{ width: `${statistics.usageStats?.courseFillRate}%` }}
              ></div>
            </div>
            <span className="usage-value">
              {statistics.usageStats?.courseFillRate}%
            </span>
          </div>
          <div className="usage-item">
            <span className="usage-label">學生選課率:</span>
            <div className="usage-bar">
              <div
                className="usage-fill"
                style={{
                  width: `${statistics.usageStats?.studentEnrollmentRate}%`,
                }}
              ></div>
            </div>
            <span className="usage-value">
              {statistics.usageStats?.studentEnrollmentRate}%
            </span>
          </div>
          <div className="usage-item">
            <span className="usage-label">教師開課率:</span>
            <div className="usage-bar">
              <div
                className="usage-fill"
                style={{
                  width: `${statistics.usageStats?.teacherTeachingRate}%`,
                }}
              ></div>
            </div>
            <span className="usage-value">
              {statistics.usageStats?.teacherTeachingRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
