import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY } from "../keys";
import { Service } from "./types";

export const getServices = async (): Promise<Service[] | null> => {
	try {
		const services = await AsyncStorage.getItem(STORAGE_KEY.SERVICES);
		return services != null ? JSON.parse(services) : null;
	} catch (error) {
		console.error("Errors while getting Services Data!");
		throw error;
	}
};

export const setServices = async (services?: Service[]): Promise<void> => {
	try {
		await AsyncStorage.setItem(
			STORAGE_KEY.SERVICES,
			JSON.stringify(services)
		);
	} catch (error) {
		console.error("Errors while saving Services Data: ", error);
	}
};

export const removeService = async (id: string): Promise<void> => {
	try {
		const services = await getServices();
		const filteredService = services?.filter(
			(service) => service?._id !== id
		);
		await setServices(filteredService);
	} catch (error) {
		console.error("Error while removing a Service: ", error);
	}
};

export const updateService = async (service: Service): Promise<void> => {
	try {
		const services = await getServices();
		const newServices = services?.map(
			// spread operator (update all the fields of s to service (if they are same interface))
			(s) => (s._id === service._id ? { ...s, ...service } : s)
		);
		await setServices(newServices);
	} catch (error) {
		console.error("Error while updating a Service: ", error);
	}
};

export const getServiceById = async (id: string): Promise<Service | null> => {
	try {
		const services = await getServices();
		const service = services?.find((s) => s._id === id);
		return service || null;
	} catch (error) {
		console.error("Errors while getting a service: ", error);
		return null;
	}
};

export const createService = async (service: Service): Promise<void> => {
	try {
		const services = await getServices();
		if (services != undefined) {
			services.push(service);
			await setServices(services);
		}
	} catch (error) {
		console.error("Errors while creating a service: ", error);
	}
};
