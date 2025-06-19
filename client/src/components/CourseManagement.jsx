import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/config";
import {
  FaSearch,
  FaBook,
  FaUsers,
  FaClock,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import { IoWarning, IoCheckmarkCircle } from "react-icons/io5";
import "./CourseManagement.css";

function CourseManagement({ userInfo }) {
  // 權限檢查 - 只允許管理員訪問
  const isAdmin = userInfo?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="course-management">
        <div className="access-denied">
          <IoWarning className="warning-icon" />
          <h2>訪問被拒絕</h2>
          <p>您沒有權限訪問課程管理功能</p>
          <p>請聯繫系統管理員獲取相關權限</p>
        </div>
      </div>
    );
  }
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedCourses, setExpandedCourses] = useState(new Set());
  const [editingCourse, setEditingCourse] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [filters, setFilters] = useState({
    term: "114-1",
    departmentId: "",
    grade: "",
  });

  const [newCourse, setNewCourse] = useState({
    departmentId: "",
    courseName: "",
    note: "",
    outline: "",
    detailTime: "",
    classroomName: "",
    chooseLimit: "",
    credit: "",
    type: "",
    grade: "",
    class: "",
    semester: "114-1",
    teacher: "",
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

  // 新增課程
  const createCourse = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}courses`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCourse),
      });

      const result = await response.json();

      if (response.ok) {
        setModalMessage("課程新增成功！");
        setModalType("success");
        setShowModal(true);
        setShowAddForm(false);
        setNewCourse({
          departmentId: "",
          courseName: "",
          note: "",
          outline: "",
          detailTime: "",
          classroomName: "",
          chooseLimit: "",
          credit: "",
          type: "",
          grade: "",
          class: "",
          semester: "114-1",
          teacher: "",
        });
        await fetchCourses(currentPage);
      } else {
        setModalMessage(result.message || "課程新增失敗");
        setModalType("error");
        setShowModal(true);
      }
    } catch (err) {
      setModalMessage("課程新增請求失敗");
      setModalType("error");
      setShowModal(true);
      console.error("Error creating course:", err);
    }
  };

  // 更新課程
  const updateCourse = async (courseId, updatedData) => {
    try {
      const response = await fetch(`${API_BASE_URL}courses/${courseId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (response.ok) {
        setModalMessage("課程更新成功！");
        setModalType("success");
        setShowModal(true);
        setEditingCourse(null);
        await fetchCourses(currentPage);
      } else {
        setModalMessage(result.message || "課程更新失敗");
        setModalType("error");
        setShowModal(true);
      }
    } catch (err) {
      setModalMessage("課程更新請求失敗");
      setModalType("error");
      setShowModal(true);
      console.error("Error updating course:", err);
    }
  };

  // 刪除課程
  const deleteCourse = async (courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}courses/${courseId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204 || response.ok) {
        setModalMessage("課程刪除成功！");
        setModalType("success");
        setShowModal(true);
        setConfirmDelete(null);
        await fetchCourses(currentPage);
      } else {
        const result = await response.json();
        setModalMessage(result.message || "課程刪除失敗");
        setModalType("error");
        setShowModal(true);
      }
    } catch (err) {
      setModalMessage("課程刪除請求失敗");
      setModalType("error");
      setShowModal(true);
      console.error("Error deleting course:", err);
    }
  };

  // 開始編輯課程
  const startEditingCourse = (course) => {
    setEditingCourse({
      id: course.id,
      departmentId: course.department.id,
      courseName: course.name,
      note: course.note,
      outline: course.outline,
      detailTime: course.time,
      classroomName: course.classroom.name,
      chooseLimit: course.choose_limit,
      credit: course.credits,
      type: course.type,
      grade: course.grade,
      class: course.class,
      semester: course.semester,
      teacher: course.teacher.name,
    });
  };

  // 取消編輯
  const cancelEditing = () => {
    setEditingCourse(null);
  };

  // 保存編輯
  const saveEdit = () => {
    const { id, ...updateData } = editingCourse;
    updateCourse(id, updateData);
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
    setHasSearched(false);
    fetchCourses(1);
  };

  const clearFilters = () => {
    setFilters({
      term: "114-1",
      departmentId: "",
      grade: "",
    });
    setCurrentPage(1);
    setCourses([]);
    setHasSearched(false);
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
    <div className="course-management">
      <h2
        style={{
          textAlign: "center",
          color: "#4f46e5",
          margin: "1rem",
          fontSize: "2rem",
        }}
      >
        課程管理系統
      </h2>
      <div className="course-management-header">
        <p>學期: 114-1</p>
        <button className="add-course-btn" onClick={() => setShowAddForm(true)}>
          <FaPlus />
          新增課程
        </button>
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
      )}

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

      {/* 新增課程表單 */}
      {showAddForm && (
        <div className="add-course-form">
          <div className="form-header">
            <h3>新增課程</h3>
            <button
              className="close-form-btn"
              onClick={() => setShowAddForm(false)}
            >
              <FaTimes />
            </button>
          </div>
          <div className="form-content">
            <div className="form-row">
              <div className="form-group">
                <label>系所:</label>
                <select
                  value={newCourse.departmentId}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, departmentId: e.target.value })
                  }
                  required
                >
                  <option value="">請選擇系所</option>
                  <option value="3">資訊管理學系</option>
                  <option value="4">資訊工程學系</option>
                  <option value="6">財務金融學系</option>
                </select>
              </div>
              <div className="form-group">
                <label>課程名稱:</label>
                <input
                  type="text"
                  value={newCourse.courseName}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, courseName: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>授課教師:</label>
                <input
                  type="text"
                  value={newCourse.teacher}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, teacher: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>學分數:</label>
                <input
                  type="number"
                  min="1"
                  value={newCourse.credit}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, credit: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>上課時間:</label>
                <input
                  type="text"
                  value={newCourse.detailTime}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, detailTime: e.target.value })
                  }
                  placeholder="例: 週一 1-2節"
                  required
                />
              </div>
              <div className="form-group">
                <label>教室:</label>
                <input
                  type="text"
                  value={newCourse.classroomName}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      classroomName: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>選課人數限制:</label>
                <input
                  type="number"
                  min="1"
                  value={newCourse.chooseLimit}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, chooseLimit: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>課程類型:</label>
                <select
                  value={newCourse.type}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, type: e.target.value })
                  }
                  required
                >
                  <option value="">請選擇類型</option>
                  <option value="必修">必修</option>
                  <option value="選修">選修</option>
                  <option value="通識">通識</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>年級:</label>
                <select
                  value={newCourse.grade}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, grade: e.target.value })
                  }
                  required
                >
                  <option value="">請選擇年級</option>
                  <option value="1">一年級</option>
                  <option value="2">二年級</option>
                  <option value="3">三年級</option>
                  <option value="4">四年級</option>
                </select>
              </div>
              <div className="form-group">
                <label>班級:</label>
                <input
                  type="text"
                  value={newCourse.class}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, class: e.target.value })
                  }
                  placeholder="例: A班"
                  required
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>課程備註:</label>
              <textarea
                value={newCourse.note}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, note: e.target.value })
                }
                rows="3"
              />
            </div>
            <div className="form-group full-width">
              <label>課程大綱連結:</label>
              <input
                type="url"
                value={newCourse.outline}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, outline: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="save-btn" onClick={createCourse}>
              <FaSave />
              儲存
            </button>
            <button
              className="cancel-btn"
              onClick={() => setShowAddForm(false)}
            >
              <FaTimes />
              取消
            </button>
          </div>
        </div>
      )}

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
            const isEditing = editingCourse && editingCourse.id === course.id;

            return (
              <div key={course.id} className="course-card">
                {isEditing ? (
                  // 編輯模式
                  <div className="edit-course-form">
                    <div className="form-header">
                      <h3>編輯課程</h3>
                    </div>
                    <div className="form-content">
                      <div className="form-row">
                        <div className="form-group">
                          <label>系所:</label>
                          <select
                            value={editingCourse.departmentId}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                departmentId: e.target.value,
                              })
                            }
                          >
                            <option value="3">資訊管理學系</option>
                            <option value="4">資訊工程學系</option>
                            <option value="6">財務金融學系</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>課程名稱:</label>
                          <input
                            type="text"
                            value={editingCourse.courseName}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                courseName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>授課教師:</label>
                          <input
                            type="text"
                            value={editingCourse.teacher}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                teacher: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>學分數:</label>
                          <input
                            type="number"
                            min="1"
                            value={editingCourse.credit}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                credit: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>上課時間:</label>
                          <input
                            type="text"
                            value={editingCourse.detailTime}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                detailTime: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>教室:</label>
                          <input
                            type="text"
                            value={editingCourse.classroomName}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                classroomName: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>選課人數限制:</label>
                          <input
                            type="number"
                            min="0"
                            value={editingCourse.chooseLimit}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                chooseLimit: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-group">
                          <label>課程類型:</label>
                          <select
                            value={editingCourse.type}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                type: e.target.value,
                              })
                            }
                          >
                            <option value="必修">必修</option>
                            <option value="選修">選修</option>
                            <option value="通識">通識</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>年級:</label>
                          <select
                            value={editingCourse.grade}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                grade: e.target.value,
                              })
                            }
                          >
                            <option value="1">一年級</option>
                            <option value="2">二年級</option>
                            <option value="3">三年級</option>
                            <option value="4">四年級</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>班級:</label>
                          <input
                            type="text"
                            value={editingCourse.class}
                            onChange={(e) =>
                              setEditingCourse({
                                ...editingCourse,
                                class: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group full-width">
                        <label>課程備註:</label>
                        <textarea
                          value={editingCourse.note}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              note: e.target.value,
                            })
                          }
                          rows="3"
                        />
                      </div>
                      <div className="form-group full-width">
                        <label>課程大綱連結:</label>
                        <input
                          type="url"
                          value={editingCourse.outline}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              outline: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="save-btn" onClick={saveEdit}>
                        <FaSave />
                        儲存
                      </button>
                      <button className="cancel-btn" onClick={cancelEditing}>
                        <FaTimes />
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  // 顯示模式
                  <>
                    <div className="course-header">
                      <h3 className="course-title">{course.name}</h3>
                      <div className="course-management-actions">
                        <button
                          className="edit-btn"
                          onClick={() => startEditingCourse(course)}
                        >
                          <FaEdit />
                          編輯
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => setConfirmDelete(course.id)}
                        >
                          <FaTrash />
                          刪除
                        </button>
                      </div>
                    </div>

                    {/* 主要資訊 - 始終顯示 */}
                    <div className="course-main-info">
                      <div className="info-row">
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
                              <span className="enrollment-status">
                                （已額滿）
                              </span>
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
                              查看大綱
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
                    </div>
                  </>
                )}
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
            下一頁
          </button>
        </div>
      )}

      {/* 刪除確認對話框 */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div
            className="modal-content confirm-delete"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-icon error">
                <IoWarning />
              </div>
            </div>
            <div className="modal-body">
              <p className="modal-message">確定要刪除這個課程嗎？</p>
              <p className="modal-warning">此操作無法復原！</p>
            </div>
            <div className="modal-footer">
              <button
                className="modal-confirm-btn"
                onClick={() => deleteCourse(confirmDelete)}
              >
                確定刪除
              </button>
              <button
                className="modal-cancel-btn"
                onClick={() => setConfirmDelete(null)}
              >
                取消
              </button>
            </div>
          </div>
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

export default CourseManagement;
