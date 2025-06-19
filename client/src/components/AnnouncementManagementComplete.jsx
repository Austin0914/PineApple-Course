import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/config";
import { IoWarning } from "react-icons/io5";
import "./AnnouncementManagement.css";

function AnnouncementManagementComplete({ userInfo }) {
  // 權限檢查 - 只允許管理員訪問
  const isAdmin = userInfo?.role === "admin";

  console.log("AnnouncementManagementComplete - userInfo:", userInfo);
  console.log("AnnouncementManagementComplete - isAdmin:", isAdmin);

  if (!isAdmin) {
    return (
      <div className="announcement-management">
        <div className="access-denied">
          <IoWarning className="warning-icon" />
          <h2>訪問被拒絕</h2>
          <p>您沒有權限訪問公告管理功能</p>
          <p>請聯繫系統管理員獲取相關權限</p>
        </div>
      </div>
    );
  }
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    announce_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchAllAnnouncements();
  }, []);

  // 獲取所有公告
  const fetchAllAnnouncements = async () => {
    try {
      setLoading(true);

      // 獲取普通公告
      const normalResponse = await fetch(
        `${API_BASE_URL}announcements?time=false`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        }
      );

      // 獲取時間軸公告
      const timeResponse = await fetch(
        `${API_BASE_URL}announcements?time=true`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        }
      );

      if (normalResponse.ok && timeResponse.ok) {
        const normalResult = await normalResponse.json();
        const timeResult = await timeResponse.json();

        const allAnnouncements = [
          ...(normalResult.data || []).map((item) => ({
            ...item,
            type: "普通公告",
          })),
          ...(timeResult.data || []).map((item) => ({
            ...item,
            type: "時間軸公告",
          })),
        ];

        allAnnouncements.sort(
          (a, b) => new Date(b.announceDate) - new Date(a.announceDate)
        );
        setAnnouncements(allAnnouncements);
        setError("");
      } else {
        throw new Error("Failed to fetch announcements");
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError(`無法載入公告資料: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 新增公告
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          userID: userInfo?.userId,
        }),
      });

      if (response.status === 204) {
        setShowAddModal(false);
        resetForm();
        fetchAllAnnouncements();
        alert("公告新增成功！");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "新增公告失敗");
      }
    } catch (err) {
      console.error("Error adding announcement:", err);
      alert(`新增公告失敗: ${err.message}`);
    }
  };

  // 編輯公告
  const handleEditAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE_URL}announcements/${selectedAnnouncement.announceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            userID: userInfo?.userId,
          }),
        }
      );

      if (response.status === 204) {
        setShowEditModal(false);
        resetForm();
        setSelectedAnnouncement(null);
        fetchAllAnnouncements();
        alert("公告編輯成功！");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "編輯公告失敗");
      }
    } catch (err) {
      console.error("Error editing announcement:", err);
      alert(`編輯公告失敗: ${err.message}`);
    }
  };

  // 刪除公告
  const handleDeleteAnnouncement = async (announceId, title) => {
    if (!confirm(`確定要刪除公告「${title}」嗎？此操作無法撤銷。`)) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}announcements/${announceId}`,
        {
          method: "DELETE",
          headers: { Accept: "application/json" },
          credentials: "include",
        }
      );

      if (response.status === 204) {
        fetchAllAnnouncements();
        alert("公告刪除成功！");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "刪除公告失敗");
      }
    } catch (err) {
      console.error("Error deleting announcement:", err);
      alert(`刪除公告失敗: ${err.message}`);
    }
  };

  // 開啟編輯模態框
  const openEditModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      announce_date: announcement.announceDate.split("T")[0],
      end_date: announcement.endDate ? announcement.endDate.split("T")[0] : "",
    });
    setShowEditModal(true);
  };

  // 重置表單
  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      announce_date: "",
      end_date: "",
    });
  };

  // 處理表單輸入
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 格式化日期
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("zh-TW");
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="announcement-management">
        <div className="loading">載入中...</div>
      </div>
    );
  }

  return (
    <div className="announcement-management">
      <div className="management-header">
        <h1>公告管理</h1>
        <button
          className="add-btn"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          新增公告
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="announcements-table">
        <table>
          <thead>
            <tr>
              <th>標題</th>
              <th>類型</th>
              <th>發布日期</th>
              <th>結束日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => (
              <tr key={announcement.announceId}>
                <td className="title-cell">{announcement.title}</td>
                <td>{announcement.type}</td>
                <td>{formatDate(announcement.announceDate)}</td>
                <td>
                  {announcement.endDate
                    ? formatDate(announcement.endDate)
                    : "無"}
                </td>
                <td className="actions-cell">
                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(announcement)}
                  >
                    編輯
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteAnnouncement(
                        announcement.announceId,
                        announcement.title
                      )
                    }
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {announcements.length === 0 && (
          <div className="no-data">暫無公告資料</div>
        )}
      </div>

      {/* 新增公告模態框 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>新增公告</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleAddAnnouncement}
              className="announcement-form"
            >
              <div className="form-group">
                <label htmlFor="title">標題 *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">內容 *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="announce_date">發布日期 *</label>
                <input
                  type="date"
                  id="announce_date"
                  name="announce_date"
                  value={formData.announce_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_date">
                  結束日期 (可選，填寫後將顯示在時間軸)
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  新增
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 編輯公告模態框 */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>編輯公告</h2>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleEditAnnouncement}
              className="announcement-form"
            >
              <div className="form-group">
                <label htmlFor="edit-title">標題 *</label>
                <input
                  type="text"
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-content">內容 *</label>
                <textarea
                  id="edit-content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-announce_date">發布日期 *</label>
                <input
                  type="date"
                  id="edit-announce_date"
                  name="announce_date"
                  value={formData.announce_date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-end_date">
                  結束日期 (可選，填寫後將顯示在時間軸)
                </label>
                <input
                  type="date"
                  id="edit-end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  保存
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnnouncementManagementComplete;
