import React, { createContext, useState, ReactNode } from "react";

// Define the shape of the context
interface UserContextProps {
  C_id: number | null;
  setC_id: (C_id: number | null) => void;
}

// Create the context with default values
const UserContext = createContext<UserContextProps>({
  C_id: null,
  setC_id: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

// Create a provider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Initialize state with the value from sessionStorage
  const [C_id, setC_id] = useState<number | null>(() => {
    const storedC_id = sessionStorage.getItem("C_id");
    return storedC_id ? Number(storedC_id) : null;
  });

  // Save the C_id to sessionStorage whenever it changes
  const handleSetC_id = (C_id: number | null) => {
    setC_id(C_id);
    if (C_id == null) sessionStorage.setItem("C_id", "");
    else sessionStorage.setItem("C_id", C_id.toString()); // Store it as a string in sessionStorage
  };

  return (
    <UserContext.Provider value={{ C_id, setC_id: handleSetC_id }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
