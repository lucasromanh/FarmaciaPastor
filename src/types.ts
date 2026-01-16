
export type SocialFormat = 'POST' | 'REEL' | 'HISTORIA';
export type PostStatus = 'PLANNED' | 'APPROVED' | 'DONE' | 'SKIPPED';
export type CopyTone = 'TRADICIONAL' | 'CERCANO' | 'PROFESIONAL' | 'URGENTE';

export interface ReelScene {
    sceneNumber: number;
    durationSec: number;
    shotType: string;
    onScreenText: string;
    voiceOver: string;
    actions: string;
}

export interface ReelScript {
    setup?: string; 
    hook: string;
    scenes: ReelScene[];
    cta: string;
}

export interface PlannedPost {
    id: string;
    date: string; // YYYY-MM-DD
    format: SocialFormat;
    theme: string;
    objective: string;
    copy: string;
    hashtags: string;
    generatedImageUrl?: string;
    coverImage?: string; // New: Optional selected cover overlay
    mediaType?: 'image' | 'video';
    reelScript?: ReelScript;
    status: PostStatus;
}

export interface PendingItem {
    id: string;
    text: string;
    completed: boolean;
    assignedTo?: string; // e.g., 'Karen'
}

export interface RecordingPlanItem {
    id: string;
    title: string; // e.g. "Enero 2026"
    content: string;
    dateArchived: string;
}

export interface BrandPalette {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        bg: string;
        surface: string;
        text: string;
    };
}

export interface BrandInfo {
    name: string;
    tagline: string;
    logo: string | null; // Base64 string
    whatsapp: string;
    phone: string;
    email: string;
    address: string;
}

export interface Topic {
    id: string;
    category: string;
    title: string;
    suggestedFormats: SocialFormat[];
    objectives: string[];
    reelAngles: string[];
    copyTemplates: string[];
}
