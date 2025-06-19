import { useState, useEffect } from "react";
import AnnounceList from "./AnnouceList";
import { API_BASE_URL } from "../config/config";
import "./Announce.css";

function Announce({ showTimedAnnouncements = false }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    fetchAnnouncements();
  }, [showTimedAnnouncements]);

  // 格式化時間為年月日
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}/${month}/${day}`;
    } catch {
      return dateString; // 如果解析失敗，返回原字串
    }
  };

  // 處理點擊公告
  const handleAnnouncementClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowModal(true);
  };

  // 關閉彈出視窗
  const closeModal = () => {
    setShowModal(false);
    setSelectedAnnouncement(null);
  };
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const timeParam = showTimedAnnouncements ? "true" : "false";
      const response = await fetch(
        `${API_BASE_URL}announcements?time=${timeParam}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        setAnnouncements(result.data || []);
        setError("");
      } else {
        throw new Error("Failed to fetch announcements");
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("無法載入公告資料，請檢查網路連接或聯繫管理員");

      // 如果API失敗，使用備用資料
      setAnnouncements([
        {
          announceId: 1,
          announceDate: "2025-06-09",
          title:
            "114學年度第1學期第一階段選課(114/6/9～6/13)系統開放及關閉篩選時間",
          content:
            "第一階段選課日期：114年6月9日（星期一）至6月13日（星期五）止\n系統開放時間：每日上午8:00至晚上11:00\n請同學把握時間完成選課作業。",
        },
        {
          announceId: 2,
          announceDate: "2025-02-08",
          title:
            "113-2學期TAICA(臺灣大專院校人工智慧學程聯盟)課程、選課暨上課說明",
          content:
            "113-2學期TAICA課程即將開始，請有選修相關課程的同學注意上課時間與地點。\n詳細資訊請參考課程大綱。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="announceContainer">
        <h1 style={{ margin: "1rem 0", fontWeight: "bold" }}>公告</h1>
        <div className="announce-loading">載入中...</div>
      </div>
    );
  }

  return (
    <div className="announceContainer">
      <h1 style={{ margin: "1rem 0", fontWeight: "bold" }}>公告</h1>
      {error && (
        <div
          className="announce-error"
          style={{ color: "red", marginBottom: "1rem" }}
        >
          {error}
        </div>
      )}
      <div
        className="announce"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {" "}
        {announcements.length > 0 ? (
          announcements.map((item, index) => (
            <AnnounceList
              key={item.announceId || index}
              announceDate={formatDate(item.announceDate)}
              title={item.title}
              content={item.content}
              onClick={() => handleAnnouncementClick(item)}
            />
          ))
        ) : (
          <div className="no-announcements">暫無公告</div>
        )}
      </div>

      {/* 彈出視窗 */}
      {showModal && selectedAnnouncement && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedAnnouncement.title}</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-date">
                發布日期：{formatDate(selectedAnnouncement.announceDate)}
              </div>
              {selectedAnnouncement.endDate && (
                <div className="modal-end-date">
                  結束日期：{formatDate(selectedAnnouncement.endDate)}
                </div>
              )}
              <div className="modal-content-text">
                {selectedAnnouncement.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Announce;
