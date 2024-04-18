import { Chessboard } from "react-chessboard";
import { useChessboard, useWizard } from "./store";
import { useEffect } from "react";
import "./App.css";

function App() {
  const { step, current, prev, next, total } = useWizard();
  const { load, position, onDrop, status } = useChessboard();

  useEffect(() => {
    if (step.type === "challenge") {
      load(step);
    }
  }, [step]);

  const nextDisabled = !(step.type !== "challenge" || status.completed);

  return (
    <>
      <h2>
        {current}/{total}
      </h2>
      <button disabled={prev.disabled} onClick={prev.handler}>
        prev
      </button>
      <button disabled={nextDisabled} onClick={next.handler}>
        next
      </button>
      {status.completed && !status.success && (
        <button onClick={() => load(step)}>reload</button>
      )}
      <hr />
      <div className="grid">
        <div>
          {step.type === "challenge" && (
            <>
              <h1>Chess Game</h1>
              <Chessboard
                position={position}
                onPieceDrop={!status.completed ? onDrop : undefined}
                arePiecesDraggable={!status.completed}
                boardWidth={500}
              />
            </>
          )}
          {step.type === "media" && (
            <>
              <h1>{step.media}</h1>
            </>
          )}
        </div>
        <div>
          <div>
            {step.chat.map((msg: any, i: number) => (
              <div key={i} className={`chat ${msg.type}`}>
                <strong>{msg.from}</strong>: {msg.msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
