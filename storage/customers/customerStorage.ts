import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "../keys";
import { Customer } from "./types";

export const setCustomers = async (customers: Customer[]) => {
	try {
		await AsyncStorage.setItem(
			STORAGE_KEY.CUSTOMERS,
			JSON.stringify(customers)
		);
	} catch (error) {
		console.error("Cannot set customers: ", error);
		throw error;
	}
};

export const getCustomers = async (): Promise<Customer[] | null> => {
	try {
		const customers = await AsyncStorage.getItem(STORAGE_KEY.CUSTOMERS);
		return customers != null ? JSON.parse(customers) : null;
	} catch (error) {
		console.error("Cannot get customers: ", error);
		throw error;
	}
};
