import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const KEY_POSTS = 'fp_planner_posts_v1';
const KEY_SETTINGS = 'fp_planner_settings_v1';
const KEY_PAYMENTS = 'fp_planner_payments_v1';

// Cache en memoria para acceso síncrono
const cache: { [key: string]: any } = {};
let cacheInitialized = false;

// Inicializar cache desde Firestore
const initializeCache = async () => {
    if (cacheInitialized) return;
    
    try {
        const keys = [KEY_POSTS, KEY_SETTINGS, KEY_PAYMENTS];
        await Promise.all(keys.map(async (key) => {
            const docRef = doc(db, 'appData', key);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                cache[key] = docSnap.data().data;
            } else {
                // Intentar migrar desde localStorage
                const localItem = localStorage.getItem(key);
                if (localItem) {
                    cache[key] = JSON.parse(localItem);
                    // Subir a Firestore
                    await setDoc(docRef, { data: cache[key], updatedAt: new Date() });
                }
            }
        }));
        cacheInitialized = true;
    } catch (e) {
        console.error("Error initializing cache from Firestore", e);
        // Cargar desde localStorage como fallback
        [KEY_POSTS, KEY_SETTINGS, KEY_PAYMENTS].forEach(key => {
            try {
                const item = localStorage.getItem(key);
                if (item) cache[key] = JSON.parse(item);
            } catch (err) {
                console.error(`Error loading ${key} from localStorage`, err);
            }
        });
    }
};

// Configurar listeners en tiempo real
const setupRealtimeListeners = () => {
    const keys = [KEY_POSTS, KEY_SETTINGS, KEY_PAYMENTS];
    
    keys.forEach(key => {
        const docRef = doc(db, 'appData', key);
        onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                const newData = doc.data().data;
                console.log(`🔄 Firestore sync: ${key} actualizado`, newData);
                cache[key] = newData;
                // Actualizar localStorage también
                try {
                    localStorage.setItem(key, JSON.stringify(cache[key]));
                } catch (e) {
                    console.error("Error updating localStorage", e);
                }
                // Disparar evento custom para notificar cambios
                window.dispatchEvent(new CustomEvent('storage-update', { detail: { key, data: cache[key] } }));
            }
        }, (error) => {
            console.error(`Error in realtime listener for ${key}:`, error);
        });
    });
};

// Inicializar al importar
initializeCache().then(() => {
    setupRealtimeListeners();
});

// Función para limpiar valores undefined (Firestore no los acepta)
const cleanUndefined = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(item => cleanUndefined(item));
    }
    
    if (obj !== null && typeof obj === 'object') {
        const cleaned: any = {};
        for (const key in obj) {
            if (obj[key] !== undefined) {
                cleaned[key] = cleanUndefined(obj[key]);
            }
        }
        return cleaned;
    }
    
    return obj;
};

// Función para guardar (síncrona con actualización async en background)
export const saveToStorage = (key: string, data: any) => {
    try {
        console.log(`💾 Guardando ${key}:`, data);
        
        // Actualizar cache inmediatamente
        cache[key] = data;
        
        // Actualizar localStorage inmediatamente
        localStorage.setItem(key, JSON.stringify(data));
        
        // Limpiar undefined antes de guardar en Firestore
        const cleanedData = cleanUndefined(data);
        
        // Actualizar Firestore en background (no bloqueante)
        const docRef = doc(db, 'appData', key);
        setDoc(docRef, { data: cleanedData, updatedAt: new Date() })
            .then(() => {
                console.log(`✅ ${key} guardado en Firestore`);
            })
            .catch(e => {
                console.error(`❌ Error saving to Firestore (${key}):`, e);
            });
    } catch (e) {
        console.error("Error saving to storage", e);
    }
};

// Función para cargar (síncrona desde cache)
export const loadFromStorage = (key: string, defaultValue: any) => {
    try {
        if (cache[key] !== undefined) {
            return cache[key];
        }
        
        // Fallback a localStorage si el cache no está listo
        const item = localStorage.getItem(key);
        if (item) {
            const parsed = JSON.parse(item);
            cache[key] = parsed;
            return parsed;
        }
        
        return defaultValue;
    } catch (e) {
        console.error("Error loading from storage", e);
        return defaultValue;
    }
};

export const storageKeys = { KEY_POSTS, KEY_SETTINGS, KEY_PAYMENTS };