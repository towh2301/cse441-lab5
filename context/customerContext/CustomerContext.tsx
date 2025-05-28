import { URLS } from "@/helpers/urls";
import {
	getCustomers,
	setCustomers,
} from "@/storage/customers/customerStorage";
import { Customer } from "@/storage/customers/types";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

type CustomerContextType = {
	customers: Customer[] | null;
	addCustomer: (customer: Customer) => Promise<void>;
	isLoading?: boolean;
	isSuccess?: boolean;
	handleInvalidateCustomers: () => Promise<void>;
	[key: string]: unknown; // any but more strict ( have to check type before use)
};

type CustomerProviderProps = {
	children: React.ReactNode;
};

const CustomerContext = createContext<CustomerContextType | undefined>(
	undefined
);

export const useCustomerContext = (): CustomerContextType => {
	const customerContext = useContext(CustomerContext);
	if (customerContext === undefined) {
		throw new Error(
			"useCustomerContext must be used within an CustomerProvider"
		);
	}
	return customerContext;
};

export const CustomerProvider: React.FC<CustomerProviderProps> = ({
	children,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [customers, setMyCustomers] = useState<Customer[] | null>(null);
	const [isSuccess, setIsSuccess] = useState(false);

	const fetchCustomers = async () => {
		try {
			const response = await axios.get<Customer[]>(URLS.CUSTOMERS);
			const myCustomers = response?.data;
			await setCustomers(myCustomers);

			setMyCustomers(await getCustomers());
			setIsSuccess(true);
		} catch (error) {
			console.error("Failed to fetch customers: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	const addCustomer = async (customer: Customer) => {
		try {
			customers?.push(customer);
			if (customers != null) {
				await setCustomers(customers);
				setIsSuccess(true);
			}
		} catch (error) {
			console.error("Failed to add a new customer: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInvalidateCustomers = async () => {
		try {
			const newCustomers = await getCustomers();
			if (newCustomers != null) {
				setMyCustomers(newCustomers);
			}
		} catch (error) {
			console.error("Failed to handle invalidate customers: ", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchCustomers();
	}, []);

	return (
		<>
			<CustomerContext.Provider
				value={{
					isLoading,
					customers,
					isSuccess,
					addCustomer,
					handleInvalidateCustomers,
				}}
			>
				{children}
			</CustomerContext.Provider>
		</>
	);
};
