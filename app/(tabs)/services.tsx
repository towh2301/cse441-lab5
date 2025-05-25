import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

const API_URL = "https://kami-backend-5rs0.onrender.com/services";

interface Service {
	id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	imageUrl?: string;
}

export default function ServicesScreen() {
	const [services, setServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchServices();
	}, []);

	const fetchServices = async () => {
		try {
			setLoading(true);
			const response = await axios.get(API_URL);
			setServices(response.data);
			setError(null);
		} catch (err) {
			console.error("Error fetching services:", err);
			setError("Failed to load services. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleSelectService = (serviceId: string) => {
		router.push(`/(tabs)/service/${serviceId}`);
	};

	const renderServiceItem = ({ item }: { item: Service }) => (
		<TouchableOpacity
			style={styles.serviceCard}
			onPress={() => handleSelectService(item.id)}
		>
			<ThemedView style={styles.serviceContent}>
				<ThemedText type="subtitle" style={styles.serviceName}>
					{item.name}
				</ThemedText>
				<ThemedText style={styles.serviceDescription}>
					{item.description.length > 100
						? `${item.description.substring(0, 100)}...`
						: item.description}
				</ThemedText>
				<ThemedText style={styles.servicePrice}>
					${item.price.toFixed(2)}
				</ThemedText>
				<ThemedText style={styles.serviceCategory}>
					Category: {item.category}
				</ThemedText>
			</ThemedView>
			<IconSymbol
				size={24}
				name="chevron.right"
				color="#4B7BEC"
				style={styles.chevron}
			/>
		</TouchableOpacity>
	);

	if (loading) {
		return (
			<ThemedView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#4B7BEC" />
				<ThemedText style={styles.loadingText}>
					Loading services...
				</ThemedText>
			</ThemedView>
		);
	}

	if (error) {
		return (
			<ThemedView style={styles.errorContainer}>
				<IconSymbol
					size={50}
					name="exclamationmark.triangle.fill"
					color="#FF3B30"
				/>
				<ThemedText style={styles.errorText}>{error}</ThemedText>
				<TouchableOpacity
					style={styles.retryButton}
					onPress={fetchServices}
				>
					<ThemedText style={styles.retryText}>Retry</ThemedText>
				</TouchableOpacity>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedView style={styles.header}>
				<ThemedText type="title" style={styles.title}>
					Available Services
				</ThemedText>
			</ThemedView>

			{services.length > 0 ? (
				<FlatList
					data={services}
					renderItem={renderServiceItem}
					keyExtractor={(item) => item.id}
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
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 60,
	},
	header: {
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
		flexDirection: "row",
		borderRadius: 15,
		marginBottom: 15,
		padding: 15,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
		backgroundColor: "#FFFFFF",
		borderColor: "#E0E0E0",
		borderWidth: 1,
	},
	serviceContent: {
		flex: 1,
	},
	serviceName: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 5,
	},
	serviceDescription: {
		fontSize: 14,
		marginBottom: 10,
		color: "#666",
	},
	servicePrice: {
		fontSize: 16,
		fontWeight: "600",
		color: "#4B7BEC",
		marginBottom: 5,
	},
	serviceCategory: {
		fontSize: 14,
		color: "#888",
	},
	chevron: {
		alignSelf: "center",
		marginLeft: 10,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		marginTop: 10,
		color: "#666",
	},
	errorContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	errorText: {
		marginTop: 10,
		marginBottom: 20,
		fontSize: 16,
		color: "#666",
		textAlign: "center",
	},
	retryButton: {
		backgroundColor: "#4B7BEC",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 8,
	},
	retryText: {
		color: "#FFFFFF",
		fontWeight: "600",
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
});
