import { useEffect, useRef, useState } from "react";

interface SnakeGameProps {
  onValueChange: (newValue: number) => void;
  password: string;
}

export const Snake: React.FC<SnakeGameProps> = ({
  onValueChange,
  password,
}) => {
  let gameOver = false;
  const [go, setGo] = useState(false);
  const scoreRef = useRef(0);
  const grid = 20;

  let count = 0;

  function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  useEffect(() => {
    interface Snake {
      x: number;
      y: number;
      dx: number;
      dy: number;
      cells: Array<{ x: number; y: number }>;
      maxCells: number;
    }

    const snake: Snake = {
      x: 160,
      y: 160,
      dx: grid,
      dy: 0,
      cells: [],
      maxCells: 1,
    };
    const apple = {
      x: 60,
      y: 60,
    };

    function loop() {
      requestAnimationFrame(loop);
      if (!go) {
        if (++count < 20) {
          return;
        }

        gameOver = false;
        count = 0;
        const canvas = document.getElementById("game") as HTMLCanvasElement;

        if (!canvas) {
          setGo(true);
          return;
        }
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;

        context.clearRect(0, 0, canvas.width, canvas.height);

        snake.x += snake.dx;
        snake.y += snake.dy;

        if (snake.x < 0) {
          snake.x = canvas.width - grid;
        } else if (snake.x >= canvas.width) {
          snake.x = 0;
        }

        if (snake.y < 0) {
          snake.y = canvas.height - grid;
        } else if (snake.y >= canvas.height) {
          snake.y = 0;
        }

        snake.cells.unshift({ x: snake.x, y: snake.y });

        if (snake.cells.length > snake.maxCells) {
          snake.cells.pop();
        }

        context.fillStyle = "red";
        context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
        context.font = "bold 22px Courier";
        context.fillStyle = "black";
        context.fillText(
          password[scoreRef.current + 1],
          apple.x + 3,
          apple.y + 17
        );

        context.fillStyle = "black";
        snake.cells.forEach(function (cell, index) {
          context.fillStyle = "black";
          context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
          context.fillStyle = "white";
          context.fillText(password[index], cell.x + 3, cell.y + 17);

          if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            scoreRef.current = scoreRef.current + 1;
            onValueChange(scoreRef.current);
            apple.x = getRandomInt(0, 10) * grid;
            apple.y = getRandomInt(0, 10) * grid;
          }

          for (var i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
              snake.x = 160;
              snake.y = 160;
              snake.cells = [];
              snake.maxCells = 1;
              snake.dx = grid;
              snake.dy = 0;

              apple.x = getRandomInt(0, 25) * grid;
              apple.y = getRandomInt(0, 25) * grid;
              gameOver = true;
            }
          }

          if (gameOver) {
            setGo(true);
          }
        });
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
      } else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
      } else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
      } else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const { clientX, clientY } = e.touches[0];
      const deltaX = clientX - snake.x;
      const deltaY = clientY - snake.y;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && snake.dx === 0) {
          snake.dx = grid;
          snake.dy = 0;
        } else if (deltaX < 0 && snake.dx === 0) {
          snake.dx = -grid;
          snake.dy = 0;
        }
      } else {
        if (deltaY > 0 && snake.dy === 0) {
          snake.dy = grid;
          snake.dx = 0;
        } else if (deltaY < 0 && snake.dy === 0) {
          snake.dy = -grid;
          snake.dx = 0;
        }
      }
    };

    const handleTouchEnd = () => {
      // Handle touch end if needed
    };
    const handleResize = () => {
      const canvas = document.getElementById("game") as HTMLCanvasElement;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);

    requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, [gameOver]);

  const handleRestart = () => {
    setGo(false);

    scoreRef.current = 0;
    localStorage.setItem("score", "0");
  };

  return (
    <div className="flex w-full justify-center items-center bg-white">
      <canvas
        id="game"
        width="385"
        height="300"
        className={`bg-[#f8f8f8] ${go ? "hidden" : ""} `}
        style={{ border: "3px dashed white" }}
      ></canvas>
    </div>
  );
};
