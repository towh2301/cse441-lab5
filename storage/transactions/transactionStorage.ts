import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "../keys";
import { Transaction } from "./types";

const getTransactions = async (): Promise<Transaction[] | null> => {
	try {
		const transactions = await AsyncStorage.getItem(
			STORAGE_KEY.TRANSACTIONS
		);
		return transactions != null ? JSON.parse(transactions) : null;
	} catch (error) {
		console.error("Cannot get transactions: ", error);
		throw error;
	}
};

const setTransactions = async (transactions: Transaction[]) => {
	try {
		await AsyncStorage.setItem(
			STORAGE_KEY.TRANSACTIONS,
			JSON.stringify(transactions)
		);
	} catch (error) {
		console.error("Cannot set transactions: ", error);
	}
};
