import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/authContext/AuthContext";
import { URLS } from "@/helpers/urls";

export default function LoginScreen() {
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { isAuthenticated, login } = useAuth();

	// Check if user is already logged in
	useEffect(() => {
		if (isAuthenticated) {
			// User is already logged in, redirect to the main app
			router.replace("/(tabs)");
		}
	}, [isAuthenticated]);

	const handleLogin = async () => {
		if (!phone || !password) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		try {
			setLoading(true);
			const response = await axios.post(URLS.AUTH, {
				phone,
				password,
			});

			if (response.data && response.data.token) {
				// Store user data and token using the auth context
				const userData = {
					phone,
					token: response.data.token,
				};

				await login(userData);
				router.replace("/(tabs)");
			} else {
				Alert.alert("Error", "Invalid credentials");
			}
		} catch (error) {
			console.error("Login error:", error);
			Alert.alert("Error", "Failed to login. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title" style={styles.title}>
				Login to Kami Services
			</ThemedText>
			<Input
				placeholder="Phone"
				leftIcon={{ type: "font-awesome", name: "envelope" }}
				onChangeText={setPhone}
				value={phone}
				autoCapitalize="none"
				keyboardType="phone-pad"
				containerStyle={styles.inputContainer}
			/>
			<Input
				placeholder="Password"
				leftIcon={{ type: "font-awesome", name: "lock" }}
				onChangeText={setPassword}
				value={password}
				secureTextEntry
				containerStyle={styles.inputContainer}
			/>
			<Button
				title="Login"
				onPress={handleLogin}
				loading={loading}
				buttonStyle={styles.button}
				containerStyle={styles.buttonContainer}
			/>
			<Button
				title="Register"
				type="outline"
				onPress={() => router.push("/(auth)/register")}
				buttonStyle={styles.registerButton}
				containerStyle={styles.buttonContainer}
			/>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 30,
		textAlign: "center",
	},
	inputContainer: {
		marginBottom: 20,
	},
	button: {
		backgroundColor: "#4B7BEC",
		borderRadius: 10,
		paddingVertical: 12,
	},
	registerButton: {
		borderColor: "#4B7BEC",
		borderRadius: 10,
		paddingVertical: 12,
	},
	buttonContainer: {
		width: "100%",
		marginVertical: 10,
	},
});
