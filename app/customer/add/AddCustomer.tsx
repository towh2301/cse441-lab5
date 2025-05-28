import { ThemedView } from "@/components/ThemedView";
import { useCustomerContext } from "@/context/customerContext/CustomerContext";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
} from "react-native";

const AddCustomerScreen = () => {
	const [name, setName] = useState<string>();
	const [phone, setPhone] = useState<string>();
	const [errors, setErrors] = useState<{
		name?: string;
		phone?: string;
		totalSpent?: string;
	}>({});
	const { addCustomer, handleInvalidateCustomers, isLoading } =
		useCustomerContext();

	const validateForm = useCallback(() => {
		const newErrors: {
			name?: string;
			phone?: string;
			totalSpent?: string;
		} = {};

		// Validate name
		if (!name?.trim()) {
			newErrors.name = "Service name is required";
		}

		if (!phone?.trim()) {
			newErrors.phone = "Phone is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [name, phone]);

	const handleSubmit = useCallback(async () => {
		if (!validateForm()) {
			return;
		}

		try {
			await addCustomer({
				_id: `${name} + ${phone}`,
				name: name || "ServiceTest",
				phone: phone,
			});
			setName("");
			setPhone("");
			await handleInvalidateCustomers();
			router.back();
		} catch (error) {
			console.error("Error creating service:", error);
		}
	}, [validateForm, addCustomer, name, phone]);

	return (
		<SafeAreaView style={styles.container}>
			<ThemedView style={styles.form}>
				<TextInput
					style={[styles.input, errors.name && styles.inputError]}
					onChangeText={setName}
					value={name}
					placeholder="Customer Name"
					autoCapitalize="words"
				/>
				{errors.name && (
					<Text style={styles.errorText}>{errors.name}</Text>
				)}

				<TextInput
					style={[styles.input, errors.phone && styles.inputError]}
					onChangeText={setPhone}
					value={phone?.toString()}
					placeholder="phone"
					keyboardType="numeric"
				/>
				{errors.phone && (
					<Text style={styles.errorText}>{errors.phone}</Text>
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

export default AddCustomerScreen;

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
