import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "../keys";
import { UserData } from "./types";

export const storeUserData = async (userData: UserData): Promise<void> => {
	try {
		await AsyncStorage.setItem(
			STORAGE_KEY.USER_DATA,
			JSON.stringify(userData)
		);
	} catch (error) {
		console.error("Errors while saving useData!");
		throw error;
	}
};

export const clearUserData = async (): Promise<void> => {
	try {
		await AsyncStorage.removeItem(STORAGE_KEY.USER_DATA);
	} catch (error) {
		console.error("Error while clear UserData!");
		throw error;
	}
};

export const getUserData = async (): Promise<UserData | null> => {
	try {
		const userData = await AsyncStorage.getItem(STORAGE_KEY.USER_DATA);
		return userData != null ? JSON.parse(userData) : null;
	} catch (error) {
		console.error("Error while get UserData.");
		throw error;
	}
};

export const isLoggedIn = async (): Promise<boolean> => {
	try {
		const userData = await getUserData();
		return userData?.isLoggedIn === true;
	} catch (error) {
		console.error("Error while get User Status.");
		throw error;
	}
};
