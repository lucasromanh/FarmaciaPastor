import React, { useState, useEffect } from 'react';
import { BrandHeader } from './components/BrandHeader';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { PALETTES } from './brand/palettes';
import { DEFAULT_BRAND } from './brand/brand';
import { loadFromStorage, saveToStorage, storageKeys } from './lib/storage';
import { BrandInfo, BrandPalette } from './types';

const App: React.FC = () => {
    const [view, setView] = useState<'dashboard' | 'settings'>('dashboard');
    
    // State for Brand Settings
    const [brandInfo, setBrandInfo] = useState<BrandInfo>(DEFAULT_BRAND);
    const [colors, setColors] = useState<BrandPalette['colors']>(PALETTES[0].colors);
    const [paletteIndex, setPaletteIndex] = useState(0); // Legacy index for dashboard logic if needed

    // Initialize Settings from Storage
    useEffect(() => {
        const savedSettings = loadFromStorage(storageKeys.KEY_SETTINGS, null);
        
        if (savedSettings) {
            if (savedSettings.brandInfo) setBrandInfo(savedSettings.brandInfo);
            if (savedSettings.colors) setColors(savedSettings.colors);
            if (savedSettings.paletteIndex !== undefined) setPaletteIndex(savedSettings.paletteIndex);
        }
    }, []);

    // Apply CSS Variables when colors change
    useEffect(() => {
        const root = document.documentElement;
        
        root.style.setProperty('--brand-primary', colors.primary);
        root.style.setProperty('--brand-secondary', colors.secondary);
        root.style.setProperty('--brand-accent', colors.accent);
        root.style.setProperty('--brand-bg', colors.bg);
        root.style.setProperty('--brand-surface', colors.surface);
        root.style.setProperty('--brand-text', colors.text);
    }, [colors]);

    // Save Settings whenever they change
    const updateSettings = (newInfo: BrandInfo, newColors: BrandPalette['colors'], newIdx: number) => {
        setBrandInfo(newInfo);
        setColors(newColors);
        setPaletteIndex(newIdx);

        saveToStorage(storageKeys.KEY_SETTINGS, {
            brandInfo: newInfo,
            colors: newColors,
            paletteIndex: newIdx
        });
    };

    const handleUpdateBrandInfo = (newInfo: BrandInfo) => {
        updateSettings(newInfo, colors, paletteIndex);
    };

    const handleUpdateColors = (newColors: BrandPalette['colors']) => {
        // If user manually edits colors, we effectively "detach" from a preset index, but we can keep index for reference or set to -1
        updateSettings(brandInfo, newColors, paletteIndex); 
    };

    return (
        <div className="min-h-screen font-primary">
            <BrandHeader 
                brand={brandInfo}
                openSettings={() => setView('settings')} 
                goHome={() => setView('dashboard')} 
            />
            
            <main>
                {view === 'dashboard' && <Dashboard paletteIndex={paletteIndex} />}
                {view === 'settings' && (
                    <Settings 
                        brandInfo={brandInfo}
                        onUpdateBrandInfo={handleUpdateBrandInfo}
                        currentColors={colors}
                        onUpdateColors={handleUpdateColors}
                        onClose={() => setView('dashboard')} 
                    />
                )}
            </main>
        </div>
    );
};

export default App;