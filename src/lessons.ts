import { Chess, Square } from "chess.js";

// Redefine onDrop to include success and failure callbacks
type onDrop = (
  params: {
    sourceSquare: Square;
    targetSquare: Square;
    piece: String;
    game: Chess;
    history: any[];
  },
  callbacks: {
    success: (message: string) => void;
    failure: (message: string) => void;
  }
) => void;

type ChatMessage = {
  from: "coach" | "checker";
  msg: String;
  type?: "success" | "failure";
};

type Step = {
  type: "challenge" | "media";
  position?: String;
  singlePlayer?: boolean;
  media?: String;
  chat: ChatMessage[];
  onDrop?: onDrop;
};

type Lesson = {
  title: String;
  steps: Step[];
};

export const lesson1: Lesson = {
  title: "Lesson 1",
  steps: [
    {
      type: "media",
      media: "https://www.youtube.com/watch?v=6Pqd7UFWr7M",
      chat: [
        {
          from: "coach",
          msg: "mirate este video de wikihow pibe",
        },
      ],
    },
    {
      type: "challenge",
      position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      //   singlePlayer: true,
      chat: [
        {
          from: "coach",
          msg: "do 4 valid moves",
        },
      ],
      onDrop: function ({ history }, { success }) {
        console.log({ historyLen: history.length });
        if (history.length >= 4) {
          success("You did it!");
        }
      },
    },
    {
      type: "challenge",
      position: "8/8/8/8/8/8/PPPPPPPP/N1K1N3 w - - 0 1",
      singlePlayer: true,
      chat: [
        {
          from: "coach",
          msg: "Can you move the white king straight up one square? without moving any knights?",
        },
      ],
      onDrop: function ({ targetSquare, piece }, { success, failure }) {
        console.log({ targetSquare, piece });

        if (piece == "wN") {
          failure("You can't move a knight");
        }

        if (piece === "wK" && targetSquare === "c2") {
          success("es esa!");
        }
      },
    },
  ],
};
