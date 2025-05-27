import axios from "axios";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { URLS } from "@/helpers/urls";
import { Service } from "@/storage/services/types";

export default function HomeScreen() {
	const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchFeaturedServices();
	}, []);

	const fetchFeaturedServices = async () => {
		try {
			const response = await axios.get(URLS.SERVICES);
			// In a real app, you might have a featured flag or sort by popularity
			// Here we just take the first 5 services
			setFeaturedServices(response.data.slice(0, 5));
		} catch (err) {
			console.error("Error fetching featured services:", err);
		} finally {
			setLoading(false);
		}
	};

	const navigateToService = (serviceId: string) => {
		router.push(`/service/${serviceId}`);
	};

	const renderFeaturedItem = ({ item }: { item: Service }) => (
		<TouchableOpacity
			style={styles.featuredItem}
			onPress={() => navigateToService(item?._id)}
		>
			<ThemedView style={styles.featuredImageContainer}>
				{item.imageUrl ? (
					<Image
						source={{ uri: item.imageUrl }}
						style={styles.featuredImage}
					/>
				) : (
					<IconSymbol size={40} name="hammer.fill" color="#4B7BEC" />
				)}
			</ThemedView>
			<ThemedText type="defaultSemiBold" style={styles.featuredName}>
				{item.name}
			</ThemedText>
			<ThemedText style={styles.featuredPrice}>
				${item.price.toFixed(2)}
			</ThemedText>
		</TouchableOpacity>
	);

	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
			headerImage={
				<Image
					source={require("@/assets/images/partial-react-logo.png")}
					style={styles.reactLogo}
				/>
			}
		>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">Welcome to Kami Services</ThemedText>
				<ThemedText style={styles.subtitle}>
					Find professional services at your fingertips
				</ThemedText>
			</ThemedView>

			<ThemedView style={styles.sectionContainer}>
				<ThemedView style={styles.sectionHeader}>
					<ThemedText type="subtitle" style={styles.sectionTitle}>
						Featured Services
					</ThemedText>
					<TouchableOpacity
						onPress={() => router.push("/(tabs)/services")}
					>
						<ThemedText style={styles.seeAll}>See All</ThemedText>
					</TouchableOpacity>
				</ThemedView>

				{loading ? (
					<ThemedView style={styles.loadingContainer}>
						<ThemedText>Loading featured services...</ThemedText>
					</ThemedView>
				) : (
					<FlatList
						data={featuredServices}
						renderItem={renderFeaturedItem}
						keyExtractor={(item) => item?._id}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.featuredList}
					/>
				)}
			</ThemedView>

			<ThemedView style={styles.promotionContainer}>
				<ThemedView style={styles.promotionCard}>
					<ThemedText type="subtitle" style={styles.promotionTitle}>
						Special Offer
					</ThemedText>
					<ThemedText style={styles.promotionDescription}>
						Get 15% off your first service booking with code: KAMI15
					</ThemedText>
					<TouchableOpacity style={styles.promotionButton}>
						<ThemedText style={styles.promotionButtonText}>
							Book Now
						</ThemedText>
					</TouchableOpacity>
				</ThemedView>
			</ThemedView>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: "absolute",
	},
	titleContainer: {
		marginBottom: 20,
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
		marginTop: 5,
	},
	searchContainer: {
		marginBottom: 25,
	},
	searchBar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F5F5F5",
		borderRadius: 10,
		paddingHorizontal: 15,
		paddingVertical: 12,
		borderWidth: 1,
		borderColor: "#E0E0E0",
	},
	searchText: {
		marginLeft: 10,
		color: "#999",
		fontSize: 16,
	},
	sectionContainer: {
		marginBottom: 25,
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
	},
	seeAll: {
		fontSize: 14,
		color: "#4B7BEC",
	},
	categoriesList: {
		paddingRight: 20,
	},
	categoryItem: {
		marginRight: 15,
		alignItems: "center",
	},
	categoryIconContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "#E6EFFE",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
	},
	categoryName: {
		fontSize: 12,
		textAlign: "center",
	},
	featuredList: {
		paddingRight: 20,
	},
	featuredItem: {
		marginRight: 15,
		width: 140,
	},
	featuredImageContainer: {
		width: 140,
		height: 100,
		borderRadius: 10,
		backgroundColor: "#E6EFFE",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 8,
		overflow: "hidden",
	},
	featuredImage: {
		width: "100%",
		height: "100%",
	},
	featuredName: {
		fontSize: 14,
		marginBottom: 4,
	},
	featuredPrice: {
		fontSize: 14,
		color: "#4B7BEC",
		fontWeight: "600",
	},
	loadingContainer: {
		height: 100,
		justifyContent: "center",
		alignItems: "center",
	},
	promotionContainer: {
		marginBottom: 20,
	},
	promotionCard: {
		backgroundColor: "#E6EFFE",
		borderRadius: 15,
		padding: 20,
	},
	promotionTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 10,
	},
	promotionDescription: {
		fontSize: 16,
		marginBottom: 15,
		color: "#333",
	},
	promotionButton: {
		backgroundColor: "#4B7BEC",
		paddingVertical: 12,
		paddingHorizontal: 25,
		borderRadius: 8,
		alignSelf: "flex-start",
	},
	promotionButtonText: {
		color: "#FFFFFF",
		fontWeight: "600",
		fontSize: 16,
	},
});
