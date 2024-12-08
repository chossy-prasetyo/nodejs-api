function now_datetime()
{
  const now = new Date();
  const padZero = (num) => String(num).padStart(2, '0');

  const year = now.getFullYear();
  const month = padZero(now.getMonth() + 1);
  const date = padZero(now.getDate());

  const hours = padZero(now.getHours());
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
}

module.exports = now_datetime
