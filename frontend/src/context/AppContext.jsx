import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('tb_favorites')) || [];
        } catch { return []; }
    });

    const [recentlyViewed, setRecentlyViewed] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('tb_recent')) || [];
        } catch { return []; }
    });

    const [globalSearch, setGlobalSearch] = useState('');
    const [activeRegion, setActiveRegion] = useState('All');
    const [isNavOpen, setIsNavOpen] = useState(false);

    // Auth State
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('tb_user')) || null; } catch { return null; }
    });
    const [authModalOpen, setAuthModalOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('tb_favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('tb_recent', JSON.stringify(recentlyViewed));
    }, [recentlyViewed]);

    useEffect(() => {
        if (user) localStorage.setItem('tb_user', JSON.stringify(user));
        else localStorage.removeItem('tb_user');
    }, [user]);

    const toggleFavorite = (state) => {
        setFavorites(prev => {
            const exists = prev.find(f => f._id === state._id);
            if (exists) return prev.filter(f => f._id !== state._id);
            return [...prev, state];
        });
    };

    const isFavorite = (id) => favorites.some(f => f._id === id);

    const addRecentlyViewed = (state) => {
        setRecentlyViewed(prev => {
            const filtered = prev.filter(r => r._id !== state._id);
            return [state, ...filtered].slice(0, 5);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tb_user');
    };

    return (
        <AppContext.Provider value={{
            favorites, toggleFavorite, isFavorite,
            recentlyViewed, addRecentlyViewed,
            globalSearch, setGlobalSearch,
            activeRegion, setActiveRegion,
            isNavOpen, setIsNavOpen,
            user, setUser, logout,
            authModalOpen, setAuthModalOpen
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
