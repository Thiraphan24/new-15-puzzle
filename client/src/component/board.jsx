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
    shufflePuzzle();
  }, []);

  // จับเวลา
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ตรวจสอบว่าปัญหาสามารถแก้ไขได้หรือไม่
  const isSolvable = (puzzle) => {
    const inversions = puzzle.reduce((count, curr, i) => {
      for (let j = i + 1; j < puzzle.length; j++) {
        if (puzzle[i] > puzzle[j] && puzzle[j] !== "Empty") {
          count++;
        }
      }
      return count;
    }, 0);
    return inversions % 2 === 0;
  };

  // สุ่มจัดเรียงรูป
  const shufflePuzzle = () => {
    const shuffledPuzzle = [...puzzle].sort(() => Math.random() - 0.5);
    if (!isSolvable(shuffledPuzzle)) {
      // If the puzzle is not solvable, shuffle again
      shufflePuzzle();
    } else {
      setPuzzle(shuffledPuzzle);
    }
  };

  // ย้าย tile และตรวจสอบว่าเรียงถูกต้องหรือไม่
  const move = (clickedIndex) => {
    const emptyIndex = puzzle.indexOf("Empty");

    // Check if the clicked tile is adjacent to the empty tile
    if (isAdjacent(emptyIndex, clickedIndex)) {
      const updatedPuzzle = [...puzzle];
      [updatedPuzzle[emptyIndex], updatedPuzzle[clickedIndex]] = [
        updatedPuzzle[clickedIndex],
        updatedPuzzle[emptyIndex],
      ];

      setPuzzle(updatedPuzzle);

      // Check if the puzzle is solved
      if (isSolved(updatedPuzzle)) {
        recordScore();
      }
    }
  };

  // ตรวจสอบว่า tile ที่ถูกคลิกอยู่ใกล้ empty หรือไม่
  const isAdjacent = (index1, index2) => {
    const rowSize = 4; // Adjust this based on your puzzle layout
    const areInSameRow =
      Math.floor(index1 / rowSize) === Math.floor(index2 / rowSize);
    const areInSameColumn = index1 % rowSize === index2 % rowSize;

    return (
      (areInSameRow && Math.abs(index1 - index2) === 1) ||
      (areInSameColumn && Math.abs(index1 - index2) === rowSize)
    );
  };

  // ตรวจสอบว่าเรียงรูปถูกต้องหรือไม่
  const isSolved = (currentPuzzle) => {
    for (let i = 0; i < currentPuzzle.length - 1; i++) {
      if (currentPuzzle[i] !== i + 1) {
        return false;
      }
    }
    return true;
  };

  // บันทึกคะแนน
  const recordScore = () => {
    const newScore = time + score;
    setScore(newScore);

    // Use spread syntax to create a new array
    setRank([
      {
        score: newScore,
        time: time,
      },
      ...rank,
    ]);
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
            className={`tile ${item === "Empty" ? "empty" : ""}`}
            onClick={() => move(index)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="timer">เวลา: {time} วินาที</div>
      <div className="score">คะแนน: {score}</div>
      <button onClick={recordScore}>บันทึกคะแนน</button>
      <ul className="rank">
        {rank.map((item, index) => (
          <li key={index}>
            {item.score} วินาที (เวลา: {item.time})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Board;
