import { URLS } from "@/helpers/urls";
import {
	clearServices,
	createService,
	getServices,
	removeService,
	setServices,
	updateService,
} from "@/storage/services/serviceStorage";
import { Service } from "@/storage/services/types";
import axios from "axios";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";

type Status = "idle" | "loading" | "success" | "error";

interface ServiceContextType {
	status: Status;
	services: Service[] | null;
	isLoading: boolean;
	getAllServices: () => Promise<Service[] | null>;
	updateService: (newService: Service) => Promise<void>;
	createService: (newService: Service) => Promise<void>;
	deleteServiceById: (id: string) => Promise<void>;
	fetchServices: () => Promise<void>;
	handleInvalidateData: () => Promise<void>;
}

interface ServiceProviderProps {
	children: React.ReactNode;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const useServiceContext = () => {
	const context = React.useContext(ServiceContext);
	if (!context) {
		throw new Error(
			"useServiceContext must be used within a ServiceProvider"
		);
	}
	return context;
};

export const ServiceProvider: React.FC<ServiceProviderProps> = ({
	children,
}) => {
	const [services, setMyServices] = useState<Service[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [status, setStatus] = useState<Status>("idle");

	const showToastWithGravity = () => {
		ToastAndroid.showWithGravity(
			"Successfully!",
			ToastAndroid.SHORT,
			ToastAndroid.CENTER
		);
	};

	const fetchServices = useCallback(async () => {
		try {
			setIsLoading(true);
			setStatus("loading");
			await clearServices();
			const response = await axios.get<Service[]>(URLS.SERVICES);
			const fetchedServices = response.data || [];
			await setServices(fetchedServices);

			const myServices = await getServices();
			setMyServices(myServices);
			setStatus("success");
		} catch (error) {
			console.error("Error while fetching data:", error);
			setStatus("error");
			throw error;
		} finally {
			setIsLoading(false);
			if (status === "success") {
				showToastWithGravity();
			}
		}
	}, []);

	const getAllServices = useCallback(async (): Promise<Service[] | null> => {
		try {
			setIsLoading(true);
			setStatus("loading");
			const localServices = await getServices();
			setMyServices(localServices || []);
			setStatus("success");
			return localServices;
		} catch (error) {
			console.error("Error loading services:", error);
			setStatus("error");
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const updateServiceHandler = useCallback(async (newService: Service) => {
		try {
			setIsLoading(true);
			setStatus("loading");
			await updateService(newService);
			const updatedServices = await getServices();
			setServices(updatedServices || []);
			setStatus("success");
		} catch (error) {
			console.error("Error while updating service:", error);
			setStatus("error");
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createServiceHandler = useCallback(async (newService: Service) => {
		try {
			setIsLoading(true);
			setStatus("loading");
			await createService(newService);
			const updatedServices = await getServices();
			setServices(updatedServices || []);
			setStatus("success");
		} catch (error) {
			console.error("Error while creating a new service:", error);
			setStatus("error");
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const deleteServiceByIdHandler = useCallback(async (id: string) => {
		try {
			setIsLoading(true);
			setStatus("loading");
			await removeService(id);
			const updatedServices = await getServices();
			setServices(updatedServices || []);
			setStatus("success");
		} catch (error) {
			console.error("Error while deleting a service:", error);
			setStatus("error");
			throw error;
		} finally {
			if (status === "success") {
				showToastWithGravity();
				handleInvalidateData();
			}
			setIsLoading(false);
		}
	}, []);

	const handleInvalidateData = useCallback(async () => {
		try {
			const myServices = await getServices();
			setMyServices(myServices);
		} catch (error) {
			console.error("Error while handle invalidate data: ", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchServices();
	}, [fetchServices]);

	return (
		<ServiceContext.Provider
			value={{
				status,
				services,
				isLoading,
				getAllServices,
				updateService: updateServiceHandler,
				createService: createServiceHandler,
				deleteServiceById: deleteServiceByIdHandler,
				fetchServices,
				handleInvalidateData,
			}}
		>
			{children}
		</ServiceContext.Provider>
	);
};
