// Leaderboard.js

import React from "react";
import "../component/Leaderboad.css";

const Leaderboard = ({ rank }) => {
  // Assuming rank is an array of user objects with properties name, score, and time

  // Sort the rank array by time in ascending order
  const sortedRank = rank.sort((a, b) => a.time - b.time);

  // Take the top 10 users
  const top10Users = sortedRank.slice(0, 5);

  return (
    <div className="container-leader">
      <h1>Leader Board</h1>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>01.30</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>05.40</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Jacob</td>
            <td>07.00</td>
          </tr>
          <tr>
            <th scope="row">4</th>
            <td>Few</td>
            <td>10.00</td>
          </tr>
          <tr>
            <th scope="row">5</th>
            <td>Jame</td>
            <td>15.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
