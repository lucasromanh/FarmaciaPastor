import React, { useState, useEffect } from 'react';
import { PendingItem } from '../types';
import { loadFromStorage, saveToStorage, storageKeys } from '../lib/storage';

export const PendingList: React.FC = () => {
    const [items, setItems] = useState<PendingItem[]>([]);
    const [newItemText, setNewItemText] = useState('');
    const [assignedTo, setAssignedTo] = useState('');

    useEffect(() => {
        const stored = loadFromStorage('fp_pending_items_v1', [
            { id: 'def_1', text: 'Falta infografía', assignedTo: 'Karen', completed: false },
            { id: 'def_2', text: 'Faltan videos antiguos', assignedTo: 'Karen', completed: false }
        ]);
        setItems(stored);
    }, []);

    const save = (newItems: PendingItem[]) => {
        setItems(newItems);
        saveToStorage('fp_pending_items_v1', newItems);
    };

    const handleAdd = () => {
        if (!newItemText.trim()) return;
        const newItem: PendingItem = {
            id: Date.now().toString(),
            text: newItemText,
            assignedTo: assignedTo,
            completed: false
        };
        save([...items, newItem]);
        setNewItemText('');
        setAssignedTo('');
    };

    const toggleComplete = (id: string) => {
        const updated = items.map(i => i.id === id ? { ...i, completed: !i.completed } : i);
        save(updated);
    };

    const deleteItem = (id: string) => {
        save(items.filter(i => i.id !== id));
    };

    return (
        <div className="bg-red-50 rounded-xl p-4 border border-red-100 mb-6 shadow-sm">
            <h3 className="font-bold text-lg text-red-900 mb-3 flex items-center gap-2">
                <span>⚠️ Pendientes / Material Faltante</span>
            </h3>
            
            <div className="space-y-2 mb-4">
                {items.map(item => (
                    <div key={item.id} className="flex items-start gap-2 bg-white p-2 rounded border border-red-100 shadow-sm transition-all hover:shadow-md">
                        <input 
                            type="checkbox" 
                            checked={item.completed} 
                            onChange={() => toggleComplete(item.id)}
                            className="mt-1 cursor-pointer accent-red-600"
                        />
                        <div className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            <p className="font-medium">{item.text}</p>
                            {item.assignedTo && <p className="text-[10px] text-red-500 font-bold">A cargo de: {item.assignedTo}</p>}
                        </div>
                        <button onClick={() => deleteItem(item.id)} className="text-gray-400 hover:text-red-500 text-xs px-2">✕</button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-2 bg-white p-2 rounded border border-red-100">
                <input 
                    type="text" 
                    value={newItemText}
                    onChange={e => setNewItemText(e.target.value)}
                    placeholder="Escribí aquí lo que falta..."
                    className="w-full text-xs p-2 border border-gray-200 rounded focus:ring-2 focus:ring-red-300 outline-none bg-white text-gray-900 placeholder-gray-400"
                />
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={assignedTo}
                        onChange={e => setAssignedTo(e.target.value)}
                        placeholder="Responsable (opcional)"
                        className="flex-1 text-xs p-2 border border-gray-200 rounded focus:ring-2 focus:ring-red-300 outline-none bg-white text-gray-900 placeholder-gray-400"
                    />
                    <button 
                        onClick={handleAdd}
                        className="bg-red-600 text-white text-xs font-bold px-4 py-1 rounded hover:bg-red-700 transition-colors shadow-sm"
                    >
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    );
};