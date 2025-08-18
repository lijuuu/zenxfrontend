export const formatDate = (timestamp: number) => {
  if (!timestamp) return "Invalid date";

  try {
    const ts = timestamp < 1e12 ? timestamp * 1000 : timestamp;
    const date = new Date(ts);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
  } catch {
    return "Invalid date";
  }
};
