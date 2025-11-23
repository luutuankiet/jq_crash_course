import { useState, useEffect, useCallback } from 'react';

interface RecipeProgress {
    [recipeId: string]: {
        read: boolean;
        completed: boolean;
    };
}

const STORAGE_KEY = 'jq-master-progress';

export const useRecipeProgress = () => {
    const [progress, setProgress] = useState<RecipeProgress>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }, [progress]);

    const isRead = useCallback((recipeId: string) => {
        return progress[recipeId]?.read || false;
    }, [progress]);

    const isCompleted = useCallback((recipeId: string) => {
        return progress[recipeId]?.completed || false;
    }, [progress]);

    const markAsRead = useCallback((recipeId: string) => {
        setProgress(prev => ({
            ...prev,
            [recipeId]: {
                ...prev[recipeId],
                read: true,
            },
        }));
    }, []);

    const toggleCompleted = useCallback((recipeId: string) => {
        setProgress(prev => ({
            ...prev,
            [recipeId]: {
                read: prev[recipeId]?.read || true,
                completed: !(prev[recipeId]?.completed || false),
            },
        }));
    }, []);

    const clearProgress = useCallback(() => {
        setProgress({});
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const getStats = useCallback(() => {
        const entries = Object.values(progress);
        return {
            read: entries.filter(p => p.read).length,
            completed: entries.filter(p => p.completed).length,
            total: entries.length,
        };
    }, [progress]);

    return {
        isRead,
        isCompleted,
        markAsRead,
        toggleCompleted,
        clearProgress,
        getStats,
    };
};
