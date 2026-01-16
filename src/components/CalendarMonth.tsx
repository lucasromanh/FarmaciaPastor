import React from 'react';
import { PlannedPost } from '../types';

interface Props {
    posts: PlannedPost[];
    year: number;
    month: number; // 0-11
    onNavigate: (direction: -1 | 1) => void;
    onDayClick: (dateStr: string, existingPost?: PlannedPost) => void;
}

export const CalendarMonth: React.FC<Props> = ({ posts, year, month, onNavigate, onDayClick }) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    
    const monthName = new Date(year, month).toLocaleString('es-ES', { month: 'long', year: 'numeric' });

    const getPostForDay = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return posts.find(p => p.date === dateStr);
    };

    const getFormatStyle = (post: PlannedPost) => {
        const isApproved = post.status === 'APPROVED';
        let base = "text-xs p-1.5 rounded-md font-bold truncate mb-1 shadow-sm border ";
        
        if (post.format === 'POST') base += isApproved ? "bg-blue-600 text-white border-blue-700" : "bg-blue-50 text-blue-800 border-blue-100";
        else if (post.format === 'REEL') base += isApproved ? "bg-purple-600 text-white border-purple-700" : "bg-purple-50 text-purple-800 border-purple-100";
        else base += isApproved ? "bg-orange-500 text-white border-orange-600" : "bg-orange-50 text-orange-800 border-orange-100";
        
        return base;
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b bg-white">
                <button onClick={() => onNavigate(-1)} className="p-3 hover:bg-gray-100 rounded-full transition text-gray-600 font-bold">←</button>
                <h3 className="font-bold text-xl capitalize text-gray-800 font-primary">{monthName}</h3>
                <button onClick={() => onNavigate(1)} className="p-3 hover:bg-gray-100 rounded-full transition text-gray-600 font-bold">→</button>
            </div>
            
            <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 py-3 bg-gray-50 border-b">
                <div>DOM</div><div>LUN</div><div>MAR</div><div>MIE</div><div>JUE</div><div>VIE</div><div>SAB</div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 border-b border-gray-200">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-gray-50/50 min-h-[120px]"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const post = getPostForDay(day);
                    const isPayDay = day === 12;

                    return (
                        <div 
                            key={day} 
                            onClick={() => onDayClick(dateStr, post)}
                            className="bg-white min-h-[120px] p-2 relative hover:bg-gray-50 transition group flex flex-col cursor-pointer active:bg-gray-100"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-sm font-bold ${isPayDay ? 'text-accent' : 'text-gray-400 group-hover:text-primary'}`}>
                                    {day}
                                </span>
                                {isPayDay && <span className="text-xs" title="Pago CM">💳</span>}
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-end">
                                {post ? (
                                    <div className={getFormatStyle(post)}>
                                        <div className="flex justify-between items-center">
                                            <span>{post.format[0]}</span>
                                            {post.status !== 'APPROVED' && <span className="text-[9px] opacity-75">⏳</span>}
                                        </div>
                                        <div className="font-normal truncate text-[10px] leading-tight mt-0.5">{post.theme}</div>
                                    </div>
                                ) : (
                                    <div className="hidden group-hover:flex items-center justify-center h-full opacity-50">
                                        <span className="text-2xl text-gray-300">+</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="p-2 text-center text-xs text-gray-400 bg-gray-50">
                Referencias: <span className="text-blue-500 font-bold">Post</span> • <span className="text-purple-500 font-bold">Reel</span> • <span className="text-orange-500 font-bold">Historia</span> | Click para editar/crear
            </div>
        </div>
    );
};