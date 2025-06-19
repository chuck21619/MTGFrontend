import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Dashboard({ accessToken, setAccessToken }) {
  const decoded = jwtDecode(accessToken || "");
  //const username = decoded?.username || "Unknown";
  const [players, setPlayers] = useState([]);
  const [decks, setDecks] = useState([]);
  const [selections, setSelections] = useState([
    { player: "", deck: "" },
    { player: "", deck: "" },
    { player: "", deck: "" },
    { player: "", deck: "" },
  ]);

  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem("players") || "[]");
    const storedDecks = JSON.parse(localStorage.getItem("decks") || "[]");

    setPlayers(storedPlayers);
    setDecks(storedDecks);
  }, []);

  const handlePredict = async () => {
    // First build the map:
    const selectionsMap = {};
    selections.forEach((selection) => {
      selectionsMap[selection.player] = selection.deck;
    });

    // Now apply padding using your players array:
    const paddedSelections = players.map((player) => {
      return {
        player: player,
        deck: selectionsMap[player] || "none",
      };
    });

    const res = await fetch(`${BACKEND_URL}/api/predict`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selections: paddedSelections }),
    });

    const data = await res.json();
    console.log("Prediction result:", data);
    alert(`Prediction: ${data.prediction || "No prediction returned"}`);
  };

  return (
    <>
      <h2>Dashboard</h2>
      <div>
        <h3>Enter Players and Decks</h3>
        {selections.map((selection, index) => (
          <div key={index} style={{ marginBottom: "1rem" }}>
            <select
              value={selection.player}
              onChange={(e) => {
                const updated = [...selections];
                updated[index].player = e.target.value;
                setSelections(updated);
              }}
            >
              <option value="">Select Player</option>
              {players.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>

            <select
              value={selection.deck}
              onChange={(e) => {
                const updated = [...selections];
                updated[index].deck = e.target.value;
                setSelections(updated);
              }}
            >
              <option value="">Select Deck</option>
              {decks.map((deck) => (
                <option key={deck} value={deck}>
                  {deck}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button onClick={handlePredict}>Predict</button>
    </>
  );
}
