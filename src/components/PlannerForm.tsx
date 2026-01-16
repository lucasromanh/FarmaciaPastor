import React, { useState, useEffect, useRef } from 'react';
import { PlannedPost, SocialFormat, ReelScene, CopyTone, BrandInfo } from '../types';
import { TOPICS } from '../content/topics';
import { generateSmartContent, suggestNextDate, generatePublicAIImage } from '../lib/aiFree';
import { generateFlyerImage } from '../lib/flyerCanvas';
import { addBrandWatermark, loadImageWithTimeout } from '../lib/imageProcessor';
import { uploadToCloudinary } from '../lib/cloudinary';
import { Modal, LoadingModal } from './Modal';
import { PALETTES } from '../brand/palettes';
import { loadFromStorage } from '../lib/storage';

interface Props {
    lastDate: string;
    selectedDate?: string;
    onSave: (post: PlannedPost) => void;
    paletteIndex: number;
    postToEdit?: PlannedPost | null;
    onCancelEdit?: () => void;
    brandInfo: BrandInfo;
}

export const PlannerForm: React.FC<Props> = ({ lastDate, selectedDate, onSave, paletteIndex, postToEdit, onCancelEdit, brandInfo }) => {
    const suggestedDate = suggestNextDate(lastDate);
    
    // Form Inputs
    const [date, setDate] = useState(suggestedDate);
    const [initialFormat, setInitialFormat] = useState<SocialFormat>('POST');
    
    // Default topic
    const [selectedTopicId, setSelectedTopicId] = useState(TOPICS.length > 1 ? TOPICS[1].id : TOPICS[0].id);
    const [customTopicText, setCustomTopicText] = useState("");
    
    // TONE SELECTOR
    const [selectedTone, setSelectedTone] = useState<CopyTone>('TRADICIONAL');

    // UI Effects
    const [highlightForm, setHighlightForm] = useState(false);
    
    // Draft State
    const [isGenerating, setIsGenerating] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [draft, setDraft] = useState<PlannedPost | null>(null);
    
    // Modals state
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'info' | 'error' | 'warning' | 'success';
    }>({ isOpen: false, title: '', message: '', type: 'info' });
    
    const [loadingMessage, setLoadingMessage] = useState('');
    
    // Covers
    const [availableCovers, setAvailableCovers] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dateInputRef = useRef<HTMLInputElement>(null);

    // --- EFFECTS ---
    
    // Load Covers
    useEffect(() => {
        setAvailableCovers(loadFromStorage('fp_covers_v1', []));
    }, [draft]); // Reload when draft opens/changes to ensure freshness

    // Highlight when clicking calendar
    useEffect(() => {
        if (selectedDate) {
            setDate(selectedDate);
            setHighlightForm(true);
            setTimeout(() => setHighlightForm(false), 1500);
        }
    }, [selectedDate]);

    // Populate form when editing
    useEffect(() => {
        if (postToEdit) {
            setDraft(postToEdit);
            setDate(postToEdit.date);
            // We don't set initialFormat/Topic here because the Draft view takes over immediately
        } else {
            setDraft(null); // Reset if edit mode is cleared externally
        }
    }, [postToEdit]);


    // --- Helpers ---
    const getTopicTitle = () => {
        const topic = TOPICS.find(t => t.id === selectedTopicId)!;
        return (selectedTopicId === 'custom_topic' && customTopicText) ? customTopicText : topic.title;
    };

    const isCustomAndEmpty = selectedTopicId === 'custom_topic' && !customTopicText.trim();

    // --- 3 CREATION PATHS (Only for New Posts) ---

    // 1. Full AI Generation
    const handleFullAuto = async () => {
        if (isCustomAndEmpty) return;
        setIsGenerating(true);
        setImageLoading(true);
        setLoadingMessage('Generando imagen con IA...');

        try {
            const title = getTopicTitle();
            
            // Generate Text & Script with TONE
            const content = await generateSmartContent(selectedTopicId, initialFormat, customTopicText, selectedTone, brandInfo);
            
            // Generate REAL AI Image (base)
            const baseImageUrl = generatePublicAIImage(title, initialFormat);
            
            // Esperar a que cargue y agregar marca (30 segundos timeout)
            await loadImageWithTimeout(baseImageUrl, 30000);
            const finalImageUrl = await addBrandWatermark(baseImageUrl, brandInfo);

            const newPost: PlannedPost = {
                id: Date.now().toString(),
                date,
                format: initialFormat,
                theme: title,
                objective: 'IA Generativa',
                copy: content.copy,
                hashtags: content.hashtags,
                reelScript: content.reelScript,
                status: 'PLANNED',
                generatedImageUrl: finalImageUrl,
                mediaType: 'image'
            };

            setDraft(newPost);
            setIsGenerating(false);
            setImageLoading(false);
            setLoadingMessage('');
        } catch (error: any) {
            console.error('Error en generación:', error);
            setModalState({
                isOpen: true,
                title: 'Problema con la imagen',
                message: error.message || 'La imagen tardó demasiado en cargar (más de 30 segundos). Puedes intentar de nuevo o subir una imagen propia.',
                type: 'warning'
            });
            setIsGenerating(false);
            setImageLoading(false);
            setLoadingMessage('');
        }
    };

    // 2. Upload Content
    const handleUploadMode = async () => {
        if (isCustomAndEmpty) return;
        setIsGenerating(true);
        const title = getTopicTitle();

        // Generate Text ONLY (AI)
        const content = await generateSmartContent(selectedTopicId, initialFormat, customTopicText, selectedTone, brandInfo);

        const newPost: PlannedPost = {
            id: Date.now().toString(),
            date,
            format: initialFormat,
            theme: title,
            objective: 'Contenido Propio',
            copy: content.copy,
            hashtags: content.hashtags,
            reelScript: undefined,
            status: 'PLANNED',
            generatedImageUrl: '',
            mediaType: initialFormat === 'REEL' ? 'video' : 'image'
        };

        setDraft(newPost);
        setIsGenerating(false);
        setTimeout(() => fileInputRef.current?.click(), 100);
    };

    // 3. Scripting Mode
    const handleScriptMode = () => {
        if (isCustomAndEmpty) return;
        const title = getTopicTitle();
        
        const emptyScript = {
            setup: 'Preparar buena iluminación y limpiar la lente de la cámara.',
            hook: '',
            scenes: [
                { sceneNumber: 1, durationSec: 3, shotType: 'Plano Medio', onScreenText: title, voiceOver: '', actions: 'Intro del tema' },
                { sceneNumber: 2, durationSec: 5, shotType: '', onScreenText: '', voiceOver: '', actions: '' },
                { sceneNumber: 3, durationSec: 4, shotType: '', onScreenText: '', voiceOver: '', actions: '' },
            ],
            cta: 'Seguinos para más'
        };

        const newPost: PlannedPost = {
            id: Date.now().toString(),
            date,
            format: initialFormat,
            theme: title,
            objective: 'Guion Planificado',
            copy: '',
            hashtags: '',
            reelScript: emptyScript,
            status: 'PLANNED',
            generatedImageUrl: '', 
            mediaType: 'image'
        };

        setDraft(newPost);
    };

    // --- Draft Actions ---

    const handleUpdateDraft = (field: keyof PlannedPost, value: any) => {
        if (!draft) return;
        setDraft({ ...draft, [field]: value });
    };

    // Regenerate Text
    const handleRegenerateText = async () => {
        if (!draft) return;
        setIsGenerating(true);
        // Uses currently selected tone
        const content = await generateSmartContent(selectedTopicId, draft.format, customTopicText, selectedTone, brandInfo);
        setDraft({ ...draft, copy: content.copy, hashtags: content.hashtags });
        setIsGenerating(false);
    };
    
    // Regenerate Image ONLY
    const handleRegenerateImage = async () => {
        if (!draft) return;
        setImageLoading(true);
        setLoadingMessage('Generando nueva imagen...');
        
        try {
            const title = getTopicTitle();
            const baseImageUrl = generatePublicAIImage(title, draft.format);
            
            // Esperar a que la imagen cargue (30 segundos timeout)
            await loadImageWithTimeout(baseImageUrl, 30000);
            
            // Agregar marca de agua con logo/nombre
            const finalImageUrl = await addBrandWatermark(baseImageUrl, brandInfo);
            
            setDraft({ ...draft, generatedImageUrl: finalImageUrl });
            setImageLoading(false);
            setLoadingMessage('');
        } catch (error: any) {
            console.error('Error generando imagen:', error);
            setModalState({
                isOpen: true,
                title: 'Problema con la imagen',
                message: error.message || 'La imagen tardó más de 30 segundos. Intenta nuevamente o sube una imagen propia.',
                type: 'warning'
            });
            setImageLoading(false);
            setLoadingMessage('');
        }
    };

    // Generate Script Only
    const handleGenerateScriptOnly = async () => {
        if (!draft) return;
        setIsGenerating(true);
        const content = await generateSmartContent(selectedTopicId, 'REEL', customTopicText, selectedTone, brandInfo);
        if (content.reelScript) {
            setDraft({ ...draft, reelScript: content.reelScript });
        }
        setIsGenerating(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && draft) {
            const isVideo = file.type.startsWith('video/');
            
            // Mostrar loading
            setLoadingMessage(isVideo ? 'Subiendo video a la nube...' : 'Subiendo imagen...');
            
            try {
                if (!isVideo) {
                    // Imágenes: subir a Cloudinary
                    const cloudinaryUrl = await uploadToCloudinary(file);
                    setDraft({ ...draft, generatedImageUrl: cloudinaryUrl, mediaType: 'image' });
                } else {
                    // Videos: subir a Cloudinary
                    const cloudinaryUrl = await uploadToCloudinary(file);
                    setDraft({ ...draft, generatedImageUrl: cloudinaryUrl, mediaType: 'video' });
                }
                setLoadingMessage('');
            } catch (error) {
                console.error('Error subiendo archivo:', error);
                setLoadingMessage('');
                setModalState({
                    isOpen: true,
                    title: 'Error al subir',
                    message: 'No se pudo subir el archivo a la nube. Inténtalo de nuevo.',
                    type: 'error'
                });
            }
        }
    };

    // Update helpers for scenes...
    const updateScene = (index: number, field: keyof ReelScene, value: any) => {
        if (!draft || !draft.reelScript) return;
        const newScenes = [...draft.reelScript.scenes];
        newScenes[index] = { ...newScenes[index], [field]: value };
        setDraft({ ...draft, reelScript: { ...draft.reelScript, scenes: newScenes } });
    };

    const addScene = () => {
        if (!draft || !draft.reelScript) return;
        const nextNum = draft.reelScript.scenes.length + 1;
        const newScene: ReelScene = { sceneNumber: nextNum, durationSec: 3, shotType: '', onScreenText: '', voiceOver: '', actions: '' };
        setDraft({ ...draft, reelScript: { ...draft.reelScript, scenes: [...draft.reelScript.scenes, newScene] } });
    };

    const removeScene = (index: number) => {
        if (!draft || !draft.reelScript) return;
        const newScenes = draft.reelScript.scenes.filter((_, i) => i !== index);
        const renumbered = newScenes.map((s, i) => ({ ...s, sceneNumber: i + 1 }));
        setDraft({ ...draft, reelScript: { ...draft.reelScript, scenes: renumbered } });
    };

    const handleConfirm = (approved: boolean) => {
        if (!draft) return;
        onSave({ ...draft, status: approved ? 'APPROVED' : 'PLANNED' });
        setDraft(null);
        if (!postToEdit && !selectedDate) {
             setDate(suggestNextDate(draft.date));
        }
    };
    
    const handleDiscard = () => {
        setDraft(null);
        if (postToEdit && onCancelEdit) {
            onCancelEdit();
        }
    };

    // --- RENDER DRAFT EDITOR ---
    if (draft) {
        return (
            <div className={`bg-white p-6 rounded-xl shadow-lg border-2 mb-8 animate-in fade-in slide-in-from-bottom-4 ${postToEdit ? 'border-orange-200 ring-2 ring-orange-100' : 'border-primary/10'}`}>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-primary">
                            {postToEdit ? '✏️ Editando Publicación' : 'Editor de Publicación'}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Tema:</span>
                             <input 
                                type="text" 
                                value={draft.theme}
                                onChange={(e) => setDraft({...draft, theme: e.target.value})}
                                className="font-bold text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-transparent hover:border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>
                    
                    {/* Date and Format */}
                    <div className="flex items-center gap-2">
                         <input 
                            type="date" 
                            value={draft.date}
                            onChange={(e) => setDraft({...draft, date: e.target.value})}
                            className="bg-white border border-gray-200 text-gray-700 font-bold text-sm py-1 px-2 rounded focus:ring-2 focus:ring-primary outline-none"
                        />

                        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border">
                            <select 
                                value={draft.format}
                                onChange={(e) => setDraft({...draft, format: e.target.value as SocialFormat})}
                                className="bg-white border-gray-200 text-primary font-bold text-sm py-1 pl-2 pr-8 rounded focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                            >
                                <option value="POST">POST</option>
                                <option value="REEL">REEL</option>
                                <option value="HISTORIA">STORY</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* LEFT COLUMN: Visuals */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-500 uppercase">Multimedia y Portada</label>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*,video/*" 
                                onChange={handleFileUpload}
                            />
                            <div className="flex gap-2">
                                <button 
                                    onClick={handleRegenerateImage} 
                                    disabled={imageLoading}
                                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                                >
                                    <span>↻</span> {imageLoading ? 'Cargando...' : 'Nueva Imagen IA'}
                                </button>
                                <button 
                                    onClick={() => fileInputRef.current?.click()} 
                                    className="text-xs bg-gray-800 text-white px-3 py-1.5 rounded hover:bg-gray-700 flex items-center gap-2 transition-colors shadow-sm"
                                >
                                    <span>⬆</span> Subir Propia
                                </button>
                            </div>
                        </div>
                        
                        <div className={`rounded-lg overflow-hidden border bg-gray-900 shadow-inner relative group mx-auto transition-all duration-300
                            ${draft.format === 'POST' ? 'aspect-square w-full' : 'aspect-[9/16] w-64'}`}
                        >
                            {/* Loading Overlay */}
                            {imageLoading && (
                                <div className="absolute inset-0 z-20 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mb-2"></div>
                                    <span className="text-xs font-bold animate-pulse">Creando Imagen...</span>
                                </div>
                            )}

                            {/* Base Media */}
                            {draft.generatedImageUrl ? (
                                draft.mediaType === 'video' ? (
                                    <video src={draft.generatedImageUrl} controls className="w-full h-full object-cover" />
                                ) : (
                                    <img 
                                        src={draft.generatedImageUrl} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover" 
                                        onLoad={() => setImageLoading(false)}
                                    />
                                )
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100">
                                    <span className="text-4xl mb-2">📷</span>
                                    <span className="text-sm text-center px-4 font-medium text-gray-400">
                                        Subí tu archivo o<br/>usá Generar IA
                                    </span>
                                </div>
                            )}

                            {/* COVER OVERLAY */}
                            {draft.coverImage && (
                                <div className="absolute inset-0 z-10 pointer-events-none">
                                    <img src={draft.coverImage} alt="Cover Overlay" className="w-full h-full object-fill" />
                                </div>
                            )}
                        </div>

                        {/* COVER SELECTOR */}
                        {availableCovers.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Seleccionar Portada (Overlay)</label>
                                <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                                    <button 
                                        onClick={() => setDraft({...draft, coverImage: undefined})}
                                        className={`shrink-0 w-12 h-20 flex items-center justify-center border-2 rounded text-[10px] font-bold transition-all
                                            ${!draft.coverImage ? 'border-primary bg-white text-primary' : 'border-gray-200 text-gray-400 hover:bg-gray-100'}`}
                                    >
                                        Sin
                                    </button>
                                    {availableCovers.map((cover, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setDraft({...draft, coverImage: cover})}
                                            className={`shrink-0 w-12 h-20 border-2 rounded overflow-hidden transition-all relative
                                                ${draft.coverImage === cover ? 'border-primary ring-1 ring-primary' : 'border-transparent hover:border-gray-300'}`}
                                        >
                                            <img src={cover} className="w-full h-full object-cover" alt="Cover opt" />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[9px] text-gray-400 mt-1 italic text-right">Gestionar en "Moldes de Portada" →</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Text & Details */}
                    <div className="space-y-6">
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                            {/* Tone Selector & Actions */}
                            <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
                                <label className="text-xs font-bold text-blue-800 uppercase">Copy (IA)</label>
                                
                                <div className="flex items-center gap-2">
                                    <select 
                                        value={selectedTone}
                                        onChange={(e) => setSelectedTone(e.target.value as CopyTone)}
                                        className="text-[10px] p-1 rounded border border-blue-200 bg-white text-blue-800 font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                                    >
                                        <option value="TRADICIONAL">🏛️ Tradicional</option>
                                        <option value="CERCANO">👋 Cercano</option>
                                        <option value="PROFESIONAL">🩺 Profesional</option>
                                        <option value="URGENTE">⚠️ Urgente</option>
                                    </select>

                                    <button 
                                        onClick={handleRegenerateText}
                                        disabled={isGenerating}
                                        className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1.5 rounded hover:bg-blue-200 font-bold flex items-center gap-1 transition-colors"
                                    >
                                        {isGenerating ? 'Generando...' : '↻ Reescribir'}
                                    </button>
                                </div>
                            </div>

                            <textarea 
                                value={draft.copy}
                                onChange={(e) => handleUpdateDraft('copy', e.target.value)}
                                placeholder="El texto se generará automáticamente o podés escribirlo..."
                                className="w-full p-3 border rounded-lg text-sm h-64 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 shadow-sm resize-none"
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Hashtags</label>
                            <input 
                                type="text"
                                value={draft.hashtags}
                                onChange={(e) => handleUpdateDraft('hashtags', e.target.value)}
                                className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none bg-white text-gray-600 shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* FULL WIDTH SCRIPT EDITOR */}
                {(draft.format === 'REEL' || draft.reelScript) && (
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 mb-8 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-purple-200 pb-4 gap-4">
                            <div>
                                <h4 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                                    🎬 Guion de Grabación (Reel / Video)
                                </h4>
                                <p className="text-xs text-purple-700 mt-1">Planificá toma por toma para no olvidarte nada.</p>
                            </div>
                            <button 
                                onClick={handleGenerateScriptOnly}
                                disabled={isGenerating}
                                className="text-xs bg-purple-200 text-purple-900 px-3 py-2 rounded-lg hover:bg-purple-300 font-bold flex items-center gap-2 transition-colors shadow-sm"
                            >
                                {isGenerating ? '...' : '✨ Generar Escenas con IA'}
                            </button>
                        </div>
                        
                        {/* If script object doesn't exist but it's a REEL, show a button to init it manually if AI wasn't used */}
                        {!draft.reelScript && (
                            <div className="text-center py-4">
                                <button 
                                    onClick={() => setDraft({...draft, reelScript: { hook: '', scenes: [], cta: '' }})}
                                    className="bg-white border border-purple-300 text-purple-700 px-4 py-2 rounded font-bold"
                                >
                                    Crear Guion Manualmente
                                </button>
                            </div>
                        )}

                        {draft.reelScript && (
                            <>
                                {/* SETUP SECTION */}
                                <div className="mb-6 bg-white p-4 rounded-lg border border-purple-100">
                                    <label className="text-xs font-bold text-purple-800 uppercase block mb-2">
                                        🛠️ Setup / Antes de Grabar (Contexto)
                                    </label>
                                    <textarea
                                        placeholder="Ej: Usar trípode, luz frente a ventana, preparar el producto X sobre la mesa..."
                                        value={draft.reelScript.setup || ''}
                                        onChange={(e) => setDraft({...draft, reelScript: {...draft.reelScript!, setup: e.target.value}})}
                                        className="w-full p-3 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none h-20 resize-none"
                                    />
                                </div>

                                {/* GLOBAL HOOK & CTA */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Gancho (Texto en Pantalla)</label>
                                        <input 
                                            type="text" 
                                            value={draft.reelScript.hook}
                                            onChange={(e) => setDraft({...draft, reelScript: {...draft.reelScript!, hook: e.target.value}})}
                                            className="w-full p-3 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:ring-1 focus:ring-purple-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase block mb-1">CTA (Llamado a la acción final)</label>
                                        <input 
                                            type="text" 
                                            value={draft.reelScript.cta}
                                            onChange={(e) => setDraft({...draft, reelScript: {...draft.reelScript!, cta: e.target.value}})}
                                            className="w-full p-3 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:ring-1 focus:ring-purple-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* SCENES */}
                                <div className="space-y-4">
                                    {draft.reelScript.scenes.map((scene, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-xl border-l-4 border-purple-400 shadow-sm relative">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-sm font-bold bg-purple-100 text-purple-900 px-3 py-1 rounded-full border border-purple-200">
                                                    Escena {scene.sceneNumber}
                                                </span>
                                                <div className="flex items-center gap-3">
                                                     <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded border">
                                                        <label className="text-[10px] font-bold text-gray-500 uppercase">Duración:</label>
                                                        <input 
                                                            type="number" 
                                                            value={scene.durationSec}
                                                            onChange={(e) => updateScene(idx, 'durationSec', Number(e.target.value))}
                                                            className="w-12 p-1 bg-white text-gray-900 text-center font-bold text-sm outline-none rounded border border-gray-200" 
                                                        />
                                                        <span className="text-xs text-gray-500">seg</span>
                                                    </div>
                                                    <button onClick={() => removeScene(idx)} className="text-red-400 hover:text-red-600 font-bold px-2 py-1">Eliminar</button>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Visuals */}
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Encuadre / Plano</label>
                                                        <input 
                                                            type="text" 
                                                            placeholder="Ej: Plano medio, Detalle..."
                                                            value={scene.shotType}
                                                            onChange={(e) => updateScene(idx, 'shotType', e.target.value)}
                                                            className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:ring-1 focus:ring-purple-500 outline-none" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Acción Visual (Qué pasa)</label>
                                                        <textarea 
                                                            placeholder="Descripción de la acción..."
                                                            value={scene.actions}
                                                            onChange={(e) => updateScene(idx, 'actions', e.target.value)}
                                                            rows={2}
                                                            className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:ring-1 focus:ring-purple-500 outline-none resize-none" 
                                                        />
                                                    </div>
                                                </div>

                                                {/* Audio */}
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Texto en Pantalla (Opcional)</label>
                                                        <input 
                                                            type="text" 
                                                            placeholder="Títulos..."
                                                            value={scene.onScreenText}
                                                            onChange={(e) => updateScene(idx, 'onScreenText', e.target.value)}
                                                            className="w-full p-2 border border-gray-300 bg-white text-gray-900 rounded text-sm focus:ring-1 focus:ring-purple-500 outline-none" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Audio / Voz en Off (Qué se dice)</label>
                                                        <textarea 
                                                            placeholder="Guion hablado..."
                                                            value={scene.voiceOver}
                                                            onChange={(e) => updateScene(idx, 'voiceOver', e.target.value)}
                                                            rows={2}
                                                            className="w-full p-2 border border-purple-200 bg-purple-50/50 text-purple-900 rounded text-sm italic focus:ring-1 focus:ring-purple-500 outline-none resize-none" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={addScene}
                                        className="w-full py-3 border-2 border-dashed border-purple-300 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="text-xl">+</span> Agregar Nueva Escena
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex gap-3 mt-8 pt-4 border-t sticky bottom-0 bg-white z-10">
                    <button 
                        onClick={handleDiscard}
                        className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                    >
                        {postToEdit ? 'Cancelar Edición' : 'Descartar'}
                    </button>
                    <button 
                        onClick={() => handleConfirm(false)}
                        className="flex-1 py-3 px-4 rounded-lg border border-primary text-primary font-medium hover:bg-green-50 transition-colors"
                    >
                        {postToEdit ? 'Guardar Cambios' : 'Guardar Pendiente'}
                    </button>
                    <button 
                        onClick={() => handleConfirm(true)}
                        className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-bold shadow-md hover:shadow-lg hover:bg-green-800 transition-all"
                    >
                        ✓ {postToEdit ? 'Guardar y Aprobar' : 'Aprobar'}
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER INITIAL SELECTION ---
    return (
        <>
            <div 
                id="planner-form" 
                className={`bg-white p-6 rounded-xl shadow-sm border transition-all duration-500 mb-8 scroll-mt-24 
                    ${highlightForm ? 'border-yellow-400 ring-2 ring-yellow-200 shadow-yellow-100 scale-[1.01]' : 'border-gray-100'}`}
            >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-primary">Planificar Nuevo Contenido</h2>
                {highlightForm && <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded animate-pulse">Fecha Seleccionada</span>}
            </div>
            
            {/* FIXED LAYOUT: Date | Format | Topic */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* Date */}
                <div className="w-full md:w-1/4 relative">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Fecha</label>
                    <div className="relative">
                        <input 
                            ref={dateInputRef}
                            type="date" 
                            value={date} 
                            onChange={e => setDate(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-gray-800 font-medium bg-white cursor-pointer"
                        />
                        <button 
                            onClick={() => dateInputRef.current?.showPicker()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                        >
                            📅
                        </button>
                    </div>
                </div>

                {/* Format Selector (New) */}
                <div className="w-full md:w-1/4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Formato</label>
                    <select 
                        value={initialFormat}
                        onChange={e => setInitialFormat(e.target.value as SocialFormat)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none appearance-none bg-white text-gray-800 font-medium cursor-pointer"
                    >
                        <option value="POST">🖼️ Post</option>
                        <option value="REEL">🎬 Reel</option>
                        <option value="HISTORIA">⏱️ Historia</option>
                    </select>
                </div>

                {/* Topic */}
                <div className="w-full md:w-1/2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tema y Objetivo</label>
                    <select 
                        value={selectedTopicId}
                        onChange={e => setSelectedTopicId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none appearance-none bg-white text-gray-800 font-medium cursor-pointer"
                    >
                        {TOPICS.map(t => (
                            <option key={t.id} value={t.id}>{t.category} — {t.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Custom Topic Input */}
            {selectedTopicId === 'custom_topic' && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                    <input 
                        type="text"
                        value={customTopicText}
                        onChange={(e) => setCustomTopicText(e.target.value)}
                        placeholder="Ej: Caminata al aire libre, Sorteo..."
                        className="w-full p-3 border border-primary/50 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-blue-50/50 text-gray-800 placeholder-gray-400"
                        autoFocus
                    />
                </div>
            )}
            
            {/* Tone Selector Initial */}
            <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Tono de la Comunicación</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(['TRADICIONAL', 'CERCANO', 'PROFESIONAL', 'URGENTE'] as CopyTone[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setSelectedTone(t)}
                            className={`p-2 rounded-lg text-xs font-bold border transition-colors
                                ${selectedTone === t 
                                    ? 'bg-primary text-white border-primary' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {t === 'TRADICIONAL' && '🏛️ Tradicional'}
                            {t === 'CERCANO' && '👋 Cercano'}
                            {t === 'PROFESIONAL' && '🩺 Profesional'}
                            {t === 'URGENTE' && '⚠️ Urgente'}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3 Main Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* Option 1: Full AI */}
                <button 
                    onClick={handleFullAuto}
                    disabled={isCustomAndEmpty}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all group h-32
                        ${isCustomAndEmpty 
                            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed' 
                            : 'border-primary/10 bg-gradient-to-br from-white to-green-50 hover:to-green-100 hover:border-primary/30 cursor-pointer shadow-sm hover:shadow-md'
                        }`}
                >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">✨</span>
                    <span className={`font-bold text-sm ${isCustomAndEmpty ? 'text-gray-400' : 'text-primary'}`}>Generar Todo (IA)</span>
                    <span className="text-[10px] text-gray-500 mt-1 text-center">Copy, Foto Realista y Guion</span>
                </button>

                {/* Option 2: Upload + AI Text */}
                <button 
                    onClick={handleUploadMode}
                    disabled={isCustomAndEmpty}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all group h-32
                        ${isCustomAndEmpty 
                            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed' 
                            : 'border-primary/10 bg-white hover:bg-gray-50 hover:border-primary/30 cursor-pointer shadow-sm hover:shadow-md'
                        }`}
                >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">⬆️</span>
                    <span className={`font-bold text-sm ${isCustomAndEmpty ? 'text-gray-400' : 'text-gray-700'}`}>Ya tengo Video/Foto</span>
                    <span className="text-[10px] text-gray-500 mt-1 text-center">Subir + Texto con IA</span>
                </button>

                {/* Option 3: Scripting */}
                <button 
                    onClick={handleScriptMode}
                    disabled={isCustomAndEmpty}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all group h-32
                        ${isCustomAndEmpty 
                            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed' 
                            : 'border-primary/10 bg-white hover:bg-gray-50 hover:border-primary/30 cursor-pointer shadow-sm hover:shadow-md'
                        }`}
                >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</span>
                    <span className={`font-bold text-sm ${isCustomAndEmpty ? 'text-gray-400' : 'text-gray-700'}`}>Armar Guion</span>
                    <span className="text-[10px] text-gray-500 mt-1 text-center">Planificar Escenas</span>
                </button>
            </div>
            
            {isGenerating && (
                <div className="text-center mt-3 text-sm text-primary font-bold animate-pulse">
                    🤖 Generando contenido e imagen...
                </div>
            )}
            </div>
            
            {/* Modals */}
            <Modal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ ...modalState, isOpen: false })}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
            />
            
            <LoadingModal 
                isOpen={loadingMessage !== ''}
                message={loadingMessage}
            />
        </>
    );
};