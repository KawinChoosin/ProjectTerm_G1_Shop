import React, { createContext, useState, useEffect, ReactNode } from "react";

// Define the shape of the context
interface UserContextProps {
  C_id: number | null;
  setC_id: (C_id: number) => void;
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
  const [C_id, setC_id] = useState<number | null>(null);

  // Load the C_id from localStorage when the component mounts
  useEffect(() => {
    const storedC_id = localStorage.getItem("C_id");
    if (storedC_id) {
      setC_id(Number(storedC_id)); // Convert the string to a number
    }
  }, []);

  // Save the C_id to localStorage whenever it changes
  const handleSetC_id = (C_id: number) => {
    setC_id(C_id);
    localStorage.setItem("C_id", C_id.toString()); // Store it as a string in localStorage
  };

  return (
    <UserContext.Provider value={{ C_id, setC_id: handleSetC_id }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
