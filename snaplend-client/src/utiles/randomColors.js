const pastelPalette = [
    "#f9c5d1", // light pink
    "#fcd5ce", // peach
    "#fde2e4", // soft rose
    "#d8e2dc", // mint
    "#a9def9", // light blue
    "#e4c1f9", // lavender
    "#caffbf", // light green
    "#b5ead7", // mint green
    "#f0efeb", // cream
    "#ffc8dd", // pinkish
    "#bdb2ff", // purple pastel
    "#fdffb6", // yellow pastel
  ];
  
  function getRandomFromArray(arr) {
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  }
  
  export function assignPastelColorsToUsers(users) {
    return users.map(user => ({
      ...user,
      color: getRandomFromArray(pastelPalette),
    }));
  }
  