import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCustomerContext } from "@/context/customerContext/CustomerContext";
import { CustomerResponse } from "@/storage/customers/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const loyaltyOptions = [
	{ label: "Normal", value: "normal" },
	{ label: "High", value: "high" },
	{ label: "Low", value: "low" },
];

export default function EditCustomerScreen() {
	const { id } = useLocalSearchParams();
	const [customer, setCustomer] = useState<CustomerResponse | undefined>(
		undefined
	);
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [loyalty, setLoyalty] = useState("normal");
	const [loading, setLoading] = useState(false);

	const { fetchCustomerDetails, updateCustomer, isLoading } =
		useCustomerContext();
	const navigation = useNavigation();
	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			if (id) {
				const cusId = Array.isArray(id) ? id[0] : id.toString();
				const customerData = await fetchCustomerDetails(cusId);
				setCustomer(customerData);
				setName(customerData?.name || "");
				setPhone(customerData?.phone || "");
				setLoyalty(customerData?.loyalty || "normal");
			}
		};
		fetchData();
	}, [id, fetchCustomerDetails]);

	const handleSave = async () => {
		if (!customer?._id) return;

		if (!name.trim() || !phone.trim()) {
			Alert.alert("Error", "Please fill in all fields");
			return;
		}

		setLoading(true);
		const success = await updateCustomer(customer._id, {
			name: name.trim(),
			phone: phone.trim(),
			loyalty: loyalty as "normal" | "high" | "low",
		});

		if (success) {
			Alert.alert("Success", "Customer updated successfully", [
				{
					text: "OK",
					onPress: () => router.back(),
				},
			]);
		} else {
			Alert.alert("Error", "Failed to update customer");
		}
		setLoading(false);
	};

	if (isLoading) {
		return (
			<ThemedView style={styles.container}>
				<ActivityIndicator size="large" color="#4B7BEC" />
				<ThemedText style={{ textAlign: "center", marginTop: 20 }}>
					Loading customer details...
				</ThemedText>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedView style={styles.header}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<Ionicons name="arrow-back" size={24} color="#333" />
				</TouchableOpacity>
				<ThemedText style={styles.title}>Edit Customer</ThemedText>
			</ThemedView>

			<ScrollView style={styles.content}>
				<ThemedView style={styles.formContainer}>
					<View style={styles.inputGroup}>
						<Text style={styles.label}>Customer Name</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter customer name"
							value={name}
							onChangeText={setName}
							editable={!loading}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Phone Number</Text>
						<TextInput
							style={styles.input}
							placeholder="Enter phone number"
							value={phone}
							onChangeText={setPhone}
							keyboardType="phone-pad"
							editable={!loading}
						/>
					</View>

					<View style={styles.inputGroup}>
						<Text style={styles.label}>Loyalty Level</Text>
						<Dropdown
							style={styles.dropdown}
							data={loyaltyOptions}
							labelField="label"
							valueField="value"
							placeholder="Select loyalty level"
							value={loyalty}
							onChange={(item) => setLoyalty(item.value)}
							disable={loading}
						/>
					</View>

					<TouchableOpacity
						style={[
							styles.saveButton,
							loading && styles.saveButtonDisabled,
						]}
						onPress={handleSave}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator size="small" color="white" />
						) : (
							<Text style={styles.saveButtonText}>
								Save Changes
							</Text>
						)}
					</TouchableOpacity>
				</ThemedView>
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 60,
		paddingHorizontal: 20,
		paddingBottom: 20,
		backgroundColor: "white",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
	},
	backButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: "#f0f0f0",
		marginRight: 15,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	content: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 20,
	},
	formContainer: {
		backgroundColor: "white",
		borderRadius: 12,
		padding: 20,
		marginBottom: 20,
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		backgroundColor: "#fff",
	},
	dropdown: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		backgroundColor: "#fff",
	},
	saveButton: {
		backgroundColor: "#4CAF50",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 20,
	},
	saveButtonDisabled: {
		backgroundColor: "#ccc",
	},
	saveButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
});
