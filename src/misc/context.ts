import { createContext } from "react";
import { UserDataContextType } from ".";

export const UserDataContext = createContext<UserDataContextType | null>(null);
