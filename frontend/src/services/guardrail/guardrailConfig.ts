// Guardrail Configuration - All patterns, terms, and templates
// Version: 1.0.0

// ============================================
// ROMANCE & FLIRTING PATTERNS (Block)
// ============================================
export const ROMANCE_PATTERNS = [
    // English
    'how to flirt', 'flirt', 'flrt', 'flirttu', 'flirtu',
    'how to get a girlfriend', 'how to get a boyfriend',
    'how to attract', 'pick up line', 'pickup line',
    'rizz', 'rizzz', 'dating tips', 'dating',
    'how to kiss', 'kiss', 'make her love', 'make him love',
    'how to propose', 'propose', 'proposal',
    'how to impress crush', 'impress crush', 'crush',
    'gf', 'girlfriend', 'girl friend',
    'bf', 'boyfriend', 'boy friend',
    'date ku', 'romantic', 'romance',
    // Tamil transliteration
    'love panna', 'love pannalama', 'luv', 'lav', 'lavu',
    'ponnu pidikka', 'pasanga pidikka',
    'propose pannalama', 'propose epdi',
    'sight adikurathu', 'sight adikka',
    'girl kitta pesa', 'boy kitta pesa',
    'crush kitta', 'impress panna',
    'chatting tips'
];

// ============================================
// EXPLICIT SEXUAL PATTERNS (Block immediately)
// ============================================
export const EXPLICIT_PATTERNS = [
    // Direct explicit
    'porn', 'p0rn', 'prn', 'hentai',
    'sexvideo', 'sex video', 'nude', 'nudes',
    'blowjob', 'handjob', 'oral sex',
    'sex positions', 'intercourse tips',
    'hookup', 'hook up', 'one night',
    'escort', 'paid sex',
    'dick', 'cock', 'pussy', 'boobs', 'tits',
    'lick', 'suck', 'masturbat',
    // Tamil
    'porn link', 'nude pic', 'nude anupu',
    'sex epdi panrathu', 'sex panna epdi'
];

// ============================================
// PROFANITY PATTERNS (Block)
// ============================================
export const PROFANITY_PATTERNS = [
    // Tamil slang
    'punda', 'otha', 'oththa', 'sunni',
    'thevdiya', 'poolu', 'bunda',
    'kena punda', 'loosu punda', 'naye',
    // English-Tamil mix
    'bloody fool', 'mental fellow', 'stupid paya',
    // Common profanity
    'fuck', 'f*ck', 'fck', 'shit', 'sh*t',
    'bitch', 'bastard', 'ass', 'damn'
];

// ============================================
// HARASSMENT & BULLYING PATTERNS (Block)
// ============================================
export const HARASSMENT_PATTERNS = [
    // Tamil
    'ivan romba mokka', 'aval romba cheap',
    'nee loosu', 'unakku arivu illa',
    'unna adikkanum', 'nee sethuru',
    // English
    'i hate you', 'kill yourself', 'kys',
    'you are stupid', 'you are dumb',
    'ugly', 'loser', 'idiot'
];

// ============================================
// SELF-HARM PATTERNS (Escalate)
// ============================================
export const SELF_HARM_PATTERNS = [
    // English
    'want to die', 'kill myself', 'suicide',
    'end my life', 'hurt myself', 'self harm',
    'cut myself', 'no reason to live',
    // Tamil
    'sethuranum', 'saagalam', 'naan sethuduven',
    'enna kollanum'
];

// ============================================
// EMOTIONAL WELLNESS PATTERNS (Empathetic redirect)
// ============================================
export const EMOTIONAL_WELLNESS_PATTERNS = [
    // Depression keywords
    'depressed', 'depression', 'feeling depressed',
    'lonely', 'loneliness', 'feeling lonely',
    'sad', 'sadness', 'feeling sad', 'very sad',
    'anxious', 'anxiety', 'panic attack',
    'stressed', 'stress', 'overwhelmed',
    // Seeking emotional support
    'need someone to talk', 'no one to talk',
    'feeling down', 'feeling low', 'feeling empty',
    'no friends', 'nobody cares', 'nobody loves me',
    'feel alone', 'feeling isolated',
    'cant cope', 'cant handle', 'breaking down',
    'mental health', 'emotionally drained',
    // Confidence/self-esteem
    'confidence booster', 'feel worthless', 'useless',
    'hate myself', 'not good enough', 'failure',
    // Tamil
    'romba kashtam', 'vazhkai bore', 'yaarum illai',
    'thani feel', 'kedaiya', 'mental a irukku'
];

// ============================================
// VIOLENCE PATTERNS (Block)
// ============================================
export const VIOLENCE_PATTERNS = [
    'kill', 'how to kill', 'how to hurt', 'how to attack',
    'bomb', 'make a bomb', 'make weapon', 'gun', 'weapon',
    'stab', 'murder', 'beat someone', 'explosion', 'explode',
    // Tamil
    'avana adikanum', 'sandai podanum'
];

// ============================================
// ILLEGAL PATTERNS (Block)
// ============================================
export const ILLEGAL_PATTERNS = [
    'hack wifi', 'hack password', 'hacking',
    'crack software', 'pirate', 'piracy',
    'bypass security', 'steal', 'fraud',
    'fake id', 'drugs', 'weed', 'cocaine'
];

// ============================================
// CHEATING PATTERNS (Block unless learning intent)
// ============================================
export const CHEATING_PATTERNS = [
    'give me answers', 'give answer',
    'write my essay', 'write my assignment',
    'do my homework', 'do homework',
    'solve this entire paper', 'solve paper',
    'complete assignment', 'full answer',
    // Tamil
    'exam answer kudu', 'full answer anupu',
    'assignment complete panni kudu',
    'homework panni kudu', 'paper solution anupu'
];

// ============================================
// LEARNING INTENT CUES (Allow cheating context)
// ============================================
export const LEARNING_INTENT_CUES = [
    'explain', 'how does', 'why does', 'what is',
    'help me understand', 'teach me', 'steps',
    'concept', 'example', 'show me how',
    // Tamil
    'explain pannunga', 'steps sollunga',
    'concept puriyala'
];

// ============================================
// PRIVACY / PII PATTERNS (Block)
// ============================================
export const PRIVACY_PATTERNS = [
    'phone number', 'mobile number', 'email address',
    'home address', 'password', 'otp',
    'where does', 'track', 'location of',
    'find my teacher', 'teacher number',
    'parent number', 'doxxing'
];

// ============================================
// SENSITIVE ACADEMIC TERMS (Need syllabus context)
// ============================================
export const SENSITIVE_ACADEMIC_TERMS = [
    'sex', 'gender', 'reproduction',
    'puberty', 'menstruation', 'periods',
    'pregnancy', 'pregnant', 'contraception',
    'sti', 'hiv', 'aids',
    'sperm', 'ovum', 'fertilization',
    'uterus', 'testes', 'penis', 'vagina',
    'breast', 'intercourse',
    // Tamil
    'reproduction na enna', 'puberty na enna',
    'periods na enna', 'pregnancy epdi'
];

// ============================================
// SYLLABUS CONTEXT CUES (Allow sensitive topics)
// ============================================
export const SYLLABUS_CUES = [
    // Grade/class cues
    'grade', 'class', 'standard', 'std',
    'class 6', 'class 7', 'class 8', 'class 9', 'class 10',
    'class 11', 'class 12',
    '6th', '7th', '8th', '9th', '10th', '11th', '12th',
    // Subject cues
    'chapter', 'lesson', 'textbook', 'book',
    'science', 'biology', 'bio',
    'cbse', 'icse', 'state board', 'ncert',
    'exam', 'notes', 'homework explanation',
    'teacher asked', 'diagram',
    // Tamil
    'paadam', 'teacher sonna', 'book la irukku'
];

// ============================================
// ACADEMIC DOMAINS (Allowlist) - Expanded significantly
// ============================================
export const ACADEMIC_DOMAINS = [
    // Math
    'math', 'mathematics', 'algebra', 'geometry', 'calculus', 'trigonometry',
    'arithmetic', 'equation', 'formula', 'theorem', 'fraction', 'decimal',
    'percentage', 'ratio', 'probability', 'statistics', 'graph', 'function',
    // Physics
    'physics', 'force', 'motion', 'velocity', 'acceleration', 'gravity',
    'thermodynamics', 'heat', 'energy', 'power', 'electricity', 'magnetism',
    'wave', 'light', 'optics', 'sound', 'nuclear', 'quantum', 'momentum',
    'friction', 'pressure', 'density', 'matter', 'atom', 'molecule',
    // Chemistry
    'chemistry', 'element', 'compound', 'reaction', 'acid', 'base', 'salt',
    'periodic table', 'electron', 'proton', 'neutron', 'ion', 'bond',
    'oxidation', 'reduction', 'organic', 'inorganic', 'polymer',
    // Biology
    'biology', 'cell', 'organism', 'plant', 'animal', 'ecosystem',
    'photosynthesis', 'respiration', 'digestion', 'circulation', 'excretion',
    'nervous system', 'evolution', 'genetics', 'dna', 'rna', 'protein',
    'enzyme', 'bacteria', 'virus', 'fungi', 'ecology', 'food chain',
    // History & Geography
    'history', 'geography', 'civics', 'economics', 'civilization',
    'war', 'revolution', 'empire', 'dynasty', 'constitution', 'democracy',
    'climate', 'weather', 'continent', 'country', 'river', 'mountain',
    // English & Language
    'english', 'language', 'literature', 'grammar', 'vocabulary', 'poem',
    'essay', 'story', 'novel', 'character', 'theme', 'metaphor', 'simile',
    // Computer Science
    'computer', 'programming', 'coding', 'python', 'java', 'javascript',
    'algorithm', 'data structure', 'database', 'network', 'software',
    // General academic
    'explain', 'define', 'what is', 'how does', 'why does', 'describe',
    'compare', 'contrast', 'analyze', 'solve', 'calculate', 'derive',
    'exam', 'study', 'homework', 'assignment', 'notes', 'learn', 'understand',
    'concept', 'theory', 'principle', 'law', 'rule', 'example'
];

// ============================================
// NON-ACADEMIC DOMAINS (Reject)
// ============================================
export const NON_ACADEMIC_DOMAINS = [
    'gossip', 'celebrity', 'movie', 'entertainment',
    'joke', 'meme', 'game', 'gaming',
    'personal advice', 'relationship advice'
];

// ============================================
// LEETSPEAK REPLACEMENTS
// ============================================
export const LEETSPEAK_MAP: Record<string, string> = {
    '0': 'o', '1': 'i', '3': 'e', '4': 'a',
    '5': 's', '7': 't', '@': 'a', '$': 's'
};

// ============================================
// RESPONSE TEMPLATES
// ============================================
export const RESPONSE_TEMPLATES = {
    ACADEMIC_REDIRECT: "This assistant supports learning only. Ask a subject question like math, science, or history.",

    CLARIFICATION: "Share your grade and subject. Tell me the chapter name so I can help you better.",

    CLARIFICATION_SENSITIVE: "Is this for a school subject? Please share your grade, board (CBSE/ICSE), and the exact chapter name.",

    CHEATING_REDIRECT: "I can explain steps and concepts, but I won't do your homework for you. Share what you've tried so far, and I'll help you understand.",

    PRIVACY_REDIRECT: "I cannot help with personal data or finding people's information. Ask me a learning question instead.",

    SELF_HARM_ESCALATION: "I'm sorry you're feeling this way. Please talk to a trusted adult, parent, teacher, or counselor right now. If you're in immediate danger, contact local emergency services.",

    PROFANITY_REDIRECT: "Let's keep our conversation respectful. How can I help you with your studies?",

    HARASSMENT_REDIRECT: "I'm here to help you learn, not for negative conversations. What subject can I help you with?",

    BLOCK_GENERIC: "I can only help with academic topics. Ask me about your school subjects!"
};

// ============================================
// GEMINI SYSTEM PROMPTS
// ============================================
export const SYSTEM_PROMPTS = {
    NORMAL: `You are a friendly school learning tutor named Achariya Intelligence.
- Answer academic questions clearly and helpfully
- Keep answers age-appropriate for school students (grades 6-12)
- Avoid personal advice, relationship topics, or non-academic content
- If a question is not academic, politely redirect to asking a school subject question
- Be encouraging and supportive of learning
- If responding in Tamil, use ஆச்சாரியா AI as the name`,

    SENSITIVE: `You are a school biology tutor named Achariya Intelligence providing age-appropriate syllabus-aligned explanations.
- Provide scientific, factual explanations only
- Focus on definitions, diagrams, and biological processes as taught in school textbooks
- Do NOT provide sexual content, romance advice, or explicit details
- Keep explanations at the appropriate grade level
- If the user lacks grade or chapter context, ask for it before answering
- Avoid any content that goes beyond what's in standard CBSE/ICSE textbooks
- If responding in Tamil, use ஆச்சாரியா AI as the name`
};
