import { create } from "zustand";
import { Chess, Square } from "chess.js";
import { lesson1 } from "./lessons";

type WizardPorps = {
  step: any;
  current: number;
  prev: {
    disabled: boolean;
    handler: () => void;
  };
  next: {
    disabled: boolean;
    handler: () => void;
  };
  total: number;
  setStep: (step: any) => void;
};

export const useWizard = create<WizardPorps>((set, get) => ({
  step: lesson1.steps[0],
  current: 0,
  prev: {
    disabled: true,
    handler: () => {
      if (get().prev.disabled) return;
      const step = lesson1.steps[get().current - 1];
      set({
        step,
        current: get().current - 1,
      });
    },
  },
  next: {
    disabled: false,
    handler: () => {
      if (get().next.disabled) return;
      const step = lesson1.steps[get().current + 1];
      set((s) => ({
        step,
        current: get().current + 1,
        prev: { ...s.prev, disabled: false },
      }));
    },
  },
  total: lesson1.steps.length,
  setStep: (step: any) => {
    set({ step });
  },
}));

export interface ChessboardProps {
  load: (lesson: any) => void;
  game: Chess;
  status: {
    completed: boolean;
    success: boolean;
  };
  onDrop: (sourceSquare: any, targetSquare: any, piece: any) => boolean;
  position: any;
  lesson: any;
  history: any[];
}

export const useChessboard = create<ChessboardProps>((set, get) => ({
  status: { completed: false, success: false },
  load: (lesson: any) => {
    console.log("LOADING NEW CHESS GAME");
    const game = new Chess();
    game.load(lesson.position, { skipValidation: true });
    set({
      game,
      position: lesson.position,
      lesson: lesson,
      history: [],
      status: {
        completed: false,
        success: false,
      },
    });
  },
  history: [],
  lesson: { chat: [] },
  game: new Chess(),
  position: get()?.game?.fen(),
  onDrop: (sourceSquare: Square, targetSquare: Square, piece: string) => {
    const game = get().game;
    const lesson = get().lesson;

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;

    set({
      history: [...get().history, move],
    });

    // lesson check
    if (lesson.onDrop) {
      const check = lesson.onDrop(
        { sourceSquare, targetSquare, piece, game, history: get().history },
        {
          success: (message: string) => {
            set({
              status: {
                completed: true,
                success: true,
              },
            });
            useWizard.getState().step.chat.push({
              from: "coach",
              msg: message,
              type: "success",
            });
          },
          failure: (message: string) => {
            useWizard.getState().step.chat.push({
              from: "coach",
              msg: message,
              type: "failure",
            });
          },
        }
      );

      if (get().lesson.singlePlayer) {
        const currentFen = game.fen();
        const fenWithWhitesTurn = currentFen.replace(" b", " w");
        game.load(fenWithWhitesTurn, {
          skipValidation: true,
        });
        set({ position: game.fen() });
      }

      if (check === false) return false;
    }

    set({ position: game.fen() });
    return true;
  },
}));
