import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTransactionContext } from "@/context/transactionContext/TransactionContext";
import { Service } from "@/storage/services/types";
import { Transaction } from "@/storage/transactions/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

export default function TransactionDetailScreen() {
	const { transactions, isLoading } = useTransactionContext();
	const { id } = useLocalSearchParams();
	const [transaction, setTransaction] = useState<Transaction | null>(null);
	const navigation = useNavigation();

	useEffect(() => {
		if (transactions && id) {
			const foundTransaction = transactions.find(
				(t) => t._id === id || t.id === id
			);
			setTransaction(foundTransaction || null);
		}
	}, [transactions, id]);

	useLayoutEffect(() => {
		if (id && transaction) {
			navigation.setOptions({
				headerShown: false,
			});
		}
	}, [id, transaction]);

	const formatDateTime = (dateTimeStr: string | undefined) => {
		if (!dateTimeStr) return "";
		const date = dateTimeStr
			.slice(2, 10)
			.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
		const time = dateTimeStr
			.slice(10, 16)
			.replace(/(\d{2})(\d{2})/, "$1:$2");
		return `${date} ${time}`;
	};

	const calculateTotal = (services: Service[] | undefined) => {
		if (!services) return 0;
		return services.reduce(
			(total, service) => total + (service.price || 0),
			0
		);
	};

	const renderServiceItem = useCallback(
		(service: Service, quantity: number) => (
			<ThemedView style={styles.serviceItem} key={service._id}>
				<ThemedText style={styles.serviceName}>
					{service.name} {quantity > 1 && `x${quantity}`}
				</ThemedText>
				<ThemedText style={styles.servicePrice}>
					{service.price?.toLocaleString() || 0} đ
				</ThemedText>
			</ThemedView>
		),
		[]
	);

	if (!transaction) {
		return (
			<ThemedView style={styles.container}>
				<ThemedText>Transaction not found</ThemedText>
			</ThemedView>
		);
	}

	const services = transaction.service
		? Array.isArray(transaction.service)
			? transaction.service
			: [transaction.service]
		: [];
	const total = calculateTotal(services);
	const amount = transaction.priceBeforePromotion || total;
	const discount = amount - (transaction.price || 0) || 0;
	const payment = transaction.price || 0;

	if (isLoading) {
		return (
			<>
				<ThemedView style={styles.container}>
					<ActivityIndicator size="large" color="#4B7BEC" />
					<ThemedText style={styles.content}>Loading...</ThemedText>
				</ThemedView>
			</>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedView style={styles.header}>
				<TouchableOpacity
					onPress={() => router.back()}
					hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
				>
					<Ionicons name="arrow-back" size={24} color="#000" />
				</TouchableOpacity>
				<ThemedText type="title" style={styles.title}>
					Transaction detail
				</ThemedText>
			</ThemedView>
			<ScrollView style={styles.content}>
				<ThemedView style={styles.section}>
					<ThemedText style={styles.sectionTitle}>
						General information
					</ThemedText>
					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}>
							Transaction code
						</ThemedText>
						<ThemedText style={styles.value}>
							{transaction.id || "N/A"}
						</ThemedText>
					</ThemedView>
					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}>Customer</ThemedText>
						<ThemedText style={styles.value}>
							{transaction.customer?.name || "Unknown"} -
							{transaction.customer?.phone || "N/A"}
						</ThemedText>
					</ThemedView>
					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}>
							Creation time
						</ThemedText>
						<ThemedText style={styles.value}>
							{formatDateTime(transaction.id)}
						</ThemedText>
					</ThemedView>
				</ThemedView>

				<ThemedView style={styles.section}>
					<ThemedText style={styles.sectionTitle}>
						Services list
					</ThemedText>
					<ThemedText>
						{services.map((service) =>
							renderServiceItem(service, 1)
						)}
					</ThemedText>
					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}>Total</ThemedText>
						<ThemedText style={styles.value}>
							{total.toLocaleString()} đ
						</ThemedText>
					</ThemedView>
				</ThemedView>

				<ThemedView style={styles.section}>
					<ThemedText style={styles.sectionTitle}>Cost</ThemedText>
					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}>
							Amount of money
						</ThemedText>
						<ThemedText style={styles.value}>
							{amount.toLocaleString()} đ
						</ThemedText>
					</ThemedView>
					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}>Discount</ThemedText>
						<ThemedText style={[styles.value, styles.discount]}>
							-{discount.toLocaleString()} đ
						</ThemedText>
					</ThemedView>
				</ThemedView>

				<ThemedView style={styles.section}>
					<ThemedText style={styles.sectionTitle}>
						Total payment
					</ThemedText>
					<ThemedView style={styles.infoRow}>
						<ThemedText style={styles.label}></ThemedText>
						<ThemedText style={[styles.value, styles.payment]}>
							{payment.toLocaleString()} đ
						</ThemedText>
					</ThemedView>
				</ThemedView>
			</ScrollView>
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
		alignItems: "center",
		paddingHorizontal: 20,
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
});
