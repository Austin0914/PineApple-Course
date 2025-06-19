import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/config";
import {
  FaSearch,
  FaBook,
  FaUsers,
  FaClock,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { IoWarning, IoCheckmarkCircle } from "react-icons/io5";
import "./CourseSelection.css";

function CourseSelection({ userInfo }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false); // 改為 false，不自動載入
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // 控制模態框顯示
  const [modalMessage, setModalMessage] = useState(""); // 模態框訊息
  const [modalType, setModalType] = useState(""); // 模態框類型 (success/error)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false); // 追蹤是否已進行搜尋
  const [expandedCourses, setExpandedCourses] = useState(new Set()); // 追蹤展開的課程
  const [filters, setFilters] = useState({
    term: "114-1", // 固定為 114-1
    departmentId: "",
    grade: "",
  });
  // 切換課程詳細資訊的展開狀態
  const toggleCourseExpanded = (courseId) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseId)) {
      newExpanded.delete(courseId);
    } else {
      newExpanded.add(courseId);
    }
    setExpandedCourses(newExpanded);
  };

  // 取得課程列表
  const fetchCourses = async (page = 1) => {
    setLoading(true);
    try {
      // 固定學期為 114-1
      let url = `${API_BASE_URL}courses?page=${page}&term=114-1`;

      if (filters.departmentId) url += `&departmentId=${filters.departmentId}`;
      if (filters.grade) url += `&grade=${filters.grade}`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        // 根據實際 API 格式處理數據
        const formattedCourses = result.data.map((course) => ({
          id: course.courseId,
          code: course.classNumber || `COURSE-${course.courseId}`,
          name: course.courseName,
          department: {
            id: course.departmentId,
            name: course.departmentName,
          },
          teacher: {
            id: course.teacherId,
            name: course.teacherName || "未指定",
          },
          credits: course.credit || 3,
          time: course.detailTime || "時間未定",
          classroom: {
            name: course.classroomName || "教室未定",
          },
          choose_limit: course.chooseLimit || 0,
          current_enrollments: course.currentEnrollment || 0,
          semester: course.semester,
          note: course.note || "",
          outline: course.outline || "",
          type: course.type || "",
          grade: course.grade || "",
          class: course.class || "",
        }));

        setCourses(formattedCourses);
        setHasSearched(true);

        if (result.pagination) {
          setCurrentPage(result.pagination.current_page);
          setTotalPages(result.pagination.last_page);
        }
      } else {
        setError("無法取得課程資料");
      }
    } catch (err) {
      setError("網路連線錯誤");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };
  // 選課功能
  const enrollCourse = async (courseId) => {
    const getCookie = (name) => {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(name + "="));
      return cookieValue ? cookieValue.split("=")[1] : null;
    };

    const userId = getCookie("userID");
    if (!userId) {
      setModalMessage("用戶資訊不完整");
      setModalType("error");
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}users/${userId}/enrollments/${courseId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setModalMessage("選課成功！");
        setModalType("success");
        setShowModal(true);
        // 重新載入課程列表以更新選課狀態
        await fetchCourses(currentPage);
      } else {
        setModalMessage(result.message || "選課失敗");
        setModalType("error");
        setShowModal(true);
      }
    } catch (err) {
      setModalMessage("選課請求失敗");
      setModalType("error");
      setShowModal(true);
      console.error("Error enrolling course:", err);
    }
  };

  // 關閉 modal
  const closeModal = () => {
    setShowModal(false);
    setModalMessage("");
    setModalType("");
  };

  // 篩選處理
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };
  const applyFilters = () => {
    setCurrentPage(1);
    setHasSearched(false); // 重置搜尋狀態
    fetchCourses(1);
  };
  const clearFilters = () => {
    setFilters({
      term: "114-1", // 保持固定學期
      departmentId: "",
      grade: "",
    });
    setCurrentPage(1);
    setCourses([]); // 清空課程列表
    setHasSearched(false); // 重置搜尋狀態
  };

  // 頁面切換
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchCourses(page);
    }
  };

  // 清除錯誤訊息
  const clearError = () => {
    setError("");
  };
  // 移除自動載入的 useEffect
  // useEffect(() => {
  //   fetchCourses();
  // }, []);

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
    <div className="course-selection">
      {" "}
      <div className="course-selection-header">
        <h2>選課系統</h2>
        <p>學期: 114-1</p>
      </div>
      {/* 錯誤與成功訊息 */}
      {error && (
        <div className="message error-message" onClick={clearError}>
          <IoWarning />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="message success-message">
          <IoCheckmarkCircle />
          <span>{successMessage}</span>
        </div>
      )}{" "}
      {/* 篩選區域 */}
      <div className="course-filters">
        <div className="filter-group">
          <label>學期:</label>
          <div className="fixed-term">114-1</div>
        </div>

        <div className="filter-group">
          <label>系所:</label>
          <select
            value={filters.departmentId}
            onChange={(e) => handleFilterChange("departmentId", e.target.value)}
          >
            <option value="">全部系所</option>
            <option value="3">資訊管理學系</option>
            <option value="4">資訊工程學系</option>
            <option value="6">財務金融學系</option>
          </select>
        </div>

        <div className="filter-group">
          <label>年級:</label>
          <select
            value={filters.grade}
            onChange={(e) => handleFilterChange("grade", e.target.value)}
          >
            <option value="">全部年級</option>
            <option value="1">一年級</option>
            <option value="2">二年級</option>
            <option value="3">三年級</option>
            <option value="4">四年級</option>
          </select>
        </div>

        <div className="filter-actions">
          <button className="apply-filters-btn" onClick={applyFilters}>
            <FaSearch />
            搜尋
          </button>
          <button className="clear-filters-btn" onClick={clearFilters}>
            清除
          </button>
        </div>
      </div>
      {/* 課程列表 */}
      <div className="course-list">
        {loading ? (
          <div className="loading">載入中...</div>
        ) : !hasSearched ? (
          <div className="no-search">
            <FaSearch className="search-icon" />
            <p>請使用上方的搜尋功能來查找課程</p>
            <p className="search-hint">
              選擇學期、年級等條件後點擊「搜尋」按鈕
            </p>
          </div>
        ) : courses.length === 0 ? (
          <div className="no-courses">
            <p>沒有找到符合條件的課程</p>
            <p className="search-hint">請嘗試調整搜尋條件</p>
          </div>
        ) : (
          courses.map((course) => {
            const isExpanded = expandedCourses.has(course.id);

            return (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3 className="course-title">{course.name}</h3>
                </div>

                {/* 主要資訊 - 始終顯示 */}
                <div className="course-main-info">
                  <div className="info-row">
                    {" "}
                    <div className="info-item">
                      <FaUsers className="info-icon" />
                      <div className="enrollment-info">
                        <span
                          className={`enrollment-count ${
                            (course.current_enrollments || 0) >=
                            (course.choose_limit || 0)
                              ? "enrollment-full"
                              : "enrollment-available"
                          }`}
                        >
                          {course.current_enrollments || 0}
                        </span>
                        <span>/</span>
                        <span className="enrollment-limit">
                          {course.choose_limit || 0}
                        </span>
                        <span>人</span>
                        {(course.current_enrollments || 0) >=
                          (course.choose_limit || 0) && (
                          <span className="enrollment-status">（已額滿）</span>
                        )}
                      </div>
                    </div>
                    <div className="info-item">
                      <FaBook className="info-icon" />
                      <span>{course.credits || 0} 學分</span>
                    </div>
                    <div className="info-item">
                      <FaClock className="info-icon" />
                      <span>{course.time || "時間未定"}</span>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-item">
                      <strong>授課教師: </strong>
                      <span>{course.teacher?.name || "未指定"}</span>
                    </div>
                  </div>
                </div>

                {/* 詳細資訊 - 可展開/收合 */}
                {isExpanded && (
                  <div className="course-detailed-info">
                    <div className="detail-section">
                      <div className="info-item">
                        <FaMapMarkerAlt className="info-icon" />
                        <span>
                          教室: {course.classroom?.name || "教室未定"}
                        </span>
                      </div>

                      {course.type && (
                        <div className="info-item">
                          <span className="info-label">類型:</span>
                          <span>{course.type}</span>
                        </div>
                      )}

                      {course.grade && (
                        <div className="info-item">
                          <span className="info-label">年級:</span>
                          <span>{course.grade}</span>
                        </div>
                      )}

                      {course.class && (
                        <div className="info-item">
                          <span className="info-label">班級:</span>
                          <span>{course.class}</span>
                        </div>
                      )}
                    </div>

                    {/* 顯示課程備註 */}
                    {course.note && (
                      <div className="course-note">
                        <strong>備註: </strong>
                        <span>{course.note}</span>
                      </div>
                    )}

                    {/* 顯示課程大綱連結 */}
                    {course.outline && (
                      <div className="course-outline">
                        <strong>課程大綱: </strong>
                        <a
                          href={course.outline}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="outline-link"
                        >
                          {course.outline}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* 底部操作區 */}
                <div className="course-actions">
                  <button
                    className="toggle-details-btn"
                    onClick={() => toggleCourseExpanded(course.id)}
                  >
                    {isExpanded ? (
                      <>
                        <FaChevronUp />
                        收合詳情
                      </>
                    ) : (
                      <>
                        <FaChevronDown />
                        展開詳情
                      </>
                    )}
                  </button>

                  <button
                    className="enroll-btn"
                    onClick={() => enrollCourse(course.id)}
                    disabled={
                      (course.current_enrollments || 0) >=
                      (course.choose_limit || 0)
                    }
                  >
                    {(course.current_enrollments || 0) >=
                    (course.choose_limit || 0)
                      ? "已額滿"
                      : "選課"}
                  </button>
                </div>
              </div>
            );
          })
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
            下一頁{" "}
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

export default CourseSelection;
