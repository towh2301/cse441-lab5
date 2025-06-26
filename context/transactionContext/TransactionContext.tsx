import { URLS } from "@/helpers/urls";
import { getUserData } from "@/storage/auth/authStorage";
import {
	getTransactions,
	setTransactions,
} from "@/storage/transactions/transactionStorage";
import { Transaction } from "@/storage/transactions/types";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface TransactionService {
	id: string;
	quantity: number;
	userID: string;
}

interface CreateTransactionData {
	customerId: string;
	services: TransactionService[];
}

type TransactionContextType = {
	transactions: Transaction[] | null;
	addTransaction: (data: CreateTransactionData) => Promise<boolean>;
	deleteTransaction: (id: string) => Promise<boolean>;
	isLoading?: boolean;
	isSuccess?: boolean;
	[key: string]: any; // any but more strict (have to check type before use)
};

type TransactionProviderProps = {
	children: React.ReactNode;
};

const TransactionContext = createContext<TransactionContextType | undefined>(
	undefined
);

export const useTransactionContext = (): TransactionContextType => {
	const transactionContext = useContext(TransactionContext);
	if (transactionContext === undefined) {
		throw new Error(
			"useTransactionContext must be used within an TransactionProvider"
		);
	}
	return transactionContext;
};

export const TransactionProvider: React.FC<TransactionProviderProps> = ({
	children,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [transactions, setMyTransactions] = useState<Transaction[] | null>(
		null
	);
	const [isSuccess, setIsSuccess] = useState(false);

	const fetchTransactions = async () => {
		try {
			const response = await axios.get<Transaction[]>(URLS.TRANSACTIONS);
			const myTransactions = response?.data;
			await setTransactions(myTransactions);

			setMyTransactions(await getTransactions());
			setIsSuccess(true);
		} catch (error) {
			console.error("Failed to fetch transactions: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	const addTransaction = async (
		data: CreateTransactionData
	): Promise<boolean> => {
		try {
			setIsLoading(true);
			const userData = await getUserData();
			if (!userData?.token) {
				console.error("No auth token found");
				return false;
			}

			const response = await axios.post(URLS.TRANSACTIONS, {
				customerId: data.customerId,
				services: data.services,
				token: userData.token,
			});

			if (response.status === 200 || response.status === 201) {
				await fetchTransactions(); // Refresh transactions
				return true;
			}
			return false;
		} catch (error) {
			console.error("Failed to add transaction: ", error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const deleteTransaction = async (id: string): Promise<boolean> => {
		try {
			setIsLoading(true);
			const userData = await getUserData();
			if (!userData?.token) {
				console.error("No auth token found");
				return false;
			}

			const response = await axios.delete(`${URLS.TRANSACTIONS}/${id}`, {
				data: {
					token: userData.token,
				},
			});

			if (response.status === 200) {
				await fetchTransactions(); // Refresh transactions
				return true;
			}
			return false;
		} catch (error) {
			console.error("Failed to delete transaction: ", error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const handleInvalidateTransactions = async () => {
		try {
			const newTransactions = await getTransactions();
			if (newTransactions != null) {
				setTransactions(newTransactions);
			}
		} catch (error) {
			console.error("Failed to handle invalidate transactions: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTransactions();
	}, []);

	return (
		<TransactionContext.Provider
			value={{
				isLoading,
				transactions,
				isSuccess,
				addTransaction,
				deleteTransaction,
				handleInvalidateTransactions,
			}}
		>
			{children}
		</TransactionContext.Provider>
	);
};
