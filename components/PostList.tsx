import React from 'react';
import { PlannedPost } from '../types';

interface Props {
    posts: PlannedPost[];
    onPreview: (post: PlannedPost) => void;
    onDelete: (id: string) => void;
    onApprove: (id: string) => void;
    onEdit: (post: PlannedPost) => void;
}

export const PostList: React.FC<Props> = ({ posts, onPreview, onDelete, onApprove, onEdit }) => {
    // Sort by date desc
    const sorted = [...posts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="space-y-4">
            {sorted.map(post => {
                const isApproved = post.status === 'APPROVED';
                
                return (
                    <div key={post.id} className={`bg-white p-4 rounded-xl shadow-sm border ${isApproved ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-100'} flex gap-4 transition-all`}>
                        {/* Thumbnail */}
                        <div 
                            className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden cursor-pointer hover:opacity-80 transition relative flex items-center justify-center"
                            onClick={() => onPreview(post)}
                        >
                            {/* Base Image/Video */}
                            {post.generatedImageUrl ? (
                                post.mediaType === 'video' ? (
                                    <video 
                                        src={post.generatedImageUrl} 
                                        className="w-full h-full object-cover" 
                                        muted 
                                        playsInline
                                    />
                                ) : (
                                    <img src={post.generatedImageUrl} className="w-full h-full object-cover" alt="Thumb" />
                                )
                            ) : (
                                <div className="text-xs text-gray-400 text-center px-1">
                                    {post.format === 'REEL' ? '🎬 Sin Video' : '📷 Sin Foto'}
                                </div>
                            )}

                            {/* Cover Overlay on Thumbnail */}
                            {post.coverImage && (
                                <div className="absolute inset-0 z-0">
                                    <img src={post.coverImage} className="w-full h-full object-cover opacity-90" alt="Cover" />
                                </div>
                            )}
                            
                            {/* Format Badge */}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-0.5 font-bold uppercase backdrop-blur-sm z-10">
                                {post.format}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-gray-500 font-bold font-secondary">{post.date}</span>
                                    {isApproved ? (
                                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                            ✓ APROBADA
                                        </span>
                                    ) : (
                                        <button 
                                            onClick={() => onApprove(post.id)}
                                            className="text-[10px] font-bold bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                                        >
                                            ⏳ PENDIENTE
                                        </button>
                                    )}
                                </div>
                                <h4 className="font-bold text-gray-800 truncate leading-tight">{post.theme}</h4>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{post.copy}</p>
                            </div>
                            
                            <div className="mt-3 flex gap-2 justify-end">
                                <button 
                                    onClick={() => onPreview(post)}
                                    className="text-xs text-gray-500 hover:text-gray-800 font-bold px-2 py-1 transition"
                                >
                                    Ver Detalle
                                </button>
                                <button 
                                    onClick={() => onEdit(post)}
                                    className="text-xs text-primary bg-green-50 hover:bg-green-100 font-bold px-2 py-1 rounded transition border border-green-200"
                                >
                                    ✎ Editar
                                </button>
                                <button 
                                    onClick={() => onDelete(post.id)}
                                    className="text-xs text-gray-400 hover:text-red-500 px-2 py-1"
                                >
                                    Borrar
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            
            {posts.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm">No hay publicaciones planificadas.</p>
                    <p className="text-gray-300 text-xs mt-1">Usa el formulario para crear una.</p>
                </div>
            )}
        </div>
    );
};