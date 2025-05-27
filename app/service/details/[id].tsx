import axios from "axios";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Service } from "@/interface/services/types";

const API_URL = "https://kami-backend-5rs0.onrender.com/services";

export default function ServiceDetails() {
	const { id } = useLocalSearchParams();
	const [service, setService] = useState<Service | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigation = useNavigation();

	useEffect(() => {
		fetchServiceDetails();
	}, [id]);

	useEffect(() => {
		if (id && service) {
			navigation.setOptions({
				title: `${service?.name}`,
				styles: {},
			});
		}
	}, [id, service]);

	const fetchServiceDetails = async () => {
		if (!id) return;

		try {
			setLoading(true);
			const response = await axios.get(`${API_URL}/${id}`);
			setService(response.data);
			setError(null);
		} catch (err) {
			console.error("Error fetching service details:", err);
			setError("Failed to load service details. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleBookService = () => {
		Alert.alert(
			"Book Service",
			`Would you like to book ${service?.name}?`,
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Book Now",
					onPress: () => {
						Alert.alert("Success", "Service booked successfully!");
						router.back();
					},
				},
			]
		);
	};

	if (loading) {
		return (
			<ThemedView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#4B7BEC" />
				<ThemedText style={styles.loadingText}>
					Loading service details...
				</ThemedText>
			</ThemedView>
		);
	}

	if (error || !service) {
		return (
			<ThemedView style={styles.errorContainer}>
				<IconSymbol
					size={50}
					name="exclamationmark.triangle.fill"
					color="#FF3B30"
				/>
				<ThemedText style={styles.errorText}>
					{error || "Service not found"}
				</ThemedText>
				<TouchableOpacity
					style={styles.retryButton}
					onPress={fetchServiceDetails}
				>
					<ThemedText style={styles.retryText}>Retry</ThemedText>
				</TouchableOpacity>
			</ThemedView>
		);
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedView style={styles.contentContainer}>
				<ThemedText type="title" style={styles.serviceName}>
					{service.name}
				</ThemedText>

				<ThemedView style={styles.priceCategory}>
					<ThemedText style={styles.price}>
						${service.price.toFixed(2)}
					</ThemedText>
				</ThemedView>
			</ThemedView>

			<ThemedView style={styles.bookButtonContainer}>
				<TouchableOpacity
					style={styles.bookButton}
					onPress={handleBookService}
				>
					<ThemedText style={styles.bookButtonText}>
						Book This Service
					</ThemedText>
				</TouchableOpacity>
			</ThemedView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollContainer: {
		flex: 1,
	},
	backButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 15,
		paddingTop: 50,
		paddingBottom: 10,
	},
	backText: {
		fontSize: 16,
		color: "#4B7BEC",
		marginLeft: 5,
	},
	serviceImage: {
		width: "100%",
		height: 250,
		backgroundColor: "#E1E1E1",
	},
	contentContainer: {
		padding: 20,
	},
	serviceName: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
	},
	priceCategory: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	price: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#4B7BEC",
	},
	category: {
		fontSize: 16,
		color: "#666",
		backgroundColor: "#F0F0F0",
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 15,
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 10,
	},
	description: {
		fontSize: 16,
		lineHeight: 24,
		color: "#333",
	},
	details: {
		fontSize: 16,
		lineHeight: 24,
		color: "#333",
	},
	providerInfo: {
		padding: 15,
		backgroundColor: "#F8F8F8",
		borderRadius: 10,
	},
	providerName: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 5,
	},
	ratingContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	rating: {
		marginLeft: 5,
		color: "#666",
	},
	bookButtonContainer: {
		padding: 15,
		borderTopWidth: 1,
		borderTopColor: "#E0E0E0",
		backgroundColor: "#FFF",
	},
	bookButton: {
		backgroundColor: "#4B7BEC",
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: "center",
	},
	bookButtonText: {
		color: "#FFF",
		fontSize: 18,
		fontWeight: "600",
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
});
