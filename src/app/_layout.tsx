import { Stack } from "expo-router";

import { GameProvider } from "../context/gamecontext";

export default function RootLayout() {

    return (
        <GameProvider>
            <Stack>
              <Stack.Screen
              name="index"
              options={{
                title: "Meine Vokabeln",
              }}
              />
              <Stack.Screen
                name="learn"
                options={{
                  title: "Vokabeln lernen",
                }}
        />
            </Stack>
        </GameProvider>
    )
  }