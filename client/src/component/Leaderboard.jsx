import React, { useState, useEffect } from "react";
import "../component/Leaderboad.css";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data from Express Server
    fetch("http://localhost:3003/leaderboard")
      .then((response) => response.json())
      .then((data) => setLeaderboard(data))
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  return (
    <div className="container-leader">
      <h1>Leader Board</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user) => (
            <tr key={user.rank}>
              <th scope="row">{user.rank}</th>
              <td>{user.name}</td>
              <td>{user.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
