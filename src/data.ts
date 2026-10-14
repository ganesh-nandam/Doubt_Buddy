import type {
  ChatMessage,
  DoubtHistoryItem,
  WeakSpot,
  PracticeQuestion,
  Student,
} from './types';

export const initialChatHistory: ChatMessage[] = [
  {
    id: 'm1',
    role: 'tutor',
    text: "Hi Aarav! I'm your Socratic tutor. What concept are you stuck on today?",
    timestamp: '10:15 AM',
  },
  {
    id: 'm2',
    role: 'user',
    text: "I don't get why the quadratic formula has a plus-minus in front of the square root.",
    timestamp: '10:16 AM',
  },
  {
    id: 'm3',
    role: 'tutor',
    text: "Good question. When you complete the square for ax² + bx + c = 0, what two possibilities does the last step give you?",
    timestamp: '10:16 AM',
  },
  {
    id: 'm4',
    role: 'user',
    text: "Hmm… two values for x? One with + and one with −?",
    timestamp: '10:17 AM',
  },
  {
    id: 'm5',
    role: 'tutor',
    text: "Exactly. So if a parabola crosses the x-axis twice, how many roots should the formula produce?",
    timestamp: '10:17 AM',
  },
  {
    id: 'm6',
    role: 'user',
    text: "Two roots! That's why there's a ± — it gives both solutions in one formula.",
    timestamp: '10:18 AM',
  },
  {
    id: 'm7',
    role: 'tutor',
    text: "Spot on. Now, can you think of a case where there might only be one root?",
    timestamp: '10:18 AM',
  },
];

export const doubtHistory: DoubtHistoryItem[] = [
  { id: 'd1', topic: 'Quadratic Formula', subject: 'Math', question: 'Why does ± appear in the formula?', status: 'resolved', date: 'Today' },
  { id: 'd2', topic: 'Completing the Square', subject: 'Math', question: 'How to factor x² + 6x + 9?', status: 'resolved', date: 'Today' },
  { id: 'd3', topic: 'Parabola Vertex', subject: 'Math', question: 'Finding the vertex of a parabola', status: 'in-progress', date: 'Yesterday' },
  { id: 'd4', topic: 'Linear Equations', subject: 'Math', question: 'Solving 3x + 7 = 22', status: 'resolved', date: 'Yesterday' },
  { id: 'd5', topic: 'Factoring Trinomials', subject: 'Math', question: "Can't factor x² + 5x + 6", status: 'open', date: '2 days ago' },
  { id: 'd6', topic: 'Slope-Intercept Form', subject: 'Math', question: 'y = mx + b meaning', status: 'resolved', date: '3 days ago' },
];

export const studentWeakSpots: WeakSpot[] = [
  { id: 'w1', topic: 'Quadratic Equations', subject: 'Math', mastery: 35, attempts: 12, trend: 'improving' },
  { id: 'w2', topic: 'Factoring Trinomials', subject: 'Math', mastery: 48, attempts: 8, trend: 'declining' },
  { id: 'w3', topic: 'Parabola Vertex', subject: 'Math', mastery: 55, attempts: 5, trend: 'stable' },
  { id: 'w4', topic: 'Completing the Square', subject: 'Math', mastery: 62, attempts: 6, trend: 'improving' },
];

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'q1',
    topic: 'Quadratic Equations',
    question: 'Solve x² + 7x + 12 = 0 using factoring. What are the two roots?',
    hint: 'Think: what two numbers multiply to 12 and add to 7?',
    answer: 'x = -3, x = -4',
  },
  {
    id: 'q2',
    topic: 'Factoring Trinomials',
    question: 'Factor completely: 2x² + 5x − 3',
    hint: 'Look for an (ax + b)(cx + d) pattern where ac = 2 and bd = −3.',
    answer: '(2x − 1)(x + 3)',
  },
  {
    id: 'q3',
    topic: 'Parabola Vertex',
    question: 'Find the vertex of y = x² − 4x + 1 using x = −b/2a.',
    hint: 'Here a = 1 and b = −4. Plug into x = −b/(2a) first.',
    answer: '(2, −3)',
  },
];

/**
 * Bank of practice questions organized by topic, with 3 difficulty tiers each.
 * Used to dynamically populate the Practice Questions section based on
 * the student's weak spots detected from chat.
 */
export const practiceQuestionBank: Record<string, { easy: PracticeQuestion; medium: PracticeQuestion; hard: PracticeQuestion }> = {
  'Quadratic Equations': {
    easy: {
      id: 'qe-easy',
      topic: 'Quadratic Equations',
      question: 'Find the roots of x² − 5x + 6 = 0 by factoring.',
      hint: 'What two numbers multiply to 6 and add to −5?',
      answer: 'x = 2, x = 3',
    },
    medium: {
      id: 'qe-medium',
      topic: 'Quadratic Equations',
      question: 'Solve 2x² + 3x − 2 = 0 using the quadratic formula.',
      hint: 'Use x = (−b ± √(b²−4ac)) / 2a. Here a=2, b=3, c=−2.',
      answer: 'x = 0.5, x = -2',
    },
    hard: {
      id: 'qe-hard',
      topic: 'Quadratic Equations',
      question: 'For what value of k does kx² + 4x + 1 = 0 have exactly one real root?',
      hint: 'One real root means the discriminant b² − 4ac = 0.',
      answer: 'k = 4',
    },
  },
  'Factoring Trinomials': {
    easy: {
      id: 'ft-easy',
      topic: 'Factoring Trinomials',
      question: 'Factor: x² + 7x + 12',
      hint: 'Find two numbers that multiply to 12 and add to 7.',
      answer: '(x + 3)(x + 4)',
    },
    medium: {
      id: 'ft-medium',
      topic: 'Factoring Trinomials',
      question: 'Factor completely: 3x² + 11x + 6',
      hint: 'Try (3x + ?)(x + ?). What gives 3×2=6 and 9+2=11?',
      answer: '(3x + 2)(x + 3)',
    },
    hard: {
      id: 'ft-hard',
      topic: 'Factoring Trinomials',
      question: 'Factor: 6x² − 7x − 20',
      hint: 'Look for (ax + b)(cx + d) where ac = 6 and bd = −20.',
      answer: '(2x − 5)(3x + 4)',
    },
  },
  'Parabola Vertex': {
    easy: {
      id: 'pv-easy',
      topic: 'Parabola Vertex',
      question: 'Find the vertex of y = x² − 6x using x = −b/2a.',
      hint: 'Here a = 1, b = −6. What is −(−6)/2(1)?',
      answer: '(3, -9)',
    },
    medium: {
      id: 'pv-medium',
      topic: 'Parabola Vertex',
      question: 'Find the vertex of y = 2x² + 8x + 5.',
      hint: 'a = 2, b = 8. Find x = −b/2a, then plug back for y.',
      answer: '(-2, -3)',
    },
    hard: {
      id: 'pv-hard',
      topic: 'Parabola Vertex',
      question: 'A parabola has vertex (2, −4) and passes through (0, 0). Find its equation in vertex form.',
      hint: 'Vertex form is y = a(x − h)² + k. Use the point to find a.',
      answer: 'y = (x − 2)² − 4',
    },
  },
  'Linear Equations': {
    easy: {
      id: 'le-easy',
      topic: 'Linear Equations',
      question: 'Solve for x: 3x + 7 = 22',
      hint: 'Subtract 7 from both sides, then divide by 3.',
      answer: 'x = 5',
    },
    medium: {
      id: 'le-medium',
      topic: 'Linear Equations',
      question: 'Find the slope of the line passing through (1, 3) and (4, 12).',
      hint: 'Slope = (y₂ − y₁) / (x₂ − x₁).',
      answer: 'm = 3',
    },
    hard: {
      id: 'le-hard',
      topic: 'Linear Equations',
      question: 'Write the equation of the line with slope 2 passing through (3, 5) in point-slope form.',
      hint: 'Point-slope form: y − y₁ = m(x − x₁).',
      answer: 'y − 5 = 2(x − 3)',
    },
  },
  "Newton's Laws": {
    easy: {
      id: 'nl-easy',
      topic: "Newton's Laws",
      question: 'A 2 kg block is pushed with 10 N of force. Find the acceleration.',
      hint: 'Use F = ma, so a = F/m.',
      answer: '5 m/s²',
    },
    medium: {
      id: 'nl-medium',
      topic: "Newton's Laws",
      question: 'A 5 kg object has a net force of 15 N north and 20 N east. Find the magnitude of acceleration.',
      hint: 'First find the net force magnitude using Pythagoras, then a = F/m.',
      answer: '5 m/s²',
    },
    hard: {
      id: 'nl-hard',
      topic: "Newton's Laws",
      question: 'Two blocks (3 kg and 2 kg) are connected by a string over a frictionless pulley. Find the acceleration of the system.',
      hint: 'Net force = (m₁ − m₂)g, total mass = m₁ + m₂. Use a = F/m.',
      answer: '1.96 m/s²',
    },
  },
  'Stoichiometry': {
    easy: {
      id: 'st-easy',
      topic: 'Stoichiometry',
      question: 'Balance: H₂ + O₂ → H₂O',
      hint: 'Count atoms on each side. You need 2 O on the left.',
      answer: '2H₂ + O₂ → 2H₂O',
    },
    medium: {
      id: 'st-medium',
      topic: 'Stoichiometry',
      question: 'How many moles of CO₂ are produced from 4 moles of C₃H₈ in complete combustion?',
      hint: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O. The ratio is 1:3.',
      answer: '12 moles',
    },
    hard: {
      id: 'st-hard',
      topic: 'Stoichiometry',
      question: 'How many grams of H₂O are produced from 0.5 moles of O₂ reacting with excess H₂? (Molar mass of H₂O = 18 g/mol)',
      hint: '2H₂ + O₂ → 2H₂O. So 0.5 mol O₂ → 1.0 mol H₂O. Then convert to grams.',
      answer: '18 g',
    },
  },
  'Projectile Motion': {
    easy: {
      id: 'pm-easy',
      topic: 'Projectile Motion',
      question: 'A ball is thrown straight up at 20 m/s. How long until it reaches its peak? (g = 10 m/s²)',
      hint: 'At the peak, velocity = 0. Use v = v₀ − gt.',
      answer: '2 s',
    },
    medium: {
      id: 'pm-medium',
      topic: 'Projectile Motion',
      question: 'A ball is launched at 20 m/s at 30°. Find the horizontal range. (g = 10 m/s²)',
      hint: 'Range = v²sin(2θ)/g. sin(60°) = √3/2.',
      answer: '34.64 m',
    },
    hard: {
      id: 'pm-hard',
      topic: 'Projectile Motion',
      question: 'A projectile launched at 45° has a range of 40 m. What was its initial speed? (g = 10 m/s²)',
      hint: 'Range = v²sin(90°)/g = v²/g (since sin90°=1). Solve for v.',
      answer: '20 m/s',
    },
  },
  'Trigonometry': {
    easy: {
      id: 'tr-easy',
      topic: 'Trigonometry',
      question: 'In a right triangle, the opposite side is 3 and the hypotenuse is 5. Find sin(θ).',
      hint: 'sin(θ) = opposite / hypotenuse.',
      answer: '0.6',
    },
    medium: {
      id: 'tr-medium',
      topic: 'Trigonometry',
      question: 'A ladder leans against a wall at 60° to the ground. If the ladder is 10 m long, how high up the wall does it reach?',
      hint: 'Use sin(60°) = height / ladder length. sin(60°) = √3/2.',
      answer: '8.66 m',
    },
    hard: {
      id: 'tr-hard',
      topic: 'Trigonometry',
      question: 'Find all angles θ in [0°, 360°) where cos(θ) = −√2/2.',
      hint: 'cos is negative in Q2 and Q3. The reference angle is 45°.',
      answer: '135°, 225°',
    },
  },
  'Programming Basics': {
    easy: {
      id: 'pb-easy',
      topic: 'Programming Basics',
      question: 'What will print? `for i in range(3): print(i)`',
      hint: 'range(3) generates 0, 1, 2.',
      answer: '0 1 2',
    },
    medium: {
      id: 'pb-medium',
      topic: 'Programming Basics',
      question: 'What does this return? `[x * 2 for x in [1, 2, 3]]`',
      hint: 'This is a list comprehension that doubles each element.',
      answer: '[2, 4, 6]',
    },
    hard: {
      id: 'pb-hard',
      topic: 'Programming Basics',
      question: 'What is the output of `len("hello"[1:4])`?',
      hint: 'String slicing [1:4] extracts characters at indices 1, 2, 3.',
      answer: '3',
    },
  },
};

export const students: Student[] = [
  {
    id: 's1',
    name: 'Aarav Sharma',
    avatar: 'AS',
    subjects: ['Math', 'Physics'],
    engagementMinutes: 248,
    doubtsAsked: 14,
    doubtsResolved: 11,
    frustrationLevel: 4,
    lastActive: '5 min ago',
    weakSpots: [
      { id: 'w1', topic: 'Quadratic Equations', subject: 'Math', mastery: 35, attempts: 12, trend: 'improving' },
      { id: 'w2', topic: 'Factoring Trinomials', subject: 'Math', mastery: 48, attempts: 8, trend: 'declining' },
      { id: 'w3', topic: 'Kinematics', subject: 'Physics', mastery: 52, attempts: 6, trend: 'stable' },
    ],
  },
  {
    id: 's2',
    name: 'Diya Patel',
    avatar: 'DP',
    subjects: ['Math', 'Chemistry'],
    engagementMinutes: 186,
    doubtsAsked: 9,
    doubtsResolved: 8,
    frustrationLevel: 2,
    lastActive: '20 min ago',
    weakSpots: [
      { id: 'w4', topic: 'Linear Equations', subject: 'Math', mastery: 70, attempts: 5, trend: 'improving' },
      { id: 'w5', topic: 'Stoichiometry', subject: 'Chemistry', mastery: 44, attempts: 7, trend: 'declining' },
    ],
  },
  {
    id: 's3',
    name: 'Kabir Singh',
    avatar: 'KS',
    subjects: ['Physics', 'Math'],
    engagementMinutes: 312,
    doubtsAsked: 22,
    doubtsResolved: 15,
    frustrationLevel: 7,
    lastActive: '2 min ago',
    weakSpots: [
      { id: 'w6', topic: 'Newton\'s Laws', subject: 'Physics', mastery: 30, attempts: 14, trend: 'declining' },
      { id: 'w7', topic: 'Quadratic Equations', subject: 'Math', mastery: 41, attempts: 9, trend: 'stable' },
      { id: 'w8', topic: 'Projectile Motion', subject: 'Physics', mastery: 38, attempts: 8, trend: 'declining' },
    ],
  },
  {
    id: 's4',
    name: 'Ananya Rao',
    avatar: 'AR',
    subjects: ['Chemistry', 'Biology'],
    engagementMinutes: 154,
    doubtsAsked: 7,
    doubtsResolved: 7,
    frustrationLevel: 1,
    lastActive: '1 hour ago',
    weakSpots: [
      { id: 'w9', topic: 'Cell Division', subject: 'Biology', mastery: 75, attempts: 4, trend: 'improving' },
      { id: 'w10', topic: 'Chemical Bonding', subject: 'Chemistry', mastery: 58, attempts: 5, trend: 'stable' },
    ],
  },
  {
    id: 's5',
    name: 'Ishaan Verma',
    avatar: 'IV',
    subjects: ['Math', 'Physics'],
    engagementMinutes: 95,
    doubtsAsked: 5,
    doubtsResolved: 3,
    frustrationLevel: 5,
    lastActive: '3 hours ago',
    weakSpots: [
      { id: 'w11', topic: 'Trigonometry', subject: 'Math', mastery: 40, attempts: 4, trend: 'stable' },
      { id: 'w12', topic: 'Ohm\'s Law', subject: 'Physics', mastery: 50, attempts: 3, trend: 'declining' },
    ],
  },
  {
    id: 's6',
    name: 'Sara Khan',
    avatar: 'SK',
    subjects: ['Biology', 'Chemistry'],
    engagementMinutes: 201,
    doubtsAsked: 12,
    doubtsResolved: 10,
    frustrationLevel: 3,
    lastActive: '30 min ago',
    weakSpots: [
      { id: 'w13', topic: 'Genetics', subject: 'Biology', mastery: 45, attempts: 8, trend: 'improving' },
      { id: 'w14', topic: 'Acids & Bases', subject: 'Chemistry', mastery: 60, attempts: 5, trend: 'stable' },
    ],
  },
];

export const classWeakSpotAggregation = [
  { topic: 'Quadratic Equations', subject: 'Math', studentsAffected: 4, avgMastery: 38 },
  { topic: 'Newton\'s Laws', subject: 'Physics', studentsAffected: 3, avgMastery: 32 },
  { topic: 'Factoring Trinomials', subject: 'Math', studentsAffected: 3, avgMastery: 45 },
  { topic: 'Stoichiometry', subject: 'Chemistry', studentsAffected: 2, avgMastery: 44 },
  { topic: 'Projectile Motion', subject: 'Physics', studentsAffected: 2, avgMastery: 38 },
];
