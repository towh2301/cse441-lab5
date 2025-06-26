import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCustomerContext } from "@/context/customerContext/CustomerContext";
import { useServiceContext } from "@/context/serviceContext/ServiceContext";
import { useTransactionContext } from "@/context/transactionContext/TransactionContext";
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
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function AddTransactionScreen() {
	const { customerId } = useLocalSearchParams();
	const [selectedServices, setSelectedServices] = useState<{
		[key: string]: { selected: boolean; quantity: number };
	}>({});
	const [loading, setLoading] = useState(false);

	const { addTransaction } = useTransactionContext();
	const {
		services,
		getAllServices,
		isLoading: servicesLoading,
	} = useServiceContext();
	const { fetchCustomerDetails } = useCustomerContext();
	const navigation = useNavigation();
	const router = useRouter();

	useEffect(() => {
		getAllServices();
	}, [getAllServices]);

	const updateServiceSelection = (
		serviceId: string,
		selected: boolean,
		quantity: number = 1
	) => {
		setSelectedServices((prev) => ({
			...prev,
			[serviceId]: { selected, quantity },
		}));
	};

	const handleAddTransaction = async () => {
		if (!customerId) return;

		const cusId = Array.isArray(customerId)
			? customerId[0]
			: customerId.toString();

		const servicesToAdd = Object.entries(selectedServices)
			.filter(([_, data]) => data.selected && data.quantity > 0)
			.map(([serviceId, data]) => ({
				id: serviceId,
				quantity: data.quantity,
				userID: cusId,
			}));

		if (servicesToAdd.length === 0) {
			Alert.alert("Error", "Please select at least one service");
			return;
		}

		setLoading(true);
		const success = await addTransaction({
			customerId: cusId,
			services: servicesToAdd,
		});

		if (success) {
			Alert.alert("Success", "Transaction added successfully", [
				{
					text: "OK",
					onPress: () => router.back(),
				},
			]);
		} else {
			Alert.alert("Error", "Failed to add transaction");
		}
		setLoading(false);
	};

	const calculateTotal = () => {
		return Object.entries(selectedServices)
			.filter(([_, data]) => data.selected)
			.reduce((total, [serviceId, data]) => {
				const service = services?.find((s) => s._id === serviceId);
				return total + (service?.price || 0) * data.quantity;
			}, 0);
	};

	if (servicesLoading) {
		return (
			<ThemedView style={styles.container}>
				<ActivityIndicator size="large" color="#4B7BEC" />
				<ThemedText style={{ textAlign: "center", marginTop: 20 }}>
					Loading services...
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
				<ThemedText style={styles.title}>Add Transaction</ThemedText>
			</ThemedView>

			<ScrollView style={styles.content}>
				<ThemedView style={styles.servicesContainer}>
					<Text style={styles.sectionTitle}>Select Services</Text>

					{services?.map((service) => (
						<View key={service._id} style={styles.serviceRow}>
							<View style={styles.serviceInfo}>
								<BouncyCheckbox
									isChecked={
										selectedServices[service._id!]
											?.selected || false
									}
									onPress={(checked) => {
										updateServiceSelection(
											service._id!,
											checked,
											1
										);
									}}
									text={service.name}
									textStyle={styles.serviceText}
									fillColor="#4CAF50"
									unFillColor="#FFFFFF"
									iconStyle={{ borderColor: "#4CAF50" }}
								/>
								<Text style={styles.servicePrice}>
									${service.price}
								</Text>
							</View>

							{selectedServices[service._id!]?.selected && (
								<View style={styles.quantityContainer}>
									<Text style={styles.quantityLabel}>
										Quantity:
									</Text>
									<TextInput
										style={styles.quantityInput}
										value={
											selectedServices[
												service._id!
											]?.quantity?.toString() || "1"
										}
										onChangeText={(text) => {
											const quantity =
												parseInt(text) || 1;
											updateServiceSelection(
												service._id!,
												true,
												quantity
											);
										}}
										keyboardType="numeric"
										maxLength={2}
									/>
								</View>
							)}
						</View>
					))}
				</ThemedView>

				{Object.values(selectedServices).some((s) => s.selected) && (
					<ThemedView style={styles.totalContainer}>
						<Text style={styles.totalText}>
							Total: ${calculateTotal()}
						</Text>
					</ThemedView>
				)}

				<TouchableOpacity
					style={[
						styles.addButton,
						loading && styles.addButtonDisabled,
					]}
					onPress={handleAddTransaction}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<Text style={styles.addButtonText}>
							Add Transaction
						</Text>
					)}
				</TouchableOpacity>
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
	servicesContainer: {
		backgroundColor: "white",
		borderRadius: 12,
		padding: 20,
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
		marginBottom: 15,
	},
	serviceRow: {
		marginBottom: 20,
		paddingBottom: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	serviceInfo: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	serviceText: {
		fontSize: 16,
		color: "#333",
		textDecorationLine: "none",
		flex: 1,
	},
	servicePrice: {
		fontSize: 16,
		fontWeight: "600",
		color: "#4CAF50",
	},
	quantityContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginLeft: 30,
		gap: 10,
	},
	quantityLabel: {
		fontSize: 14,
		color: "#666",
	},
	quantityInput: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 6,
		padding: 8,
		width: 60,
		textAlign: "center",
		fontSize: 14,
	},
	totalContainer: {
		backgroundColor: "#E8F5E8",
		borderRadius: 12,
		padding: 20,
		marginBottom: 20,
		alignItems: "center",
	},
	totalText: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#4CAF50",
	},
	addButton: {
		backgroundColor: "#4CAF50",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginBottom: 30,
	},
	addButtonDisabled: {
		backgroundColor: "#ccc",
	},
	addButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
});
