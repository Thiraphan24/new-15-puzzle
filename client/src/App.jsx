import { useState } from "react";
import "./App.css";
import Board from "./component/board";
import Register from "./component/Register";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* <Board /> */}
      <Register />
    </div>
  );
}

export default App;
