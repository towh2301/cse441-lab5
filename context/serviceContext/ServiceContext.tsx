import {
	createService,
	getServices,
	removeService,
	updateService,
} from "@/storage/services/serviceStorage";
import { Service } from "@/storage/services/types";
import React, { createContext, useCallback, useEffect, useState } from "react";

interface ServiceContextType {
	services: Service[] | null;
	isLoading: boolean;
	getAllServices: () => Promise<Service[] | null>;
	updateService: (newService: Service) => Promise<void>;
	createService: (newService: Service) => Promise<void>;
	deleteServiceById: (id: string) => Promise<void>;
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

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [services, setServices] = useState<Service[] | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const getAllServices = useCallback(async (): Promise<Service[] | null> => {
		try {
			setIsLoading(true);
			const localServices = await getServices();
			setServices(localServices);
			return localServices;
		} catch (error) {
			console.error("Error loading services:", error);
			return null;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const updateServiceHandler = useCallback(async (newService: Service) => {
		try {
			setIsLoading(true);
			await updateService(newService);
			const updatedServices = await getServices();
			setServices(updatedServices);
		} catch (error) {
			console.error("Error while updating service:", error);
			throw error; // Ném lỗi để component con có thể xử lý
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createServiceHandler = useCallback(async (newService: Service) => {
		try {
			setIsLoading(true);
			await createService(newService);
			const updatedServices = await getServices();
			setServices(updatedServices);
		} catch (error) {
			console.error("Error while creating a new service:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const deleteServiceByIdHandler = useCallback(async (id: string) => {
		try {
			setIsLoading(true);
			await removeService(id);
			const updatedServices = await getServices();
			setServices(updatedServices);
		} catch (error) {
			console.error("Error while deleting a service:", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		getAllServices();
	}, [getAllServices]);

	return (
		<ServiceContext.Provider
			value={{
				services,
				isLoading,
				getAllServices,
				updateService: updateServiceHandler,
				createService: createServiceHandler,
				deleteServiceById: deleteServiceByIdHandler,
			}}
		>
			{children}
		</ServiceContext.Provider>
	);
};
