import React, { useState, useEffect } from 'react';
import { PlannedPost } from '../types';
import { loadFromStorage } from '../lib/storage';

interface Props {
    post: PlannedPost;
    onClose: () => void;
}

export const PreviewModal: React.FC<Props> = ({ post, onClose }) => {
    // If post has a saved cover, start with it. Otherwise no cover (-1)
    const [activeCover, setActiveCover] = useState<string | null>(post.coverImage || null);
    
    // Legacy support: Load all covers to allow swapping if needed, though strictly we should stick to the saved one
    const [availableCovers, setAvailableCovers] = useState<string[]>([]);

    useEffect(() => {
        setAvailableCovers(loadFromStorage('fp_covers_v1', []));
    }, []);

    const toggleCover = () => {
        if (activeCover) {
            setActiveCover(null); // Turn off
        } else {
            // If post has a specific cover, restore it, otherwise pick first available
            setActiveCover(post.coverImage || availableCovers[0] || null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className={`bg-white rounded-2xl w-full overflow-hidden flex flex-col max-h-[90vh] transition-all
                    ${(post.format === 'REEL' || post.format === 'HISTORIA') ? 'max-w-xs h-[80vh]' : 'max-w-md h-auto'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Mock Header */}
                <div className="px-4 py-3 border-b flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">FP</div>
                        <span className="font-semibold text-sm">farmacia.pastor</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {(availableCovers.length > 0 || post.coverImage) && (
                            <button 
                                onClick={toggleCover}
                                className={`text-xs px-2 py-1 rounded font-bold transition-colors ${activeCover ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}
                            >
                                {activeCover ? 'Ocultar Portada' : 'Ver Portada'}
                            </button>
                        )}
                        <button onClick={onClose} className="text-gray-500 text-xl hover:text-red-500">×</button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
                    
                    {/* Render Image or Video */}
                    {post.generatedImageUrl ? (
                        post.mediaType === 'video' ? (
                            <video 
                                src={post.generatedImageUrl} 
                                controls={!activeCover} // Hide controls if cover is overlaying
                                autoPlay 
                                loop 
                                className="w-full h-full object-cover" 
                            />
                        ) : (
                            <img 
                                src={post.generatedImageUrl} 
                                alt="Preview" 
                                className={`w-full object-cover ${post.format === 'POST' ? 'aspect-square' : 'h-full'}`}
                            />
                        )
                    ) : (
                        <div className="text-white text-center p-8 opacity-50 flex flex-col items-center">
                            <span className="text-4xl mb-2">📷</span>
                            <span>Sin multimedia</span>
                        </div>
                    )}

                    {/* COVER OVERLAY */}
                    {activeCover && (
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            <img src={activeCover} className="w-full h-full object-fill" alt="Cover Overlay" />
                        </div>
                    )}

                    {/* Format Overlays (Reel UI fake) - Only if no cover active to avoid clutter */}
                    {post.format === 'REEL' && !activeCover && (
                        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none z-10">
                            <div className="flex items-end gap-2 text-white mb-8">
                                <div className="space-y-2">
                                    <div className="font-bold text-sm flex items-center gap-1">
                                        farmacia.pastor <span className="text-[10px] bg-white/20 px-1 rounded">Seguir</span>
                                    </div>
                                    <div className="text-xs line-clamp-2 opacity-90">{post.copy}</div>
                                    <div className="flex items-center gap-1 text-[10px] opacity-70">
                                        <span>♫ Audio original</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-2 bottom-20 flex flex-col gap-4 items-center text-white">
                                <div className="flex flex-col items-center"><span className="text-xl">♥</span><span className="text-[10px]">1.2k</span></div>
                                <div className="flex flex-col items-center"><span className="text-xl">💬</span><span className="text-[10px]">34</span></div>
                                <div className="flex flex-col items-center"><span className="text-xl">✈</span></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer only for POST */}
                {post.format === 'POST' && (
                    <div className="p-4 bg-white shrink-0 max-h-[30vh] overflow-y-auto">
                        <div className="flex gap-4 mb-2">
                            <span className="text-2xl cursor-pointer hover:text-red-500">♡</span>
                            <span className="text-2xl">💬</span>
                            <span className="text-2xl">✈</span>
                        </div>
                        <div className="text-sm">
                            <p className="mb-1"><span className="font-bold mr-2">farmacia.pastor</span>{post.copy}</p>
                            <p className="text-blue-900 text-xs mt-1">{post.hashtags}</p>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Side Panel for Script */}
            {post.reelScript && (
                 <div className="hidden lg:block ml-4 bg-white rounded-xl p-6 w-80 h-[80vh] overflow-y-auto">
                    <h3 className="font-bold text-lg mb-4 text-primary">Guion del Reel</h3>
                    <div className="space-y-4">
                        <div className="bg-purple-50 p-3 rounded">
                            <label className="text-[10px] uppercase font-bold text-purple-700">Gancho</label>
                            <p className="text-sm font-medium">{post.reelScript.hook}</p>
                        </div>
                        <div className="space-y-3">
                            {post.reelScript.scenes.map(s => (
                                <div key={s.sceneNumber} className="border-l-2 border-primary pl-3">
                                    <span className="text-xs font-bold text-gray-500">Escena {s.sceneNumber} ({s.durationSec}s)</span>
                                    <p className="text-xs mt-1 text-gray-800">{s.actions}</p>
                                    <p className="text-xs mt-1 text-gray-500 italic">"{s.voiceOver}"</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                            <label className="text-[10px] uppercase font-bold text-gray-500">CTA</label>
                            <p className="text-sm font-medium">{post.reelScript.cta}</p>
                        </div>
                    </div>
                 </div>
            )}
        </div>
    );
};