import { TOPICS } from "../content/topics";
import { PlannedPost, ReelScript, SocialFormat, CopyTone, BrandInfo } from "../types";

// --- TEXT BUILDER ASSETS ---

const HOOKS: Record<CopyTone, string[]> = {
    TRADICIONAL: [
        "En Farmacia Pastor, sabemos que la salud es lo más importante para vos y tu familia.",
        "Más de 30 años acompañando a los vecinos de Cafayate con compromiso y dedicación.",
        "La tranquilidad de saber que contás con nosotros en cada etapa de la vida.",
        "Tradición, confianza y servicio: los pilares que nos definen desde siempre."
    ],
    CERCANO: [
        "¡Hola vecinos! 👋 Esperamos que estén teniendo un hermoso día en nuestros Valles.",
        "Nos encanta verte bien y ser parte de tu día a día. Hoy queremos compartirte algo útil.",
        "¿Sabías esto? 🤔 A veces los pequeños hábitos hacen una gran diferencia en tu salud.",
        "¡Buen día Cafayate! ☀️ Pasamos por acá para dejarte un consejo que te va a servir."
    ],
    PROFESIONAL: [
        "Información farmacéutica de importancia para el cuidado de su salud:",
        "Desde el punto de vista sanitario, la prevención es la herramienta más eficaz.",
        "Recomendación experta de Farmacia Pastor para el bienestar de la comunidad:",
        "Atención: Consejos profesionales para el uso responsable de medicamentos."
    ],
    URGENTE: [
        "⚠️ Atención: Es muy importante tener esto en cuenta durante estos días.",
        "No dejes pasar esto por alto. Tu salud no puede esperar.",
        "Recordatorio importante para esta semana en Cafayate:",
        "¡Cuidate! La prevención activa es fundamental hoy."
    ]
};

const BODY_DEVELOPMENT: Record<CopyTone, string[]> = {
    TRADICIONAL: [
        "Entendemos que cada paciente es único, por eso nos esforzamos en brindarte la mejor atención farmacéutica. Nuestro equipo está capacitado para orientarte en todo lo que necesites.",
        "A veces, lo único que necesitamos es un consejo honesto y profesional. En nuestra farmacia vas a encontrar siempre una mano amiga dispuesta a escuchar.",
        "Mantener la salud al día es una tarea de todos los días. Nosotros te facilitamos el acceso a todo lo que necesitás, desde medicamentos hasta productos de cuidado personal."
    ],
    CERCANO: [
        "No hay nada como sentirse bien y con energía. ✨ Por eso seleccionamos los mejores productos para que te mimes y cuides a los tuyos.",
        "Sabemos que la rutina a veces nos gana, pero tomarse un ratito para uno mismo es clave. ¿Hace cuánto no renovás tu botiquín o te das un gusto?",
        "Nos encanta cuando nos visitan y nos cuentan cómo están. Somos más que una farmacia, somos tus vecinos y estamos acá para lo que necesites."
    ],
    PROFESIONAL: [
        "Contamos con un amplio stock de medicamentos y trabajamos con todas las obras sociales para garantizar que no interrumpas tu tratamiento.",
        "La adherencia a los tratamientos y el uso correcto de la dermocosmética son fundamentales para ver resultados reales. Consultanos tus dudas.",
        "Nuestra misión es dispensar salud con responsabilidad. Verificamos cada receta y te asesoramos sobre posibles interacciones o cuidados especiales."
    ],
    URGENTE: [
        "Ante los cambios de clima o situaciones estacionales, es vital estar preparados. Revisa tu stock en casa y no esperes a último momento.",
        "Si tenés síntomas o dudas, lo mejor es actuar rápido y consultar a un profesional. Estamos disponibles para asesorarte en lo que esté a nuestro alcance.",
        "La salud es hoy. Priorizá tu bienestar y el de tu familia acercándote a profesionales de confianza."
    ]
};

const VALUES_CLOSERS: string[] = [
    "En Farmacia Pastor, tu bienestar es nuestra tradición. Gracias por elegirnos. 🌿",
    "Somos tu farmacia de confianza en Cafayate. Siempre cerca, siempre con vos.",
    "Cuidando a las familias de Cafayate con la dedicación de siempre. ❤️",
    "Compromiso, ética y salud. Los valores que nos definen y nos impulsan cada día.",
    "Vení a charlar con nosotros, estamos para asesorarte con honestidad y calidez."
];

const CTAS: Record<CopyTone, string[]> = {
    TRADICIONAL: [
        "Visitanos en nuestra dirección de siempre. Te esperamos.",
        "Consultanos con confianza en el mostrador.",
        "Estamos a tu disposición para cualquier consulta."
    ],
    CERCANO: [
        "¡Te esperamos! 😊 Pasá a saludarnos.",
        "Mandanos un WhatsApp si tenés dudas, te respondemos al toque.",
        "Date una vuelta por la farmacia y descubrí todo lo nuevo."
    ],
    PROFESIONAL: [
        "Consultá siempre a tu médico y farmacéutico de confianza.",
        "Asesoramiento profesional garantizado en cada visita.",
        "Acercate para una consulta personalizada con nuestro equipo."
    ],
    URGENTE: [
        "No te automediques, consultanos hoy mismo.",
        "Pasá hoy, no lo dejes para mañana.",
        "Prevengamos juntos. Te esperamos."
    ]
};

const getContactFooter = (brand: BrandInfo) => {
    // Determine contact method to show based on availability
    const phonePart = brand.phone ? `📞 ${brand.phone}` : "";
    const wppPart = brand.whatsapp ? `📲 WhatsApp: ${brand.whatsapp}` : "";
    const contactLine = [phonePart, wppPart].filter(Boolean).join(" | ");
    
    const emailPart = brand.email ? `📧 ${brand.email}` : "";

    return `
📍 ${brand.address}
${contactLine}
${emailPart}
`.trim();
};

/**
 * Simulates AI generation by intelligently building copies layer by layer.
 * Result: Longer, richer text with tone and values.
 */
export const generateSmartContent = async (
    topicId: string, 
    format: SocialFormat,
    customTopicText: string | undefined,
    tone: CopyTone = 'TRADICIONAL',
    brand: BrandInfo
): Promise<{ copy: string, reelScript?: ReelScript, hashtags: string }> => {
    
    // Simulate network delay for "AI feel"
    await new Promise(resolve => setTimeout(resolve, 800));

    const topic = TOPICS.find(t => t.id === topicId) || TOPICS[0];
    
    // 1. Get Topic Core Message
    let coreMessage = topic.copyTemplates[Math.floor(Math.random() * topic.copyTemplates.length)];
    if (topicId === 'custom_topic' && customTopicText) {
        coreMessage = coreMessage.replace('{CUSTOM_TOPIC}', customTopicText);
    }

    // 2. Select Components based on Tone
    const hook = HOOKS[tone][Math.floor(Math.random() * HOOKS[tone].length)];
    const bodyFiller = BODY_DEVELOPMENT[tone][Math.floor(Math.random() * BODY_DEVELOPMENT[tone].length)];
    const valueStatement = VALUES_CLOSERS[Math.floor(Math.random() * VALUES_CLOSERS.length)];
    const cta = CTAS[tone][Math.floor(Math.random() * CTAS[tone].length)];

    // 3. Assemble Copy (Longer Structure)
    // Structure: Hook -> Core Message -> Body Expansion -> Values -> CTA -> Footer -> Hashtags
    
    // Hashtags
    const categoryTag = topicId === 'custom_topic' ? 'Novedades' : topic.category.replace(/\s+/g, '');
    const hashtags = `#FarmaciaPastor #Cafayate #Salud #${categoryTag} #Bienestar #Tradicion`;
    
    // Contact Info Footer
    const footer = getContactFooter(brand);

    const finalCopy = `${hook}\n\n${coreMessage}\n\n${bodyFiller}\n\n${valueStatement}\n\n👉 ${cta}\n\n---\n${footer}\n\n${hashtags}`;

    // Script Logic
    let script: ReelScript | undefined = undefined;
    const titleToUse = (topicId === 'custom_topic' && customTopicText) ? customTopicText : topic.title;

    if (format === 'REEL') {
        script = {
            setup: "Grabar con buena luz natural. Si es posible, usar el uniforme/guardapolvo para transmitir profesionalismo.",
            hook: `(Texto en pantalla): ${titleToUse}`,
            scenes: [
                {
                    sceneNumber: 1,
                    durationSec: 3,
                    shotType: "Plano medio",
                    onScreenText: titleToUse,
                    voiceOver: hook,
                    actions: "Saludo inicial a cámara, tono amable."
                },
                {
                    sceneNumber: 2,
                    durationSec: 6,
                    shotType: "Primer plano / Detalle",
                    onScreenText: "El consejo clave",
                    voiceOver: coreMessage,
                    actions: "Mostrar el producto o hacer el gesto de explicación."
                },
                {
                    sceneNumber: 3,
                    durationSec: 5,
                    shotType: "Plano medio / Acción",
                    onScreenText: "Info importante",
                    voiceOver: bodyFiller,
                    actions: "Interactuando con un cliente o mostrando variedad de stock."
                },
                {
                    sceneNumber: 4,
                    durationSec: 4,
                    shotType: "Plano medio",
                    onScreenText: "Farmacia Pastor",
                    voiceOver: valueStatement,
                    actions: "Sonrisa final, gesto de bienvenida."
                }
            ],
            cta: cta
        };
    }

    return {
        copy: finalCopy, // Contains everything
        hashtags,        // Returned separately just in case, but already in copy
        reelScript: script
    };
};

/**
 * Generates a real AI image URL using the free Pollinations.ai API.
 * Now with improved prompts for better topic relevance
 */
export const generatePublicAIImage = (topic: string, format: string): string => {
    const width = 1080;
    const height = format === 'POST' ? 1080 : 1920; 
    
    // Random seed changes every time this is called
    const seed = Math.floor(Math.random() * 1000000);

    // Mejorar el prompt basado en palabras clave del tema
    const topicLower = topic.toLowerCase();
    let enhancedPrompt = topic;
    
    // Detectar palabras clave y mejorar el contexto visual
    if (topicLower.includes('hidratación') || topicLower.includes('agua') || topicLower.includes('calor')) {
        enhancedPrompt = `persona tomando agua, botella de agua fresca con gotas, hidratación saludable, verano, luz natural, estilo de vida saludable`;
    } else if (topicLower.includes('protector solar') || topicLower.includes('sol')) {
        enhancedPrompt = `crema protector solar, playa, cuidado de la piel, familia feliz al sol, prevención`;
    } else if (topicLower.includes('vitamina') || topicLower.includes('suplemento')) {
        enhancedPrompt = `vitaminas, frutas frescas coloridas, alimentación saludable, bienestar, energía`;
    } else if (topicLower.includes('gripe') || topicLower.includes('resfr')) {
        enhancedPrompt = `persona con té caliente, bufanda, cuidado en invierno, comodidad del hogar`;
    } else if (topicLower.includes('diabetes') || topicLower.includes('glucosa')) {
        enhancedPrompt = `medidor de glucosa, control de salud, prevención diabetes, estilo de vida saludable`;
    } else if (topicLower.includes('presión') || topicLower.includes('corazón')) {
        enhancedPrompt = `tensiómetro, control de presión arterial, salud cardiovascular, prevención`;
    } else if (topicLower.includes('niño') || topicLower.includes('bebé') || topicLower.includes('pediatr')) {
        enhancedPrompt = `familia feliz con niños, cuidado infantil, pediatría, amor familiar`;
    } else if (topicLower.includes('dermocos') || topicLower.includes('piel') || topicLower.includes('crema')) {
        enhancedPrompt = `productos de cuidado de la piel, rutina de skincare, rostro saludable, belleza natural`;
    } else if (topicLower.includes('dolor') || topicLower.includes('inflam')) {
        enhancedPrompt = `persona activa y saludable, ejercicio, bienestar físico, vitalidad`;
    } else if (topicLower.includes('alergia')) {
        enhancedPrompt = `flores, primavera, naturaleza, persona feliz al aire libre`;
    } else if (topicLower.includes('peso') || topicLower.includes('diet')) {
        enhancedPrompt = `alimentación balanceada, plato saludable, frutas y verduras frescas, bienestar`;
    } else if (topicLower.includes('farmacia') || topicLower.includes('medicamento')) {
        enhancedPrompt = `farmacia moderna y acogedora, profesional de salud sonriente, atención al cliente, confianza`;
    }
    
    // Contexto visual profesional para farmacia
    const styleContext = "professional healthcare setting, bright natural lighting, photorealistic, high quality, clean and modern, warm and welcoming atmosphere, argentina, lifestyle photography";
    
    const finalPrompt = encodeURIComponent(`${enhancedPrompt}, ${styleContext}`);
    return `https://image.pollinations.ai/prompt/${finalPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;
};

export const suggestNextDate = (lastDateStr: string): string => {
    const date = new Date(lastDateStr);
    date.setDate(date.getDate() + 2); 
    return date.toISOString().split('T')[0];
};