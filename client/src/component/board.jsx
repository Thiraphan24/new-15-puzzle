import React, { useState, useEffect } from "react";
import "./board.css";

const Board = () => {
  const [puzzle, setPuzzle] = useState([
    <img src="1.jpg" />,
    <img src="2.jpg" />,
    <img src="3.jpg" />,
    <img src="4.jpg" />,
    <img src="5.jpg" />,
    <img src="6.jpg" />,
    <img src="7.jpg" />,
    <img src="8.jpg" />,
    <img src="9.jpg" />,
    <img src="10.jpg" />,
    <img src="11.jpg" />,
    <img src="12.jpg" />,
    <img src="13.jpg" />,
    <img src="14.jpg" />,
    <img src="15.jpg" />,
    "Empty",
  ]);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState([]);

  // สุ่มจัดเรียงรูป
  useEffect(() => {
    const shuffledPuzzle = puzzle.sort(() => Math.random() - 0.5);
    setPuzzle(shuffledPuzzle);
  }, []);

  // จับเวลา
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ตรวจสอบว่าปัญหาสามารถแก้ไขได้หรือไม่
  const isSolvable = (puzzle) => {
    const inversions = puzzle.reduce((count, curr, i) => {
      for (let j = i + 1; j < puzzle.length; j++) {
        if (puzzle[i] > puzzle[j] && puzzle[j] != "Empty") {
          count++;
        }
      }
      return count;
    }, 0);
    return inversions % 2 == 0;
  };

  // ย้ายรูป
  const move = (direction) => {
    const emptyIndex = puzzle.indexOf("Empty");
    const targetIndex = emptyIndex + direction;
    if (targetIndex < 0 || targetIndex >= puzzle.length) {
      return;
    }
    const temp = puzzle[emptyIndex];
    puzzle[emptyIndex] = puzzle[targetIndex];
    puzzle[targetIndex] = temp;
  };

  // ตรวจสอบว่าเรียงรูปถูกต้องหรือไม่
  const isSolved = (puzzle) => {
    return puzzle.sort() == [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  };

  // บันทึกคะแนน
  const recordScore = () => {
    if (isSolved(puzzle)) {
      const newScore = time + score;
      setScore(newScore);
      setRank(
        (rank || []).unshift({
          score: newScore,
          time: time,
        })
      );
    }
  };

  return (
    <div className="App">
      <header>
        <h1>15puzzle</h1>
      </header>
      <div className="puzzle">
        {puzzle.map((item, index) => (
          <div
            key={index}
            className={`tile ${item == "Empty" ? "empty" : ""}`}
            onClick={() => move(item == "Empty" ? -1 : 1)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="timer">เวลา: {time} วินาที</div>
      <div className="score">คะแนน: {score}</div>
      <button onClick={recordScore}>บันทึกคะแนน</button>
      <ul className="rank">
        {rank.map((item) => (
          <li key={item.score}>
            {item.score} วินาที (เวลา: {item.time})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Board;
