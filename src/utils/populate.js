export async function populateOptions({
  authFetch,
  BACKEND_URL,
  accessToken,
  setAccessToken,
  navigate,
}) {
  try {
    const res = await authFetch(
      `${BACKEND_URL}/api/populate`,
      { method: "GET" },
      { accessToken, setAccessToken, navigate, backendUrl: BACKEND_URL }
    );

    const data = await res.json();
    const playersData = data.players || [];
    const decksData = data.decks || [];

    localStorage.setItem("players", JSON.stringify(playersData));
    localStorage.setItem("decks", JSON.stringify(decksData));
  } catch (err) {
    console.error("Failed to populate options:", err);
  }
}
