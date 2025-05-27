import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/authContext/AuthContext";

const API_URL = "https://kami-backend-5rs0.onrender.com/auth";

export default function RegisterScreen() {
	const { login } = useAuth();
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleRegister = async () => {
		if (!phone || !password || !confirmPassword) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match");
			return;
		}

		try {
			setLoading(true);
			const response = await axios.post(`${API_URL}/register`, {
				phone,
				password,
			});
			if (response.data) {
				// Store user data using auth context
				await login({
					phone,
					// Don't store raw password for security reasons
					// In a real app, you would store a token instead
					isLoggedIn: true,
				});

				Alert.alert(
					"Success",
					"Account created successfully. Please log in.",
					[
						{
							text: "OK",
							onPress: () => router.replace("/(auth)/login"),
						},
					]
				);
			}
		} catch (error) {
			console.error("Registration error:", error);
			Alert.alert("Error", "Failed to register. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="title" style={styles.title}>
				Create an Account
			</ThemedText>

			<Input
				placeholder="Email"
				leftIcon={{ type: "font-awesome", name: "envelope" }}
				onChangeText={setPhone}
				value={phone}
				autoCapitalize="none"
				keyboardType="number-pad"
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

			<Input
				placeholder="Confirm Password"
				leftIcon={{ type: "font-awesome", name: "lock" }}
				onChangeText={setConfirmPassword}
				value={confirmPassword}
				secureTextEntry
				containerStyle={styles.inputContainer}
			/>

			<Button
				title="Register"
				onPress={handleRegister}
				loading={loading}
				buttonStyle={styles.button}
				containerStyle={styles.buttonContainer}
			/>

			<Button
				title="Back to Login"
				type="clear"
				onPress={() => router.push("/(auth)/login")}
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
	buttonContainer: {
		width: "100%",
		marginVertical: 10,
	},
});
