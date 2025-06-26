import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCustomerContext } from "@/context/customerContext/CustomerContext";
import { useServiceContext } from "@/context/serviceContext/ServiceContext";
import { useTransactionContext } from "@/context/transactionContext/TransactionContext";
import { CustomerResponse } from "@/storage/customers/types";
import { Service } from "@/storage/services/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Dropdown } from "react-native-element-dropdown";

const loyaltyOptions = [
	{ label: "Normal", value: "normal" },
	{ label: "High", value: "high" },
	{ label: "Low", value: "low" },
];

export default function CustomerDetailsScreen() {
	const { id } = useLocalSearchParams();
	const [customer, setCustomer] = useState<CustomerResponse | undefined>(
		undefined
	);
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [transactionModalVisible, setTransactionModalVisible] =
		useState(false);
	const [editName, setEditName] = useState("");
	const [editPhone, setEditPhone] = useState("");
	const [editLoyalty, setEditLoyalty] = useState("normal");
	const [selectedServices, setSelectedServices] = useState<{
		[key: string]: { selected: boolean; quantity: number };
	}>({});

	const { fetchCustomerDetails, updateCustomer, deleteCustomer, isLoading } =
		useCustomerContext();
	const { addTransaction, deleteTransaction } = useTransactionContext();
	const { services, getAllServices } = useServiceContext();
	const navigation = useNavigation();
	const router = useRouter();

	useLayoutEffect(() => {
		if (id && customer) {
			navigation.setOptions({
				headerShown: false,
			});
		}
	}, [id, customer]);

	useEffect(() => {
		const fetchData = async () => {
			if (id) {
				const cusId = Array.isArray(id) ? id[0] : id.toString();
				const customerData = await fetchCustomerDetails(cusId);
				setCustomer(customerData);
				setEditName(customerData?.name || "");
				setEditPhone(customerData?.phone || "");
				setEditLoyalty(customerData?.loyalty || "normal");
			}
		};
		fetchData();
		getAllServices(); // Load services for transaction modal
	}, [id, fetchCustomerDetails, getAllServices]);

	// Memoized service item renderer
	const renderServiceItem = useCallback(
		({ item }: { item: Service }) => (
			<ThemedView style={styles.infoRow}>
				<ThemedText style={styles.label}>{item.name}</ThemedText>
				<ThemedText style={styles.value}>${item.price}</ThemedText>
			</ThemedView>
		),
		[]
	);

	// Memoized transaction item renderer
	const renderTransactionItem = useCallback(
		({
			item,
		}: {
			item: NonNullable<typeof customer>["transactions"][0];
		}) => (
			<ThemedView style={styles.transactionCard}>
				<View style={styles.transactionHeader}>
					<ThemedText style={styles.transactionTitle}>
						{item.id || item._id}
					</ThemedText>
					<View style={styles.transactionActions}>
						<ThemedText
							style={[
								styles.status,
								{
									color:
										item.status === "available"
											? "#4CAF50"
											: "#FF5722",
								},
							]}
						>
							{item.status || "N/A"}
						</ThemedText>
						{item.status !== "cancelled" && (
							<TouchableOpacity
								style={styles.deleteButton}
								onPress={() =>
									handleDeleteTransaction(item._id || "")
								}
							>
								<Ionicons
									name="trash"
									size={20}
									color="#FF5722"
								/>
							</TouchableOpacity>
						)}
					</View>
				</View>
				<ThemedText style={styles.transactionPrice}>
					Total: ${item.price || 0}
				</ThemedText>
				{item.service?.length ? (
					<FlatList
						data={item.service}
						keyExtractor={(service) => service._id.toString()}
						renderItem={renderServiceItem}
						scrollEnabled={false}
					/>
				) : (
					<ThemedText>No services in this transaction</ThemedText>
				)}
			</ThemedView>
		),
		[renderServiceItem]
	);

	const handleEditCustomer = async () => {
		if (!customer?._id) return;

		const success = await updateCustomer(customer._id, {
			name: editName,
			phone: editPhone,
			loyalty: editLoyalty as "normal" | "high" | "low",
		});

		if (success) {
			Alert.alert("Success", "Customer updated successfully");
			setEditModalVisible(false);
			// Refresh customer data
			const updatedCustomer = await fetchCustomerDetails(customer._id);
			setCustomer(updatedCustomer);
		} else {
			Alert.alert("Error", "Failed to update customer");
		}
	};

	const handleDeleteCustomer = () => {
		Alert.alert(
			"Delete Customer",
			"Are you sure you want to delete this customer?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						if (!customer?._id) return;
						const success = await deleteCustomer(customer._id);
						if (success) {
							Alert.alert(
								"Success",
								"Customer deleted successfully"
							);
							router.back();
						} else {
							Alert.alert("Error", "Failed to delete customer");
						}
					},
				},
			]
		);
	};

	const handleAddTransaction = async () => {
		if (!customer?._id) return;

		const servicesToAdd = Object.entries(selectedServices)
			.filter(([_, data]) => data.selected && data.quantity > 0)
			.map(([serviceId, data]) => ({
				id: serviceId,
				quantity: data.quantity,
				userID: customer._id!,
			}));

		if (servicesToAdd.length === 0) {
			Alert.alert("Error", "Please select at least one service");
			return;
		}

		const success = await addTransaction({
			customerId: customer._id,
			services: servicesToAdd,
		});

		if (success) {
			Alert.alert("Success", "Transaction added successfully");
			setTransactionModalVisible(false);
			setSelectedServices({});
			// Refresh customer data
			const updatedCustomer = await fetchCustomerDetails(customer._id);
			setCustomer(updatedCustomer);
		} else {
			Alert.alert("Error", "Failed to add transaction");
		}
	};

	const handleDeleteTransaction = (transactionId: string) => {
		Alert.alert(
			"Cancel Transaction",
			"Are you sure you want to cancel this transaction?",
			[
				{ text: "No", style: "cancel" },
				{
					text: "Yes",
					style: "destructive",
					onPress: async () => {
						const success = await deleteTransaction(transactionId);
						if (success) {
							Alert.alert(
								"Success",
								"Transaction cancelled successfully"
							);
							// Refresh customer data
							if (customer?._id) {
								const updatedCustomer =
									await fetchCustomerDetails(customer._id);
								setCustomer(updatedCustomer);
							}
						} else {
							Alert.alert(
								"Error",
								"Failed to cancel transaction"
							);
						}
					},
				},
			]
		);
	};

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
					style={styles.button}
					onPress={() => navigation.goBack()}
				>
					<Ionicons name="arrow-back" size={24} />
				</TouchableOpacity>
				<ThemedText style={styles.title}>Customer Details</ThemedText>
			</ThemedView>

			<ScrollView style={styles.content}>
				{/* Customer Information */}
				<ThemedView style={styles.section}>
					<View style={styles.sectionHeader}>
						<ThemedText style={styles.sectionTitle}>
							General Information
						</ThemedText>
						<View style={styles.actionButtons}>
							<TouchableOpacity
								style={styles.editButton}
								onPress={() => setEditModalVisible(true)}
							>
								<Ionicons
									name="create"
									size={20}
									color="#2196F3"
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.deleteButton}
								onPress={handleDeleteCustomer}
							>
								<Ionicons
									name="trash"
									size={20}
									color="#FF5722"
								/>
							</TouchableOpacity>
						</View>
					</View>
					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}>Name:</ThemedText>
						<ThemedText style={styles.value}>
							{customer?.name || "N/A"}
						</ThemedText>
					</ThemedView>
					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}>Phone:</ThemedText>
						<ThemedText style={styles.value}>
							{customer?.phone || "N/A"}
						</ThemedText>
					</ThemedView>
					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}>Loyalty:</ThemedText>
						<ThemedText style={styles.value}>
							{customer?.loyalty || "N/A"}
						</ThemedText>
					</ThemedView>
					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}>
							Total Spent:
						</ThemedText>
						<ThemedText style={styles.value}>
							${customer?.totalSpent || "0"}
						</ThemedText>
					</ThemedView>
				</ThemedView>

				{/* Transactions Section */}
				<ThemedView style={styles.section}>
					<View style={styles.sectionHeader}>
						<ThemedText style={styles.sectionTitle}>
							Transactions
						</ThemedText>
						<TouchableOpacity
							style={styles.addButton}
							onPress={() => setTransactionModalVisible(true)}
						>
							<Ionicons name="add" size={20} color="#4CAF50" />
							<Text style={styles.addButtonText}>Add</Text>
						</TouchableOpacity>
					</View>
					{customer?.transactions?.length ? (
						<FlatList
							data={customer.transactions}
							keyExtractor={(item) =>
								item?._id?.toString() || "null"
							}
							renderItem={renderTransactionItem}
							scrollEnabled={false}
						/>
					) : (
						<ThemedText>No transactions found</ThemedText>
					)}
				</ThemedView>
			</ScrollView>

			{/* Edit Customer Modal */}
			<Modal
				visible={editModalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setEditModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Edit Customer</Text>

						<TextInput
							style={styles.input}
							placeholder="Customer Name"
							value={editName}
							onChangeText={setEditName}
						/>
						<TextInput
							style={styles.input}
							placeholder="Phone Number"
							value={editPhone}
							onChangeText={setEditPhone}
							keyboardType="phone-pad"
						/>

						<Text style={styles.dropdownLabel}>Loyalty Level</Text>
						<Dropdown
							style={styles.dropdown}
							data={loyaltyOptions}
							labelField="label"
							valueField="value"
							placeholder="Select loyalty level"
							value={editLoyalty}
							onChange={(item) => setEditLoyalty(item.value)}
						/>

						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={[
									styles.modalButton,
									styles.cancelButton,
								]}
								onPress={() => setEditModalVisible(false)}
							>
								<Text style={styles.cancelButtonText}>
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.modalButton, styles.saveButton]}
								onPress={handleEditCustomer}
							>
								<Text style={styles.saveButtonText}>Save</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* Add Transaction Modal */}
			<Modal
				visible={transactionModalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setTransactionModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>Add Transaction</Text>

						<ScrollView style={styles.servicesList}>
							{services?.map((service) => (
								<View
									key={service._id}
									style={styles.serviceRow}
								>
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
										text={`${service.name} - $${service.price}`}
										textStyle={styles.serviceText}
									/>
									{selectedServices[service._id!]
										?.selected && (
										<View style={styles.quantityContainer}>
											<Text style={styles.quantityLabel}>
												Qty:
											</Text>
											<TextInput
												style={styles.quantityInput}
												value={
													selectedServices[
														service._id!
													]?.quantity?.toString() ||
													"1"
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
						</ScrollView>

						<View style={styles.modalButtons}>
							<TouchableOpacity
								style={[
									styles.modalButton,
									styles.cancelButton,
								]}
								onPress={() => {
									setTransactionModalVisible(false);
									setSelectedServices({});
								}}
							>
								<Text style={styles.cancelButtonText}>
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.modalButton, styles.saveButton]}
								onPress={handleAddTransaction}
							>
								<Text style={styles.saveButtonText}>
									Add Transaction
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 60,
		paddingHorizontal: 20,
		backgroundColor: "#f5f5f5",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginLeft: 10,
		color: "#333",
	},
	content: {
		flex: 1,
	},
	section: {
		marginBottom: 20,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: 10,
		padding: 15,
		backgroundColor: "#FFFFFF",
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 15,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#333",
	},
	actionButtons: {
		flexDirection: "row",
		gap: 10,
	},
	editButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: "#E3F2FD",
	},
	deleteButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: "#FFEBEE",
	},
	addButton: {
		flexDirection: "row",
		alignItems: "center",
		padding: 8,
		borderRadius: 20,
		backgroundColor: "#E8F5E8",
		gap: 5,
	},
	addButtonText: {
		color: "#4CAF50",
		fontWeight: "600",
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
		paddingVertical: 5,
	},
	label: {
		fontSize: 16,
		color: "#666",
		fontWeight: "500",
	},
	value: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	transactionCard: {
		backgroundColor: "#F8F9FA",
		borderRadius: 8,
		padding: 12,
		marginBottom: 10,
		borderLeftWidth: 4,
		borderLeftColor: "#4CAF50",
	},
	transactionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	transactionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
	},
	transactionActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	status: {
		fontSize: 12,
		fontWeight: "600",
		textTransform: "uppercase",
	},
	transactionPrice: {
		fontSize: 16,
		fontWeight: "700",
		color: "#4CAF50",
		marginBottom: 8,
	},
	button: {
		padding: 12,
		borderRadius: 25,
		backgroundColor: "#f0f0f0",
		justifyContent: "center",
		alignItems: "center",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		backgroundColor: "white",
		borderRadius: 20,
		padding: 20,
		width: "90%",
		maxHeight: "80%",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
		color: "#333",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		marginBottom: 15,
		fontSize: 16,
	},
	dropdownLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	dropdown: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		marginBottom: 15,
		backgroundColor: "#fff",
	},
	modalButtons: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
	modalButton: {
		flex: 1,
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginHorizontal: 5,
	},
	cancelButton: {
		backgroundColor: "#f5f5f5",
		borderWidth: 1,
		borderColor: "#ddd",
	},
	saveButton: {
		backgroundColor: "#4CAF50",
	},
	cancelButtonText: {
		color: "#666",
		fontWeight: "600",
	},
	saveButtonText: {
		color: "white",
		fontWeight: "600",
	},
	servicesList: {
		maxHeight: 300,
		marginBottom: 20,
	},
	serviceRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	serviceText: {
		fontSize: 16,
		color: "#333",
		textDecorationLine: "none",
	},
	quantityContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 5,
	},
	quantityLabel: {
		fontSize: 14,
		color: "#666",
	},
	quantityInput: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 4,
		padding: 8,
		width: 50,
		textAlign: "center",
		fontSize: 14,
	},
});
