type Loyalty = "normal" | "high" | "low";

export interface Customer {
	_id?: string;
	phone?: string;
	name?: string;
	loyalty?: Loyalty;
	totalSpent?: number;
}
