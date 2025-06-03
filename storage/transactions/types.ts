import { Service } from "../services/types";
import { Customer } from "./../customers/types";

type Status = "available" | "unavailable";
export interface Transaction {
	_id?: string;
	id?: string;
	customer?: Customer;
	service?: Service[];
	priceBeforePromotion?: number;
	price?: number;
	status?: Status;
}
