
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Plan = 'free' | 'pro';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  plan: Plan;
  credits: number;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  upgrade: () => Promise<void>;
  spendCredit: () => void;
  MAX_FREE_CREDITS: number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const MAX_FREE_CREDITS = 3;

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<Plan>('free');
  const [credits, setCredits] = useState(MAX_FREE_CREDITS);

  useEffect(() => {
    // Load from local storage to persist session
    const storedUser = localStorage.getItem('copyGen_user');
    const storedPlan = localStorage.getItem('copyGen_plan') as Plan;
    const storedCredits = localStorage.getItem('copyGen_credits');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedPlan) {
      setPlan(storedPlan);
    }
    if (storedCredits) {
      setCredits(parseInt(storedCredits, 10));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('copyGen_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('copyGen_user');
    }
    localStorage.setItem('copyGen_plan', plan);
    localStorage.setItem('copyGen_credits', credits.toString());
  }, [user, plan, credits]);

  const login = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    const newUser = {
      id: Math.random().toString(36).substring(7),
      name: email.split('@')[0],
      email: email
    };
    setUser(newUser);
    // Reset credits on new login for demo purposes if free
    if (plan === 'free') setCredits(MAX_FREE_CREDITS);
  };

  const logout = () => {
    setUser(null);
    setPlan('free');
    setCredits(MAX_FREE_CREDITS);
    localStorage.clear(); // Clear all app data
  };

  const upgrade = async () => {
    // Simulate Payment API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPlan('pro');
  };

  const spendCredit = () => {
    if (plan === 'pro') return; // Pro users have unlimited credits
    if (credits > 0) {
      setCredits(prev => prev - 1);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      plan,
      credits,
      isAuthenticated: !!user,
      login,
      logout,
      upgrade,
      spendCredit,
      MAX_FREE_CREDITS
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
