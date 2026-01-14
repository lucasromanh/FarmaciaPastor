import React, { useState, useEffect } from 'react';
import { PlannedPost } from '../types';
import { PlannerForm } from '../components/PlannerForm';
import { CalendarMonth } from '../components/CalendarMonth';
import { PostList } from '../components/PostList';
import { PaymentCard } from '../components/PaymentCard';
import { PreviewModal } from '../components/PreviewModal';
import { loadFromStorage, saveToStorage, storageKeys } from '../lib/storage';

interface Props {
    paletteIndex: number;
}

export const Dashboard: React.FC<Props> = ({ paletteIndex }) => {
    const [posts, setPosts] = useState<PlannedPost[]>([]);
    const [viewDate, setViewDate] = useState(new Date(2026, 0, 1)); // Start Jan 2026
    const [previewPost, setPreviewPost] = useState<PlannedPost | null>(null);
    const [selectedDateForForm, setSelectedDateForForm] = useState<string | undefined>(undefined);

    useEffect(() => {
        const stored = loadFromStorage(storageKeys.KEY_POSTS, []);
        setPosts(stored);
    }, []);

    const handleSavePost = (post: PlannedPost) => {
        const updated = [...posts, post];
        setPosts(updated);
        saveToStorage(storageKeys.KEY_POSTS, updated);
        setSelectedDateForForm(undefined); // Reset selection
    };

    const handleDeletePost = (id: string) => {
        const updated = posts.filter(p => p.id !== id);
        setPosts(updated);
        saveToStorage(storageKeys.KEY_POSTS, updated);
    };

    const handleApprovePost = (id: string) => {
        const updated = posts.map(p => 
            p.id === id ? { ...p, status: 'APPROVED' as const } : p
        );
        setPosts(updated);
        saveToStorage(storageKeys.KEY_POSTS, updated);
    };

    const handleNavigate = (dir: -1 | 1) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + dir, 1);
        setViewDate(newDate);
    };

    const handleCalendarDayClick = (dateStr: string, existingPost?: PlannedPost) => {
        if (existingPost) {
            // "Entrar a ver"
            setPreviewPost(existingPost);
        } else {
            // "Crear borrador"
            setSelectedDateForForm(dateStr);
            // Scroll to form smoothly
            document.getElementById('planner-form')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Find last post date for suggestion
    const lastDate = posts.length > 0 
        ? posts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date 
        : '2026-01-12'; // Default start

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20">
            {/* Payment Notification */}
            <PaymentCard />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Column: Form & Calendar */}
                <div className="xl:col-span-8 space-y-10">
                    <PlannerForm 
                        lastDate={lastDate} 
                        selectedDate={selectedDateForForm}
                        onSave={handleSavePost} 
                        paletteIndex={paletteIndex}
                    />
                    
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-2xl text-primary">Calendario 2026</h3>
                            <div className="text-sm text-gray-500">Vista Mensual</div>
                        </div>
                        <CalendarMonth 
                            posts={posts} 
                            year={viewDate.getFullYear()} 
                            month={viewDate.getMonth()} 
                            onNavigate={handleNavigate}
                            onDayClick={handleCalendarDayClick}
                        />
                    </div>
                </div>

                {/* Right Column: List */}
                <div className="xl:col-span-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 h-full">
                        <h3 className="font-bold text-xl mb-4 text-primary flex items-center gap-2">
                            <span>Próximas Publicaciones</span>
                            <span className="text-xs bg-white border px-2 py-0.5 rounded-full text-gray-500 font-normal">
                                {posts.filter(p => p.status === 'APPROVED').length} Aprobadas
                            </span>
                        </h3>
                        <div className="max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                            <PostList 
                                posts={posts} 
                                onPreview={setPreviewPost} 
                                onDelete={handleDeletePost}
                                onApprove={handleApprovePost}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {previewPost && (
                <PreviewModal 
                    post={previewPost} 
                    onClose={() => setPreviewPost(null)} 
                />
            )}
        </div>
    );
};