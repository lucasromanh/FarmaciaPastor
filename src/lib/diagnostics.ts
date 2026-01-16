import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Diagnóstico de conexión a Firebase
 * Ejecuta esto en la consola del navegador para verificar el estado
 */
export const runFirebaseDiagnostics = async () => {
    console.log('🔍 Ejecutando diagnósticos de Firebase...\n');
    
    // Test 1: Verificar configuración
    console.log('✅ Configuración de Firebase cargada');
    console.log('   Project ID:', db.app.options.projectId);
    
    try {
        // Test 2: Intentar escribir un documento de prueba
        console.log('\n📝 Test 2: Intentando escribir en Firestore...');
        const testRef = doc(db, 'diagnostics', 'test');
        await setDoc(testRef, { 
            test: true, 
            timestamp: new Date().toISOString() 
        });
        console.log('✅ Escritura exitosa');
        
        // Test 3: Intentar leer el documento
        console.log('\n📖 Test 3: Intentando leer de Firestore...');
        const testSnap = await getDoc(testRef);
        if (testSnap.exists()) {
            console.log('✅ Lectura exitosa:', testSnap.data());
        }
        
        console.log('\n✅ TODOS LOS TESTS PASARON');
        console.log('Firebase está funcionando correctamente.\n');
        
        return true;
        
    } catch (error: any) {
        console.error('\n❌ ERROR DETECTADO:\n');
        console.error('Código:', error.code);
        console.error('Mensaje:', error.message);
        
        if (error.code === 'permission-denied') {
            console.error('\n🔴 PROBLEMA: Las reglas de Firestore no permiten acceso');
            console.error('\n📋 SOLUCIÓN:');
            console.error('1. Ve a: https://console.firebase.google.com/');
            console.error('2. Selecciona tu proyecto "Farmacia Pastor"');
            console.error('3. Ve a Firestore Database > Reglas');
            console.error('4. Reemplaza las reglas con:\n');
            console.error(`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appData/{document=**} {
      allow read, write: if true;
    }
  }
}`);
            console.error('\n5. Haz clic en "Publicar"\n');
        }
        
        return false;
    }
};

// Auto-ejecutar en desarrollo
if ((import.meta as any).env.DEV) {
    runFirebaseDiagnostics();
}
