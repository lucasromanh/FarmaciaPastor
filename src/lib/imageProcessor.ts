import { BrandInfo } from "../types";

/**
 * Superpone el logo o nombre de la farmacia sobre una imagen generada por IA
 * @param imageUrl - URL de la imagen base generada por IA
 * @param brandInfo - Información de la marca (logo y nombre)
 * @returns Promise con la imagen final como base64
 */
export const addBrandWatermark = async (
    imageUrl: string,
    brandInfo: BrandInfo
): Promise<string> => {
    // Descargar la imagen como blob para evitar problemas CORS
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
            reject(new Error('No se pudo crear canvas'));
            return;
        }

        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Dibujar imagen base
            ctx.drawImage(img, 0, 0);
            
            // Área para el watermark (esquina inferior)
            const watermarkHeight = 120;
            const padding = 30;
            
            // Fondo semitransparente blanco
            ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
            ctx.fillRect(0, canvas.height - watermarkHeight, canvas.width, watermarkHeight);
            
            // Línea superior decorativa (color de marca)
            ctx.fillStyle = '#2d7a4f'; // Verde de Farmacia Pastor
            ctx.fillRect(0, canvas.height - watermarkHeight, canvas.width, 4);
            
            // Si hay logo, dibujarlo
            if (brandInfo.logo && brandInfo.logo.trim() !== '') {
                const logo = new Image();
                logo.crossOrigin = 'anonymous';
                
                logo.onload = () => {
                    const logoSize = 80;
                    const logoX = padding;
                    const logoY = canvas.height - watermarkHeight / 2 - logoSize / 2;
                    
                    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
                    
                    // Nombre al lado del logo
                    ctx.fillStyle = '#1a1a1a';
                    ctx.font = 'bold 36px Inter, sans-serif';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(brandInfo.name, logoX + logoSize + 20, canvas.height - watermarkHeight / 2);
                    
                    resolve(canvas.toDataURL('image/jpeg', 0.95));
                };
                
                logo.onerror = () => {
                    // Si falla el logo, solo poner el nombre
                    addTextOnly();
                };
                
                logo.src = brandInfo.logo;
            } else {
                // Solo texto sin logo
                addTextOnly();
            }
            
            function addTextOnly() {
                ctx.fillStyle = '#1a1a1a';
                ctx.font = 'bold 48px Inter, sans-serif';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillText(brandInfo.name, canvas.width / 2, canvas.height - watermarkHeight / 2 + 10);
                
                // Subtítulo (dirección)
                ctx.font = '28px Inter, sans-serif';
                ctx.fillStyle = '#4a4a4a';
                const address = brandInfo.address || 'Cafayate • Salta';
                ctx.fillText(address, canvas.width / 2, canvas.height - watermarkHeight / 2 + 45);
                
                resolve(canvas.toDataURL('image/jpeg', 0.95));
                URL.revokeObjectURL(objectUrl);
            }
        };
        
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Error cargando imagen'));
        };
        
        // Timeout de 30 segundos
        setTimeout(() => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('La imagen tardó más de 30 segundos en cargar'));
        }, 30000);
        
        img.src = objectUrl;
    });
};

/**
 * Carga una imagen con timeout
 * @param imageUrl - URL de la imagen
 * @param timeoutMs - Tiempo máximo de espera en milisegundos
 * @returns Promise que resuelve cuando la imagen carga
 */
export const loadImageWithTimeout = (imageUrl: string, timeoutMs: number = 30000): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        const timeoutId = setTimeout(() => {
            reject(new Error('La imagen tardó más de 30 segundos en cargar'));
        }, timeoutMs);
        
        img.onload = () => {
            clearTimeout(timeoutId);
            resolve();
        };
        
        img.onerror = () => {
            clearTimeout(timeoutId);
            reject(new Error('Error cargando la imagen'));
        };
        
        img.src = imageUrl;
    });
};
