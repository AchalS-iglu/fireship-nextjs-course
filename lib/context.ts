import { createContext } from 'react';

export const UserContext = createContext<{user: any, username: any}>({ user: null, username: null });