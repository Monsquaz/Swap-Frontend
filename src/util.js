module.exports = {
  ellipsis: (str, len = 160) => {
    if (str.length <= len) return str;
    return str.substring(0, len - 3) + '...';
  }
};
