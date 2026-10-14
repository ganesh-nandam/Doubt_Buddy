import type { ChatMessage } from './types';

export interface SocraticResponse {
  text: string;
  followUpSuggestions: string[];
}

/**
 * System instructions for DOUBT-BUDDY Socratic Tutor.
 * Used both as the Gemini system prompt and as the design spec for the mock engine.
 */
export const SYSTEM_INSTRUCTIONS = `You are DOUBT-BUDDY, a Socratic Tutor.

RULES:
1. Act as a Socratic Tutor named DOUBT-BUDDY.
2. NEVER give the direct answer to a math, science, or coding problem.
3. Instead, break down the user's problem. Ask ONE guiding question at a time to help them find the answer themselves.
4. If the user says "I don't know", provide an analogy or a simpler version of the problem.
5. Keep your tone encouraging and empathetic.

FORMAT:
- Respond in 1-3 short sentences.
- Always end with a single guiding question.
- Never reveal the final answer, even if the user insists.`;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

/**
 * Returns a Socratic tutoring response for the student's message.
 *
 * If VITE_GEMINI_API_KEY is set in .env, calls the Google Gemini API
 * with the full system instructions and conversation history.
 * Otherwise, falls back to a context-aware mock that follows the same rules.
 */
export async function getSocraticResponse(
  userText: string,
  history: ChatMessage[]
): Promise<SocraticResponse> {
  if (GEMINI_API_KEY) {
    try {
      return await callGemini(userText, history);
    } catch {
      // Fall back to mock if the API call fails
    }
  }
  return mockSocraticResponse(userText, history);
}

// ---------------------------------------------------------------------------
// Gemini API integration
// ---------------------------------------------------------------------------

async function callGemini(
  userText: string,
  history: ChatMessage[]
): Promise<SocraticResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  const contents = [
    ...history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    })),
    { role: 'user', parts: [{ text: userText }] },
  ];

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTIONS }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 200,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "I'm here to guide you. What part of the problem would you like to start with?";

  return {
    text: text.trim(),
    followUpSuggestions: pickSuggestions(userText),
  };
}

// ---------------------------------------------------------------------------
// Mock Socratic engine — follows the same rules as the system instructions
// ---------------------------------------------------------------------------

const dontKnowPhrases = [
  "i don't know",
  'no idea',
  "i don't understand",
  'i am lost',
  'im lost',
  'confused',
  "can't figure",
  'give up',
  'stuck',
  'help me',
  'too hard',
];

const positivePhrases = [
  'yes',
  'right',
  'correct',
  'got it',
  'makes sense',
  'i understand',
  'oh i see',
  'that makes sense',
  'i think i got',
];

const negativePhrases = ['no', 'wrong', 'incorrect', "that's not", 'not right', 'not sure'];

export interface TopicMatch {
  name: string;
  subject: string;
  keywords: string[];
  // Scaffold steps — each is ONE guiding question, revealed one at a time
  steps: string[];
  // Analogy shown when the student says "I don't know"
  analogy: string;
  // A simpler version of the problem
  simplerProblem: string;
}

/**
 * Detects the academic topic from a user message.
 * Returns the canonical topic name and subject, or null if no match.
 */
export function detectTopic(text: string): { topic: string; subject: string } | null {
  const match = findTopic(text);
  if (match) return { topic: match.name, subject: match.subject };
  return null;
}

/**
 * Returns true if the student's message expresses struggle/confusion.
 */
export function isStruggling(text: string): boolean {
  return isDontKnow(text);
}

const topicBank: TopicMatch[] = [
  {
    name: 'Quadratic Equations',
    subject: 'Math',
    keywords: ['quadratic', 'formula', '±', 'plus minus', 'square root', 'discriminant', 'roots'],
    steps: [
      "Let's take it step by step. For ax² + bx + c = 0, when you complete the square, what do you end up with inside the parentheses?",
      "Good. Now, after completing the square you take the square root of both sides. When you do that, why do you get two possibilities (a + and a −)?",
      "Exactly — the ± captures both roots. Now, the part under the square root is b² − 4ac (the discriminant). What happens if the discriminant equals zero?",
    ],
    analogy:
      "Think of the quadratic formula like a vending machine. You put in a, b, and c, and it can give you two drinks (two roots), one drink (one repeated root), or no drink (no real roots). The discriminant is the display that tells you which case you're in.",
    simplerProblem:
      "Let's try a simpler one first. What are the roots of x² − 4 = 0? (Hint: what number squared gives you 4?)",
  },
  {
    name: 'Factoring Trinomials',
    subject: 'Math',
    keywords: ['factor', 'trinomial', 'x²', 'expand', '(x+', 'binomial'],
    steps: [
      "Factoring is reverse multiplication. If we write (x + a)(x + b), what do a × b and a + b need to equal in x² + 5x + 6?",
      "Great — so you need two numbers that multiply to 6 and add to 5. Can you think of any?",
      "Once you find those two numbers, how would you write the factored form?",
    ],
    analogy:
      "Imagine factoring like un-tying a knot. You multiplied two binomials to get the trinomial — now we're carefully reversing each step to find what those original two pieces were.",
    simplerProblem:
      "Let's try an easier one: factor x² + 3x + 2. What two numbers multiply to 2 and add to 3?",
  },
  {
    name: 'Parabola Vertex',
    subject: 'Math',
    keywords: ['vertex', 'parabola', 'axis of symmetry', 'minimum', 'maximum', 'opening up', 'opening down'],
    steps: [
      "Every parabola has a vertex — its lowest or highest point. For y = ax² + bx + c, what formula gives the x-coordinate of that vertex?",
      "So x = −b/2a gives the axis of symmetry. Once you have the x, how do you find the y-coordinate of the vertex?",
      "Now, what determines whether the parabola opens upward or downward — is it a, b, or c?",
    ],
    analogy:
      "Think of a parabola like a skateboard half-pipe. The vertex is the lowest point you'd stand at. The coefficient 'a' tells you whether it's a regular half-pipe (opens up) or an upside-down one (opens down).",
    simplerProblem:
      "Let's simplify. For y = x² − 2x, what is −b/2a? (Here a = 1, b = −2.)",
  },
  {
    name: 'Linear Equations',
    subject: 'Math',
    keywords: ['slope', 'intercept', 'y = mx', 'linear', 'gradient', 'rise over run'],
    steps: [
      "In y = mx + b, what does the 'm' represent on the graph?",
      "Right — m is the slope, or 'rise over run.' And what does the 'b' tell you?",
      "If you had two points (1, 3) and (4, 12), how would you calculate the slope between them?",
    ],
    analogy:
      "Think of slope like climbing stairs. 'Rise' is how high each step goes, 'run' is how deep each step is. The slope is just rise divided by run — how steep the stairs are.",
    simplerProblem:
      "Let's try a simple one. For y = 2x + 1, what is the slope and where does the line cross the y-axis?",
  },
  {
    name: "Newton's Laws",
    subject: 'Physics',
    keywords: ['newton', 'force', 'law', 'inertia', 'f=ma', 'f = ma', 'acceleration', 'momentum'],
    steps: [
      "Newton's Second Law says F = ma. If you double the force while keeping mass the same, what happens to the acceleration?",
      "Good. Now, what if the mass doubles instead but the force stays the same — what changes in the acceleration?",
      "Let's go further: can you list the forces acting on a book sliding down a frictionless ramp?",
    ],
    analogy:
      "Think of F = ma like pushing a shopping cart. A full cart (more mass) is harder to get moving than an empty one. If you push harder (more force), it speeds up faster. That's all the equation says.",
    simplerProblem:
      "Let's simplify. If a 2 kg cart is pushed with 6 N of force, what's the acceleration? (Use a = F/m.)",
  },
  {
    name: 'Stoichiometry',
    subject: 'Chemistry',
    keywords: ['stoichiometry', 'mole', 'molar', 'balance', 'chemical equation', 'avogadro'],
    steps: [
      "Stoichiometry is about mole ratios. In 2H₂ + O₂ → 2H₂O, what is the ratio of H₂ to H₂O?",
      "So if you have 4 moles of H₂, how many moles of water would you produce?",
      "Now, to go from moles of water to grams, what do you need to multiply by?",
    ],
    analogy:
      "Think of a balanced equation like a recipe. 2 cups of flour + 1 egg = 2 pancakes. The coefficients tell you the ratio — just like ingredients in cooking. Stoichiometry is just scaling the recipe up or down.",
    simplerProblem:
      "Let's try a simple one. If 1 mole of C produces 1 mole of CO₂, how many moles of CO₂ come from 3 moles of C?",
  },
  {
    name: 'Projectile Motion',
    subject: 'Physics',
    keywords: ['projectile', 'trajectory', 'launch', 'angle', 'range', 'height'],
    steps: [
      "A projectile's motion has two independent parts: horizontal and vertical. Which one is affected by gravity?",
      "Right — only the vertical part. So how long the object stays in the air depends on what?",
      "If you know the time in the air, how would you find the horizontal distance traveled?",
    ],
    analogy:
      "Imagine rolling a ball off a table. The ball keeps moving forward at the same speed, but gravity pulls it down faster and faster. These two motions happen at the same time but don't affect each other — like two separate timers running side by side.",
    simplerProblem:
      "Let's simplify. If a ball is thrown straight up at 10 m/s, and gravity slows it by 10 m/s each second, how long until it stops rising?",
  },
  {
    name: 'Programming Basics',
    subject: 'Computer Science',
    keywords: ['code', 'coding', 'python', 'javascript', 'function', 'bug', 'error', 'loop', 'array'],
    steps: [
      "Let's look at this together. What is your code supposed to do, and what is it doing instead?",
      "Can you point to the specific line or section where you think the problem might be?",
      "What happens if you trace through that section step by step — what value does each variable hold?",
    ],
    analogy:
      "Debugging is like following a recipe that went wrong. You don't throw out the whole dish — you go back and check each step to find where the salt became sugar. Let's check your code one step at a time.",
    simplerProblem:
      "Let's simplify. Can you write out what you expect the output to be for the simplest possible input? What does your code actually give for that same input?",
  },
  {
    name: 'Trigonometry',
    subject: 'Math',
    keywords: ['trigonometry', 'sin', 'cos', 'tan', 'angle', 'triangle', 'sohcahtoa'],
    steps: [
      "Let's start with the basics. In a right triangle, which sides are 'opposite' and 'adjacent' relative to a given angle?",
      "Good. SOH-CAH-TOA tells us sine = opposite/hypotenuse. So for your angle, which side is opposite?",
      "Now, can you set up the equation using the correct ratio and solve for the missing side?",
    ],
    analogy:
      "Think of SOH-CAH-TOA as three name tags on the sides of a right triangle. Depending on which angle you're looking from, the 'opposite' and 'adjacent' tags swap positions — but the hypotenuse always stays the same.",
    simplerProblem:
      "Let's simplify. In a right triangle with a 30° angle and hypotenuse of 10, what is sin(30°)? (Think: opposite/hypotenuse.)",
  },
];

const generalSteps = [
  "That's a great question. Before I guide you — what do you already know about this topic?",
  "Let's break it into smaller pieces. What do you think the very first step should be?",
  "Can you tell me what you've tried so far, so I can see where your thinking is at?",
];

const generalAnalogy =
  "Think of learning like building with blocks. You don't place the roof first — you start with the foundation. Let's find the foundation of this problem together.";

const generalSimpler =
  "Let's try a simpler version. If we remove some of the complexity, what's the core idea we're working with?";

const dontKnowResponses = [
  "That's totally okay — not knowing is where real learning begins. Let me give you an analogy:\n\n",
  "No worries at all, confusion is part of the process. Let me make this simpler:\n\n",
  "I appreciate you being honest about that. Let me try a different angle:\n\n",
];

const positiveResponses = [
  "Excellent work! You're really getting it. Now, can you apply this reasoning to a slightly trickier version of the same problem?",
  "That's exactly right — I love how you reasoned through that! What would change if we tweaked one of the values?",
  "Beautiful! You found it on your own. Can you now write out the full solution so you see the complete flow?",
  "Spot on! You should feel proud of that. Want to try a related problem to solidify this?",
];

const negativeResponses = [
  "Close! You're thinking in the right direction. Let's check the step before that — what assumption did we make?",
  "Not quite, but the fact that you're reasoning through it is exactly what matters. Can you walk me through your thinking so far?",
  "Almost there! Let's re-examine. Where do you think the error might have crept in?",
];

const suggestionBank = [
  "I don't know",
  "Can you give me a hint?",
  "I think I got it!",
  "Walk me through step by step",
  "Give me a simpler example",
];

function findTopic(text: string): TopicMatch | null {
  const lower = text.toLowerCase();
  for (const topic of topicBank) {
    if (topic.keywords.some((kw) => lower.includes(kw))) {
      return topic;
    }
  }
  return null;
}

function isDontKnow(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return dontKnowPhrases.some((p) => lower.includes(p));
}

function isPositive(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return positivePhrases.some((p) => lower.includes(p));
}

function isNegative(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return negativePhrases.some((p) => lower.includes(p));
}

function pickSuggestions(text: string): string[] {
  if (isDontKnow(text)) return ['Can you give me a hint?', 'Walk me through step by step'];
  if (isPositive(text)) return ['Try a harder one!', 'I have another question'];
  if (isNegative(text)) return ["I don't know", 'Walk me through step by step'];
  return ["I don't know", 'Can you give me a hint?'];
}

function mockSocraticResponse(userText: string, history: ChatMessage[]): SocraticResponse {
  // Count how many tutor responses have been given for this topic
  // to advance through the scaffolding steps
  const userMessages = history.filter((m) => m.role === 'user');
  const tutorMessages = history.filter((m) => m.role === 'tutor');
  const conversationDepth = tutorMessages.length;

  // 1. "I don't know" → analogy + simpler problem
  if (isDontKnow(userText)) {
    const topic = findTopic(
      // Look at the last few user messages for topic context
      [...userMessages.map((m) => m.text), userText].reverse().join(' ')
    );
    const opener = dontKnowResponses[conversationDepth % dontKnowResponses.length];
    const analogy = topic ? topic.analogy : generalAnalogy;
    const simpler = topic ? topic.simplerProblem : generalSimpler;

    return {
      text: `${opener}${analogy}\n\n${simpler}`,
      followUpSuggestions: ['Can you give me a hint?', 'Walk me through step by step'],
    };
  }

  // 2. Positive signal → encouragement + next challenge
  if (isPositive(userText)) {
    return {
      text: positiveResponses[conversationDepth % positiveResponses.length],
      followUpSuggestions: ['Try a harder one!', 'I have another question'],
    };
  }

  // 3. Negative signal → redirect to previous step
  if (isNegative(userText)) {
    return {
      text: negativeResponses[conversationDepth % negativeResponses.length],
      followUpSuggestions: ["I don't know", 'Walk me through step by step'],
    };
  }

  // 4. Topic-specific scaffolding — advance one step at a time
  const topic = findTopic(userText);
  if (topic) {
    const stepIndex = conversationDepth % topic.steps.length;
    return {
      text: topic.steps[stepIndex],
      followUpSuggestions: pickSuggestions(userText),
    };
  }

  // 5. General fallback
  const topicFromHistory = findTopic(userMessages.slice(-3).map((m) => m.text).join(' '));
  if (topicFromHistory) {
    const stepIndex = conversationDepth % topicFromHistory.steps.length;
    return {
      text: topicFromHistory.steps[stepIndex],
      followUpSuggestions: pickSuggestions(userText),
    };
  }

  return {
    text: generalSteps[conversationDepth % generalSteps.length],
    followUpSuggestions: pickSuggestions(userText),
  };
}

export const quickPrompts = [
  "I don't understand the quadratic formula",
  'How do I factor x² + 5x + 6?',
  'How do I find the vertex of a parabola?',
  "Explain Newton's second law",
];
