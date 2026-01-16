/**
 * Cloudinary Upload Helper
 * 
 * Para usar este helper, necesitas:
 * 1. Crear cuenta gratuita en https://cloudinary.com/
 * 2. Obtener tu "Cloud Name" del dashboard
 * 3. Habilitar "Unsigned Upload" en Settings > Upload
 * 4. Crear un "Upload Preset" (unsigned)
 * 5. Reemplazar los valores abajo
 */

// ⚠️ CONFIGURACIÓN - Cloud Name configurado, falta Upload Preset
const CLOUD_NAME = 'dskqwzmy5';
const UPLOAD_PRESET = 'farmacia_pastor'; // Debes crear este preset en Cloudinary

/**
 * Sube una imagen o video a Cloudinary
 * @param file - Archivo a subir (File object)
 * @param folder - Carpeta opcional en Cloudinary
 * @returns URL pública del archivo subido
 */
export const uploadToCloudinary = async (
    file: File,
    folder: string = 'farmacia-pastor'
): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', folder);

        const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.secure_url; // URL pública del archivo
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

/**
 * Convierte una imagen base64 a File object para subir
 */
export const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

/**
 * Helper para subir múltiples archivos
 */
export const uploadMultipleToCloudinary = async (
    files: File[],
    folder: string = 'farmacia-pastor'
): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
    return Promise.all(uploadPromises);
};

// Estado para verificar si Cloudinary está configurado
export const isCloudinaryConfigured = (): boolean => {
    return CLOUD_NAME.length > 0 && UPLOAD_PRESET.length > 0;
};
