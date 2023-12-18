import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./board.css";
import Swal from "sweetalert";
import Leaderboard from "./Leaderboard";

const Board = (props) => {
  const location = useLocation();
  console.log("Location state:", location.state);
  const { name } = location.state || {};
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
  const [rank, setRank] = useState([]);
  const [paused, setPaused] = useState(true);
  const [bestTime, setBestTime] = useState(null);

  const startGame = () => {
    setPaused(false);

    if (time === 0) {
      resetTime(); // Reset the time only if it's the start of the game
    }
  };

  const pauseGame = () => {
    setPaused(true);
  };

  useEffect(() => {
    // Fetch best time when the component mounts
    const fetchBestTime = async () => {
      try {
        const response = await fetch(`http://localhost:3003/bestTime/${name}`);
        const data = await response.json();

        if (data.bestTime) {
          setBestTime(data.bestTime);
        }
      } catch (error) {
        console.error("Error fetching best time:", error);
      }
    };

    fetchBestTime();
  }, [name]); // Fetch best time when the 'name' changes

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

  // const recordScore = () => {
  //   setRank([
  //     {
  //       time: time,
  //     },
  //     ...rank,
  //   ]);
  //   setPaused(true); // Stop the timer
  //   shufflePuzzle(true);
  //   Swal({
  //     title: "Congratulations!",
  //     text: `You won! Your time is ${convert(Math.floor(time / 60))}:${convert(
  //       time % 60
  //     )}`,
  //     icon: "success",
  //   });
  //   resetTime(true);
  // };

  const recordScore = async () => {
    setRank([
      {
        time: convertTimeFormat(time), // Convert the Date object to "mm:ss" format
      },
      ...rank,
    ]);

    // Update the best time in the server
    try {
      const response = await fetch("http://localhost:3003/updateBestTime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          newBestTime: time,
        }),
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error updating best time:", error);
    }

    setPaused(true);
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

  const convertTimeFormat = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${convert(minutes)}:${convert(seconds)}`;
  };

  const shufflePuzzle = () => {
    const shuffledPuzzle = [...puzzle].sort(() => Math.random() - 0.9);
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

  const restartGame = () => {
    setPaused(true);
    resetTime(); // Reset the time
    shufflePuzzle(); // Shuffle the puzzle
  };

  const convert = (value) => (value < 10 ? `0${value}` : value);

  return (
    <div className="container">
      <img className="dog" src="dog.jpg" width={300} height={300} />
      <div className="App">
        <header>
          <div>
            <span className="welcome-message">Welcome, {name}!</span>
            <h1>15puzzle</h1>
          </div>

          <div className="timer">
            Time: {convert(Math.floor(time / 60))}:{convert(time % 60)}
          </div>

          <div className="time-sum">My best time: {bestTime || "N/A"}</div>
        </header>
        {paused ? (
          // Render stopped puzzle board
          <>
            <div className="start" onClick={startGame}>
              <img src="Start.png" width={330} height={110} />
            </div>
            <div className="puzzle-stop">
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
          </>
        ) : (
          // Render active puzzle board
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
        )}

        {/* <div className="start">
          <img src="Start.png" width={350} height={150} />
        </div> */}

        {/* <button onClick={recordScore}>บันทึกคะแนน</button> */}
        <div className="container-button">
          {paused ? (
            <button onClick={startGame}>Start</button>
          ) : (
            <button onClick={pauseGame}>Paused</button>
          )}
          <button onClick={restartGame}>Restart</button>
        </div>
      </div>
      <Leaderboard />
    </div>
  );
};

export default Board;
