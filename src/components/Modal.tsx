import React from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'info' | 'error' | 'warning' | 'success';
}

export const Modal: React.FC<Props> = ({ isOpen, onClose, title, message, type = 'info' }) => {
    if (!isOpen) return null;

    const colors = {
        info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: '💡', text: 'text-blue-900' },
        error: { bg: 'bg-red-50', border: 'border-red-200', icon: '❌', text: 'text-red-900' },
        warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: '⚠️', text: 'text-yellow-900' },
        success: { bg: 'bg-green-50', border: 'border-green-200', icon: '✅', text: 'text-green-900' }
    };

    const style = colors[type];

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className={`${style.bg} ${style.border} border-2 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-[scale-in_0.2s_ease-out]`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="text-4xl flex-shrink-0">{style.icon}</div>
                        <div className="flex-1">
                            <h3 className={`text-xl font-bold ${style.text} mb-2`}>{title}</h3>
                            <p className={`${style.text} opacity-80 leading-relaxed`}>{message}</p>
                        </div>
                    </div>
                </div>
                <div className="px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg shadow-sm border border-gray-200 transition-all duration-150 hover:scale-[1.02]"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ConfirmProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmProps> = ({ 
    isOpen, 
    onConfirm, 
    onCancel, 
    title, 
    message, 
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'warning'
}) => {
    if (!isOpen) return null;

    const colors = {
        danger: { bg: 'bg-red-50', border: 'border-red-200', icon: '🗑️', text: 'text-red-900', buttonBg: 'bg-red-600 hover:bg-red-700' },
        warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: '⚠️', text: 'text-yellow-900', buttonBg: 'bg-yellow-600 hover:bg-yellow-700' },
        info: { bg: 'bg-blue-50', border: 'border-blue-200', icon: '❓', text: 'text-blue-900', buttonBg: 'bg-blue-600 hover:bg-blue-700' }
    };

    const style = colors[type];

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div 
                className={`${style.bg} ${style.border} border-2 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-[scale-in_0.2s_ease-out]`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="text-4xl flex-shrink-0">{style.icon}</div>
                        <div className="flex-1">
                            <h3 className={`text-xl font-bold ${style.text} mb-2`}>{title}</h3>
                            <p className={`${style.text} opacity-80 leading-relaxed`}>{message}</p>
                        </div>
                    </div>
                </div>
                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 px-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg shadow-sm border border-gray-200 transition-all duration-150 hover:scale-[1.02]"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-3 px-4 ${style.buttonBg} text-white font-semibold rounded-lg shadow-sm transition-all duration-150 hover:scale-[1.02]`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface LoadingProps {
    isOpen: boolean;
    message: string;
}

export const LoadingModal: React.FC<LoadingProps> = ({ isOpen, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center">
                <div className="mb-6">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
                </div>
                <p className="text-lg font-semibold text-gray-800 mb-2">{message}</p>
                <p className="text-sm text-gray-500">Por favor espera...</p>
            </div>
        </div>
    );
};

<style jsx>{`
    @keyframes scale-in {
        from {
            transform: scale(0.9);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
`}</style>
