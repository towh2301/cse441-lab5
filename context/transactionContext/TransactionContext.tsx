import { URLS } from "@/helpers/urls";
import {
	getTransactions,
	setTransactions,
} from "@/storage/transactions/transactionStorage";
import { Transaction } from "@/storage/transactions/types";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

type TransactionContextType = {
	transactions: Transaction[] | null;
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

	const addTransaction = async (transaction: Transaction) => {
		try {
			transactions?.push(transaction);
			if (transactions != null) {
				await setTransactions(transactions);
				setIsSuccess(true);
			}
		} catch (error) {
			console.error("Failed to add a new transaction: ", error);
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
				handleInvalidateTransactions,
			}}
		>
			{children}
		</TransactionContext.Provider>
	);
};
