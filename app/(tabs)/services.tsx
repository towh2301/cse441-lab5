import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useServiceContext } from "@/context/serviceContext/ServiceContext";
import { Service } from "@/storage/services/types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Menu } from "react-native-paper";

export default function ServicesScreen() {
	const { fetchServices, isLoading, services, deleteServiceById } =
		useServiceContext();
	const [error, setError] = useState<string | null>(null);
	const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);

	const handleSelectService = useCallback((serviceId: string) => {
		router.push(`/service/details/${serviceId}`);
	}, []);

	const handleRetry = useCallback(async () => {
		try {
			setError(null);
			await fetchServices();
		} catch (err) {
			setError("Failed to load services. Please try again.");
		}
	}, [fetchServices]);

	const renderServiceItem = useCallback(
		({ item }: { item: Service }) => (
			<View style={styles.serviceCardContainer}>
				<TouchableOpacity
					style={styles.serviceCard}
					onPress={() => handleSelectService(item._id)}
					activeOpacity={0.7}
				>
					<ThemedView style={styles.serviceContent}>
						<View>
							<ThemedText
								type="subtitle"
								style={styles.serviceName}
							>
								{item.name}
							</ThemedText>
							<ThemedText style={styles.servicePrice}>
								${item.price.toFixed(2)}
							</ThemedText>
						</View>
						<View style={styles.menuWrapper}>
							<Menu
								visible={visibleMenuId === item._id}
								onDismiss={() => setVisibleMenuId(null)}
								anchor={
									<TouchableOpacity
										onPress={() =>
											setVisibleMenuId(item._id)
										}
									>
										<Ionicons
											name="ellipsis-vertical-outline"
											size={20}
											color="#555"
										/>
									</TouchableOpacity>
								}
							>
								<Menu.Item
									onPress={() => {
										deleteServiceById(item._id);
										setVisibleMenuId(null);
									}}
									title="Delete"
								/>
							</Menu>
						</View>
					</ThemedView>
				</TouchableOpacity>
			</View>
		),
		[handleSelectService, visibleMenuId, setVisibleMenuId]
	);

	if (isLoading) {
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
					onPress={handleRetry}
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
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => router.push("/service/add/AddService")}
				>
					<Ionicons name="add-circle" size={24} color="#4B7BEC" />
				</TouchableOpacity>
			</ThemedView>
			{services?.length ? (
				<FlatList
					data={services}
					renderItem={renderServiceItem}
					keyExtractor={(item) => item._id}
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
		flexDirection: "row",
		borderRadius: 15,
		marginBottom: 15,
		padding: 15,
		backgroundColor: "#FFFFFF",
		borderColor: "#E0E0E0",
		borderWidth: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	serviceContent: {
		flexDirection: "row",
		alignItems: "center",
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
		fontSize: 16,
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
		fontSize: 16,
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
	serviceCardContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 8,
	},
	menuWrapper: {
		flex: 1,
		alignItems: "flex-end",
		justifyContent: "center",
		zIndex: 999, // cần thiết để tránh bị TouchableOpacity che
		backgroundColor: "transparent", // optional
	},
});
