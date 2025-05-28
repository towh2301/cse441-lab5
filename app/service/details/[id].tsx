import axios from "axios";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Modal,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useServiceContext } from "@/context/serviceContext/ServiceContext";
import { Service } from "@/storage/services/types";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "https://kami-backend-5rs0.onrender.com/services";

const ServiceDetails = () => {
	const { id } = useLocalSearchParams();
	const [service, setService] = useState<Service | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigation = useNavigation();
	const { deleteServiceById, handleInvalidateData } = useServiceContext();

	const [menuVisible, setMenuVisible] = useState(false);

	const toggleMenu = () => setMenuVisible((prev) => !prev);
	const closeMenu = () => setMenuVisible(false);

	useEffect(() => {
		fetchServiceDetails();
	}, [id]);

	useLayoutEffect(() => {
		if (id && service) {
			navigation.setOptions({
				title: `${service?.name}`,
				headerRight: () => (
					<TouchableOpacity
						onPress={toggleMenu}
						style={{ marginRight: 15 }}
					>
						<Ionicons
							name="ellipsis-vertical-outline"
							size={20}
							color="#555"
						/>
					</TouchableOpacity>
				),
			});
		}
	}, [navigation, id, service]);

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
				{ text: "Cancel", style: "cancel" },
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

	const handleDelete = async () => {
		try {
			await deleteServiceById(String(id));
			handleInvalidateData();
			router.back();
		} catch (error) {
			console.error("Delete failed:", error);
		} finally {
			closeMenu();
		}
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

			<Modal
				visible={menuVisible}
				transparent
				animationType="fade"
				onRequestClose={closeMenu}
			>
				<TouchableOpacity
					style={styles.modalOverlay}
					activeOpacity={1}
					onPress={closeMenu}
				>
					<View style={styles.menuContainer}>
						<TouchableOpacity
							onPress={handleDelete}
							style={styles.menuItem}
						>
							<ThemedText>Delete</ThemedText>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	contentContainer: { padding: 20 },
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
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.1)",
	},
	menuContainer: {
		position: "absolute",
		top: 50,
		right: 15,
		backgroundColor: "#fff",
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 8,
		elevation: 5,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	menuItem: {
		paddingVertical: 8,
	},
});

export default ServiceDetails;
