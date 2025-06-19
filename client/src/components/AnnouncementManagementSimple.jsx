import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/config";

function AnnouncementManagement({ userInfo }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  // 刪除公告
  const handleDeleteAnnouncement = async (announceId, title) => {
    if (!confirm(`確定要刪除公告「${title}」嗎？`)) {
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
        throw new Error("刪除失敗");
      }
    } catch (err) {
      alert(`刪除公告失敗: ${err.message}`);
    }
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
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div>載入中...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          paddingBottom: "1rem",
          borderBottom: "2px solid #007bff",
        }}
      >
        <h1 style={{ margin: 0, color: "#333" }}>公告管理</h1>
        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() => alert("新增功能開發中...")}
        >
          新增公告
        </button>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#fee",
            color: "#c33",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#007bff" }}>
              <th
                style={{ padding: "1rem", textAlign: "left", color: "white" }}
              >
                標題
              </th>
              <th
                style={{ padding: "1rem", textAlign: "left", color: "white" }}
              >
                類型
              </th>
              <th
                style={{ padding: "1rem", textAlign: "left", color: "white" }}
              >
                發布日期
              </th>
              <th
                style={{ padding: "1rem", textAlign: "left", color: "white" }}
              >
                結束日期
              </th>
              <th
                style={{ padding: "1rem", textAlign: "left", color: "white" }}
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => (
              <tr
                key={announcement.announceId}
                style={{ borderBottom: "1px solid #eee" }}
              >
                <td
                  style={{
                    padding: "1rem",
                    maxWidth: "300px",
                    wordWrap: "break-word",
                  }}
                >
                  {announcement.title}
                </td>
                <td style={{ padding: "1rem" }}>{announcement.type}</td>
                <td style={{ padding: "1rem" }}>
                  {formatDate(announcement.announceDate)}
                </td>
                <td style={{ padding: "1rem" }}>
                  {announcement.endDate
                    ? formatDate(announcement.endDate)
                    : "無"}
                </td>
                <td style={{ padding: "1rem" }}>
                  <button
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginRight: "0.5rem",
                    }}
                    onClick={() => alert("編輯功能開發中...")}
                  >
                    編輯
                  </button>
                  <button
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
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
          <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
            暫無公告資料
          </div>
        )}
      </div>
    </div>
  );
}

export default AnnouncementManagement;
