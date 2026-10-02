import { useGame } from "@/context/gamecontext";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const { Timer } = require("react-native-stopwatch-timer");

type Props = {
    round: number;
    haswon: number;
    setHaswon: (value: number) => void;
};

export default function Colorselection({ round, haswon, setHaswon }: Props) {
    const { targetColor } = useGame();
    const [timerColor, setTimerColor] = useState("#000000");
    const totalDuration = Math.max(3000, 93000 - 3000 * round);

    const handleTimerComplete = () => {
        setTimerColor("#ff0000");
        setHaswon(0);
    };

    const timerOptions = {
        container: {
            backgroundColor: "transparent",
        },
        text: {
            fontSize: 40,
            fontWeight: "bold" as const,
            color: timerColor,
        },
    };

    return (
        <View style={styles.box}>
            <View style={[styles.colorbox, { backgroundColor: targetColor }]} />
            <View style={styles.timerbox}>
                <Timer
                    totalDuration={totalDuration}
                    start={haswon === 2}
                    reset={false}
                    handleFinish={handleTimerComplete}
                    options={timerOptions}
                />
                <Text style={styles.roundtext}>Runde: {round}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        alignSelf: "stretch",
        height: 180,
        marginHorizontal: 24,
        marginBottom: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#222",
        backgroundColor: "#fff",
        shadowColor: "gray",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.15,
        elevation: 4,
    },
    colorbox: {
        flex: 1,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    timerbox: {
        flex: 1.5,
        backgroundColor: "#fff",
        borderTopWidth: 2,
        borderTopColor: "#222",
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    roundtext: {
        fontSize: 20,
        fontWeight: "bold"
    }
});