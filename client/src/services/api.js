import { API_BASE_URL } from "../config/config";

// 請求緩存，用於防止重複請求
const requestCache = new Map();
const CACHE_DURATION = 5000; // 5秒緩存時間

// 通用的 API 請求函數
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const cacheKey = `${options.method || "GET"}-${endpoint}-${JSON.stringify(
    options.body || {}
  )}`;

  // 檢查緩存
  if (requestCache.has(cacheKey)) {
    const cached = requestCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("使用緩存結果:", endpoint);
      return cached.data;
    } else {
      requestCache.delete(cacheKey);
    }
  }

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // 檢查響應狀態
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    // 如果是 204 No Content，直接返回 null
    if (response.status === 204) {
      return null;
    }

    // 嘗試解析 JSON
    const data = await response.json();

    // 只對 GET 請求進行緩存
    if (!options.method || options.method === "GET") {
      requestCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// 清除緩存的輔助函數
const clearCache = (pattern) => {
  for (const key of requestCache.keys()) {
    if (key.includes(pattern)) {
      requestCache.delete(key);
    }
  }
};

// 統計相關 API
export const statisticsAPI = {
  getStatistics: () => {
    return apiRequest(`statistics`);
  },
};

// 公告相關 API
export const announcementAPI = {
  // 獲取公告列表
  getAnnouncements: (isTimeline = false) => {
    return apiRequest(`announcements?time=${isTimeline}`);
  },

  // 獲取單個公告
  getAnnouncement: (id) => {
    return apiRequest(`announcements/${id}`);
  },

  // 創建公告
  createAnnouncement: async (data) => {
    const result = await apiRequest("announcements", {
      method: "POST",
      body: JSON.stringify(data),
    });
    // 清除公告列表緩存
    clearCache("announcements");
    return result;
  },

  // 更新公告
  updateAnnouncement: async (id, data) => {
    const result = await apiRequest(`announcements/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    // 清除公告相關緩存
    clearCache("announcements");
    return result;
  },

  // 刪除公告
  deleteAnnouncement: async (id) => {
    const result = await apiRequest(`announcements/${id}`, {
      method: "DELETE",
    });
    // 清除公告相關緩存
    clearCache("announcements");
    return result;
  },
};

// 用戶相關 API (如需要)
export const userAPI = {
  // 登入
  login: (credentials) => {
    return apiRequest("login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // 登出
  logout: () => {
    return apiRequest("logout", {
      method: "POST",
    });
  },

  // 註冊
  register: (userData) => {
    return apiRequest("register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },
};

export default { announcementAPI, userAPI, statisticsAPI };
