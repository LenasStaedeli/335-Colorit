import { createContext, ReactNode, useContext, useState } from "react";

const possibleColors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#000000",
    "#ffffff",
    "#ffaa00",
    "#00ffaa",
    "#aa00ff",
    "#59535d",
    "#6b3404",
    "#eaff00",
];

function randomColor() {
    return possibleColors[Math.floor(Math.random() * possibleColors.length)];
}

interface GameContextType {
    getColors: () => string[];
    targetColor: string;
    newTargetColor: () => void;
    disablebuttons: boolean
    setDisableButtons: (value: boolean) => void
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [targetColor, setTargetColor] = useState(() => randomColor());
    const [disablebuttons, setDisableButtons] = useState(false)

    const value: GameContextType = {
        getColors: () => possibleColors,
        targetColor,
        newTargetColor: () => setTargetColor(randomColor()),
        disablebuttons,
        setDisableButtons,
    };

    return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
    const ctx = useContext(GameContext);
    if (!ctx) {
        throw new Error("useGame muss innerhalb von <GameProvider> benutzt werden");
    }
    return ctx;
}