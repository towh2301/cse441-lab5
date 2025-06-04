import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useCustomerContext } from "@/context/customerContext/CustomerContext";
import { CustomerResponse } from "@/storage/customers/types";
import { Service } from "@/storage/services/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

export default function CustomerDetailsScreen() {
	const { id } = useLocalSearchParams();
	const [customer, setCustomer] = useState<CustomerResponse | undefined>(
		undefined
	);
	const { fetchCustomerDetails, isLoading } = useCustomerContext();
	const navigation = useNavigation();

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
			}
		};
		fetchData();
	}, [id, fetchCustomerDetails]);

	// Memoized service item renderer
	const renderServiceItem = useCallback(
		({ item }: { item: Service }) => (
			<ThemedView style={styles.infoRow}>
				<ThemedText style={styles.label}>{item._id}</ThemedText>
				<ThemedText style={styles.value}>{item.name}</ThemedText>
				<ThemedText style={styles.value}>{item.price}</ThemedText>
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
			<ThemedView style={styles.section}>
				<ThemedText style={styles.sectionTitle}>
					Transaction {item._id}
				</ThemedText>
				{item.service?.length ? (
					<FlatList
						data={item.service}
						keyExtractor={(service) => service._id.toString()}
						renderItem={renderServiceItem}
						scrollEnabled={false}
						key={`services-${item._id}`} // Important for nested FlatLists
					/>
				) : (
					<ThemedText>No services in this transaction</ThemedText>
				)}
			</ThemedView>
		),
		[renderServiceItem]
	);

	if (isLoading) {
		return (
			<>
				<ThemedView style={styles.container}>
					<ActivityIndicator size="large" color="#4B7BEC" />
					<ThemedText style={styles.content}>
						Loading customers...
					</ThemedText>
				</ThemedView>
			</>
		);
	}

	const handleBack = () => {
		navigation.goBack();
	};

	return (
		<ThemedView style={styles.container}>
			<ThemedView style={styles.header}>
				<TouchableOpacity style={styles.button} onPress={handleBack}>
					<Ionicons name="arrow-back" />
				</TouchableOpacity>
			</ThemedView>
			<ThemedView style={styles.section}>
				<ThemedText style={styles.sectionTitle}>
					General Information
				</ThemedText>
				<ThemedText style={styles.label}>Name:</ThemedText>
				<ThemedText style={styles.value}>
					{customer?.name || "N/A"}
				</ThemedText>
				<ThemedText style={styles.label}>Phone:</ThemedText>
				<ThemedText style={styles.value}>
					{customer?.phone || "N/A"}
				</ThemedText>
				<ThemedText style={styles.label}>Total spent:</ThemedText>
				<ThemedText style={styles.value}>
					{customer?.totalSpent || "N/A"}
				</ThemedText>
			</ThemedView>
			<ThemedView style={styles.section}>
				<ThemedText style={styles.sectionTitle}>
					Transactions
				</ThemedText>
				<ScrollView>
					{customer?.transactions?.length ? (
						<FlatList
							data={customer.transactions}
							keyExtractor={(item) =>
								item?._id?.toString() || "null"
							}
							renderItem={renderTransactionItem}
							scrollEnabled={false} // Let ScrollView handle scrolling
						/>
					) : (
						<ThemedText>No transactions found</ThemedText>
					)}
				</ScrollView>
			</ThemedView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 60,
		paddingHorizontal: 20,
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
	},
	content: {
		paddingHorizontal: 20,
	},
	section: {
		marginBottom: 20,
		borderWidth: 1,
		borderColor: "#E0E0E0",
		borderRadius: 10,
		padding: 15,
		backgroundColor: "#FFFFFF",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 10,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	label: {
		fontSize: 16,
		color: "#666",
	},
	value: {
		fontSize: 16,
		fontWeight: "500",
	},
	serviceItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	serviceName: {
		fontSize: 16,
	},
	servicePrice: {
		fontSize: 16,
		fontWeight: "500",
	},
	discount: {
		color: "#FF4444",
	},
	payment: {
		color: "#FF4444",
		fontSize: 18,
		fontWeight: "600",
	},
	button: {
		padding: 10,
		borderRadius: 20,
		backgroundColor: "#f0f0f0",
		justifyContent: "center",
		alignItems: "center",
	},
});
