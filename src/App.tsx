import { generate } from "random-words";
import { useRef, useState } from "react";
import "./App.css";
import { PoemRenderer } from "./PoemRenderer";
const PREPOSITIONS = [
  "a",
  "and",
  "the",
  "to",
  "in",
  "of",
  "at",
  "by",
  "for",
  "with",
  "on",
  "up",
  "down",
  "out",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
];
const PUNCTUATION = [",", ".", "!", "?", "..."];

function shuffleArray(array: string[]) {
  return array.sort(() => Math.random() - 0.5);
}

function generateWords() {
  const words = [
    ...generate(6),
    // Add 3-5 prepositions
    ...shuffleArray(PREPOSITIONS).slice(0, Math.floor(Math.random() * 3) + 3),
    // Add 1-3 punctuation marks
    ...shuffleArray(PUNCTUATION).slice(0, Math.floor(Math.random() * 3) + 1),
  ];

  return shuffleArray(words).map((word) => ({ word, x: 0, y: 0 }));
}

const Word = ({
  word,
  x,
  y,
  onMove,
}: {
  word: string;
  x: number;
  y: number;
  onMove: (x: number, y: number) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const touchPositionRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const target = event.target as HTMLElement;
    offsetRef.current.x = event.touches[0].clientX - target.offsetLeft;
    offsetRef.current.y = event.touches[0].clientY - target.offsetTop;
    target.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const target = event.target as HTMLElement;
    const x = event.touches[0].clientX - offsetRef.current.x;
    const y = event.touches[0].clientY - offsetRef.current.y;
    target.style.transform = `translate(${x}px, ${y}px)`;
    touchPositionRef.current.x = x;
    touchPositionRef.current.y = y;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    onMove(touchPositionRef.current.x, touchPositionRef.current.y);
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    offsetRef.current.x = event.clientX - target.offsetLeft;
    offsetRef.current.y = event.clientY - target.offsetTop;
  };

  const handleDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    if (isDragging) return;
    let x = 0;
    let y = 0;
    if (event.dataTransfer.dropEffect === "move") {
      x = event.clientX - offsetRef.current.x;
      y = event.clientY - offsetRef.current.y;
    }
    onMove(x, y);
  };

  return (
    <div
      className="word"
      // draggable
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={
        isDragging
          ? { position: "absolute", top: 0, left: 0 }
          : {
              position: x === 0 && y === 0 ? "static" : "absolute",
              // top: `${y}px`,
              top: y,
              // left: `${x}px`,
              left: x,
              transform: "unset",
            }
      }
    >
      {word}
    </div>
  );
};

const INITIAL_WORDS = generateWords();

export const App = () => {
  const [wordSet, setWordSet] = useState(INITIAL_WORDS);

  const handleMove = (index: number, x: number, y: number) => {
    setWordSet((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], x, y };
      return next;
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset?")) {
      setWordSet(INITIAL_WORDS);
    }
  };

  const handleShare = () => {
    const divCanvas = document.getElementById("canvas") as HTMLDivElement;
    const offset = divCanvas.getBoundingClientRect();
    const offsetX = offset.x;
    const offsetY = offset.y;

    const renderer = new PoemRenderer(500, 500);
    renderer.drawBorder();
    renderer.drawWords(wordSet, offsetX, offsetY);
    renderer.saveOrShare();
  };

  return (
    <>
      <div className="header">
        <h1>Magnet Poem</h1>
        <button className="reset-button" onClick={handleReset}>
          🔄
        </button>
      </div>

      <div
        id="canvas"
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        }}
      ></div>

      <div
        className="word-bank"
        onDragOver={(event) => {
          event.preventDefault();
          if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "none";
          }
        }}
      >
        {wordSet.map((entry, index) => (
          <Word
            key={entry.word}
            word={entry.word}
            x={entry.x}
            y={entry.y}
            onMove={(x, y) => handleMove(index, x, y)}
          />
        ))}
      </div>

      <button onClick={handleShare}>SHARE</button>
    </>
  );
};
