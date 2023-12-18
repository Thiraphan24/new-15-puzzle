// Leaderboard.js

import React, { useState, useEffect } from "react";
import "../component/Leaderboad.css";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3003/leaderboard")
      .then((response) => response.json())
      .then((data) => {
        // Check if data is an array
        console.log("Leaderboard Data:", data);
        if (Array.isArray(data)) {
          setLeaderboard(data);
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch((error) => console.error("Error fetching leaderboard:", error));
  }, []);

  return (
    <div className="container-leader">
      <h1>Leader Board</h1>
      <p>
        00.010 = 10 second <br />
        0.0607 = 6 minute 07 second
      </p>
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
