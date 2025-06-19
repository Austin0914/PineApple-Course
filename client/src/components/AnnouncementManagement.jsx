import { useState, useEffect, useCallback, memo } from "react";
import { announcementAPI } from "../services/api";
import { ToastContainer } from "./Toast";
import { useConfirm } from "./ConfirmDialog";
import useToast from "../hooks/useToast";
import "./AnnouncementManagement.css";

function AnnouncementManagement({ userInfo }) {
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

  const { toasts, showSuccess, showError, removeToast } = useToast();
  const { showConfirm, confirmDialog } = useConfirm();
  useEffect(() => {
    fetchAllAnnouncements();
  }, [fetchAllAnnouncements]); // 現在 fetchAllAnnouncements 被 useCallback 包裹，不會重複創建// 獲取所有公告 (包含時間軸和普通公告)
  const fetchAllAnnouncements = useCallback(async () => {
    try {
      setLoading(true);

      // 使用 Promise.all 同時獲取兩種類型的公告
      const [normalResult, timeResult] = await Promise.all([
        announcementAPI.getAnnouncements(false), // 普通公告
        announcementAPI.getAnnouncements(true), // 時間軸公告
      ]);

      // 合併兩種公告並標記類型
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

      // 按日期排序 (最新的在前)
      allAnnouncements.sort(
        (a, b) => new Date(b.announceDate) - new Date(a.announceDate)
      );

      setAnnouncements(allAnnouncements);
      setError("");
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError(`無法載入公告資料: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []); // 空依賴陣列，函數不會重新創建// 新增公告
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await announcementAPI.createAnnouncement({
        ...formData,
        userID: userInfo?.userId,
      });

      setShowAddModal(false);
      resetForm();
      fetchAllAnnouncements();
      showSuccess("公告新增成功！");
    } catch (err) {
      console.error("Error adding announcement:", err);
      showError(`新增公告失敗: ${err.message}`);
    }
  }; // 編輯公告
  const handleEditAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await announcementAPI.updateAnnouncement(
        selectedAnnouncement.announceId,
        {
          ...formData,
          userID: userInfo?.userId,
        }
      );

      setShowEditModal(false);
      resetForm();
      setSelectedAnnouncement(null);
      fetchAllAnnouncements();
      showSuccess("公告編輯成功！");
    } catch (err) {
      console.error("Error editing announcement:", err);
      showError(`編輯公告失敗: ${err.message}`);
    }
  }; // 刪除公告
  const handleDeleteAnnouncement = async (announceId, title) => {
    const confirmed = await showConfirm({
      title: "刪除公告",
      message: `確定要刪除公告「${title}」嗎？此操作無法撤銷。`,
      confirmText: "刪除",
      cancelText: "取消",
      type: "error",
    });

    if (!confirmed) return;

    try {
      await announcementAPI.deleteAnnouncement(announceId);
      fetchAllAnnouncements();
      showSuccess("公告刪除成功！");
    } catch (err) {
      console.error("Error deleting announcement:", err);
      showError(`刪除公告失敗: ${err.message}`);
    }
  };

  // 開啟編輯模態框
  const openEditModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      announce_date: announcement.announceDate.split("T")[0], // 只取日期部分
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
      const date = new Date(dateString);
      return date.toLocaleDateString("zh-TW");
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
                  </button>{" "}
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
            </form>{" "}
          </div>
        </div>
      )}
      {/* Toast 通知容器 */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* 確認對話框 */}
      {confirmDialog}
    </div>
  );
}

export default memo(AnnouncementManagement);
