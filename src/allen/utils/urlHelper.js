import defaultThumbnail from '@/assets/allen/no-image.jpg';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

/**
 * 從完整 URL 轉為相對路徑 (只在上傳後使用)
 * @param {string} fullUrl e.g. http://localhost:8082/uploads/xxx.png
 * @returns {string} /uploads/xxx.png
 */
export function extractRelativePath(fullUrl) {
  if (!fullUrl) return '';
  return fullUrl.replace(baseUrl, '');
}

/**
 * 從相對路徑轉為完整 URL (顯示圖片用)
 * @param {string} path e.g. /uploads/xxx.png
 * @returns {string} http://localhost:8082/uploads/xxx.png 或 assets 中的預設圖片
 */
export function getFullImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  // 確保 baseUrl 與 path 之間不會重複或缺少 `/`
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}