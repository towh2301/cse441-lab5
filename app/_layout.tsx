import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import "react-native-reanimated";

import { AuthProvider } from "@/context/authContext/AuthContext";
import { CustomerProvider } from "@/context/customerContext/CustomerContext";
import { ServiceProvider } from "@/context/serviceContext/ServiceContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider as PaperProvider } from "react-native-paper";

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	if (!loaded) {
		// Async font loading only occurs in development.
		return null;
	}

	return (
		<PaperProvider>
			<AuthProvider>
				<CustomerProvider>
					<ServiceProvider>
						<ThemeProvider
							value={
								colorScheme === "dark"
									? DarkTheme
									: DefaultTheme
							}
						>
							<Stack>
								<Stack.Screen
									name="(auth)"
									options={{ headerShown: false }}
								/>
								<Stack.Screen
									name="(tabs)"
									options={{ headerShown: false }}
								/>
								<Stack.Screen name="+not-found" />
							</Stack>
							<StatusBar style="auto" />
						</ThemeProvider>
					</ServiceProvider>
				</CustomerProvider>
			</AuthProvider>
		</PaperProvider>
	);
}
