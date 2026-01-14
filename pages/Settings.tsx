import React, { useState, useRef } from 'react';
import { PALETTES } from '../brand/palettes';
import { BrandInfo, BrandPalette } from '../types';

interface Props {
    brandInfo: BrandInfo;
    onUpdateBrandInfo: (info: BrandInfo) => void;
    currentColors: BrandPalette['colors'];
    onUpdateColors: (colors: BrandPalette['colors']) => void;
    onClose: () => void;
}

export const Settings: React.FC<Props> = ({ brandInfo, onUpdateBrandInfo, currentColors, onUpdateColors, onClose }) => {
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- LOGO UPLOAD ---
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateBrandInfo({ ...brandInfo, logo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    // --- COLOR HELPERS ---
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    const rgbToCmyk = (r: number, g: number, b: number) => {
        let c = 0, m = 0, y = 0, k = 0;
        if (r === 0 && g === 0 && b === 0) {
            k = 100;
        } else {
            c = 1 - (r / 255);
            m = 1 - (g / 255);
            y = 1 - (b / 255);
            
            const minCMY = Math.min(c, m, y);
            c = (c - minCMY) / (1 - minCMY);
            m = (m - minCMY) / (1 - minCMY);
            y = (y - minCMY) / (1 - minCMY);
            k = minCMY;
        }
        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100)
        };
    };

    const rgb = hexToRgb(currentColors.primary);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    return (
        <div className="max-w-4xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold font-primary text-text">Configuración de Marca</h2>
                <button onClick={onClose} className="text-sm underline text-gray-500 hover:text-primary">Volver al Planner</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* --- LEFT: VISUAL IDENTITY --- */}
                <div className="space-y-8">
                    {/* Logo Section */}
                    <div className="bg-surface rounded-xl p-6 shadow-sm border">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Logotipo</h3>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50 relative group">
                                {brandInfo.logo ? (
                                    <>
                                        <img src={brandInfo.logo} alt="Brand Logo" className="w-full h-full object-contain p-2" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <button 
                                                onClick={() => onUpdateBrandInfo({...brandInfo, logo: null})}
                                                className="text-white text-xs font-bold bg-red-500 px-2 py-1 rounded"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <span className="text-gray-400 text-xs text-center px-2">Sin Logo</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleLogoUpload} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:opacity-90 transition-opacity w-full mb-2"
                                >
                                    Subir Imagen
                                </button>
                                <p className="text-[10px] text-gray-500">
                                    Recomendado: PNG fondo transparente.<br/>Se usará en flyers y cabecera.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Colors Section */}
                    <div className="bg-surface rounded-xl p-6 shadow-sm border">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Paleta de Colores</h3>
                        
                        {/* Presets */}
                        <div className="mb-6">
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Presets Rápidos</label>
                            <div className="grid grid-cols-3 gap-2">
                                {PALETTES.map((palette, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => onUpdateColors(palette.colors)}
                                        className="p-2 border rounded hover:bg-gray-50 text-left bg-white"
                                    >
                                        <div className="flex gap-1 mb-1">
                                            <div className="w-3 h-3 rounded-full" style={{background: palette.colors.primary}}></div>
                                            <div className="w-3 h-3 rounded-full" style={{background: palette.colors.accent}}></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-600 truncate block">{palette.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Color Inputs */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Personalizar (HEX)</label>
                            <div className="space-y-3">
                                {/* Primary */}
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="color" 
                                        value={currentColors.primary} 
                                        onChange={(e) => onUpdateColors({...currentColors, primary: e.target.value})}
                                        className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                                    />
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-600 block">Color Primario</label>
                                        <input 
                                            type="text" 
                                            value={currentColors.primary}
                                            onChange={(e) => onUpdateColors({...currentColors, primary: e.target.value})}
                                            className="text-xs border rounded p-1 w-full uppercase bg-white text-gray-900"
                                        />
                                    </div>
                                </div>
                                {/* Technical Data Display (RGB/CMYK) */}
                                <div className="bg-gray-50 p-2 rounded text-[10px] text-gray-500 grid grid-cols-2 gap-2 font-mono border">
                                    <div>
                                        <span className="font-bold">RGB:</span> {rgb.r}, {rgb.g}, {rgb.b}
                                    </div>
                                    <div>
                                        <span className="font-bold">CMYK:</span> {cmyk.c}, {cmyk.m}, {cmyk.y}, {cmyk.k}
                                    </div>
                                </div>

                                {/* Secondary */}
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="color" 
                                        value={currentColors.secondary} 
                                        onChange={(e) => onUpdateColors({...currentColors, secondary: e.target.value})}
                                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                    />
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-600 block">Secundario (Fondos suaves)</label>
                                        <input 
                                            type="text" 
                                            value={currentColors.secondary}
                                            onChange={(e) => onUpdateColors({...currentColors, secondary: e.target.value})}
                                            className="text-xs border rounded p-1 w-full uppercase bg-white text-gray-900"
                                        />
                                    </div>
                                </div>

                                {/* Accent */}
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="color" 
                                        value={currentColors.accent} 
                                        onChange={(e) => onUpdateColors({...currentColors, accent: e.target.value})}
                                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                    />
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-600 block">Acento (Botones/Destacados)</label>
                                        <input 
                                            type="text" 
                                            value={currentColors.accent}
                                            onChange={(e) => onUpdateColors({...currentColors, accent: e.target.value})}
                                            className="text-xs border rounded p-1 w-full uppercase bg-white text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT: BUSINESS INFO --- */}
                <div className="space-y-8">
                    <div className="bg-surface rounded-xl p-6 shadow-sm border">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Información del Negocio</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Nombre de la Farmacia</label>
                                <input 
                                    type="text" 
                                    value={brandInfo.name} 
                                    onChange={e => onUpdateBrandInfo({...brandInfo, name: e.target.value})}
                                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none bg-white text-gray-900" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Bajada / Slogan (Ubicación)</label>
                                <input 
                                    type="text" 
                                    value={brandInfo.tagline} 
                                    onChange={e => onUpdateBrandInfo({...brandInfo, tagline: e.target.value})}
                                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none bg-white text-gray-900" 
                                    placeholder="Ej: Cafayate • Salta"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface rounded-xl p-6 shadow-sm border">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Contacto Público</h3>
                        <p className="text-xs text-gray-500 mb-4">Estos datos podrán usarse en los copys generados por IA.</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">WhatsApp</label>
                                <input 
                                    type="text" 
                                    value={brandInfo.whatsapp} 
                                    onChange={e => onUpdateBrandInfo({...brandInfo, whatsapp: e.target.value})}
                                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none bg-white text-gray-900" 
                                    placeholder="+54 9 3868..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Teléfono Fijo</label>
                                <input 
                                    type="text" 
                                    value={brandInfo.phone} 
                                    onChange={e => onUpdateBrandInfo({...brandInfo, phone: e.target.value})}
                                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none bg-white text-gray-900" 
                                    placeholder="03868 42..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    value={brandInfo.email} 
                                    onChange={e => onUpdateBrandInfo({...brandInfo, email: e.target.value})}
                                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none bg-white text-gray-900" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Dirección Completa</label>
                                <textarea 
                                    value={brandInfo.address} 
                                    onChange={e => onUpdateBrandInfo({...brandInfo, address: e.target.value})}
                                    className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-primary outline-none h-20 resize-none bg-white text-gray-900" 
                                    placeholder="Calle, Número, Localidad..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};