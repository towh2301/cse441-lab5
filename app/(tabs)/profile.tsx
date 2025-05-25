import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/context/AuthContext";

export default function ProfileScreen() {
	// Use the Auth context to get user data
	const { user: authUser, logout: authLogout } = useAuth();

	// Initialize with default values but use data from context when available
	const [user, setUser] = useState({
		email: "",
		name: "User",
		memberSince: "May 2025",
	});

	// Update user data from Auth context when it changes
	useEffect(() => {
		if (authUser) {
			setUser({
				...user,
				email: authUser.email || "user@example.com",
				// You could retrieve more user info from authUser if needed
			});
		}
	}, [authUser]);
	const handleLogout = () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{
				text: "Cancel",
				style: "cancel",
			},
			{
				text: "Logout",
				onPress: async () => {
					try {
						// Clear user data using auth context
						await authLogout();
						// Navigate back to login screen
						router.replace("/(auth)/login");
					} catch (error) {
						console.error("Error during logout:", error);
						Alert.alert(
							"Error",
							"Failed to logout. Please try again."
						);
					}
				},
			},
		]);
	};

	const handleNavigation = (screen: string) => {
		Alert.alert("Navigation", `Navigate to ${screen} screen`);
		// In a real app, you would navigate to the respective screens
	};

	return (
		<ThemedView style={styles.container}>
			<ThemedView style={styles.header}>
				<ThemedText type="title" style={styles.title}>
					My Profile
				</ThemedText>
			</ThemedView>

			<ThemedView style={styles.profileSection}>
				<ThemedView style={styles.avatarContainer}>
					<IconSymbol
						size={60}
						name="person.crop.circle.fill"
						color="#4B7BEC"
					/>
				</ThemedView>
				<ThemedText type="subtitle" style={styles.userName}>
					{user.name}
				</ThemedText>
				<ThemedText style={styles.userEmail}>{user.email}</ThemedText>
				<ThemedText style={styles.memberSince}>
					Member since: {user.memberSince}
				</ThemedText>
			</ThemedView>

			<ThemedView style={styles.menuContainer}>
				<TouchableOpacity
					style={styles.menuItem}
					onPress={() => handleNavigation("My Bookings")}
				>
					<IconSymbol
						size={24}
						name="calendar"
						color="#4B7BEC"
						style={styles.menuIcon}
					/>
					<ThemedText style={styles.menuText}>My Bookings</ThemedText>
					<IconSymbol
						size={18}
						name="chevron.right"
						color="#BBBBBB"
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.menuItem}
					onPress={() => handleNavigation("Payment Methods")}
				>
					<IconSymbol
						size={24}
						name="creditcard"
						color="#4B7BEC"
						style={styles.menuIcon}
					/>
					<ThemedText style={styles.menuText}>
						Payment Methods
					</ThemedText>
					<IconSymbol
						size={18}
						name="chevron.right"
						color="#BBBBBB"
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.menuItem}
					onPress={() => handleNavigation("Address Book")}
				>
					<IconSymbol
						size={24}
						name="map"
						color="#4B7BEC"
						style={styles.menuIcon}
					/>
					<ThemedText style={styles.menuText}>
						Address Book
					</ThemedText>
					<IconSymbol
						size={18}
						name="chevron.right"
						color="#BBBBBB"
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.menuItem}
					onPress={() => handleNavigation("Notifications")}
				>
					<IconSymbol
						size={24}
						name="bell"
						color="#4B7BEC"
						style={styles.menuIcon}
					/>
					<ThemedText style={styles.menuText}>
						Notifications
					</ThemedText>
					<IconSymbol
						size={18}
						name="chevron.right"
						color="#BBBBBB"
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.menuItem}
					onPress={() => handleNavigation("Help & Support")}
				>
					<IconSymbol
						size={24}
						name="questionmark.circle"
						color="#4B7BEC"
						style={styles.menuIcon}
					/>
					<ThemedText style={styles.menuText}>
						Help & Support
					</ThemedText>
					<IconSymbol
						size={18}
						name="chevron.right"
						color="#BBBBBB"
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.menuItem}
					onPress={() => handleNavigation("Settings")}
				>
					<IconSymbol
						size={24}
						name="gear"
						color="#4B7BEC"
						style={styles.menuIcon}
					/>
					<ThemedText style={styles.menuText}>Settings</ThemedText>
					<IconSymbol
						size={18}
						name="chevron.right"
						color="#BBBBBB"
					/>
				</TouchableOpacity>
			</ThemedView>

			<TouchableOpacity
				style={styles.logoutButton}
				onPress={handleLogout}
			>
				<IconSymbol
					size={20}
					name="escape"
					color="#FF3B30"
					style={styles.logoutIcon}
				/>
				<ThemedText style={styles.logoutText}>Logout</ThemedText>
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
		paddingHorizontal: 20,
		marginBottom: 20,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
	},
	profileSection: {
		alignItems: "center",
		padding: 20,
		marginBottom: 20,
	},
	avatarContainer: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: "#E6EFFE",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 15,
	},
	userName: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 5,
	},
	userEmail: {
		fontSize: 16,
		color: "#666",
		marginBottom: 5,
	},
	memberSince: {
		fontSize: 14,
		color: "#888",
	},
	menuContainer: {
		paddingHorizontal: 20,
	},
	menuItem: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: "#E0E0E0",
	},
	menuIcon: {
		marginRight: 15,
	},
	menuText: {
		flex: 1,
		fontSize: 16,
	},
	logoutButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginTop: 40,
		marginHorizontal: 20,
		padding: 15,
		backgroundColor: "#FEE6E6",
		borderRadius: 10,
	},
	logoutIcon: {
		marginRight: 10,
	},
	logoutText: {
		fontSize: 16,
		color: "#FF3B30",
		fontWeight: "600",
	},
});
