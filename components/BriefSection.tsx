import React from 'react';

interface Props {
    expanded: boolean;
    onToggle: () => void;
}

export const BriefSection: React.FC<Props> = ({ expanded, onToggle }) => {
    return (
        <div className={`bg-white rounded-xl shadow-md border border-indigo-100 overflow-hidden h-fit transition-all duration-300 ${expanded ? 'ring-2 ring-indigo-200' : ''}`}>
            <button 
                onClick={onToggle}
                className="w-full px-4 py-4 flex justify-between items-center bg-white hover:bg-indigo-50 transition-colors"
            >
                <div className="flex flex-col items-start">
                    <h3 className="font-bold text-lg text-indigo-900 flex items-center gap-2">
                        📋 Estrategia & Brief
                    </h3>
                    <p className="text-xs text-indigo-500 font-medium">Objetivos y Acuerdos de Contratación</p>
                </div>
                <span className={`transform transition-transform text-indigo-400 ${expanded ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {expanded && (
                <div className="p-4 space-y-6 animate-in slide-in-from-top-2 fade-in border-t border-indigo-50">
                    
                    {/* Objetivos */}
                    <section>
                        <h4 className="text-xs font-bold text-primary uppercase mb-2">🎯 Objetivo Principal</h4>
                        <p className="text-xs text-gray-700 leading-relaxed mb-2">
                            Acompañar la <strong>reapertura de Farmacia Pastor</strong> con contenidos cercanos que:
                        </p>
                        <ul className="list-disc pl-4 text-xs text-gray-600 space-y-1">
                            <li>Refuercen confianza y tradición.</li>
                            <li>Presenten el espacio renovado.</li>
                            <li><strong>Humanicen</strong> con el equipo (Karen).</li>
                            <li>Eduquen sobre medios de pago.</li>
                        </ul>
                    </section>

                    {/* Plataformas */}
                    <section>
                        <h4 className="text-xs font-bold text-primary uppercase mb-2">📱 Frecuencia y Condiciones (Acuerdo Reunión)</h4>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold border border-indigo-100">Instagram (Principal)</span>
                                <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-[10px] font-bold border">
                                    📅 1 Publicación día por medio
                                </span>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="text-[10px] text-gray-700 bg-yellow-50 p-3 rounded border border-yellow-100 leading-relaxed">
                                    <strong>✅ Cumplimiento de Frecuencia:</strong> Tal como se acordó en la reunión de confirmación de contratación, el objetivo diario se cumple publicando <strong>CUALQUIERA</strong> de los 3 formatos (1 Post, 1 Reel <strong>O</strong> 1 Historia). No se requiere publicar los tres simultáneamente, sino mantener la constancia día por medio con una de estas opciones.
                                </div>
                                
                                <div className="text-[10px] text-gray-700 bg-blue-50 p-3 rounded border border-blue-100 leading-relaxed">
                                    <strong>💰 Extras y Presencialidad:</strong> Se deja asentado (según lo hablado en la reunión) que si la empresa solicita más viajes, mayor presencialidad o contenido adicional al estipulado, se acordará un <strong>aumento en el pago</strong> correspondiente, el cual será definido por el CM.
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Lineamientos */}
                    <section>
                        <h4 className="text-xs font-bold text-primary uppercase mb-2">🎨 Lineamientos</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-green-50 p-2 rounded border border-green-100">
                                <span className="block text-green-700 font-bold text-[10px] mb-1">SI</span>
                                <ul className="text-[10px] text-green-800">
                                    <li>✓ Local y cercano</li>
                                    <li>✓ Videos reales</li>
                                </ul>
                            </div>
                            <div className="bg-red-50 p-2 rounded border border-red-100">
                                <span className="block text-red-700 font-bold text-[10px] mb-1">NO</span>
                                <ul className="text-[10px] text-red-800">
                                    <li>✕ Fotos de stock</li>
                                    <li>✕ Lenguaje técnico</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    
                    <section className="bg-gray-50 p-2 rounded border border-gray-100">
                         <p className="text-[10px] text-gray-500 italic text-center">
                             * Ver Plan de Rodaje Mensual abajo para tareas específicas.
                         </p>
                    </section>

                </div>
            )}
        </div>
    );
};