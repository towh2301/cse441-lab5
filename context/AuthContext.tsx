import {
	UserData,
	clearUserData,
	getUserData,
	storeUserData,
} from "@/utils/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
	isAuthenticated: boolean;
	user: UserData | null;
	login: (userData: UserData) => Promise<void>;
	logout: () => Promise<void>;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		// Load user data on app start
		const loadUserData = async () => {
			try {
				const userData = await getUserData();
				if (userData && userData.isLoggedIn) {
					setUser(userData);
					setIsAuthenticated(true);
				}
			} catch (error) {
				console.error("Error loading user data:", error);
			} finally {
				setLoading(false);
			}
		};

		loadUserData();
	}, []);

	const login = async (userData: UserData) => {
		try {
			// Set user as logged in
			const authData = { ...userData, isLoggedIn: true };
			await storeUserData(authData);
			setUser(authData);
			setIsAuthenticated(true);
		} catch (error) {
			console.error("Error during login:", error);
			throw error;
		}
	};

	const logout = async () => {
		try {
			await clearUserData();
			setUser(null);
			setIsAuthenticated(false);
		} catch (error) {
			console.error("Error during logout:", error);
			throw error;
		}
	};

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, user, login, logout, loading }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
