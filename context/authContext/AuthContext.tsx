import {
	clearUserData,
	getUserData,
	storeUserData,
} from "@/storage/auth/authStorage";
import { UserData } from "@/storage/auth/types";
import { createContext, useContext, useEffect, useState } from "react";

// Create the Context is for the children nodes so they can access context of AuthContext
// This is just the type
type AuthContextType = {
	isAuthenticated: boolean;
	user: UserData | null;
	login: (userData: UserData) => Promise<void>;
	logout: () => Promise<void>;
	isLoading: boolean;
	[key: string]: any; // Allows for extending the context with additional properties
};

// Create this stuff here is to use for the global states
// The initial value can be undefined but will be full-fill later
// After having context, we MUST create the appropriate provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the Provider stuff here
// It will wrap all the App for provide the context
// So we need create the {children: React.ReactNode} type for this to allow it wrap the React nodes
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<UserData | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Define the loadUserData function at component level
	const reloadUserData = async () => {
		try {
			const user = await getUserData();
			if (user && user.isLoggedIn) {
				setUser(user);
				setIsAuthenticated(true);
			}
		} catch (error) {
			console.error("Error loading user data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Auto load userdata when open app
	useEffect(() => {
		reloadUserData();
	}, []);

	const login = async (userData: UserData): Promise<void> => {
		try {
			const authData = { ...userData, isLoggedIn: true };
			await storeUserData(authData);
			setUser(authData);
			setIsAuthenticated(true);
		} catch (error) {
			console.error("Error while logging In.", error);
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async (): Promise<void> => {
		try {
			await clearUserData();
			setUser(null);
			setIsAuthenticated(false);
		} catch (error) {
			console.error("Error while logging Out.", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				isLoading,
				login,
				logout,
				user,
				reloadUserData,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// This "Sooooo Confuseeeeeddddd" here is to check if the AuthProvider is wrapped the
// root node or not
// This ensures that `useAuth` is called within an <AuthProvider>.
// If not, it will throw an error to help debug whether the AuthProvider is properly set up.
export const useAuth = (): AuthContextType => {
	const authContext = useContext(AuthContext);
	if (authContext === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return authContext;
};
