import React, { useState, useEffect, useRef } from 'react';
import { loadFromStorage, saveToStorage } from '../lib/storage';

const KEY_COVERS = 'fp_covers_v1';

export const CoverManager: React.FC = () => {
    const [covers, setCovers] = useState<string[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setCovers(loadFromStorage(KEY_COVERS, []));
    }, []);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Limit to 3 covers as per brief suggestion
                const updated = [...covers, result].slice(-3); 
                setCovers(updated);
                saveToStorage(KEY_COVERS, updated);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeCover = (index: number) => {
        const updated = covers.filter((_, i) => i !== index);
        setCovers(updated);
        saveToStorage(KEY_COVERS, updated);
    };

    return (
        <div className="bg-white rounded-xl p-4 border border-gray-100 mb-6">
            <h3 className="font-bold text-lg text-primary mb-2">Moldes de Portada</h3>
            <p className="text-xs text-gray-500 mb-4">Subí tus marcos PNG con transparencia. Se usan en la previsualización.</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
                {covers.map((cover, idx) => (
                    <div key={idx} className="relative aspect-[9/16] bg-gray-100 rounded border overflow-hidden group">
                        <img src={cover} className="w-full h-full object-cover" alt={`Cover ${idx}`} />
                        <button 
                            onClick={() => removeCover(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                            ×
                        </button>
                    </div>
                ))}
                {covers.length < 3 && (
                    <button 
                        onClick={() => fileRef.current?.click()}
                        className="aspect-[9/16] bg-gray-50 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition"
                    >
                        <span className="text-2xl">+</span>
                        <span className="text-[10px]">Subir</span>
                    </button>
                )}
            </div>
            <input type="file" ref={fileRef} className="hidden" accept="image/png" onChange={handleUpload} />
        </div>
    );
};