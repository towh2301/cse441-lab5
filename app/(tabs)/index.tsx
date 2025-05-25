import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";
import axios from "axios";

import ParallaxScrollView from "@/components/ParallaxScrollView";
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

interface Category {
	id: string;
	name: string;
	icon: string;
}

export default function HomeScreen() {
	const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
	const [loading, setLoading] = useState(true);

	// Example categories
	const categories: Category[] = [
		{ id: "1", name: "Cleaning", icon: "spray.sparkle" },
		{ id: "2", name: "Plumbing", icon: "water.waves" },
		{ id: "3", name: "Electrical", icon: "bolt.fill" },
		{ id: "4", name: "Gardening", icon: "leaf.fill" },
		{ id: "5", name: "Painting", icon: "paintbrush.fill" },
		{ id: "6", name: "Moving", icon: "shippingbox.fill" },
	];

	useEffect(() => {
		fetchFeaturedServices();
	}, []);

	const fetchFeaturedServices = async () => {
		try {
			const response = await axios.get(API_URL);
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
		router.push(`/(tabs)/service/${serviceId}`);
	};

	const navigateToCategory = (categoryId: string, categoryName: string) => {
		// In a real app, you would navigate to a category-filtered services screen
		console.log(`Navigate to category: ${categoryName}`);
	};

	const renderCategoryItem = ({ item }: { item: Category }) => (
		<TouchableOpacity
			style={styles.categoryItem}
			onPress={() => navigateToCategory(item.id, item.name)}
		>
			<ThemedView style={styles.categoryIconContainer}>
				<IconSymbol size={24} name={item.icon} color="#4B7BEC" />
			</ThemedView>
			<ThemedText style={styles.categoryName}>{item.name}</ThemedText>
		</TouchableOpacity>
	);

	const renderFeaturedItem = ({ item }: { item: Service }) => (
		<TouchableOpacity
			style={styles.featuredItem}
			onPress={() => navigateToService(item.id)}
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

			<ThemedView style={styles.searchContainer}>
				<TouchableOpacity
					style={styles.searchBar}
					onPress={() => console.log("Search pressed")}
				>
					<IconSymbol
						size={20}
						name="magnifyingglass"
						color="#4B7BEC"
					/>
					<ThemedText style={styles.searchText}>
						Search for services...
					</ThemedText>
				</TouchableOpacity>
			</ThemedView>

			<ThemedView style={styles.sectionContainer}>
				<ThemedView style={styles.sectionHeader}>
					<ThemedText type="subtitle" style={styles.sectionTitle}>
						Categories
					</ThemedText>
					<TouchableOpacity
						onPress={() => router.push("/(tabs)/services")}
					>
						<ThemedText style={styles.seeAll}>See All</ThemedText>
					</TouchableOpacity>
				</ThemedView>

				<FlatList
					data={categories}
					renderItem={renderCategoryItem}
					keyExtractor={(item) => item.id}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.categoriesList}
				/>
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
						keyExtractor={(item) => item.id}
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
