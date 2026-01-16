import React, { useState } from 'react';
import { uploadToCloudinary } from '../lib/cloudinary';

/**
 * Componente de prueba para Cloudinary
 * Eliminar después de verificar que funciona
 */
export const ImageUploadTest: React.FC = () => {
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        setUploadedUrl(null);

        try {
            console.log('📤 Subiendo archivo:', file.name);
            const url = await uploadToCloudinary(file);
            console.log('✅ Archivo subido:', url);
            setUploadedUrl(url);
        } catch (err: any) {
            console.error('❌ Error subiendo:', err);
            setError(err.message || 'Error desconocido');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ 
            position: 'fixed', 
            bottom: '20px', 
            right: '20px', 
            background: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            maxWidth: '400px'
        }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>
                🧪 Test Cloudinary
            </h3>
            
            <input
                type="file"
                accept="image/*,video/*"
                onChange={handleUpload}
                disabled={uploading}
                style={{ fontSize: '12px', marginBottom: '12px' }}
            />

            {uploading && (
                <p style={{ color: '#666', fontSize: '12px', margin: '8px 0' }}>
                    ⏳ Subiendo...
                </p>
            )}

            {error && (
                <p style={{ color: '#ef4444', fontSize: '12px', margin: '8px 0' }}>
                    ❌ Error: {error}
                </p>
            )}

            {uploadedUrl && (
                <div>
                    <p style={{ color: '#10b981', fontSize: '12px', margin: '8px 0' }}>
                        ✅ ¡Subido correctamente!
                    </p>
                    <img 
                        src={uploadedUrl} 
                        alt="Preview" 
                        style={{ 
                            width: '100%', 
                            borderRadius: '4px',
                            marginTop: '8px'
                        }} 
                    />
                    <a 
                        href={uploadedUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                            fontSize: '11px', 
                            color: '#3b82f6',
                            wordBreak: 'break-all',
                            display: 'block',
                            marginTop: '8px'
                        }}
                    >
                        Ver URL completa
                    </a>
                </div>
            )}
        </div>
    );
};
