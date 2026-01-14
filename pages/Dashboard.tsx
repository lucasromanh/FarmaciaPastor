import React, { useState, useEffect } from 'react';
import { PlannedPost, BrandInfo } from '../types';
import { PlannerForm } from '../components/PlannerForm';
import { CalendarMonth } from '../components/CalendarMonth';
import { PostList } from '../components/PostList';
import { PaymentCard } from '../components/PaymentCard';
import { PreviewModal } from '../components/PreviewModal';
import { BriefSection } from '../components/BriefSection';
import { PendingList } from '../components/PendingList';
import { CoverManager } from '../components/CoverManager';
import { RecordingPlan } from '../components/RecordingPlan';
import { loadFromStorage, saveToStorage, storageKeys } from '../lib/storage';
import { INITIAL_SCHEDULE } from '../lib/initialData';

interface Props {
    paletteIndex: number;
    brandInfo: BrandInfo;
}

export const Dashboard: React.FC<Props> = ({ paletteIndex, brandInfo }) => {
    const [posts, setPosts] = useState<PlannedPost[]>([]);
    const [viewDate, setViewDate] = useState(new Date(2026, 0, 1)); // Start Jan 2026
    const [previewPost, setPreviewPost] = useState<PlannedPost | null>(null);
    const [selectedDateForForm, setSelectedDateForForm] = useState<string | undefined>(undefined);
    
    // State to control Brief layout
    const [briefExpanded, setBriefExpanded] = useState(false);
    
    // Edit Mode State
    const [editingPost, setEditingPost] = useState<PlannedPost | null>(null);

    useEffect(() => {
        let stored = loadFromStorage(storageKeys.KEY_POSTS, []);
        
        // Auto-load initial schedule if empty
        if (stored.length === 0) {
            stored = INITIAL_SCHEDULE;
            saveToStorage(storageKeys.KEY_POSTS, stored);
        }
        
        setPosts(stored);
    }, []);

    const handleSavePost = (post: PlannedPost) => {
        // Check if updating existing post
        const existingIndex = posts.findIndex(p => p.id === post.id);
        
        let updatedPosts;
        if (existingIndex >= 0) {
            updatedPosts = [...posts];
            updatedPosts[existingIndex] = post;
        } else {
            updatedPosts = [...posts, post];
        }

        setPosts(updatedPosts);
        saveToStorage(storageKeys.KEY_POSTS, updatedPosts);
        
        // Reset states
        setSelectedDateForForm(undefined); 
        setEditingPost(null);
    };

    const handleDeletePost = (id: string) => {
        if (confirm("¿Estás seguro de borrar esta publicación?")) {
            const updated = posts.filter(p => p.id !== id);
            setPosts(updated);
            saveToStorage(storageKeys.KEY_POSTS, updated);
            if (editingPost?.id === id) setEditingPost(null);
        }
    };

    const handleApprovePost = (id: string) => {
        const updated = posts.map(p => 
            p.id === id ? { ...p, status: 'APPROVED' as const } : p
        );
        setPosts(updated);
        saveToStorage(storageKeys.KEY_POSTS, updated);
    };

    const handleEditPost = (post: PlannedPost) => {
        setEditingPost(post);
        // Scroll to form
        document.getElementById('planner-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleNavigate = (dir: -1 | 1) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + dir, 1);
        setViewDate(newDate);
    };

    const handleCalendarDayClick = (dateStr: string, existingPost?: PlannedPost) => {
        if (existingPost) {
            setPreviewPost(existingPost);
        } else {
            setSelectedDateForForm(dateStr);
            setEditingPost(null); // Ensure we are not editing old post when clicking new date
            document.getElementById('planner-form')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Find last post date for suggestion
    const lastDate = posts.length > 0 
        ? posts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date 
        : '2026-02-11'; // Default based on initial schedule

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 pb-20">
            {/* Top Info Area: Layout shifts based on Brief Expansion */}
            <div className={`grid gap-6 mb-2 transition-all duration-300 ${briefExpanded ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                {/* Payment Card Container - Constrain width if Brief is expanded to avoid ugly stretching */}
                <div className={`${briefExpanded ? 'w-full md:w-1/2' : 'w-full'}`}>
                    <PaymentCard />
                </div>
                
                {/* Brief Section - Takes full width if expanded */}
                <div className="w-full">
                    <BriefSection 
                        expanded={briefExpanded} 
                        onToggle={() => setBriefExpanded(!briefExpanded)} 
                    />
                </div>
            </div>

            {/* Monthly Recording Plan (Editable) */}
            <RecordingPlan />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Column: Form & Calendar */}
                <div className="xl:col-span-8 space-y-10">
                    <PlannerForm 
                        lastDate={lastDate} 
                        selectedDate={selectedDateForForm}
                        onSave={handleSavePost} 
                        paletteIndex={paletteIndex}
                        postToEdit={editingPost}
                        onCancelEdit={() => setEditingPost(null)}
                        brandInfo={brandInfo}
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

                {/* Right Column: List & Helpers */}
                <div className="xl:col-span-4 space-y-6">
                    {/* Management Tools */}
                    <PendingList />
                    <CoverManager />

                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 h-fit">
                        <h3 className="font-bold text-xl mb-4 text-primary flex flex-col gap-1">
                            <span>Cronograma de Publicaciones</span>
                            <span className="text-[10px] text-gray-400 font-normal">Próximas publicaciones</span>
                        </h3>
                        <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            <PostList 
                                posts={posts} 
                                onPreview={setPreviewPost} 
                                onDelete={handleDeletePost}
                                onApprove={handleApprovePost}
                                onEdit={handleEditPost}
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