import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useCustomerContext } from "@/context/customerContext/CustomerContext";
import { Customer } from "@/storage/customers/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback } from "react";
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

export default function CustomerScreen() {
	const { customers, isLoading, isSuccess } = useCustomerContext();

	const handleOnClickCustomer = useCallback((id?: string) => {
		router.push(`/customer/details/${id}`);
	}, []);

	const renderCustomers = useCallback(
		({ item }: { item: Customer }) => (
			<View>
				<TouchableOpacity
					style={styles.serviceCard}
					onPress={() => handleOnClickCustomer(item?._id)}
					activeOpacity={0.7}
				>
					<ThemedView style={styles.serviceContent}>
						<View>
							<ThemedText
								type="subtitle"
								style={styles.serviceName}
							>
								Name: {item?.name}
							</ThemedText>
							<ThemedText style={styles.serviceName}>
								Phone: {item?.phone}
							</ThemedText>
							<ThemedText style={styles.servicePrice}>
								Total Money: {item?.totalSpent?.toFixed(2)}
							</ThemedText>
						</View>
						<Ionicons name="diamond-sharp" size={30} color="red" />
					</ThemedView>
				</TouchableOpacity>
			</View>
		),
		[customers]
	);

	if (isLoading) {
		return (
			<>
				<ThemedView style={styles.emptyContainer}>
					<ActivityIndicator size="large" color="#4B7BEC" />
					<ThemedText style={styles.emptyText}>
						Loading customers...
					</ThemedText>
				</ThemedView>
			</>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedView style={styles.header}>
				<ThemedText type="title" style={styles.title}>
					Available Customers
				</ThemedText>
			</ThemedView>
			{customers?.length ? (
				<FlatList
					data={customers}
					renderItem={renderCustomers}
					keyExtractor={(customer) => customer._id || ""}
					contentContainerStyle={styles.servicesList}
					showsVerticalScrollIndicator={false}
				/>
			) : (
				<ThemedView style={styles.emptyContainer}>
					<IconSymbol
						size={50}
						name="info.circle.fill"
						color="#8E8E93"
					/>
					<ThemedText style={styles.emptyText}>
						No services available at the moment.
					</ThemedText>
				</ThemedView>
			)}
			<TouchableOpacity
				style={styles.floatingButton}
				onPress={() => router.push("/customer/add/AddCustomer")}
			>
				<Ionicons name={"add-circle-outline"} size={60} color="white" />
			</TouchableOpacity>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 60,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
	},
	servicesList: {
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	serviceCard: {
		borderRadius: 15,
		marginBottom: 15,
		padding: 15,
		backgroundColor: "#FFFFFF",
		borderColor: "#E0E0E0",
		borderWidth: 1,
		elevation: 2,
	},
	serviceContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	serviceName: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
	},
	servicePrice: {
		fontSize: 16,
		fontWeight: "600",
		color: "#4B7BEC",
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	emptyText: {
		marginTop: 10,
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
	floatingButton: {
		position: "absolute",
		bottom: 20,
		right: 20,
		backgroundColor: "black",
		borderRadius: 100,
		width: "auto",
		height: "auto",
		alignItems: "center",
		justifyContent: "center",
	},
});
