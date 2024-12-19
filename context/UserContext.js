import React, { createContext, useContext, useState } from 'react';

// Create UserContext
const UserContext = createContext();

// UserProvider to wrap the app
export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        goal: '',
        gender: '',
        activity: '',
        height: 0,
        weight: 0,
        age: 0,
        intake: { proteins: 0, fats: 0, carbs: 0, calories: 0 },
    });

    // Function to update user data
    const updateUserData = (updates) => {
        setUserData((prev) => ({ ...prev, ...updates }));
    };

    return (
        <UserContext.Provider value={{ userData, updateUserData }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to access UserContext
export const useUser = () => useContext(UserContext);
