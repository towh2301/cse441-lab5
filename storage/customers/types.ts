import { Transaction } from "../transactions/types";

type Loyalty = "normal" | "high" | "low";

export interface Customer {
	_id?: string;
	phone?: string;
	name?: string;
	loyalty?: Loyalty;
	totalSpent?: number;
}

export interface CustomerResponse {
	_id?: string;
	phone?: string;
	name?: string;
	loyalty?: Loyalty;
	totalSpent?: number;
	transactions: Transaction[];
}
