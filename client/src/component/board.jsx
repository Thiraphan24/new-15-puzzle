import React, { useState, useEffect } from "react";
import "./board.css";
import Swal from "sweetalert";
import Leaderboard from "./Leaderboard";

const Board = () => {
  const [puzzle, setPuzzle] = useState([
    <img src="1.jpg" alt="1" />,
    <img src="2.jpg" alt="2" />,
    <img src="3.jpg" alt="3" />,
    <img src="4.jpg" alt="4" />,
    <img src="5.jpg" alt="5" />,
    <img src="6.jpg" alt="6" />,
    <img src="7.jpg" alt="7" />,
    <img src="8.jpg" alt="8" />,
    <img src="9.jpg" alt="9" />,
    <img src="10.jpg" alt="10" />,
    <img src="11.jpg" alt="11" />,
    <img src="12.jpg" alt="12" />,
    <img src="13.jpg" alt="13" />,
    <img src="14.jpg" alt="14" />,
    <img src="15.jpg" alt="15" />,
    "Empty",
  ]);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState([]);
  const [paused, setPaused] = useState(true);
  const [winner, setWinner] = useState(false);

  // สุ่มจัดเรียงรูป
  useEffect(() => {
    shufflePuzzle();
  }, []);

  const resetTime = () => {
    setTime(0);
  };

  // จับเวลา
  useEffect(() => {
    let interval;
    if (!paused) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        displayCurrentTime();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [paused]);

  const startGame = () => {
    setPaused(false);
  };

  const move = (clickedIndex) => {
    if (paused) {
      startGame();
    }

    const emptyIndex = puzzle.indexOf("Empty");

    if (isAdjacent(emptyIndex, clickedIndex)) {
      const updatedPuzzle = [...puzzle];
      [updatedPuzzle[emptyIndex], updatedPuzzle[clickedIndex]] = [
        updatedPuzzle[clickedIndex],
        updatedPuzzle[emptyIndex],
      ];

      setPuzzle(updatedPuzzle);

      if (isSolved(updatedPuzzle)) {
        recordScore();
      }
    }
  };

  const isAdjacent = (index1, index2) => {
    const rowSize = 4;
    const areInSameRow =
      Math.floor(index1 / rowSize) === Math.floor(index2 / rowSize);
    const areInSameColumn = index1 % rowSize === index2 % rowSize;

    return (
      (areInSameRow && Math.abs(index1 - index2) === 1) ||
      (areInSameColumn && Math.abs(index1 - index2) === rowSize)
    );
  };
  const isSolved = (currentPuzzle) => {
    for (let i = 0; i < currentPuzzle.length - 1; i++) {
      // Check if the current element is an image with the correct src attribute
      if (currentPuzzle[i].props.src !== `${i + 1}.jpg`) {
        return false;
      }
    }
    return true;
  };

  const recordScore = () => {
    const newScore = time + score;
    setScore(newScore);

    setRank([
      {
        score: newScore,
        time: time,
      },
      ...rank,
    ]);
    setPaused(true); // Stop the timer
    shufflePuzzle(true);
    Swal({
      title: "Congratulations!",
      text: `You won! Your time is ${convert(Math.floor(time / 60))}:${convert(
        time % 60
      )}`,
      icon: "success",
    });
    resetTime(true);
  };

  const shufflePuzzle = () => {
    const shuffledPuzzle = [...puzzle].sort(() => Math.random() - 0.5);
    if (!isSolvable(shuffledPuzzle)) {
      shufflePuzzle();
    } else {
      setPuzzle(shuffledPuzzle);
    }
  };

  const displayCurrentTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    // You can update the time display as needed
    console.log(`Time: ${convert(minutes)}:${convert(seconds)}`);
  };

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

  const convert = (value) => (value < 10 ? `0${value}` : value);

  return (
    <div className="container">
      <img className="dog" src="dog.jpg" width={300} height={300} />
      <div className="App">
        <header>
          <h1>15puzzle</h1>
          <div className="timer">
            เวลา: {convert(Math.floor(time / 60))}:{convert(time % 60)}
          </div>
          <div className="move-sum">move: {score}</div>
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
        <button onClick={recordScore}>บันทึกคะแนน</button>
        <button onClick={startGame}>เริ่มเกม</button>{" "}
        {/* Add a button to start the game */}
        <ul className="rank">
          {rank.map((item, index) => (
            <li key={index}>
              {item.score} วินาที (เวลา: {item.time})
            </li>
          ))}
        </ul>
      </div>
      <Leaderboard rank={rank} />
    </div>
  );
};

export default Board;
