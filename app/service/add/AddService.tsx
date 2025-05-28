import { ThemedView } from "@/components/ThemedView";
import { useServiceContext } from "@/context/serviceContext/ServiceContext";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
} from "react-native";

const AddServiceScreen = () => {
	const [name, setName] = useState<string>();
	const [price, setPrice] = useState<string>();
	const [errors, setErrors] = useState<{ name?: string; price?: string }>({});
	const { createService, isLoading, handleInvalidateData } =
		useServiceContext();

	const validateForm = useCallback(() => {
		const newErrors: { name?: string; price?: string } = {};

		// Validate name
		if (!name?.trim()) {
			newErrors.name = "Service name is required";
		}

		if (!price?.trim()) {
			newErrors.price = "Price is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [name, price]);

	const handleSubmit = useCallback(async () => {
		if (!validateForm()) {
			return;
		}

		try {
			await createService({
				_id: `${name} + ${price}`,
				name: name || "ServiceTest",
				price: parseFloat(price || "0"),
			});
			setName("");
			setPrice("0");
			await handleInvalidateData();
			router.back();
		} catch (error) {
			console.error("Error creating service:", error);
		}
	}, [validateForm, createService, name, price]);

	return (
		<SafeAreaView style={styles.container}>
			<ThemedView style={styles.form}>
				<TextInput
					style={[styles.input, errors.name && styles.inputError]}
					onChangeText={setName}
					value={name}
					placeholder="Service Name"
					autoCapitalize="words"
				/>
				{errors.name && (
					<Text style={styles.errorText}>{errors.name}</Text>
				)}

				<TextInput
					style={[styles.input, errors.price && styles.inputError]}
					onChangeText={setPrice}
					value={price?.toString()}
					placeholder="Price"
					keyboardType="numeric"
				/>
				{errors.price && (
					<Text style={styles.errorText}>{errors.price}</Text>
				)}

				<TouchableOpacity
					style={[styles.button, isLoading && styles.buttonDisabled]}
					onPress={handleSubmit}
					disabled={isLoading}
				>
					<Text style={styles.buttonText}>Create Service</Text>
				</TouchableOpacity>
			</ThemedView>
		</SafeAreaView>
	);
};

export default AddServiceScreen;

// Styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	form: {
		padding: 16,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	},
	inputError: {
		borderColor: "red",
	},
	errorText: {
		color: "red",
		fontSize: 12,
		marginBottom: 10,
	},
	button: {
		backgroundColor: "#007AFF",
		padding: 12,
		borderRadius: 5,
		alignItems: "center",
	},
	buttonDisabled: {
		backgroundColor: "#aaa",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});
