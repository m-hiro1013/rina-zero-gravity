import { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthContext = createContext({
    user: null,
    loading: true,
});

export function AuthProvider({ children }) {
    const authState = useAuth();

    return (
        <AuthContext.Provider value={authState}>
            {!authState.loading && children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
