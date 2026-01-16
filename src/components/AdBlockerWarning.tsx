import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export const AdBlockerWarning: React.FC = () => {
    const [isBlocked, setIsBlocked] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Test Firebase connection
        const testConnection = async () => {
            try {
                // Try a simple Firestore operation
                const testQuery = query(collection(db, 'appData'), limit(1));
                await getDocs(testQuery);
                setIsBlocked(false);
            } catch (error: any) {
                // Check if it's a network/blocked error
                if (
                    error.message?.includes('Failed to fetch') ||
                    error.message?.includes('NetworkError') ||
                    error.code === 'unavailable' ||
                    error.code === 'failed-precondition'
                ) {
                    setIsBlocked(true);
                }
            }
        };

        testConnection();
        
        // Re-test every 30 seconds
        const interval = setInterval(testConnection, 30000);
        
        return () => clearInterval(interval);
    }, []);

    if (!isBlocked || isDismissed) return null;

    return (
        <div className="fixed top-16 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[100] animate-in slide-in-from-top-4 fade-in">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-yellow-800 mb-1">
                            ⚠️ AdBlocker Detectado
                        </h3>
                        <p className="text-sm text-yellow-700 mb-2">
                            Tu bloqueador de anuncios está interfiriendo con la sincronización en la nube. 
                        </p>
                        <p className="text-xs text-yellow-600 mb-3">
                            Desactiva el AdBlocker para <strong>localhost</strong> o <strong>{window.location.hostname}</strong> para usar todas las funciones.
                        </p>
                        <button
                            onClick={() => setIsDismissed(true)}
                            className="text-xs text-yellow-800 underline hover:text-yellow-900 font-semibold"
                        >
                            Entendido, cerrar aviso
                        </button>
                    </div>
                    <button
                        onClick={() => setIsDismissed(true)}
                        className="flex-shrink-0 text-yellow-600 hover:text-yellow-800"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
