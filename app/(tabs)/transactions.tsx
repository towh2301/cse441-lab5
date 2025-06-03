import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTransactionContext } from "@/context/transactionContext/TransactionContext";
import { Transaction } from "@/storage/transactions/types";
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

export default function TransactionScreen() {
	const { transactions, isLoading } = useTransactionContext();

	const handleSelectTransaction = useCallback((id?: string) => {
		router.push(`/transaction/details/${id}`);
	}, []);

	const renderTransactions = useCallback(
		({ item }: { item: Transaction }) => {
			const isCancelled = item.status === "unavailable";
			const transactionDate = item.id
				?.slice(2, 10)
				.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
			const transactionTime = item.id
				?.slice(10, 16)
				.replace(/(\d{2})(\d{2})/, "$1:$2");

			return (
				<View>
					<TouchableOpacity
						style={[
							styles.transactionCard,
							isCancelled && styles.cancelledCard,
						]}
						onPress={() => handleSelectTransaction(item?._id)}
						activeOpacity={0.7}
						disabled={isCancelled}
					>
						<ThemedView style={styles.transactionContent}>
							<View>
								<ThemedText
									type="subtitle"
									style={styles.transactionId}
								>
									{item.id} - {transactionDate}{" "}
									{transactionTime}{" "}
									{isCancelled && "- Cancelled"}
								</ThemedText>
								<ThemedText style={styles.transactionService}>
									-{" "}
									{item.service && item.service.length > 0 ? (
										<>
											{item.service.map(
												(service, index) => (
													<View key={index}>
														<ThemedText>
															{service.name}
															{item.price &&
															index === 0
																? ` - ${item.price.toLocaleString()} đ`
																: ""}
														</ThemedText>
													</View>
												)
											)}
										</>
									) : (
										"Service not specified"
									)}
								</ThemedText>
								<ThemedText style={styles.transactionCustomer}>
									Customer: {item.customer?.name || "Unknown"}
								</ThemedText>
							</View>
							{!isCancelled && (
								<Ionicons
									name="chevron-forward"
									size={24}
									color="#555"
								/>
							)}
						</ThemedView>
					</TouchableOpacity>
				</View>
			);
		},
		[]
	);

	if (isLoading) {
		return (
			<>
				<ThemedView style={styles.emptyContainer}>
					<ActivityIndicator size="large" color="#4B7BEC" />
					<ThemedText style={styles.emptyText}>
						Loading transactions...
					</ThemedText>
				</ThemedView>
			</>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedView style={styles.header}>
				<ThemedText type="title" style={styles.title}>
					Transaction
				</ThemedText>
			</ThemedView>
			{transactions?.length ? (
				<FlatList
					data={transactions}
					renderItem={renderTransactions}
					keyExtractor={(transaction) => transaction._id || ""}
					contentContainerStyle={styles.transactionsList}
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
						No transactions available at the moment.
					</ThemedText>
				</ThemedView>
			)}
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
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
		marginBottom: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
	},
	transactionsList: {
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	transactionCard: {
		borderRadius: 15,
		marginBottom: 15,
		padding: 15,
		backgroundColor: "#FFFFFF",
		borderColor: "#E0E0E0",
		borderWidth: 1,
		elevation: 2,
	},
	cancelledCard: {
		backgroundColor: "#FFF0F0", // Light red for cancelled items
		opacity: 0.7,
	},
	transactionContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	transactionId: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
	},
	transactionService: {
		fontSize: 16,
		marginBottom: 5,
	},
	transactionCustomer: {
		fontSize: 16,
		color: "#666",
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
		borderRadius: 30,
		width: 60,
		height: 60,
		alignItems: "center",
		justifyContent: "center",
		borderColor: "#4B7BEC",
		borderWidth: 2,
		elevation: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
});
