import AsyncStorage from "@react-native-async-storage/async-storage";

// Auth related utility functions
export const AUTH_STORAGE_KEY = "userData";

export interface UserData {
	email: string;
	token?: string;
	isLoggedIn?: boolean;
	isRegistered?: boolean;
}

// Store user data in AsyncStorage
export const storeUserData = async (userData: UserData): Promise<void> => {
	try {
		await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
	} catch (error) {
		console.error("Error storing user data:", error);
		throw error;
	}
};

// Get user data from AsyncStorage
export const getUserData = async (): Promise<UserData | null> => {
	try {
		const jsonValue = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (error) {
		console.error("Error getting user data:", error);
		return null;
	}
};

// Check if the user is logged in
export const isLoggedIn = async (): Promise<boolean> => {
	try {
		const userData = await getUserData();
		return userData?.isLoggedIn === true;
	} catch (error) {
		console.error("Error checking login status:", error);
		return false;
	}
};

// Remove user data from AsyncStorage
export const clearUserData = async (): Promise<void> => {
	try {
		await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
	} catch (error) {
		console.error("Error clearing user data:", error);
		throw error;
	}
};

// Log out user
export const logout = async (): Promise<void> => {
	await clearUserData();
};
