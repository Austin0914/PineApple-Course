import { useState } from "react";
import { announcementAPI } from "../services/api";

function AnnouncementTest() {
  const [testResult, setTestResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testAPI = async (testName, apiCall) => {
    setLoading(true);
    try {
      const result = await apiCall();
      setTestResult(`${testName} 成功: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setTestResult(`${testName} 失敗: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", border: "1px solid #ccc", margin: "1rem" }}>
      <h3>公告 API 測試</h3>

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() =>
            testAPI("獲取普通公告", () =>
              announcementAPI.getAnnouncements(false)
            )
          }
          disabled={loading}
          style={{ marginRight: "1rem" }}
        >
          測試獲取普通公告
        </button>

        <button
          onClick={() =>
            testAPI("獲取時間軸公告", () =>
              announcementAPI.getAnnouncements(true)
            )
          }
          disabled={loading}
        >
          測試獲取時間軸公告
        </button>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() =>
            testAPI("創建測試公告", () =>
              announcementAPI.createAnnouncement({
                title: "測試公告",
                content: "這是一個測試公告",
                announce_date: "2025-06-19",
                userID: 1,
              })
            )
          }
          disabled={loading}
          style={{ marginRight: "1rem" }}
        >
          測試創建公告
        </button>
      </div>

      {loading && <div>執行中...</div>}

      {testResult && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            backgroundColor: "#f5f5f5",
            borderRadius: "4px",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
          }}
        >
          {testResult}
        </div>
      )}
    </div>
  );
}

export default AnnouncementTest;
