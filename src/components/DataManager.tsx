import React, { useState } from 'react';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { storageKeys, saveToStorage, loadFromStorage } from '../lib/storage';
import { ConfirmModal, Modal } from './Modal';

interface Props {
    onDataCleared: () => void;
}

export const DataManager: React.FC<Props> = ({ onDataCleared }) => {
    const [showManager, setShowManager] = useState(false);
    const [confirmClear, setConfirmClear] = useState(false);
    const [resultModal, setResultModal] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' }>({
        isOpen: false,
        message: '',
        type: 'success'
    });

    const handleClearAll = async () => {
        try {
            // 1. Limpiar localStorage
            localStorage.removeItem(storageKeys.KEY_POSTS);
            localStorage.removeItem(storageKeys.KEY_SETTINGS);
            localStorage.removeItem(storageKeys.KEY_PAYMENTS);
            
            // 2. Limpiar Firestore
            await deleteDoc(doc(db, 'appData', storageKeys.KEY_POSTS));
            
            console.log('✅ Datos eliminados de localStorage y Firestore');
            
            setConfirmClear(false);
            setResultModal({
                isOpen: true,
                message: 'Todos los datos han sido eliminados. La página se recargará.',
                type: 'success'
            });
            
            // Recargar página después de 2 segundos
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
        } catch (error) {
            console.error('Error limpiando datos:', error);
            setResultModal({
                isOpen: true,
                message: 'Error al limpiar datos. Verifica la consola.',
                type: 'error'
            });
        }
    };

    const handleViewData = async () => {
        try {
            // Ver datos locales
            const localPosts = loadFromStorage(storageKeys.KEY_POSTS, []);
            console.log('📱 Posts en localStorage:', localPosts);
            
            // Ver datos en Firestore
            const docRef = doc(db, 'appData', storageKeys.KEY_POSTS);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                console.log('☁️ Posts en Firestore:', docSnap.data().data);
            } else {
                console.log('☁️ No hay datos en Firestore');
            }
            
            setResultModal({
                isOpen: true,
                message: 'Datos mostrados en la consola. Presiona F12 para verlos.',
                type: 'success'
            });
        } catch (error) {
            console.error('Error obteniendo datos:', error);
        }
    };

    if (!showManager) {
        return (
            <button
                onClick={() => setShowManager(true)}
                className="fixed bottom-4 left-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-900 z-50 shadow-lg"
            >
                🛠️ Gestión de Datos
            </button>
        );
    }

    return (
        <>
            <div className="fixed bottom-4 left-4 bg-white rounded-xl shadow-2xl p-4 z-50 border-2 border-gray-800 w-72">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm">🛠️ Gestión de Datos</h3>
                    <button
                        onClick={() => setShowManager(false)}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                        ×
                    </button>
                </div>
                
                <div className="space-y-2">
                    <button
                        onClick={handleViewData}
                        className="w-full bg-blue-500 text-white px-3 py-2 rounded text-xs font-bold hover:bg-blue-600"
                    >
                        📊 Ver Datos en Consola
                    </button>
                    
                    <button
                        onClick={() => setConfirmClear(true)}
                        className="w-full bg-red-500 text-white px-3 py-2 rounded text-xs font-bold hover:bg-red-600"
                    >
                        🗑️ Limpiar TODOS los Datos
                    </button>
                    
                    <p className="text-[10px] text-gray-500 mt-2">
                        ⚠️ Usar solo si hay datos corruptos o duplicados
                    </p>
                </div>
            </div>
            
            <ConfirmModal
                isOpen={confirmClear}
                onConfirm={handleClearAll}
                onCancel={() => setConfirmClear(false)}
                title="⚠️ ¿Eliminar TODOS los datos?"
                message="Esto eliminará todas las publicaciones, configuraciones y datos de localStorage y Firestore. Esta acción NO se puede deshacer."
                confirmText="Sí, eliminar todo"
                cancelText="Cancelar"
                type="danger"
            />
            
            <Modal
                isOpen={resultModal.isOpen}
                onClose={() => setResultModal({ ...resultModal, isOpen: false })}
                title={resultModal.type === 'success' ? '✅ Éxito' : '❌ Error'}
                message={resultModal.message}
                type={resultModal.type}
            />
        </>
    );
};
