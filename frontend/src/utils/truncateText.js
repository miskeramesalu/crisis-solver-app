export const truncateText = (text, maxLen = 50) => {
  if (!text || text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '…';
};