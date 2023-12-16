// Leaderboard.js

import React from "react";
import "../component/Leaderboad.css";

const Leaderboard = ({ rank }) => {
  // Assuming rank is an array of user objects with properties name, score, and time

  // Sort the rank array by time in ascending order
  const sortedRank = rank.sort((a, b) => a.time - b.time);

  // Take the top 10 users
  const top10Users = sortedRank.slice(0, 10);

  return (
    <div className="container-lead">
      <h2>Leader Board</h2>
      <ol>
        {top10Users.map((user, index) => (
          <li key={index}>
            {user.name} - {user.time} seconds
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
