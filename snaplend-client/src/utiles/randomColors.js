const pastelPalette = [
  "#EF5350", // Red
  "#AB47BC", // Purple
  "#42A5F5", // Blue
  "#26A69A", // Teal
  "#66BB6A", // Green
  "#FFA726", // Orange
  "#FFCA28", // Yellow
  "#8D6E63", // Brown
  "#5C6BC0", // Indigo
  "#EC407A", // Pink
];

// Hash a string to a consistent number
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Assign a consistent color from the palette based on user.id
function getColorForUserId(userId) {
  const index = hashString(userId) % pastelPalette.length;
  return pastelPalette[index];
}

export function assignPastelColorsToUsers(users) {
  return users.map(user => ({
    ...user,
    color: getColorForUserId(user.id),
  }));
}
