import { useEffect } from "react";

// 開發環境下的請求監控
const RequestMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const requestCounts = new Map();
    const requestTimes = new Map();

    // 攔截 fetch 請求
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const url = args[0];
      const now = Date.now();

      // 記錄請求次數
      const count = requestCounts.get(url) || 0;
      requestCounts.set(url, count + 1);

      // 記錄請求時間
      const times = requestTimes.get(url) || [];
      times.push(now);
      requestTimes.set(url, times);

      // 檢測短時間內的重複請求
      const recentTimes = times.filter((time) => now - time < 5000); // 5秒內
      if (recentTimes.length > 3) {
        console.warn(`⚠️ 檢測到重複請求: ${url}`);
        console.warn(`5秒內發送了 ${recentTimes.length} 次請求`);
        console.warn(
          "請求時間:",
          recentTimes.map((time) => new Date(time).toLocaleTimeString())
        );
      }

      return originalFetch.apply(this, args);
    };

    // 定期清理舊的記錄
    const cleanup = setInterval(() => {
      const cutoff = Date.now() - 60000; // 1分鐘前
      for (const [url, times] of requestTimes.entries()) {
        const recentTimes = times.filter((time) => time > cutoff);
        if (recentTimes.length === 0) {
          requestTimes.delete(url);
          requestCounts.delete(url);
        } else {
          requestTimes.set(url, recentTimes);
        }
      }
    }, 30000);

    return () => {
      // 恢復原始 fetch
      window.fetch = originalFetch;
      clearInterval(cleanup);
    };
  }, []);

  return null; // 這個組件不渲染任何內容
};

export default RequestMonitor;
