export type Language = 'es' | 'en' | 'fr' | 'it';

export interface PresetData {
  title: string;
  capacity: number;
  text: string;
}

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' }
];

export const PRESETS_BY_LANG: Record<Language, Record<string, PresetData>> = {
  es: {
    amigos: {
      title: "Cena de Amigos con Exes y Drama 🍷",
      capacity: 4,
      text: `- Carlos (Vegano, evitar a Juan, jefa: Elena)
- Juan (Hermano de María, quiere a María al lado)
- María (Esposa de Juan, prefiere mesa tranquila)
- Ana (Muy habladora, mejor amiga de Sofía, evitar a Roberto)
- Sofía (Vegana, amiga de Ana)
- Roberto (Súper tímido, ex-pareja de Ana, evitar a Ana)
- Elena (Jefa de Carlos, le gusta el vino, jefa)
- Marcos (Novio de Elena, tímido, amigo de Tomás)
- Lucía (Soltera, busca conocer gente, habladora)
- Tomás (Amigo de Marcos, muy gracioso, soltero, vegetariano)`
    },
    boda: {
      title: "Boda Familiar de Alta Tensión 💒",
      capacity: 5,
      text: `- Suegra Amparo (Evitar a Nuera Carolina, quiere estar con Hijo Alberto)
- Hijo Alberto (Esposo de Carolina, quiere con Amparo)
- Nuera Carolina (Evitar a Amparo, quiere con Amiga Vanesa)
- Amiga Vanesa (Habladora, soltera)
- Tío Pepe (Fumador, ruidoso, evitar a Tía Marta)
- Tía Marta (Muy conservadora, evitar a Tío Pepe)
- Primo Lucas (Adolescente, quiere wifi)
- Prima Sofi (Adolescente, amiga de Lucas)
- Abuelo Ramón (Sordo, prefiere mesa tranquila, quiere con Tía Marta)
- Abuela Teresa (Amable, quiere hablar con todos)`
    },
    oficina: {
      title: "Almuerzo de Fin de Año de la Oficina 💼",
      capacity: 3,
      text: `- Jefe Miguel (Autoritario, evitar a Sindicato Pedro)
- Sindicato Pedro (Vocal, evitar a Jefe Miguel)
- Secretaria Clara (Sabe todo, amiga de Laura)
- Diseñadora Laura (Introvertida, quiere con Clara)
- Programador Dev (No duerme, con cafeína, prefiere mesa con Laura)
- Comercial Iván (Muy hablador, prefiere mesa con Jefe Miguel)
- Finanzas Sole (Calculadora, meticulosa, evitar a Comercial Iván)
- Recursos Humanos Gaby (Medidadora, quiere con todos, vegetariana)`
    },
    consorcio: {
      title: "Reunión de Vecinos Extraordinaria 🏢",
      capacity: 4,
      text: `- Vecino 1A Paco (Odia ruidos, evitar a Duplex 4B Jenny)
- Duplex 4B Jenny (Tiene 3 perros, fiestera, odia a Paco)
- Portero Antonio (Sabe la vida de todos, quiere con Administrador)
- Administrador Ruiz (Trata de huir, quiere con Antonio)
- Vecina 3C Marta (Presidenta, obsesionada con limpieza, quiere mesa con Paco)
- Vecino 2B Carlos (Melómano, sordo, evitar a Marta)
- Inquilina 1B Sofía (Estudiante, siempre cansada, vegetariana)
- Propietario 5A Juan (Inversor, millonario, reservado)`
    }
  },
  en: {
    amigos: {
      title: "Dinner with Friends, Exes & Drama 🍷",
      capacity: 4,
      text: `- Charles (Vegan, avoid John, boss: Helen)
- John (Mary's brother, wants to sit next to Mary)
- Mary (John's wife, prefers a quiet table)
- Jane (Very talkative, Sofia's best friend, avoid Robert)
- Sofia (Vegan, Jane's friend)
- Robert (Super shy, Jane's ex-partner, avoid Jane)
- Helen (Charles's boss, loves wine, boss-type)
- Mark (Helen's boyfriend, shy, Thomas's friend)
- Lucy (Single, looking to meet people, talkative)
- Thomas (Mark's friend, very funny, single, vegetarian)`
    },
    boda: {
      title: "High-Tension Family Wedding 💒",
      capacity: 5,
      text: `- Mother-in-law Margaret (Avoid Daughter-in-law Caroline, wants to be with Son Albert)
- Son Albert (Caroline's husband, wants to be with Margaret)
- Daughter-in-law Caroline (Avoid Margaret, wants to be with Friend Vanessa)
- Friend Vanessa (Talkative, single)
- Uncle Bob (Smoker, noisy, avoid Aunt Martha)
- Aunt Martha (Very conservative, avoid Uncle Bob)
- Cousin Luke (Teenager, wants Wi-Fi)
- Cousin Sophie (Teenager, friend of Luke)
- Grandpa Raymond (Deaf, prefers quiet table, wants to be with Aunt Martha)
- Grandma Theresa (Friendly, wants to speak with everyone)`
    },
    oficina: {
      title: "Office Year-End Luncheon 💼",
      capacity: 3,
      text: `- Boss Michael (Authoritative, avoid Union Rep Peter)
- Union Rep Peter (Vocal, avoid Boss Michael)
- Secretary Claire (Knows everything, Laura's friend)
- Designer Laura (Introverted, wants to be with Claire)
- Programmer Dev (No sleep, caffeinated, prefers table with Laura)
- Sales Guy Ian (Very talkative, prefers table with Boss Michael)
- Accountant Sally (Calculating, meticulous, avoid Sales Guy Ian)
- HR Gaby (Mediator, wants to join everyone, vegetarian)`
    },
    consorcio: {
      title: "Emergency Neighborhood Meeting 🏢",
      capacity: 4,
      text: `- Resident Paco (Hates noise, avoid Duplex Jenny)
- Duplex Jenny (Has 3 dogs, party animal, hates Paco)
- Janitor Tony (Knows everyone's business, wants to be with Manager)
- Manager Ruiz (Trying to escape, wants to be with Tony)
- Resident Martha (President, obsessed with cleaning, wants table with Paco)
- Resident Charles (Music lover, deaf, avoid Martha)
- Tenant Sophia (Student, always tired, vegetarian)
- Owner John (Investor, millionaire, quiet)`
    }
  },
  fr: {
    amigos: {
      title: "Dîner d'Amis avec Ex & Drame 🍷",
      capacity: 4,
      text: `- Charles (Végan, éviter Jean, patronne: Hélène)
- Jean (Frère de Marie, veut s'asseoir à côté de Marie)
- Marie (Épouse de Jean, préfère une table calme)
- Jeanne (Très bavarde, meilleure amie de Sophie, éviter Robert)
- Sophie (Végane, amie de Jeanne)
- Robert (Super timide, ex-mari de Jeanne, éviter Jeanne)
- Hélène (Patronne de Charles, aime le vin, chef)
- Marc (Copain d'Hélène, timide, ami de Thomas)
- Lucie (Célibataire, cherche à faire des rencontres, bavarde)
- Thomas (Ami de Marc, très drôle, célibataire, végétarien)`
    },
    boda: {
      title: "Mariage Familial Haute Tension 💒",
      capacity: 5,
      text: `- Belle-mère Amparine (Éviter la belle-fille Caroline, veut être avec son fils Albert)
- Fils Albert (Époux de Caroline, veut être avec Amparine)
- Belle-fille Caroline (Éviter Amparine, veut être avec son amie Vaness)
- Amie Vaness (Bavarde, célibataire)
- Oncle Pierre (Fumeur, bruyant, éviter tante Marthe)
- Tante Marthe (Très conservatrice, éviter oncle Pierre)
- Cousin Lucas (Adolescent, veut du wifi)
- Cousine Sophie (Adolescente, amie de Lucas)
- Grand-père Raymond (Sourd, préfère une table calme, veut être avec tante Marthe)
- Grand-mère Thérèse (Aimable, veut parler avec tout le monde)`
    },
    oficina: {
      title: "Déjeuner de Fin d'Année au Bureau 💼",
      capacity: 3,
      text: `- Chef Michel (Autoritaire, éviter délégué syndical Pierre)
- Délégué syndical Pierre (Expressif, éviter Chef Michel)
- Secrétaire Claire (Sait tout, amie de Laure)
- Designer Laure (Introvertie, veut être avec Claire)
- Développeur Dev (Sans sommeil, caféiné, préfère table avec Laure)
- Commercial Yvan (Très bavard, préfère table avec Chef Michel)
- Comptable Solange (Calculatrice, méticuleuse, éviter Commercial Yvan)
- RH Gaby (Médiatrice, veut être avec tout le monde, végétarienne)`
    },
    consorcio: {
      title: "Réunion de Copropriétaires Extraordinaire 🏢",
      capacity: 4,
      text: `- Voisin Paco (Déteste le bruit, éviter Duplex Jenny)
- Duplex Jenny (A 3 chiens, fêtarde, déteste Paco)
- Gardien Antoine (Sait tout sur tout le monde, veut être avec l'Administrateur)
- Administrateur Ruiz (Cherche à fuir, veut être avec Antoine)
- Voisine Marthe (Présidente, obsédée par la propreté, veut être avec Paco)
- Voisin Charles (Mélomane, sourd, éviter Marthe)
- Locataire Sophie (Étudiante, toujours fatiguée, végétarienne)
- Propriétaire Jean (Investisseur, millionnaire, réservé)`
    }
  },
  it: {
    amigos: {
      title: "Cena di Amici con Ex e Drammi 🍷",
      capacity: 4,
      text: `- Carlo (Vegano, evitare Giovanni, capo: Elena)
- Giovanni (Fratello di Maria, vuole stare vicino a Maria)
- Maria (Moglie di Giovanni, preferisce un tavolo tranquillo)
- Anna (Molto chiacchierona, migliore amica di Sofia, evitare Roberto)
- Sofia (Vegana, amica di Anna)
- Roberto (Super timido, ex-compagno di Anna, evitare Anna)
- Elena (Capo di Carlo, ama il vino, stile leader)
- Marco (Fidanzato di Elena, timido, amico di Tommaso)
- Lucia (Single, vuole incontrare persone, chiacchierona)
- Tommaso (Amico di Marco, molto divertente, single, vegetariano)`
    },
    boda: {
      title: "Matrimonio di Famiglia ad Alta Tensione 💒",
      capacity: 5,
      text: `- Suocera Amparo (Evitare nuora Carolina, vuole stare con figlio Alberto)
- Figlio Alberto (Marito di Carolina, vuole stare con Amparo)
- Nuora Carolina (Evitare Amparo, vuole stare con amica Vanessa)
- Amica Vanessa (Chiacchierona, single)
- Zio Pepe (Fumatore, rumoroso, evitare zia Marta)
- Zia Marta (Molto conservatrice, evitare zio Pepe)
- Cugino Luca (Adolescente, vuole il wifi)
- Cugina Sofia (Adolescente, amica di Luca)
- Nonno Ramon (Sordo, preferisce tavolo tranquillo, vuole stare con zia Marta)
- Nonna Teresa (Gentile, vuole parlare con tutti)`
    },
    oficina: {
      title: "Pranzo di Fine Anno dell'Ufficio 💼",
      capacity: 3,
      text: `- Capo Michele (Autorevole, evitare sindacalista Pietro)
- Sindacalista Pietro (Rumoroso, evitare Capo Michele)
- Segretaria Clara (Sa tutto, amica di Laura)
- Designer Laura (Introversa, vuole stare con Clara)
- Programmatore Dev (Senza sonno, caffeinato, preferisce tavolo con Laura)
- Commerciale Ivan (Molto chiacchierone, preferisce tavolo con Capo Michele)
- Contabile Sole (Calcolatrice, meticolosa, evitare Commerciale Ivan)
- Risorse Umane Gaby (Mediatrice, vuole stare con tutti, vegetariana)`
    },
    consorcio: {
      title: "Riunione Straordinaria dei Condomini 🏢",
      capacity: 4,
      text: `- Condomino Paco (Odia i rumori, evitare Duplex Jenny)
- Duplex Jenny (Ha 3 cani, festaiola, odia Paco)
- Portiere Antonio (Sa tutto di tutti, vuole stare con l'Amministratore)
- Amministratore Ruiz (Tende a fuggire, vuole stare con Antonio)
- Condomina Marta (Presidente, ossessionata dalla pulizia, vuole tavolo con Paco)
- Condomino Carlo (Melomane, sordo, evitare Marta)
- Affittuaria Sofia (Studentessa, sempre stanca, vegetariana)
- Proprietario Giovanni (Investitore, milionario, riservato)`
    }
  }
};

export const translations: Record<Language, Record<string, string>> = {
  es: {
    // Header & Strip
    promoStrip: "¡Resuelve de inmediato conflictos de exes, opiniones políticas disparatadas y requerimientos veganos!",
    algoVersion: "Algoritmo Inteligente v4",
    subtitle: "Logística Inteligente para Cenas Inolvidables",
    scenario: "Escenario:",
    presetAmigos: "Amigos 🍷",
    presetBoda: "Boda 💒",
    presetOficina: "Oficina 💼",
    presetConsorcio: "Consorcio 🏢",

    // Banner alert
    alertTitle: "Configuración de Seguridad Social Activada",
    alertText: "El sistema de To Meet AI detecta palabras clave en el cuadro de texto como \"evitar\", \"ex-pareja\", \"odia\", y \"quiere con\" para recalcular la cohesión espacial e impedir catástrofes durante los brindis. Puedes editar la libreta de invitados a tu antojo.",

    // Guest Notebook Card
    notebookTitle: "1. Libreta de Invitados",
    notebookTotal: "Total: {count} comensales",
    notebookHelp: "Edita los renglones conservando el formato `Invitado (Dieta, evita a Name, quiere a Name)`:",
    notebookPlaceholder: "- Nombre (Restricciones o Afinidades aquí)",
    maxCapacity: "Capacidad Máxima por Mesa",
    maxCapacityHelp: "Cuántas personas entran cómodamente en cada mesa.",
    tableIntimate: "Mesa íntima (2 pers.)",
    tableImperial: "Mesa Imperial (10 pers.)",
    solveBtn: "Resolver Mesas con IA",

    // Stats
    statsTitle: "CONTRALORÍA DEL EVENTO",
    statsGuests: "Invitados",
    statsTables: "Mesas",
    statsHarmony: "Armonía",
    statsMitigated: "100% Mitigado",
    statsConflictLabel: "Conflicto Crítico Separado:",

    // Solver state
    solvingTitle: "Procesando Restricciones",
    solvingSubtitle: "El algoritmo de To Meet AI está equilibrando afinidades ideales y apartando antagonistas.",
    step1: "Analizando cuaderno de comensales...",
    step2: "Identificando lazos de afinidad...",
    step3: "Estableciendo cordón de seguridad...",
    step4: "Ubicando puestos de mesa final...",

    // Dining plan
    resultsTitle: "2. Plano del Comedor Recomendado",
    resultsSubtitle: "Mesas organizadas siguiendo criterios de máximo agrado recíproco.",
    btnCopyUnlock: "Copiar para WhatsApp • $1.99",
    btnCopyReady: "Copiar para WhatsApp",
    btnCopied: "¡Copiado al portapapeles! ✅",
    btnCopyHint: "Listo para pegar en tu grupo de WhatsApp",

    // Table details
    tableHeader: "Mesa #{index}",
    capacityLabel: "CAPACIDAD",
    tableFull: "Mesa Llena",
    tableSpace: "Lugar libre",
    achievedAffinities: "Logrado:",
    resolvedConflicts: "Fricción evitada:",
    noEgoClashes: "✨ No se detectaron choques de ego en esta mesa.",

    // Call to Action Promo bottom
    promoCtaTitle: "¿Listo para coordinar con los comensales?",
    promoCtaText: "Desbloquea la copia directa. Te generamos un resumen impecable con emojis estructurados para enviar directo al grupo de WhatsApp del evento por solo $1.99 USD. ¡Te ahorrarás horas de quejas telefónicas!",
    promoCtaBtn: "Desbloquear Copia WhatsApp ($1.99)",

    // Empty state
    emptyTitle: "Tu Salón de Eventos Digital",
    emptyText: "Ingresa tu lista de invitados con sus peculiaridades a la izquierda y presiona el botón. To Meet AI calculará la geometría divina del orden de sillas.",
    emptyExampleBtn: "Resolver ejemplo de Amigos 🍷",

    // Feature highlights
    feat1Title: "Algoritmo Anti-Conflictos",
    feat1Text: "Prioriza mantener un rango de seguridad de mínimo una mesa de distancia entre ex-parejas marcadas como hostiles para evitar copas rotas.",
    feat2Title: "Distribución Dietética Inteligente",
    feat2Text: "Agrupa vagamente a invitados con el mismo menú especial (vegano/celíaco) para facilitar el servicio al mozo y optimizar tiempos.",
    feat3Title: "Moderación de Conversación",
    feat3Text: "Impide sobrecargar mesas únicamente con personas tímidas o silenciosas insertando al menos un \"animador de mesa\" para romper el hielo.",

    // Footer
    footerSecured: "To Meet AI es una herramienta offline totalmente segura. Los datos ingresados nunca salen de tu explorador.",
    footerSandbox: "Simuladores de Pago de Pruebas Seguras Integrados • AI Studio Build 2026",

    // Paywall Modal
    modalHeader: "Desbloquear Resumen",
    modalSub: "Adquiere el acceso de copia para exportar el diseño de tus mesas a WhatsApp y planillas con un solo clic.",
    modalPromoTag: "TO MEET AI PREMIUM",
    modalPriceLabel: "Pago único de licencia:",
    modalBenefitTitle: "¿Qué desbloqueará?",
    modalBenefit1: "Formato limpio para WhatsApp: Con listas ordenadas y emojis listos para copiar.",
    modalBenefit2: "Modo Guardado Offline: Consolida los datos directo al explorador.",
    modalBenefit3: "Cero anuncios: Acceso permanente sin límites de uso por mesa.",
    modalSuccessTitle: "¡Pago Exitoso de Prueba!",
    modalSuccessText: "Copias unlocked permanentemente. Hemos copiado al portapapeles el resumen listo de tu evento automáticamente. ¡Disfruta la cena!",
    modalProcessingTitle: "Procesando transacción de prueba...",
    modalProcessingText: "Estableciendo comunicación encriptada segura SSL (256-bit)",
    modalSandboxLabel: "Simulador de Tarjeta Integrado:",
    modalSandboxText: "Ingresa cualquier dato ficticio para probar el flujo de principio a fin. No se debitará dinero real.",
    modalPayholder: "Nombre Completo del Titular",
    modalPayholderPlaceholder: "Ej. Alexis Acuña",
    modalCardnum: "Número de Tarjeta de Prueba",
    modalExpiry: "Vencimiento (MM/AA)",
    modalCVC: "Código CVC",
    modalPayBtn: "Pagar $1.99 USD",
    modalAutoFillBtn: "⚡ Emular Pago Exitoso al Instante",
    waAssistantTitle: "📲 Asistente de Coordinación de WhatsApp (Premium)",
    waAssistantSub: "Elige la plantilla ideal redactada por la IA para informar la distribución de asientos:",
    waTabHosts: "Anfitriones",
    waTabOrganizers: "Planners & Catering",
    waTabGuests: "Mensajes para Cada Invitado",
    waCopyTitle: "Vista Previa del Mensaje",
    searchGuestsLabel: "Filtrar por nombre de invitado:",
    searchGuestsPlaceholder: "Escriba un nombre para buscar...",
    copiedLabel: "¡Copiado! 📋✨",
    individualInviteTemplate: "¡Hola *{name}*! 👋 Te escribimos para confirmarte tu ubicación en el evento. Estarás en la *{table}* 🍽️ con: {others}. ¡Nos vemos pronto para celebrar! 🥂",
    orgsHeaderTemplate: "📋 *ESTRUCTURA DE CATERING Y COORDINACIÓN DE MESAS* 🍽️\nAquí se detalla la distribución para facilitar el servicio de mesas y menús especiales:\n\n",
    hostsHeaderTemplate: "👰🤵 *RECOMENDACIÓN FINAL DE MESAS* 💕\nAquí tienen la distribución de mesas optimizada para su evento. ¡Cero fricciones de invitados!:\n\n",
    viewerWelcome: "🎉 Buscador de Mesas Interactivo",
    viewerSubtitle: "Encuentra tu mesa y tus acompañantes de forma fácil y atractiva.",
    viewerSearchPlaceholder: "Escribe tu nombre para buscar...",
    viewerAllTables: "Todas las Mesas",
    viewerInteractivePlan: "Plano de Comensales Inteligente",
    viewerWelcomeBack: "¡Bienvenido/a de vuelta a To Meet AI! 💍",
    viewerBackToApp: "Volver al Planificador Principal 🛠️",
    viewerCongratulations: "¡Te encontramos! 🎟️ Estás en la mesa:",
    viewerDietLabel: "Menú Especial:",
    viewerCompanionsLabel: "Compartirás esta velada con:",
    viewerQrMobileTitle: "Tu Pase Digital Oficial de Mesa 📲",
    viewerQrMobileDesc: "Escanea de nuevo o guarda esta pantalla para tener acceso directo al mapa interactivo el día de la celebración."
  },
  en: {
    // Header & Strip
    promoStrip: "Resolve instantly exes conflicts, crazy political debates, and vegan requests!",
    algoVersion: "Smart Algorithm v4",
    subtitle: "Smart Logistics for Unforgettable Dinners",
    scenario: "Scenario:",
    presetAmigos: "Friends 🍷",
    presetBoda: "Wedding 💒",
    presetOficina: "Office 💼",
    presetConsorcio: "Neighbours 🏢",

    // Banner alert
    alertTitle: "Social Security Settings Activated",
    alertText: "To Meet AI scans lines for key terms like \"avoid\", \"ex-partner\", \"hates\", and \"with\" to recalculate spatial harmony and prevent toast disasters. Edit the guestlist freely.",

    // Guest Notebook Card
    notebookTitle: "1. Guestlist Registry",
    notebookTotal: "Total: {count} guests",
    notebookHelp: "Format as: `Guest (Dietary/Attributes, avoid Name, wants Name)`:",
    notebookPlaceholder: "- Name (Dietary needs, dislikes or affinities here)",
    maxCapacity: "Max Capacity Per Table",
    maxCapacityHelp: "How many guests can comfortably seat at each table.",
    tableIntimate: "Intimate (2 guests)",
    tableImperial: "Imperial Table (10 guests)",
    solveBtn: "Solve Tables with AI",

    // Stats
    statsTitle: "EVENT CONTROLLERSHIP",
    statsGuests: "Guests",
    statsTables: "Tables",
    statsHarmony: "Harmony",
    statsMitigated: "100% Mitigated",
    statsConflictLabel: "Critical Friction Separated:",

    // Solver state
    solvingTitle: "Processing Constraints",
    solvingSubtitle: "The To Meet AI algorithm is balancing ideal affinities and separation rules.",
    step1: "Analyzing guests notebooks...",
    step2: "Identifying affinity ties...",
    step3: "Establishing security boundary...",
    step4: "Assigning final seat configurations...",

    // Dining plan
    resultsTitle: "2. Recommended Dining Layout",
    resultsSubtitle: "Tables organized optimizing reciprocal comfort and seating chemistry.",
    btnCopyUnlock: "Copy for WhatsApp • $1.99",
    btnCopyReady: "Copy for WhatsApp",
    btnCopied: "Copied to clipboard! ✅",
    btnCopyHint: "Ready to paste directly into your WhatsApp group chat",

    // Table details
    tableHeader: "Table #{index}",
    capacityLabel: "CAPACITY",
    tableFull: "Table Full",
    tableSpace: "Seating available",
    achievedAffinities: "Achieved:",
    resolvedConflicts: "Friction prevented:",
    noEgoClashes: "✨ No ego clashes detected at this table.",

    // Call to Action Promo bottom
    promoCtaTitle: "Ready to coordinate with the guests?",
    promoCtaText: "Unlock clipboard copy! A polished text structured with clean emojis is generated automatically to send to your group chat. Save hours of phone complaints!",
    promoCtaBtn: "Unlock WhatsApp Copy ($1.99)",

    // Empty state
    emptyTitle: "Your Digital Banquet Hall",
    emptyText: "Type in your guestlist with their traits on the left and click. AcomodaAI will calculate the divine layout of your seating charts.",
    emptyExampleBtn: "Try Friends Example 🍷",

    // Feature highlights
    feat1Title: "Conflict Separation Algorithm",
    feat1Text: "Guarantees a safe separation distance (minimum one table apart) between hostile exes to keep glasses from flying.",
    feat2Title: "Smart Dietary Grouping",
    feat2Text: "Gently clusters guests with similar dietary restrictions (vegan, celiac) to optimize catering speed and kitchen coordination.",
    feat3Title: "Icebreaking Moderation",
    feat3Text: "Balances conversational personalities, ensuring shy guests are seated around at least one 'table animator' to spark easy chat.",

    // Footer
    footerSecured: "To Meet AI operates safely fully offline. Your guest data never leaves your browser.",
    footerSandbox: "Integrated Secure Payment Sandbox Simulator • AI Studio Build 2026",

    // Paywall Modal
    modalHeader: "Unlock Summary Export",
    modalSub: "Acquire full copy permissions to easily export your clean table layout to WhatsApp and spreadsheets with a single tap.",
    modalPromoTag: "TO MEET AI PREMIUM",
    modalPriceLabel: "One-time license cost:",
    modalBenefitTitle: "What's included?",
    modalBenefit1: "Clean WhatsApp Format: Organized bullet points with elegant emojis ready to copy.",
    modalBenefit2: "Offline Preservation: Keeps configurations stored directly in your local browser.",
    modalBenefit3: "Zero Ads: Infinite lifetime access with no table count limits.",
    modalSuccessTitle: "Payment Simulated Successfully!",
    modalSuccessText: "Features unlocked forever. We have automatically copied the formatted text to your clipboard. Enjoy the dinner!",
    modalProcessingTitle: "Processing sandbox transaction...",
    modalProcessingText: "Securing connection via 256-bit SSL certificate",
    modalSandboxLabel: "Integrated Sandbox Simulator:",
    modalSandboxText: "Feel free to input dummy card details to complete the flow. No real funds are moved.",
    modalPayholder: "Cardholder full name",
    modalPayholderPlaceholder: "e.g. Alexis Acuña",
    modalCardnum: "Dummy Card Number",
    modalExpiry: "Expiry Date (MM/YY)",
    modalCVC: "CVC Code",
    modalPayBtn: "Pay $1.99 USD",
    modalAutoFillBtn: "⚡ Instant Sandbox Success (Simulate)",
    waAssistantTitle: "📲 WhatsApp Coordination Assistant (Premium)",
    waAssistantSub: "Choose the perfect AI-tailored template to communicate seating arrangements:",
    waTabHosts: "Hosts",
    waTabOrganizers: "Planners & Catering",
    waTabGuests: "Messages for Each Guest",
    waCopyTitle: "Message Preview",
    searchGuestsLabel: "Filter by guest name:",
    searchGuestsPlaceholder: "Type a name to search...",
    copiedLabel: "Copied! 📋✨",
    individualInviteTemplate: "Hello *{name}*! 👋 Just wanted to let you know that you will be seated at *{table}* 🍽️ alongside: {others}. Looking forward to celebrating together! 🥂",
    orgsHeaderTemplate: "📋 *CATERING & TABLE COORDINATION STRUCTURE* 🍽️\nHere is the detailed layout to streamline table service and special dietary menus:\n\n",
    hostsHeaderTemplate: "👰🤵 *FINAL RECOMMENDED SEATING ARRANGEMENT* 💕\nHere is your optimized guest table setup. Zero friction, total harmony!:\n\n",
    viewerWelcome: "🎉 Interactive Table Finder",
    viewerSubtitle: "Find your table and tablemates easily for a seamless event experience.",
    viewerSearchPlaceholder: "Type your name to search...",
    viewerAllTables: "All Tables",
    viewerInteractivePlan: "Smart Seating Map & Seating Card",
    viewerWelcomeBack: "Welcome back to To Meet AI! 💍",
    viewerBackToApp: "Back to Main Planner 🛠️",
    viewerCongratulations: "We found you! 🎟️ You are seated at:",
    viewerDietLabel: "Special Diet:",
    viewerCompanionsLabel: "You will share the evening with:",
    viewerQrMobileTitle: "Your Official Digital Seating Pass 📲",
    viewerQrMobileDesc: "Rescan or save this screen to have instant access to the seating map on the celebration day."
  },
  fr: {
    // Header & Strip
    promoStrip: "Réglez instantanément conflits d'exs, débats politiques et repas végans !",
    algoVersion: "Algorithme Intelligent v4",
    subtitle: "Logistique Intelligente pour Dîners Inoubliables",
    scenario: "Scénario :",
    presetAmigos: "Amis 🍷",
    presetBoda: "Mariage 💒",
    presetOficina: "Bureau 💼",
    presetConsorcio: "Copropriété 🏢",

    // Banner alert
    alertTitle: "Sécurité Sociale Activée",
    alertText: "Le système To Meet AI détecte les mots clés comme \"éviter\", \"ex-mari\", \"déteste\" et \"avec\" pour équilibrer la cohésion spatiale et empêcher les drames pendant les toasts. Modifiez le carnet à votre guise.",

    // Guest Notebook Card
    notebookTitle: "1. Registre des Convives",
    notebookTotal: "Total : {count} convives",
    notebookHelp: "Format requis : `Invité (Régime/Traits, éviter Name, veut Name)` :",
    notebookPlaceholder: "- Nom (Régime ou affinités ici)",
    maxCapacity: "Capacité Maximale par Table",
    maxCapacityHelp: "Combien de personnes peuvent s'installer confortablement à chaque table.",
    tableIntimate: "Table intime (2 pers.)",
    tableImperial: "Table Impériale (10 pers.)",
    solveBtn: "Résoudre les Tables avec l'IA",

    // Stats
    statsTitle: "CONTRÔLE DE L'ÉVÉNEMENT",
    statsGuests: "Convives",
    statsTables: "Tables",
    statsHarmony: "Harmonie",
    statsMitigated: "100% Atténué",
    statsConflictLabel: "Frictions Évitées de Justesse :",

    // Solver state
    solvingTitle: "Traitement des Règles",
    solvingSubtitle: "L'algorithme de To Meet AI équilibre les affinités idéales et écarte les antagonistes.",
    step1: "Analyse des listes d'invités...",
    step2: "Détermination des liaisons d'affinité...",
    step3: "Mise en place de la zone de sécurité d'exs...",
    step4: "Calcul des placements finaux à table...",

    // Dining plan
    resultsTitle: "2. Plan de Salle Recommandé",
    resultsSubtitle: "Tables organisées selon les critères de confort et d'harmonie mutuelle.",
    btnCopyUnlock: "Copier pour WhatsApp • $1.99",
    btnCopyReady: "Copier pour WhatsApp",
    btnCopied: "Copié dans le presse-papiers ! ✅",
    btnCopyHint: "Prêt à être collé dans votre groupe WhatsApp",

    // Table details
    tableHeader: "Table #{index}",
    capacityLabel: "CAPACITÉ",
    tableFull: "Table Complète",
    tableSpace: "Siège disponible",
    achievedAffinities: "Réussi :",
    resolvedConflicts: "Friction évitée :",
    noEgoClashes: "✨ Aucun conflit d'ego détecté à cette table.",

    // Call to Action Promo bottom
    promoCtaTitle: "Prêt à coordonner avec vos convives ?",
    promoCtaText: "Débloquez la copie rapide ! Un plan structuré avec émojis sera créé automatiquement pour votre groupe WhatsApp. Épargnez-vous des heures de complaintes téléphoniques !",
    promoCtaBtn: "Débloquer Export WhatsApp ($1.99)",

    // Empty state
    emptyTitle: "Votre Salon Événementiel Numérique",
    emptyText: "Saisissez votre liste d'invités avec leurs traits à gauche, puis cliquez sur le bouton. To Meet AI calculera la géométrie divine du placement.",
    emptyExampleBtn: "Essayer l'exemple des Amis 🍷",

    // Feature highlights
    feat1Title: "Algorithme Anti-Conflit d'Ex-partenaires",
    feat1Text: "Assure un placement de sécurité (minimum une table d'écart) entre ex hostiles pour éviter de briser les verres.",
    feat2Title: "Regroupement Diététique Pratique",
    feat2Text: "Rapproche les convives au menu spécifique (végan, sans gluten) pour faciliter le service et accélérer la cuisine.",
    feat3Title: "Modération de l'Atmosphère",
    feat3Text: "Équilibre les personnalités des tables, en intégrant au moins un 'animateur de table' pour relancer naturellement les discussions.",

    // Footer
    footerSecured: "To Meet AI est un outil entièrement sécurisé hors ligne. Vos données restent dans votre navigateur.",
    footerSandbox: "Simulateur de Paiement de Prémices Sécurisé • AI Studio Build 2026",

    // Paywall Modal
    modalHeader: "Débloquer l'Export",
    modalSub: "Achetez les droits de copie pour exporter votre plan de table d'un clic vers WhatsApp ou votre tableur.",
    modalPromoTag: "TO MEET AI PREMIUM",
    modalPriceLabel: "Tarif de licence unique :",
    modalBenefitTitle: "Contenu du déblocage :",
    modalBenefit1: "Format propre pour WhatsApp : Listes bien ordonnées avec émoticônes.",
    modalBenefit2: "Sauvegarde locale continue : Préservation automatique des données.",
    modalBenefit3: "Zéro Publicité : Accès illimité à vie sans restrictions.",
    modalSuccessTitle: "Paiement fictif validé !",
    modalSuccessText: "Fonctionnalités débloquées à vie. Le plan formaté a été copié automatiquement dans votre presse-papiers. Bon appétit !",
    modalProcessingTitle: "Validation de la transaction...",
    modalProcessingText: "Sécurisation en cours par certificat SSL 256 bits",
    modalSandboxLabel: "Simulateur Intégré :",
    modalSandboxText: "Saisissez n'importe quelles coordonnées de carte factices pour essayer le parcours complet.",
    modalPayholder: "Nom du titulaire de carte",
    modalPayholderPlaceholder: "Ex. Alexis Acuña",
    modalCardnum: "Numéro de Carte Factice",
    modalExpiry: "Date d'expiration (MM/AA)",
    modalCVC: "Code CVC",
    modalPayBtn: "Acheter $1.99 USD",
    modalAutoFillBtn: "⚡ Émulation de Paiement Réussi",
    waAssistantTitle: "📲 Assistant de Coordination WhatsApp (Premium)",
    waAssistantSub: "Choisissez le modèle idéal rédigé par l'IA pour communiquer la disposition des chaises :",
    waTabHosts: "Hôtes",
    waTabOrganizers: "Planners & Traiteur",
    waTabGuests: "Message pour Chaque Invité",
    waCopyTitle: "Aperçu du Message",
    searchGuestsLabel: "Filtrer par nom d'invité :",
    searchGuestsPlaceholder: "Saisir un nom à rechercher...",
    copiedLabel: "Copié ! 📋✨",
    individualInviteTemplate: "Bonjour *{name}* ! 👋 Nous voulions vous informer que vous serez installé(e) à la *{table}* 🍽️ avec : {others}. Au plaisir de célébrer ensemble ! 🥂",
    orgsHeaderTemplate: "📋 *STRUCTURE TRAITEUR & COORDINATION DES TABLES* 🍽️\nVoici la répartition détaillée pour faciliter le service et le contrôle des menus spéciaux :\n\n",
    hostsHeaderTemplate: "👰🤵 *DISPOSITION RECOMMANDÉE DES TABLES* 💕\nVoici la configuration optimisée de vos invités. Zéro friction, harmonie totale ! :\n\n",
    viewerWelcome: "🎉 Recherche Interactive de Table",
    viewerSubtitle: "Trouvez facilement votre table et vos compagnons pour une expérience d'événement fluide.",
    viewerSearchPlaceholder: "Saisissez votre nom pour rechercher...",
    viewerAllTables: "Toutes les Tables",
    viewerInteractivePlan: "Plan Répartition Intelligent",
    viewerWelcomeBack: "Bienvenue de retour sur To Meet AI! 💍",
    viewerBackToApp: "Retour au Planificateur Principal 🛠️",
    viewerCongratulations: "Nous vous avons trouvé ! 🎟️ Vous êtes placé à la :",
    viewerDietLabel: "Menu Spécial :",
    viewerCompanionsLabel: "Vous partagerez la soirée avec :",
    viewerQrMobileTitle: "Votre Pass Numérique Officiel des Tables 📲",
    viewerQrMobileDesc: "Scannez à nouveau ou enregistrez cet écran pour un accès direct au plan des tables le jour de la fête."
  },
  it: {
    // Header & Strip
    promoStrip: "Risolvi subito litigi tra ex, discussioni politiche e menu vegani!",
    algoVersion: "Algoritmo Intelligente v4",
    subtitle: "Logistica Intelligente per Cene Indimenticabili",
    scenario: "Scenario:",
    presetAmigos: "Amici 🍷",
    presetBoda: "Matrimonio 💒",
    presetOficina: "Ufficio 💼",
    presetConsorcio: "Condominio 🏢",

    // Banner alert
    alertTitle: "Configurazione Sicurezza Sociale Attiva",
    alertText: "AcomodaAI esamina parole chiave del testo come \"evitare\", \"ex\", \"odia\" e \"con\" per regolare l'armonia degli spazi e prevenire disastri durante i brindisi. Modifica la lista come preferisci.",

    // Guest Notebook Card
    notebookTitle: "1. Registro degli Ospiti",
    notebookTotal: "Totale: {count} ospiti",
    notebookHelp: "Formato richiesto: `Ospite (Dieta/Tratti, evitare Nome, vuole Nome)`:",
    notebookPlaceholder: "- Nome (Dieta, antipatie o legami d'affinità)",
    maxCapacity: "Capacità Massima del Tavolo",
    maxCapacityHelp: "Quanti invitati possono sedersi comodamente in ciascun tavolo.",
    tableIntimate: "Tavolo intimo (2 osp.)",
    tableImperial: "Tavolo Imperiale (10 osp.)",
    solveBtn: "Risolvi i Tavoli con l'IA",

    // Stats
    statsTitle: "STATO DELL'EVENTO",
    statsGuests: "Ospiti",
    statsTables: "Tavoli",
    statsHarmony: "Armonia",
    statsMitigated: "100% Mitigato",
    statsConflictLabel: "Situazioni ad Attrito Risolte:",

    // Solver state
    solvingTitle: "Elaborazione Vincoli",
    solvingSubtitle: "L'algoritmo di AcomodaAI sta bilanciando le affinità ed evitando ostilità reciproche.",
    step1: "Analisi dell'elenco degli invitati...",
    step2: "Calcolo dei legami d'affinità...",
    step3: "Piazzamento barriere di sicurezza tra ex...",
    step4: "Assegnazione dei posti finali nei tavoli...",

    // Dining plan
    resultsTitle: "2. Disposizione dei Tavoli Consigliata",
    resultsSubtitle: "Tavoli disposti ottimizzando il comfort e l'armonia interpersonale.",
    btnCopyUnlock: "Copia per WhatsApp • $1.99",
    btnCopyReady: "Copia per WhatsApp",
    btnCopied: "Copiato negli appunti! ✅",
    btnCopyHint: "Pronto da incollare direttamente sulla chat di WhatsApp",

    // Table details
    tableHeader: "Tavolo #{index}",
    capacityLabel: "CAPIENZA",
    tableFull: "Tavolo Pieno",
    tableSpace: "Posto disponibile",
    achievedAffinities: "Raggiunto:",
    resolvedConflicts: "Frizione evitata:",
    noEgoClashes: "✨ Nessun urto di ego rilevato in questo tavolo.",

    // Call to Action Promo bottom
    promoCtaTitle: "Pronto a coordinarti con gli invitati?",
    promoCtaText: "Sblocca la copia veloce degli appunti! Un riepilogo pulito formattato con emoji sarà generato per il tuo gruppo WhatsApp. Risparmia ore di lamentele!",
    promoCtaBtn: "Sblocca Copia WhatsApp ($1.99)",

    // Empty state
    emptyTitle: "La tua Sala Banchetti Digitale",
    emptyText: "Inserisci l'elenco degli ospiti con le loro preferenze a sinistra e clicca. AcomodaAI calcolerà la disposizione dei tavoli perfetta.",
    emptyExampleBtn: "Prova l'esempio Amici 🍷",

    // Feature highlights
    feat1Title: "Algoritmo Anti-Conflitto",
    feat1Text: "Assicura un posizionamento sicuro (minimo un tavolo di distanza) fra ex-partner ostili per evitare calici rotti.",
    feat2Title: "Raggruppamento Diete Meticoloso",
    feat2Text: "Raggruppa gli ospiti con diete particolari (vegani, celiaci) per agevolare il lavoro del catering e abbreviare i tempi.",
    feat3Title: "Moderazione Sociale Attiva",
    feat3Text: "Equilibra i profili nei tavoli, assicurando che gli ospiti introversi siedano vicino ad almeno un 'animatore del tavolo'.",

    // Footer
    footerSecured: "AcomodaAI è uno strumento offline completamente sicuro. I dati degli ospiti restano nel tuo browser.",
    footerSandbox: "Simulatore di Transazioni Sicure Sandbox • AI Studio Build 2026",

    // Paywall Modal
    modalHeader: "Sblocca Esportazione",
    modalSub: "Acquista i permessi di copia per esportare istantaneamente i tavoli su WhatsApp o su file tabellari.",
    modalPromoTag: "ACOMODAAI PREMIUM",
    modalPriceLabel: "Costo licenza una tantum:",
    modalBenefitTitle: "Cosa sbloccherai?",
    modalBenefit1: "Formato WhatsApp pulito: Elenchi organizzati ed eleganti provvisti di emoji.",
    modalBenefit2: "Conservazione locale: Mantiene i dati al sicuro localmente nel browser.",
    modalBenefit3: "Zero Pubblicità: Accesso illimitato senza limiti di tavoli.",
    modalSuccessTitle: "Simulazione pagamento completata!",
    modalSuccessText: "Funzionalità sbloccate per sempre. Abbiamo copiato automaticamente negli appunti il riepilogo del tuo evento! Buon appetito!",
    modalProcessingTitle: "Elaborazione transazione di prova...",
    modalProcessingText: "Connessione sicura in corso via certificato SSL 256-bit",
    modalSandboxLabel: "Simulatore Sandbox Integrato:",
    modalSandboxText: "Fornisci dettagli di pagamento di fantasia per verificare l'intera transazione. Non si muove denaro vero.",
    modalPayholder: "Nome completo dell'intestatario",
    modalPayholderPlaceholder: "Es. Alexis Acuña",
    modalCardnum: "Numero Carta di Prova",
    modalExpiry: "Data Scadenza (MM/AA)",
    modalCVC: "Codice CVC",
    modalPayBtn: "Paga $1.99 USD",
    modalAutoFillBtn: "⚡ Emulazione Pagamento Riuscito",
    waAssistantTitle: "📲 Assistente Coordinamento WhatsApp (Premium)",
    waAssistantSub: "Scegli il modello ideale compilato dall'IA per comunicare la disposizione dei tavoli:",
    waTabHosts: "Sposi",
    waTabOrganizers: "Planner & Catering",
    waTabGuests: "Messaggio per Ogni Ospite",
    waCopyTitle: "Anteprima del Messaggio",
    searchGuestsLabel: "Filtra per nome ospite:",
    searchGuestsPlaceholder: "Inserisci un nome da cercare...",
    copiedLabel: "Copiato! 📋✨",
    individualInviteTemplate: "Ciao *{name}*! 👋 Volevamo comunicarti che al tavolo sarai posizionato al *{table}* 🍽️ insieme a: {others}. Non vediamo l'ora di festeggiare insieme! 🥂",
    orgsHeaderTemplate: "📋 *STRUTTURA CATERING & COORDINAMENTO TAVOLI* 🍽️\nEcco la disposizione dettagliata per facilitare il servizio dei pasti e i menù speciali:\n\n",
    hostsHeaderTemplate: "👰🤵 *DISPOSIZIONE FINALE CONSIGLIATA DEI TAVOLI* 💕\nEcco la configurazione ottimizzata dei tavoli per il vostro evento. Zero attrito, armonia totale!:\n\n",
    viewerWelcome: "🎉 Trova Tavolo Interattivo",
    viewerSubtitle: "Trova facilmente il tuo tavolo e i tuoi compagni per un'esperienza di evento fluida.",
    viewerSearchPlaceholder: "Digita il tuo nome per cercare...",
    viewerAllTables: "Tutti i Tavoli",
    viewerInteractivePlan: "Mappa dei Tavoli Intelligente",
    viewerWelcomeBack: "Benvenuto di ritorno su AcomodaAI! 💍",
    viewerBackToApp: "Torna al Pianificatore Principale 🛠️",
    viewerCongratulations: "Ti abbiamo trovato! 🎟️ Sei seduto al:",
    viewerDietLabel: "Menu Speciale:",
    viewerCompanionsLabel: "Condividerai la serata con:",
    viewerQrMobileTitle: "Il tuo Pass Digitale Ufficiale dei Tavoli 📲",
    viewerQrMobileDesc: "Scansiona di nuovo o salva questa schermata per l'accesso diretto alla mappa dei tavoli il giorno della festa."
  }
};
