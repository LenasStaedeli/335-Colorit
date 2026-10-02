import { useGame } from "@/context/gamecontext";
import Slider from "@react-native-community/slider";
import { decode } from "base64-arraybuffer";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import UPNG from "upng-js";
import Colorsel from "../components/colorselection";
import ColorSplats from "../components/colorsplats";

// haswon: 2 = Runde läuft, 1 = gewonnen, 0 = verloren
export default function Gamescreen() {
    const { targetColor, newTargetColor } = useGame();
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [isPictureTaken, setIsPictureTaken] = useState(false);
    const [imageURI, setImageURI] = useState("");
    const [hex, setHex] = useState("#ffffff");
    const [zoom, setZoom] = useState(0);
    const [isFlashOn, setIsFlashOn] = useState(false);
    const [haswon, setHaswon] = useState(2);
    const [round, setRound] = useState(1);
    const [timerKey, setTimerKey] = useState(0);

    async function takepicture() {
        if (!cameraRef.current) return;
        try {
            const photo = await cameraRef.current.takePictureAsync();
            setImageURI(photo.uri);
            setIsPictureTaken(true);

            const side = Math.min(photo.width, photo.height);
            const size = Math.round(side * (70 / 340));

            const result = await ImageManipulator.manipulateAsync(
                photo.uri,
                [
                    {
                        crop: {
                            originX: Math.round((photo.width - size) / 2),
                            originY: Math.round((photo.height - size) / 2),
                            width: size,
                            height: size,
                        },
                    },
                    { resize: { width: 1, height: 1 } },
                ],
                { format: ImageManipulator.SaveFormat.PNG, base64: true }
            );

            const png = UPNG.decode(decode(result.base64!));
            const rgba = new Uint8Array(UPNG.toRGBA8(png)[0]);
            const toHex = (n: number) => n.toString(16).padStart(2, "0");
            const found = `#${toHex(rgba[0])}${toHex(rgba[1])}${toHex(rgba[2])}`;

            setHex(found);
            evaluateColor(found); // found übergeben, weil hex noch der alte Wert ist
        } catch (e) {
            console.log("Fehler:", e);
        }
    }

    function evaluateColor(measured: string) {
        const R = parseInt(measured.slice(1, 3), 16);
        const G = parseInt(measured.slice(3, 5), 16);
        const B = parseInt(measured.slice(5, 7), 16);

        const Rsol = parseInt(targetColor.slice(1, 3), 16);
        const Gsol = parseInt(targetColor.slice(3, 5), 16);
        const Bsol = parseInt(targetColor.slice(5, 7), 16);

        const diff = Math.abs(Rsol - R) + Math.abs(Gsol - G) + Math.abs(Bsol - B);
        console.log("Abweichung:", diff);

        setHaswon(diff <= 210 ? 1 : 0);
    }

    function resetRound() {
        setIsPictureTaken(false);
        setImageURI("");
        setHex("#ffffff");
        setZoom(0);
        setIsFlashOn(false);
        setHaswon(2);
        newTargetColor();
        setTimerKey((k) => k + 1); // baut Colorsel neu auf -> Timer startet frisch
    }

    function onPressNext() {
        setRound((r) => r + 1);
        resetRound();
    }

    function onPressRestart() {
        setRound(1);
        resetRound();
    }

    async function askForCamPermission() {
        await ImagePicker.requestCameraPermissionsAsync();
    }

    return (
        <View style={styles.container}>
            <ColorSplats />
            <Colorsel key={timerKey} round={round} haswon={haswon} setHaswon={setHaswon} />
            <View style={styles.cameraFrame}>
                {!isPictureTaken ? (
                    <CameraView ref={cameraRef} style={styles.camera} facing="back" zoom={zoom} enableTorch={isFlashOn} />
                ) : (
                    <Image source={{ uri: imageURI }} style={styles.camera} />
                )}
                <View style={styles.centerSquare} pointerEvents="none" />
                {!permission?.granted && (
                    <TouchableOpacity onPress={() => askForCamPermission()}>
                        <Text>Aktiviere doch wie ein goodboy deine kamera</Text>
                    </TouchableOpacity>
                )}
            </View>

            {!isPictureTaken && (
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1}
                    value={zoom}
                    onValueChange={setZoom}
                />
            )}

            {haswon === 2 && (
                <>
                    <Pressable
                        style={({ pressed }) => [styles.Pressable, pressed && styles.Pressed, { backgroundColor: hex }]}
                        onPress={() => takepicture()}
                    >
                        <Text>Fotografieren</Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [styles.Pressableflash, pressed && styles.Pressedflash, { backgroundColor: hex }]}
                        onPress={() => setIsFlashOn(!isFlashOn)}
                    >
                        <Text>Taschenlampe</Text>
                    </Pressable>
                </>
            )}
            {haswon === 1 && (
                <Pressable
                    style={({ pressed }) => [styles.PressableWide, pressed && styles.Pressed, { backgroundColor: hex }]}
                    onPress={onPressNext}
                >
                    <Text>Weiter</Text>
                </Pressable>
            )}
            {haswon === 0 && (
                <Pressable
                    style={({ pressed }) => [styles.PressableWide, pressed && styles.Pressed, { backgroundColor: hex }]}
                    onPress={onPressRestart}
                >
                    <Text>Neustart</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    camera: {
        flex: 1,
    },
    cameraFrame: {
        height: 340,
        width: 340,
        marginHorizontal: 24,
        backgroundColor: "#ddd",
        borderWidth: 2,
        borderColor: "#222",
        justifyContent: "center",
    },
    centerSquare: {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 70,
        height: 70,
        marginTop: -35,
        marginLeft: -35,
        borderWidth: 2,
        borderColor: "#fff",
    },
    hexText: {
        marginHorizontal: 24,
        marginTop: 12,
        fontSize: 20,
        fontWeight: "bold",
    },
    Pressable: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: 25,
        bottom: 40,
        height: 100,
        width: 170,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#222",
        shadowColor: "gray",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.15,
    },
    PressableWide: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: 25,
        right: 25,
        bottom: 40,
        height: 100,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#222",
        shadowColor: "gray",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.15,
    },
    Pressed: {
        opacity: 0.6,
    },
    Pressableflash: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        right: 25,
        bottom: 40,
        height: 100,
        width: 170,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#222",
        shadowColor: "gray",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.15,
    },
    Pressedflash: {
        opacity: 0.6,
    },
    slider: {
        marginHorizontal: 24,
        width: 340,
        height: 45,
        position: "absolute",
        bottom: 140,
    },
});