export async function trainModel({ BACKEND_URL, accessToken }) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/train`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("Training results:", data);
    alert(`Training Results: ${JSON.stringify(data) || "No results returned"}`);
    return data;
  } catch (err) {
    console.error("Training failed:", err);
    alert("Training failed. Check the console for details.");
    return null;
  }
}
