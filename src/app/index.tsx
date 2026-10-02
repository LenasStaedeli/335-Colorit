import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import ColorSplats from "../components/colorsplats";

export default function Index(){

    const router = useRouter()

    return(
        <View style={styles.card}>
            <ColorSplats />
            <Text style={styles.maintext}>ColorIt</Text>
            <Text style={styles.description_text}>Finde die Farbe in der angegeben Zeit</Text>
            <Pressable onPress={() => router.push("/gamescreen")} 
            style={({ pressed }) => [
            styles.Pressable,
            pressed && styles.Pressed,
      ]}><Text style={styles.start_text}>Start</Text></Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    maintext: {
        fontSize: 67,
        fontWeight: 'bold',
        textAlign: "center",
    },
    description_text: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 16,
        paddingHorizontal: 24,
    },
    card: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 260,
    },
    Pressable: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: 24,
        right: 24,
        bottom: 40,
        height: 180,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#222",
        backgroundColor: "#fff",
        shadowColor: "gray",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.15,
    },
    Pressed: {
        opacity: 0.6,
    },
    start_text: {
        fontSize: 56,
    },
})