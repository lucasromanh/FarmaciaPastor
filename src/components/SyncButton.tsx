import React, { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { storageKeys } from '../lib/storage';

interface Props {
    onSync: () => void;
}

export const SyncButton: React.FC<Props> = ({ onSync }) => {
    const [syncing, setSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<Date | null>(null);

    const handleSync = async () => {
        setSyncing(true);
        try {
            // Forzar recarga desde Firestore
            const docRef = doc(db, 'appData', storageKeys.KEY_POSTS);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data().data;
                localStorage.setItem(storageKeys.KEY_POSTS, JSON.stringify(data));
                console.log('🔄 Sincronización manual exitosa:', data);
                setLastSync(new Date());
                onSync();
            }
        } catch (error) {
            console.error('❌ Error en sincronización manual:', error);
            alert('Error al sincronizar. Verifica tu conexión a Firebase.');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleSync}
                disabled={syncing}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm transition-all ${
                    syncing 
                        ? 'bg-gray-200 text-gray-500 cursor-wait' 
                        : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                }`}
            >
                <svg 
                    className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                    />
                </svg>
                {syncing ? 'Sincronizando...' : 'Sincronizar'}
            </button>
            {lastSync && (
                <span className="text-xs text-gray-500">
                    Última sincronización: {lastSync.toLocaleTimeString()}
                </span>
            )}
        </div>
    );
};
