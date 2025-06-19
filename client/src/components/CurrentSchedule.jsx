import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/config";
import {
  FaBook,
  FaUsers,
  FaClock,
  FaMapMarkerAlt,
  FaUserGraduate,
  FaTrash,
} from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import {
  IoWarning,
  IoCheckmarkCircle,
  IoInformationCircle,
} from "react-icons/io5";
import "./CurrentSchedule.css";

function CurrentSchedule({ userInfo, currentView }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCredits, setTotalCredits] = useState(0);

  // 獲取Cookie中的userID
  const getUserId = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userID="));
    return cookieValue ? cookieValue.split("=")[1] : null;
  };
  // 獲取用戶選課列表
  const fetchEnrollments = async (page = 1) => {
    setLoading(true);
    try {
      const userId = getUserId();
      if (!userId) {
        setError("用戶資訊不完整");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}users/${userId}/enrollments?page=${page}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        // 格式化選課數據
        const formattedEnrollments = result.data.map((enrollment) => ({
          id: enrollment.enrollmentId,
          enrollmentDate: enrollment.enrollmentDate,
          state: enrollment.state,
          course: {
            id: enrollment.course.courseId,
            code:
              enrollment.course.classNumber ||
              `COURSE-${enrollment.course.courseId}`,
            name: enrollment.course.courseName,
            department: {
              id: enrollment.course.departmentId,
              name: enrollment.course.departmentName,
            },
            teacher: {
              id: enrollment.course.teacherId,
              name: enrollment.course.teacherName || "未指定",
            },
            credits: enrollment.course.credit || 0,
            time: enrollment.course.detailTime || "時間未定",
            classroom: {
              name: enrollment.course.classroomName || "教室未定",
            },
            semester: enrollment.course.semester,
            note: enrollment.course.note || "",
            type: enrollment.course.type || "",
            grade: enrollment.course.grade || "",
            class: enrollment.course.class || "",
          },
        }));

        setEnrollments(formattedEnrollments);

        // 計算總學分
        const credits = formattedEnrollments.reduce(
          (sum, enrollment) => sum + (enrollment.course.credits || 0),
          0
        );
        setTotalCredits(credits);

        if (result.pagination) {
          setCurrentPage(result.pagination.current_page);
          setTotalPages(result.pagination.last_page);
        }
      } else {
        setError("無法取得選課資料");
      }
    } catch (err) {
      setError("網路連線錯誤");
      console.error("Error fetching enrollments:", err);
    } finally {
      setLoading(false);
    }
  }; // 退選課程
  const dropCourse = async (courseId, courseName) => {
    if (!window.confirm(`確定要退選「${courseName}」嗎？`)) {
      return;
    }

    try {
      const userId = getUserId();
      if (!userId) {
        setModalMessage("用戶資訊不完整");
        setModalType("error");
        setShowModal(true);
        return;
      }
      const response = await fetch(
        `${API_BASE_URL}users/${userId}/enrollments/${courseId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // 204 No Content - 退選成功
        setModalMessage("退選成功！");
        setModalType("success");
        setShowModal(true);
        // 重新載入選課列表
        await fetchEnrollments(currentPage);
      } else {
        // 處理錯誤響應
        let errorMessage = "退選失敗";
        try {
          const result = await response.json();
          errorMessage = result.message || errorMessage;
        } catch {
          // 如果無法解析JSON，使用預設錯誤訊息
          errorMessage = `退選失敗 (${response.status})`;
        }

        setModalMessage(errorMessage);
        setModalType("error");
        setShowModal(true);
      }
    } catch (err) {
      setModalMessage("退選請求失敗");
      setModalType("error");
      setShowModal(true);
      console.error("Error dropping course:", err);
    }
  };

  // 關閉 modal
  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
    setModalType("");
  };

  // 頁面切換
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchEnrollments(page);
    }
  };

  // 清除錯誤訊息
  const clearError = () => {
    setError("");
  }; // 當切換到目前課表頁面時獲取數據
  useEffect(() => {
    if (currentView === "current-schedule") {
      fetchEnrollments();
    }
  }, [currentView]);

  // 清除錯誤訊息的定時器
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="current-schedule">
      <div className="current-schedule-header">
        <h2>目前課表</h2>
        <div className="schedule-summary">
          <div className="summary-item">
            <FaBook className="summary-icon" />
            <span>已選課程: {enrollments.length} 門</span>
          </div>
          <div className="summary-item">
            <FaUserGraduate className="summary-icon" />
            <span>總學分: {totalCredits} 學分</span>
          </div>
        </div>
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <div className="message error-message" onClick={clearError}>
          <IoWarning />
          <span>{error}</span>
        </div>
      )}

      {/* 課程列表 */}
      <div className="enrollment-list">
        {loading ? (
          <div className="loading">載入中...</div>
        ) : enrollments.length === 0 ? (
          <div className="no-enrollments">
            <IoInformationCircle className="info-icon" />
            <p>目前尚未選修任何課程</p>
            <p className="info-hint">請前往選課頁面選擇您想修習的課程</p>
          </div>
        ) : (
          enrollments.map((enrollment) => (
            <div key={enrollment.id} className="enrollment-card">
              {" "}
              <div className="enrollment-header">
                <h3 className="course-title">{enrollment.course.name}</h3>
              </div>
              <div className="course-info">
                <div className="info-row">
                  <div className="info-item">
                    <MdSchool className="info-icon" />
                    <span>{enrollment.course.department.name}</span>
                  </div>

                  <div className="info-item">
                    <FaBook className="info-icon" />
                    <span>{enrollment.course.credits} 學分</span>
                  </div>

                  <div className="info-item">
                    <FaClock className="info-icon" />
                    <span>{enrollment.course.time}</span>
                  </div>
                  <div className="info-item">
                    <FaMapMarkerAlt className="info-icon" />
                    <span>教室: {enrollment.course.classroom.name}</span>
                  </div>

                  <div className="info-item">
                    <FaUserGraduate className="info-icon" />
                    <span>授課教師: {enrollment.course.teacher.name}</span>
                  </div>
                </div>

                {enrollment.course.type && (
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">類型:</span>
                      <span>{enrollment.course.type}</span>
                    </div>

                    {enrollment.course.grade && (
                      <div className="info-item">
                        <span className="info-label">年級:</span>
                        <span>{enrollment.course.grade}</span>
                      </div>
                    )}
                  </div>
                )}

                {enrollment.course.note && (
                  <div className="course-note">
                    <strong>備註: </strong>
                    <span>{enrollment.course.note}</span>
                  </div>
                )}
              </div>
              <div className="enrollment-actions">
                {" "}
                <button
                  className="drop-course-btn"
                  onClick={() =>
                    dropCourse(enrollment.course.id, enrollment.course.name)
                  }
                >
                  <FaTrash />
                  退選
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 分頁 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            上一頁
          </button>

          <span className="pagination-info">
            第 {currentPage} 頁，共 {totalPages} 頁
          </span>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            下一頁
          </button>
        </div>
      )}

      {/* Modal 彈出訊息 */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className={`modal-icon ${modalType}`}>
                {modalType === "success" ? (
                  <IoCheckmarkCircle />
                ) : (
                  <IoWarning />
                )}
              </div>
            </div>
            <div className="modal-body">
              <p className="modal-message">{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button className="modal-close-btn" onClick={closeModal}>
                確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentSchedule;
