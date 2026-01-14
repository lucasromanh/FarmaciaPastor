import { Topic } from '../types';

export const TOPICS: Topic[] = [
    {
        id: "custom_topic",
        category: "✍️ Personalizado",
        title: "Escribir mi propio tema...",
        suggestedFormats: ["POST", "HISTORIA"],
        objectives: ["General"],
        reelAngles: [],
        copyTemplates: [
            "✨ Hoy queremos hablarte sobre {CUSTOM_TOPIC}. En Farmacia Pastor estamos para asesorarte. 📍 Visitanos en Cafayate.",
            "💡 ¿Sabías esto sobre {CUSTOM_TOPIC}? Tu bienestar es nuestra prioridad. Consultanos por WhatsApp."
        ]
    },
    {
        id: "summer_1",
        category: "Verano / Calor",
        title: "Hidratación y Golpe de Calor",
        suggestedFormats: ["HISTORIA", "POST"],
        objectives: ["Educar", "Prevención"],
        reelAngles: ["Síntomas de deshidratación", "Cuánta agua tomar"],
        copyTemplates: [
            "☀️ ¡Cuidado con el golpe de calor! En Cafayate el sol no perdona. Mantenete hidratado y evitá horarios pico. 💧",
            "La hidratación es clave estos días. No esperes a tener sed. Pasá por Farmacia Pastor si necesitás sales de rehidratación o asesoramiento."
        ]
    },
    {
        id: "summer_2",
        category: "Verano / Calor",
        title: "Protección Solar y After Sun",
        suggestedFormats: ["REEL", "POST"],
        objectives: ["Venta", "Educar"],
        reelAngles: ["Cantidad correcta de crema", "Rostro vs Cuerpo"],
        copyTemplates: [
            "🧴 El sol de los Valles es fuerte. Usá protector solar factor 50+ y repetí cada 2 horas. Tenemos dermocosmética de primera línea.",
            "¿Te quemaste? 🥵 Calmá tu piel con nuestros geles post-solares y agua termal. Cuidá tu piel hoy para evitar manchas mañana."
        ]
    },
    {
        id: "winter_1",
        category: "Invierno",
        title: "Resfríos y Garganta",
        suggestedFormats: ["POST", "REEL"],
        objectives: ["Solución", "Venta"],
        reelAngles: ["Diferencia gripe vs resfrío", "Caramelos vs Jarabe"],
        copyTemplates: [
            "❄️ Que el frío no te detenga. Combatí el dolor de garganta y la congestión con nuestra línea de venta libre. Consultanos.",
            "🤧 ¿Estornudos y tos? Reforzá tu botiquín de invierno en Farmacia Pastor. Estamos para ayudarte."
        ]
    },
    {
        id: "winter_2",
        category: "Invierno",
        title: "Piel Seca y Manos",
        suggestedFormats: ["HISTORIA", "POST"],
        objectives: ["Venta", "Dermocosmética"],
        reelAngles: ["Crema de manos express", "Labios partidos"],
        copyTemplates: [
            "🌬️ El viento frío reseca tu piel. Hidratala profundamente con cremas con Vitamina A. Tus manos te lo van a agradecer.",
            "Labios y manos agrietadas por el frío: tenemos la solución reparadora que buscás. 🧴"
        ]
    },
    {
        id: "allergies_1",
        category: "Alergias",
        title: "Rinitis y Cambio de Tiempo",
        suggestedFormats: ["REEL", "HISTORIA"],
        objectives: ["Identificación", "Solución"],
        reelAngles: ["Alergia vs Resfrío", "Tips para el hogar"],
        copyTemplates: [
            "🌸 ¿Alergia o resfrío? Si tenés picazón de ojos y estornudos, pasá por la farmacia. Tenemos antialérgicos de venta libre.",
            "El cambio de tiempo en Cafayate trae alergias. Mantené los ambientes ventilados y consultanos por colirios para ojos rojos. 👀"
        ]
    },
    {
        id: "dermo_1",
        category: "Dermocosmética",
        title: "Rutina Simple (Skincare)",
        suggestedFormats: ["REEL", "POST"],
        objectives: ["Educación", "Venta"],
        reelAngles: ["Rutina de 3 pasos", "Limpieza correcta"],
        copyTemplates: [
            "✨ Menos es más: Limpieza + Hidratación + Sol. Esa es la base de una piel sana. Encontrá tu rutina ideal en Farmacia Pastor.",
            "¿Piel sensible? Trabajamos marcas dermatológicas testeadas. Vení y te asesoramos según tu tipo de piel. 💆‍♀️"
        ]
    },
    {
        id: "kids_1",
        category: "Bebés / Niños",
        title: "Cuidados Generales",
        suggestedFormats: ["POST", "HISTORIA"],
        objectives: ["Confianza", "Empatía"],
        reelAngles: ["Qué tener en el cambiador", "Fiebre: cuándo ir al médico"],
        copyTemplates: [
            "👶 La sonrisa de tu bebé es lo más importante. Tenemos pañales, óleos y accesorios de puericultura. Farmacia Pastor acompaña su crecimiento.",
            "Ante cualquier duda con la salud de tus peques, consultá siempre a tu pediatra. Nosotros estamos para dispensar lo que necesites con confianza. ❤️"
        ]
    },
    {
        id: "seniors_1",
        category: "Adultos Mayores",
        title: "Organización de Medicación",
        suggestedFormats: ["POST"],
        objectives: ["Utilidad", "Servicio"],
        reelAngles: [],
        copyTemplates: [
            "👴👵 Cuidar a los abuelos es organizar bien sus tomas. Usá pastilleros y alarmas. En Farmacia Pastor te ayudamos a entender las recetas.",
            "Adherencia al tratamiento = Mejor calidad de vida. Si tenés dudas sobre cómo tomar un medicamento, ¡preguntanos!"
        ]
    },
    {
        id: "kit_1",
        category: "Botiquín Hogar",
        title: "Checklist de Básicos",
        suggestedFormats: ["POST", "HISTORIA"],
        objectives: ["Utilidad", "Venta cruzada"],
        reelAngles: ["Qué tirar del botiquín", "Lo que no puede faltar"],
        copyTemplates: [
            "⛑️ ¿Tenés el botiquín al día? Gasas, pervinox, curitas y termómetro. Revisá vencimientos y reponé lo que falte en Farmacia Pastor.",
            "¡Accidentes caseros pasan! Que no te falte lo básico para curar una herida menor. Pasá por la farmacia."
        ]
    },
    {
        id: "tourism_1",
        category: "Turismo / Viaje",
        title: "Botiquín de Excursión",
        suggestedFormats: ["POST", "HISTORIA"],
        objectives: ["Venta Turista", "Servicio"],
        reelAngles: ["Kit para la Quebrada", "Mal de altura"],
        copyTemplates: [
            "🎒 ¿De paseo por Cafayate? No olvides llevar agua, protector solar y algo para el dolor de cabeza. Disfrutá los Valles con seguridad.",
            "Bienvenido turista 🍇. Si la altura te afectó o necesitás algo de urgencia, estamos en el centro de Cafayate. Farmacia Pastor."
        ]
    },
    {
        id: "prevention_1",
        category: "Prevención",
        title: "Hábitos Saludables",
        suggestedFormats: ["POST"],
        objectives: ["Branding", "Bienestar"],
        reelAngles: [],
        copyTemplates: [
            "🍏 Salud no es solo tomar remedios, es prevenirlos. Comé sano, movete y descansá bien. Un consejo de tu farmacia amiga.",
            "Lavarse las manos salva vidas. 🙌 Un hábito simple que previene muchas enfermedades. Sigamos cuidándonos."
        ]
    },
    {
        id: "services_1",
        category: "Servicios",
        title: "Toma de Presión y Asesoría",
        suggestedFormats: ["HISTORIA", "POST"],
        objectives: ["Tráfico al local"],
        reelAngles: ["Cómo tomamos la presión", "Nuestro equipo"],
        copyTemplates: [
            "🩺 ¿Te controlaste la presión últimamente? Pasá por Farmacia Pastor. Controlar tus valores es cuidar tu corazón.",
            "Más que una farmacia, somos tus vecinos de confianza en Cafayate. Estamos para escucharte y asesorarte. 🤝"
        ]
    },
    {
        id: "perfume_1",
        category: "Perfumería",
        title: "Fragancias y Regalos",
        suggestedFormats: ["REEL", "POST"],
        objectives: ["Venta", "Regalos"],
        reelAngles: ["Unboxing perfume", "Idea regalo"],
        copyTemplates: [
            "🎁 ¿Buscás el regalo perfecto? Tenemos una selección de fragancias importadas y nacionales. Vení a probarlas.",
            "Sentite bien, oleté bien. ✨ Descubrí las nuevas fragancias que llegaron a Farmacia Pastor."
        ]
    },
    {
        id: "ephemeris_1",
        category: "Efemérides",
        title: "Día Mundial (Salud)",
        suggestedFormats: ["POST", "HISTORIA"],
        objectives: ["Branding", "Comunidad"],
        reelAngles: [],
        copyTemplates: [
            "📅 Hoy recordamos la importancia de la salud. Pequeños cambios hacen grandes diferencias. #FarmaciaPastor #Cafayate",
            "Celebramos la vida y el bienestar. Gracias por confiarnos tu salud cada día. ❤️"
        ]
    }
];