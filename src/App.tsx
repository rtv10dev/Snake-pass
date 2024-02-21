import { useEffect, useState } from "react";
import "./App.css";
import { Snake } from "./components/Snake/Snake";

function App() {
  const [showSnake, setShowSnake] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setPassword(Math.random().toString(36).slice(-8).toUpperCase());
  }, []);

  const onScore = (score: number) => {
    setPasswordValue(password.slice(0, score + 1));

    if (password.slice(0, score + 1) === password) {
      setShowSnake(false);
    }
  };

  const onClickPasswordInput = () => {
    if (password !== passwordValue) {
      setShowSnake(true);
      setPasswordValue(password.slice(0, 1));
    }
  };

  return (
    <div className="wrapper">
      <div>
        <span>Username</span>
        <input type="text"></input>
      </div>

      <div>
        <span>Password</span>
        <input
          type="text"
          value={passwordValue}
          readOnly
          onClick={onClickPasswordInput}
        ></input>
        {showSnake && (
          <Snake onValueChange={onScore} password={password}></Snake>
        )}
      </div>

      <div>
        <button>Create Account</button>
      </div>
    </div>
  );
}

export default App;
