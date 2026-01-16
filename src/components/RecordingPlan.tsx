import React, { useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../lib/storage';
import { RecordingPlanItem } from '../types';
import { ConfirmModal, Modal } from './Modal';

const KEY_CURRENT_PLAN = 'fp_monthly_plan_v1';
const KEY_PLAN_HISTORY = 'fp_plan_history_v1';

const DEFAULT_PLAN = `Planificación del mes actual:

1. Tomas del local antes, durante y después (reapertura).
2. Karen contando historias de la farmacia.
3. Video Sección A.
4. Video Sección B.
5. Video Sección C.
6. Video extra enfocado en productos destacados.
7. Video explicativo: cómo realizar una compra y medios de pago.`;

export const RecordingPlan: React.FC = () => {
    const [currentText, setCurrentText] = useState('');
    const [history, setHistory] = useState<RecordingPlanItem[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [showArchiveInput, setShowArchiveInput] = useState(false);
    const [archiveName, setArchiveName] = useState('');
    
    // State to track which history item is expanded
    const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
    
    // Confirm delete modal
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string | null }>({ 
        isOpen: false, 
        itemId: null 
    });
    
    // Success modal
    const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: ''
    });

    useEffect(() => {
        const storedCurrent = loadFromStorage(KEY_CURRENT_PLAN, DEFAULT_PLAN);
        const storedHistory = loadFromStorage(KEY_PLAN_HISTORY, []);
        setCurrentText(storedCurrent);
        setHistory(storedHistory);
    }, []);

    const handleSaveCurrent = () => {
        saveToStorage(KEY_CURRENT_PLAN, currentText);
        setIsEditing(false);
        setSuccessModal({ isOpen: true, message: 'Plan guardado correctamente' });
    };

    const handleArchive = () => {
        if (!archiveName.trim()) return;

        const newItem: RecordingPlanItem = {
            id: Date.now().toString(),
            title: archiveName,
            content: currentText,
            dateArchived: new Date().toLocaleDateString()
        };

        const newHistory = [newItem, ...history];
        setHistory(newHistory);
        saveToStorage(KEY_PLAN_HISTORY, newHistory);
        
        // Reset current
        setCurrentText("Nuevo Plan Mensual:\n\n1. ");
        saveToStorage(KEY_CURRENT_PLAN, "Nuevo Plan Mensual:\n\n1. ");
        
        setShowArchiveInput(false);
        setArchiveName('');
        setIsEditing(true); // Auto enter edit mode for new plan
        setSuccessModal({ isOpen: true, message: '¡Plan archivado exitosamente!' });
    };

    const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeleteConfirm({ isOpen: true, itemId: id });
    };
    
    const confirmDelete = () => {
        if (deleteConfirm.itemId) {
            const newHistory = history.filter(h => h.id !== deleteConfirm.itemId);
            setHistory(newHistory);
            saveToStorage(KEY_PLAN_HISTORY, newHistory);
            setDeleteConfirm({ isOpen: false, itemId: null });
            setSuccessModal({ isOpen: true, message: 'Historial eliminado' });
        }
    };

    const toggleHistoryExpand = (id: string) => {
        setExpandedHistoryId(expandedHistoryId === id ? null : id);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 mb-8 overflow-hidden">
            {/* Header */}
            <div className="bg-purple-50 px-6 py-3 border-b border-purple-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <h3 className="font-bold text-lg text-purple-900 flex items-center gap-2">
                    🎥 Plan de Rodaje (Mes Actual)
                </h3>
                <div className="flex gap-2">
                    {!showArchiveInput && (
                        <>
                            <button 
                                onClick={() => setShowArchiveInput(true)}
                                className="text-xs px-3 py-1.5 rounded font-bold bg-white text-purple-600 border border-purple-200 hover:bg-purple-100 transition-colors"
                            >
                                📂 Archivar y Nuevo Mes
                            </button>
                            <button 
                                onClick={() => isEditing ? handleSaveCurrent() : setIsEditing(true)}
                                className={`text-xs px-3 py-1.5 rounded font-bold transition-colors shadow-sm
                                    ${isEditing 
                                        ? 'bg-green-600 text-white hover:bg-green-700' 
                                        : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                            >
                                {isEditing ? '✓ Guardar' : '✏️ Editar'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Archive Dialog */}
            {showArchiveInput && (
                <div className="bg-purple-100 p-4 border-b border-purple-200 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs font-bold text-purple-800 mb-2">Nombre para guardar el mes actual (ej: Enero 2026):</p>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={archiveName}
                            onChange={(e) => setArchiveName(e.target.value)}
                            placeholder="Ej: Enero 2026"
                            className="flex-1 p-2 text-sm border rounded focus:ring-2 focus:ring-purple-500 outline-none bg-white text-gray-900 placeholder-gray-400"
                            autoFocus
                        />
                        <button 
                            onClick={handleArchive}
                            className="bg-purple-700 text-white text-xs font-bold px-4 rounded hover:bg-purple-800"
                        >
                            Confirmar Archivo
                        </button>
                        <button 
                            onClick={() => setShowArchiveInput(false)}
                            className="bg-gray-300 text-gray-700 text-xs font-bold px-4 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
            
            {/* Editor / View */}
            <div className="p-0">
                {isEditing ? (
                    <textarea 
                        value={currentText}
                        onChange={(e) => setCurrentText(e.target.value)}
                        className="w-full h-64 p-6 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-100 resize-none font-mono leading-relaxed"
                        placeholder="Escribí aquí los objetivos de grabación para este mes..."
                        style={{ backgroundColor: '#ffffff', color: '#111827' }} // Inline style force
                    />
                ) : (
                    <div className="p-6 bg-white whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-medium min-h-[100px]">
                        {currentText || "No hay objetivos definidos. Hacé click en Editar para comenzar."}
                    </div>
                )}
            </div>

            {/* History Section */}
            {history.length > 0 && (
                <div className="border-t border-purple-100 bg-gray-50 p-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">🗂️ Historial de Planes Anteriores</h4>
                    <div className={`grid grid-cols-1 gap-3 ${expandedHistoryId ? 'md:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
                        {history.map(item => {
                            const isExpanded = expandedHistoryId === item.id;
                            return (
                                <div 
                                    key={item.id} 
                                    onClick={() => toggleHistoryExpand(item.id)}
                                    className={`bg-white p-4 rounded border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative
                                        ${isExpanded ? 'col-span-full ring-2 ring-purple-200' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-purple-900">{item.title}</span>
                                            {isExpanded && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 rounded-full">Visualizando</span>}
                                        </div>
                                        <span className="text-[10px] text-gray-400">{item.dateArchived}</span>
                                    </div>
                                    
                                    <div className={`text-xs text-gray-600 mb-2 ${isExpanded ? 'whitespace-pre-wrap text-sm leading-relaxed' : 'line-clamp-3'}`}>
                                        {item.content}
                                    </div>

                                    {!isExpanded && (
                                        <div className="text-[10px] text-purple-500 font-bold mt-2">
                                            Click para ver todo
                                        </div>
                                    )}

                                    <button 
                                        onClick={(e) => deleteHistoryItem(e, item.id)}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-opacity bg-white px-1 rounded"
                                        title="Eliminar del historial"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
            <ConfirmModal
                isOpen={deleteConfirm.isOpen}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
                title="¿Eliminar historial?"
                message="Esta acción no se puede deshacer. El plan archivado será eliminado permanentemente."
                confirmText="Eliminar"
                cancelText="Cancelar"
                type="danger"
            />
            
            <Modal
                isOpen={successModal.isOpen}
                onClose={() => setSuccessModal({ isOpen: false, message: '' })}
                title="¡Éxito!"
                message={successModal.message}
                type="success"
            />
        </div>
    );
};