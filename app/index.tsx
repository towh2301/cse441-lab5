import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function App() {
	// Use Auth context to determine where to redirect
	const { isAuthenticated, loading } = useAuth();
	const [initialRoute, setInitialRoute] = useState<string | null>(null);

	useEffect(() => {
		if (!loading) {
			setInitialRoute(isAuthenticated ? "/(tabs)" : "/(auth)/login");
		}
	}, [isAuthenticated, loading]);

	if (loading || !initialRoute) {
		// Show loading indicator while checking auth status
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#4B7BEC" />
			</View>
		);
	}

	// Redirect based on auth status
	return <Redirect href={initialRoute} />;
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
