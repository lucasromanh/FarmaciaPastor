import { TOPICS } from "../content/topics";
import { PlannedPost, ReelScript, SocialFormat, CopyTone } from "../types";

// --- TEXT BUILDER ASSETS ---

const HOOKS: Record<CopyTone, string[]> = {
    TRADICIONAL: [
        "En Farmacia Pastor, sabemos que la salud es lo primero.",
        "Como hace años en Cafayate, estamos para cuidarte.",
        "La tranquilidad de saber que contás con nosotros.",
        "Tradición y confianza, los pilares de nuestro servicio."
    ],
    CERCANO: [
        "¡Hola vecinos! 👋 Esperamos que estén teniendo un lindo día.",
        "Queremos verte bien y cuidarte en cada estación.",
        "¿Sabías esto? Un pequeño consejo para tu día a día.",
        "Nos encanta recibirte y poder ayudarte con tus dudas."
    ],
    PROFESIONAL: [
        "Información farmacéutica importante:",
        "La prevención es la clave para una buena salud.",
        "Recomendación experta de Farmacia Pastor:",
        "Atención: Consejos para el correcto uso de medicamentos."
    ],
    URGENTE: [
        "⚠️ Atención: Es importante tener esto en cuenta hoy.",
        "No dejes pasar esto por alto.",
        "Recordatorio importante para esta semana:",
        "¡Cuidate! Prevención activa ante todo."
    ]
};

const VALUES_CLOSERS: string[] = [
    "En Farmacia Pastor, tu bienestar es nuestra tradición. 🌿",
    "Somos tu farmacia de confianza en Cafayate. Siempre cerca.",
    "Cuidando a las familias de Cafayate con la dedicación de siempre.",
    "Compromiso, ética y salud. Los valores que nos definen.",
    "Vení a charlar con nosotros, estamos para asesorarte con honestidad."
];

const CTAS: Record<CopyTone, string[]> = {
    TRADICIONAL: [
        "Visitanos en nuestra dirección de siempre.",
        "Consultanos con confianza.",
        "Te esperamos en el mostrador."
    ],
    CERCANO: [
        "¡Te esperamos! 😊",
        "Mandanos un WhatsApp si tenés dudas.",
        "Date una vuelta por la farmacia."
    ],
    PROFESIONAL: [
        "Consultá siempre a tu médico y farmacéutico.",
        "Asesoramiento profesional garantizado.",
        "Acercate para una consulta personalizada."
    ],
    URGENTE: [
        "No te automediques, consultanos hoy.",
        "Pasá hoy mismo.",
        "Prevengamos juntos."
    ]
};

/**
 * Simulates AI generation by intelligently building copies layer by layer.
 * Result: Longer, richer text with tone and values.
 */
export const generateSmartContent = async (
    topicId: string, 
    format: SocialFormat,
    customTopicText?: string,
    tone: CopyTone = 'TRADICIONAL'
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
    const valueStatement = VALUES_CLOSERS[Math.floor(Math.random() * VALUES_CLOSERS.length)];
    const cta = CTAS[tone][Math.floor(Math.random() * CTAS[tone].length)];

    // 3. Assemble Copy (Builder Pattern)
    // Structure: Hook + Core Message + Values/Tradition + CTA
    let finalCopy = `${hook}\n\n${coreMessage}\n\n${valueStatement}\n👉 ${cta}`;

    // Hashtags
    const categoryTag = topicId === 'custom_topic' ? 'Novedades' : topic.category.replace(/\s+/g, '');
    const hashtags = `#FarmaciaPastor #Cafayate #Salud #${categoryTag} #Bienestar #Tradicion`;

    // Script Logic (remains similar but could be enhanced)
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
        copy: finalCopy,
        hashtags,
        reelScript: script
    };
};

/**
 * Generates a real AI image URL using the free Pollinations.ai API.
 */
export const generatePublicAIImage = (topic: string, format: string): string => {
    const width = 1080;
    const height = format === 'POST' ? 1080 : 1920; 
    
    // Random seed changes every time this is called
    const seed = Math.floor(Math.random() * 1000000);

    const styleContext = "pharmacy context, medicine, health, wellness, bright lighting, photorealistic, 8k, professional photography, clean composition, bokeh background, warm colors";
    const cleanTopic = topic.replace(/[^\w\sñáéíóúü]/gi, '');
    
    // Add seed param to force refresh even if prompt is same
    const finalPrompt = encodeURIComponent(`${cleanTopic}, ${styleContext}`);
    return `https://image.pollinations.ai/prompt/${finalPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;
};

export const suggestNextDate = (lastDateStr: string): string => {
    const date = new Date(lastDateStr);
    date.setDate(date.getDate() + 2); 
    return date.toISOString().split('T')[0];
};