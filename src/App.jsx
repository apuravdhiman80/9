
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const SAVE_KEY = "nexus-class9-academy-v2";

const WORLDS = [
  { id: "All", icon: "✦", name: "Mystery Academy", sub: "Explore every subject", color: "violet" },
  { id: "Mathematics", icon: "∑", name: "Maths Dimension", sub: "Numbers, patterns and logic", color: "blue" },
  { id: "Science", icon: "⚛", name: "Science Laboratory", sub: "Matter, motion and life", color: "green" },
  { id: "English", icon: "Aa", name: "Word Kingdom", sub: "Grammar and word puzzles", color: "orange" },
];

const MODES = [
  { id: "Explorer", icon: "☁", label: "Explorer", time: 45, multiplier: 0.8, text: "Learn at your own pace" },
  { id: "Classic", icon: "⚡", label: "Classic", time: 30, multiplier: 1, text: "The balanced challenge" },
  { id: "Blitz", icon: "🔥", label: "Blitz", time: 20, multiplier: 1.5, text: "Race against time" },
];

const BANK = [
  // MATHEMATICS — CBSE CLASS 9 LEVEL
  {
    id: "M01", subject: "Mathematics", topic: "Linear Equations", level: "Easy",
    room: "Equation Chamber", icon: "∑", points: 100,
    question: "A vault opens when 3x + 5 = 26. Find x.",
    options: ["5", "6", "7", "8"], answer: "7",
    hint: "Undo the addition before dividing by 3.",
    explanation: "3x + 5 = 26 gives 3x = 21, so x = 7.",
  },
  {
    id: "M02", subject: "Mathematics", topic: "Number Systems", level: "Medium",
    room: "Irrational Vault", icon: "√", points: 120,
    question: "Which of these numbers is irrational?",
    options: ["√9", "0.625", "√7", "−4"], answer: "√7",
    hint: "A square root of an integer is irrational when the integer is not a perfect square.",
    explanation: "7 is not a perfect square, so √7 is irrational. The other choices are rational.",
  },
  {
    id: "M03", subject: "Mathematics", topic: "Polynomials", level: "Medium",
    room: "Polynomial Portal", icon: "x²", points: 120,
    question: "If p(x) = x² − 3x + 2, find p(4).",
    options: ["4", "5", "6", "8"], answer: "6",
    hint: "Replace each x with 4, including the x² term.",
    explanation: "p(4) = 4² − 3(4) + 2 = 16 − 12 + 2 = 6.",
  },
  {
    id: "M04", subject: "Mathematics", topic: "Coordinate Geometry", level: "Easy",
    room: "Coordinate Maze", icon: "⌖", points: 100,
    question: "Where does the point (0, −5) lie?",
    options: ["Positive x-axis", "Negative x-axis", "Positive y-axis", "Negative y-axis"],
    answer: "Negative y-axis",
    hint: "The x-coordinate is zero. Use the sign of the y-coordinate to decide which half of the vertical axis.",
    explanation: "Since x = 0 and y is negative, the point lies on the negative y-axis.",
  },
  {
    id: "M05", subject: "Mathematics", topic: "Triangles", level: "Easy",
    room: "Angle Chamber", icon: "△", points: 100,
    question: "Two angles of a triangle are 48° and 67°. Find its third angle.",
    options: ["55°", "65°", "75°", "85°"], answer: "65°",
    hint: "The three interior angles of a triangle add up to 180°.",
    explanation: "180° − 48° − 67° = 65°.",
  },
  {
    id: "M06", subject: "Mathematics", topic: "Number Patterns", level: "Medium",
    room: "Sequence Vault", icon: "◇", points: 120,
    question: "Three consecutive positive integers have a sum of 72. What is the middle integer?",
    options: ["22", "23", "24", "25"], answer: "24",
    hint: "Represent the numbers as n − 1, n and n + 1.",
    explanation: "(n − 1) + n + (n + 1) = 72. Therefore 3n = 72 and n = 24.",
  },
  {
    id: "M07", subject: "Mathematics", topic: "Exponents", level: "Medium",
    room: "Power Circuit", icon: "2ⁿ", points: 120,
    question: "Simplify (2⁵ × 2³) ÷ 2⁴.",
    options: ["8", "12", "16", "32"], answer: "16",
    hint: "When multiplying powers with the same base, add exponents. When dividing, subtract them.",
    explanation: "(2⁵ × 2³) ÷ 2⁴ = 2⁽⁵⁺³⁻⁴⁾ = 2⁴ = 16.",
  },
  {
    id: "M08", subject: "Mathematics", topic: "Statistics", level: "Easy",
    room: "Data Detective", icon: "▥", points: 100,
    question: "Find the mean of 5, 7, 9, 11 and 13.",
    options: ["7", "8", "9", "11"], answer: "9",
    hint: "Add all observations, then divide by the number of observations.",
    explanation: "Mean = (5 + 7 + 9 + 11 + 13) ÷ 5 = 45 ÷ 5 = 9.",
  },
  {
    id: "M09", subject: "Mathematics", topic: "Heron's Formula", level: "Hard",
    room: "Area Mystery", icon: "△", points: 150,
    question: "A triangular plot has sides 13 m, 14 m and 15 m. What is its area?",
    options: ["72 m²", "78 m²", "84 m²", "96 m²"], answer: "84 m²",
    hint: "Calculate the semi-perimeter before applying Heron's formula.",
    explanation: "s = (13 + 14 + 15)/2 = 21. Area = √[21(21−13)(21−14)(21−15)] = √7056 = 84 m².",
  },
  {
    id: "M10", subject: "Mathematics", topic: "Probability", level: "Medium",
    room: "Chance Engine", icon: "◉", points: 120,
    question: "A fair die is rolled once. What is the probability of obtaining an even number?",
    options: ["1/6", "1/3", "1/2", "2/3"], answer: "1/2",
    hint: "Count the even outcomes among the six equally likely outcomes.",
    explanation: "The even outcomes are 2, 4 and 6. The probability is 3/6 = 1/2.",
  },
  {
    id: "M11", subject: "Mathematics", topic: "Mensuration", level: "Easy",
    room: "Cube Vault", icon: "⬡", points: 100,
    question: "A cube has an edge of 4 cm. What is its volume?",
    options: ["16 cm³", "32 cm³", "48 cm³", "64 cm³"], answer: "64 cm³",
    hint: "The volume of a cube is the cube of its edge length.",
    explanation: "Volume = 4³ = 4 × 4 × 4 = 64 cm³.",
  },
  {
    id: "M12", subject: "Mathematics", topic: "Linear Equations in Two Variables", level: "Hard",
    room: "Twin-Code Lock", icon: "x+y", points: 150,
    question: "The equation 2x + 3y = 12 is satisfied by x = 3. Find y.",
    options: ["1", "2", "3", "4"], answer: "2",
    hint: "Substitute x = 3 and solve the remaining equation.",
    explanation: "6 + 3y = 12, so 3y = 6 and y = 2.",
  },

  // SCIENCE
  {
    id: "S01", subject: "Science", topic: "Motion", level: "Easy",
    room: "Velocity Engine", icon: "↗", points: 100,
    question: "A cyclist travels 180 m in 12 seconds at uniform speed. Find the speed.",
    options: ["12 m/s", "15 m/s", "18 m/s", "24 m/s"], answer: "15 m/s",
    hint: "Speed is distance divided by time.",
    explanation: "Speed = 180 ÷ 12 = 15 m/s.",
  },
  {
    id: "S02", subject: "Science", topic: "Motion", level: "Medium",
    room: "Acceleration Core", icon: "a", points: 120,
    question: "A car's velocity increases from 4 m/s to 16 m/s in 3 seconds. Find its acceleration.",
    options: ["3 m/s²", "4 m/s²", "5 m/s²", "6 m/s²"], answer: "4 m/s²",
    hint: "Acceleration equals change in velocity divided by elapsed time.",
    explanation: "a = (16 − 4)/3 = 12/3 = 4 m/s².",
  },
  {
    id: "S03", subject: "Science", topic: "Force and Laws of Motion", level: "Easy",
    room: "Inertia Chamber", icon: "↔", points: 100,
    question: "A passenger moves forward when a moving bus suddenly stops. Which concept explains this?",
    options: ["Inertia", "Buoyancy", "Diffusion", "Refraction"], answer: "Inertia",
    hint: "Think about an object's tendency to resist a change in its state of motion.",
    explanation: "The passenger's body tends to continue moving as the bus stops. This illustrates inertia.",
  },
  {
    id: "S04", subject: "Science", topic: "Force and Laws of Motion", level: "Medium",
    room: "Force Reactor", icon: "F", points: 120,
    question: "A 6 kg object accelerates at 3 m/s². What is the net force acting on it?",
    options: ["9 N", "12 N", "18 N", "24 N"], answer: "18 N",
    hint: "Use Newton's second law relating force, mass and acceleration.",
    explanation: "F = ma = 6 × 3 = 18 N.",
  },
  {
    id: "S05", subject: "Science", topic: "Gravitation", level: "Medium",
    room: "Gravity Vault", icon: "g", points: 120,
    question: "Find the weight of a 10 kg object on Earth. Take g = 9.8 m/s².",
    options: ["10 N", "49 N", "98 N", "980 N"], answer: "98 N",
    hint: "Weight is the gravitational force acting on an object.",
    explanation: "W = mg = 10 × 9.8 = 98 N.",
  },
  {
    id: "S06", subject: "Science", topic: "Work and Energy", level: "Medium",
    room: "Energy Core", icon: "J", points: 120,
    question: "A force of 20 N moves a box 5 m in the force's direction. Find the work done.",
    options: ["25 J", "50 J", "100 J", "200 J"], answer: "100 J",
    hint: "For a force parallel to displacement, multiply the force by the displacement.",
    explanation: "Work = force × displacement = 20 × 5 = 100 J.",
  },
  {
    id: "S07", subject: "Science", topic: "Sound", level: "Easy",
    room: "Wave Laboratory", icon: "〰", points: 100,
    question: "Which property of a sound wave primarily determines its pitch?",
    options: ["Amplitude", "Frequency", "Loudness", "Echo duration"], answer: "Frequency",
    hint: "Compare a high-pitched whistle with a low-pitched drum.",
    explanation: "A higher frequency produces a higher-pitched sound. Amplitude is associated with loudness.",
  },
  {
    id: "S08", subject: "Science", topic: "Matter in Our Surroundings", level: "Medium",
    room: "Particle Puzzle", icon: "⋯", points: 120,
    question: "Why does evaporation generally cause cooling?",
    options: [
      "All particles become motionless",
      "Higher-energy particles escape from the surface",
      "The liquid creates energy from nothing",
      "The particles become massless",
    ],
    answer: "Higher-energy particles escape from the surface",
    hint: "Consider the energy of particles able to escape into the air.",
    explanation: "Higher-energy particles escape during evaporation, reducing the average kinetic energy of the liquid remaining behind.",
  },
  {
    id: "S09", subject: "Science", topic: "Atoms and Molecules", level: "Medium",
    room: "Chemical Code", icon: "Mg", points: 120,
    question: "What is the correct chemical formula of magnesium chloride?",
    options: ["MgCl", "MgCl₂", "Mg₂Cl", "Mg₂Cl₃"], answer: "MgCl₂",
    hint: "Magnesium forms Mg²⁺ ions and chlorine forms Cl⁻ ions.",
    explanation: "One Mg²⁺ ion balances two Cl⁻ ions, giving the neutral formula MgCl₂.",
  },
  {
    id: "S10", subject: "Science", topic: "Cell Biology", level: "Easy",
    room: "Cell Mystery", icon: "◉", points: 100,
    question: "Which organelle is the main site of aerobic cellular respiration in most eukaryotic cells?",
    options: ["Ribosome", "Mitochondrion", "Golgi apparatus", "Lysosome"], answer: "Mitochondrion",
    hint: "It is often called the powerhouse of the cell.",
    explanation: "Mitochondria are the main sites of aerobic cellular respiration and ATP production.",
  },
  {
    id: "S11", subject: "Science", topic: "Cell Biology", level: "Easy",
    room: "Cell Defence", icon: "⬡", points: 100,
    question: "Which cell structure selectively regulates the movement of substances into and out of the cell?",
    options: ["Cell membrane", "Nucleolus", "Chromosome", "Ribosome"], answer: "Cell membrane",
    hint: "Look for the selectively permeable boundary of a cell.",
    explanation: "The cell membrane forms the cell boundary and controls the exchange of substances.",
  },
  {
    id: "S12", subject: "Science", topic: "Tissues", level: "Medium",
    room: "Plant Transport", icon: "♧", points: 120,
    question: "Which plant tissue primarily transports water and minerals from roots to the rest of the plant?",
    options: ["Phloem", "Xylem", "Epidermis", "Meristem"], answer: "Xylem",
    hint: "Distinguish water transport from the transport of prepared food.",
    explanation: "Xylem conducts water and dissolved minerals, mainly from the roots upwards.",
  },

  // ENGLISH
  {
    id: "E01", subject: "English", topic: "Subject–Verb Agreement", level: "Easy",
    room: "Grammar Lock", icon: "Aa", points: 100,
    question: "Complete the sentence: 'Each of the players ___ ready.'",
    options: ["are", "is", "were", "have"], answer: "is",
    hint: "In this sentence, 'each' is treated as a singular subject.",
    explanation: "'Each of the players is ready' is correct because 'each' takes a singular verb here.",
  },
  {
    id: "E02", subject: "English", topic: "Vocabulary", level: "Easy",
    room: "Word Detective", icon: "✎", points: 100,
    question: "Which word is closest in meaning to 'meticulous'?",
    options: ["Careless", "Hasty", "Thorough", "Confused"], answer: "Thorough",
    hint: "Imagine someone who checks every small detail carefully.",
    explanation: "'Meticulous' means extremely careful and attentive to detail. 'Thorough' is the closest option.",
  },
  {
    id: "E03", subject: "English", topic: "Antonyms", level: "Easy",
    room: "Word Mirror", icon: "⇄", points: 100,
    question: "Choose the antonym of 'ancient'.",
    options: ["Historic", "Modern", "Antique", "Traditional"], answer: "Modern",
    hint: "Find a word that contrasts with something belonging to the distant past.",
    explanation: "'Modern' contrasts with 'ancient', which refers to something from the distant past.",
  },
  {
    id: "E04", subject: "English", topic: "Active and Passive Voice", level: "Medium",
    room: "Voice Switch", icon: "↻", points: 120,
    question: "Choose the correct passive form: 'The team won the match.'",
    options: [
      "The match was won by the team.",
      "The match is won by the team.",
      "The team was won by the match.",
      "The match had win by the team.",
    ],
    answer: "The match was won by the team.",
    hint: "Keep the past tense and make the original object the new subject.",
    explanation: "The simple past passive uses 'was/were + past participle'. The correct form is 'was won'.",
  },
  {
    id: "E05", subject: "English", topic: "Punctuation", level: "Medium",
    room: "Punctuation Portal", icon: "?!", points: 120,
    question: "Which sentence correctly punctuates the direct question?",
    options: [
      'Mira asked, "Where are you going?"',
      'Mira asked "where are you going".',
      'Mira asked, "Where are you going".',
      'Mira asked? "Where are you going."',
    ],
    answer: 'Mira asked, "Where are you going?"',
    hint: "A direct question retains its question mark inside the quotation marks.",
    explanation: "The introductory clause ends with a comma, and the quoted direct question starts with a capital letter and ends with a question mark.",
  },
  {
    id: "E06", subject: "English", topic: "Parts of Speech", level: "Easy",
    room: "Word Scanner", icon: "⌕", points: 100,
    question: "Identify the adverb in: 'The athlete ran swiftly across the field.'",
    options: ["Athlete", "Ran", "Swiftly", "Field"], answer: "Swiftly",
    hint: "Find the word describing how the action was performed.",
    explanation: "'Swiftly' modifies the verb 'ran' by describing how the athlete ran, so it is an adverb.",
  },
  {
    id: "E07", subject: "English", topic: "Figures of Speech", level: "Medium",
    room: "Literary Laboratory", icon: "❝", points: 120,
    question: "'The classroom was a zoo during lunch break.' Which figure of speech is used?",
    options: ["Simile", "Metaphor", "Alliteration", "Personification"], answer: "Metaphor",
    hint: "The comparison is direct; the sentence does not use 'like' or 'as'.",
    explanation: "The classroom is directly compared to a zoo to suggest noise and disorder. This is a metaphor.",
  },
  {
    id: "E08", subject: "English", topic: "Conditionals", level: "Medium",
    room: "Sentence Engine", icon: "If", points: 120,
    question: "Complete the second conditional: 'If I ___ enough time, I would join the team.'",
    options: ["have", "had", "will have", "am having"], answer: "had",
    hint: "The second conditional uses a past-form verb in the if-clause and 'would' in the result clause.",
    explanation: "'If I had enough time, I would join the team' follows the standard second conditional structure.",
  },
  {
    id: "E09", subject: "English", topic: "Subject–Verb Agreement", level: "Hard",
    room: "Grammar Circuit", icon: "Aa", points: 150,
    question: "Complete the sentence: 'Neither the teacher nor the students ___ aware of the change.'",
    options: ["was", "is", "were", "has been"], answer: "were",
    hint: "With 'neither ... nor', the verb normally agrees with the nearer subject.",
    explanation: "The nearer subject is 'the students', which is plural, so 'were' is appropriate.",
  },
  {
    id: "E10", subject: "English", topic: "Word Formation", level: "Medium",
    room: "Prefix Puzzle", icon: "＋", points: 120,
    question: "Which word means 'to understand or interpret something incorrectly'?",
    options: ["Reinterpret", "Misinterpret", "Overlook", "Anticipate"], answer: "Misinterpret",
    hint: "The correct word begins with a prefix that often signals an error.",
    explanation: "'Misinterpret' means to interpret or understand something incorrectly. The prefix 'mis-' often indicates error.",
  },
  {
    id: "E11", subject: "English", topic: "Idioms", level: "Medium",
    room: "Idiom Vault", icon: "◇", points: 120,
    question: "What does the idiom 'hit the nail on the head' mean?",
    options: [
      "Make a careless mistake",
      "Describe something exactly right",
      "Avoid answering a question",
      "Work very slowly",
    ],
    answer: "Describe something exactly right",
    hint: "Think of identifying the precise point of an issue.",
    explanation: "The idiom means to say or identify something exactly correctly.",
  },
  {
    id: "E12", subject: "English", topic: "Sentence Structure", level: "Easy",
    room: "Sentence Builder", icon: "¶", points: 100,
    question: "Choose the grammatically correct sentence.",
    options: [
      "Although it was raining, we continued the match.",
      "Although it was raining but we continued the match.",
      "Although raining, but continued we the match.",
      "Although it raining, we continues the match.",
    ],
    answer: "Although it was raining, we continued the match.",
    hint: "Do not add a redundant 'but' to this standard 'although' construction.",
    explanation: "The sentence correctly combines a subordinate clause beginning with 'although' and a main clause.",
  },
];

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function readSave() {
  const fallback = { bestScore: 0, crystals: 0, sessions: 0 };

  if (typeof window === "undefined") return fallback;

  try {
    const value = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");

    return {
      bestScore: Number(value.bestScore) || 0,
      crystals: Number(value.crystals) || 0,
      sessions: Number(value.sessions) || 0,
    };
  } catch {
    return fallback;
  }
}

function getRank(score) {
  if (score >= 1500) return { name: "Nexus Legend", icon: "👑" };
  if (score >= 1000) return { name: "Puzzle Master", icon: "🧠" };
  if (score >= 600) return { name: "Elite Explorer", icon: "🚀" };
  if (score >= 250) return { name: "Code Breaker", icon: "🔐" };
  return { name: "Rookie Explorer", icon: "🔎" };
}

function playTone(correct) {
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;

    const ctx = new Audio();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = correct ? 660 : 220;
    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.16);
    oscillator.onended = () => ctx.close();
  } catch {
    // Audio is optional; gameplay does not depend on it.
  }
}

function App() {
  const [screen, setScreen] = useState("home");
  const [playerName, setPlayerName] = useState("Explorer");
  const [subject, setSubject] = useState("All");
  const [mode, setMode] = useState("Classic");
  const [roundSize, setRoundSize] = useState(12);

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [outcome, setOutcome] = useState("answer");

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintUsed, setHintUsed] = useState(false);
  const [fiftyUsed, setFiftyUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);

  const [timeLeft, setTimeLeft] = useState(30);
  const [elapsed, setElapsed] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [soundOn, setSoundOn] = useState(true);
  const [exitDialog, setExitDialog] = useState(false);

  const [save, setSave] = useState(readSave);
  const resultSaved = useRef(false);

  const currentMode = MODES.find((item) => item.id === mode) || MODES[1];
  const question = questions[current];
  const total = questions.length;
  const correctCount = answers.filter((item) => item.correct).length;
  const accuracy = answers.length ? Math.round((correctCount / answers.length) * 100) : 0;
  const rank = getRank(score);

  const availableQuestions = useMemo(
    () => BANK.filter((item) => subject === "All" || item.subject === subject),
    [subject]
  );

  const startGame = () => {
    const pool = shuffle(
      BANK.filter((item) => subject === "All" || item.subject === subject)
    );

    const chosen = pool.slice(0, Math.min(roundSize, pool.length)).map((item) => ({
      ...item,
      options: shuffle(item.options),
    }));

    resultSaved.current = false;

    setQuestions(chosen);
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setOutcome("answer");

    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setLives(3);
    setHintsLeft(3);
    setHintUsed(false);
    setFiftyUsed(false);
    setHiddenOptions([]);

    setTimeLeft(currentMode.time);
    setElapsed(0);
    setAnswers([]);
    setExitDialog(false);
    setScreen("game");
  };

  const answerQuestion = useCallback(
    (option, reason = "answer") => {
      if (revealed || !question) return;

      const correct = reason === "answer" && option === question.answer;
      const nextStreak = correct ? streak + 1 : 0;
      const timeBonus = correct ? Math.max(0, timeLeft) * 2 : 0;
      const streakBonus = correct ? Math.min(streak, 5) * 12 : 0;

      const earned = correct
        ? Math.max(
            0,
            Math.round(
              question.points * currentMode.multiplier +
                timeBonus +
                streakBonus -
                (hintUsed ? 20 : 0)
            )
          )
        : 0;

      setSelected(option);
      setRevealed(true);
      setOutcome(reason);
      setScore((previous) => previous + earned);
      setStreak(nextStreak);
      setBestStreak((previous) => Math.max(previous, nextStreak));

      if (!correct) setLives((previous) => Math.max(0, previous - 1));

      setAnswers((previous) => [
        ...previous,
        {
          id: question.id,
          subject: question.subject,
          topic: question.topic,
          question: question.question,
          chosen:
            reason === "timeout"
              ? "Time expired"
              : reason === "skip"
                ? "Skipped"
                : option,
          expected: question.answer,
          correct,
          earned,
          explanation: question.explanation,
        },
      ]);

      if (soundOn) playTone(correct);
    },
    [revealed, question, streak, timeLeft, currentMode.multiplier, hintUsed, soundOn]
  );

  useEffect(() => {
    if (screen !== "game" || revealed || !question) return undefined;

    const timer = window.setTimeout(() => {
      setElapsed((previous) => previous + 1);

      if (timeLeft <= 1) {
        setTimeLeft(0);
        answerQuestion(null, "timeout");
      } else {
        setTimeLeft((previous) => previous - 1);
      }
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [screen, revealed, question, current, timeLeft, answerQuestion]);

  const nextQuestion = () => {
    if (lives <= 0 || current + 1 >= total) {
      setScreen("results");
      return;
    }

    setCurrent((previous) => previous + 1);
    setSelected(null);
    setRevealed(false);
    setOutcome("answer");

    setHintUsed(false);
    setFiftyUsed(false);
    setHiddenOptions([]);
    setTimeLeft(currentMode.time);
  };

  const useHint = () => {
    if (!question || revealed || hintUsed || hintsLeft <= 0) return;
    setHintsLeft((previous) => previous - 1);
    setHintUsed(true);
  };

  const useFiftyFifty = () => {
    if (!question || revealed || fiftyUsed) return;

    setHiddenOptions(
      shuffle(question.options.filter((option) => option !== question.answer)).slice(0, 2)
    );
    setFiftyUsed(true);
  };

  useEffect(() => {
    if (screen !== "results" || !answers.length || resultSaved.current) return;

    resultSaved.current = true;

    const updated = {
      bestScore: Math.max(save.bestScore, score),
      crystals: save.crystals + Math.floor(score / 100),
      sessions: save.sessions + 1,
    };

    setSave(updated);

    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(updated));
    } catch {
      // Saving is optional; the session still works without storage.
    }
  }, [screen, answers.length, score, save]);

  const goHome = () => {
    setExitDialog(false);
    setScreen("home");
  };

  if (screen === "home") {
    return (
      <main className="nexus-app">
        <header className="topbar">
          <button className="brand" onClick={goHome} aria-label="Nexus Academy home">
            <span className="brand-mark">N</span>
            <span className="brand-text"><strong>NEXUS</strong><small>LEARNING ARCADE</small></span>
          </button>
          <div className="topbar-right">
            <div className="crystal-chip">◇ {save.crystals} <small>CRYSTALS</small></div>
            <div className="avatar">{(playerName.trim()[0] || "E").toUpperCase()}</div>
          </div>
        </header>

        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot" /> CBSE CLASS IX · PUZZLE EXPEDITION</div>
            <h1>Think beyond.<br /><span className="gradient-text">Unlock the unknown.</span></h1>
            <p>
              Welcome to Nexus Academy, {playerName.trim() || "Explorer"}.
              Enter mysterious rooms, crack curriculum-based challenges,
              collect crystals and train your brain through play.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => document.getElementById("mission-control")?.scrollIntoView({ behavior: "smooth", block: "center" })}>
                Start your expedition <span>↗</span>
              </button>
              <span className="hero-caption"><span>✦ ✦ ✦</span> LEARN · SOLVE · LEVEL UP</span>
            </div>
            <div className="hero-stats">
              <div><strong>36</strong><span>Curated puzzles</span></div>
              <div><strong>03</strong><span>Subject worlds</span></div>
              <div><strong>∞</strong><span>Ways to think</span></div>
            </div>
          </div>

          <div className="portal-scene">
            <div className="portal-grid" />
            <div className="portal-ring portal-ring-back" />
            <div className="portal-ring portal-ring-front" />
            <div className="portal-core"><span>N</span></div>
            <div className="orb orb-math"><strong>∑</strong><small>MATHS</small></div>
            <div className="orb orb-science"><strong>⚛</strong><small>SCIENCE</small></div>
            <div className="orb orb-english"><strong>Aa</strong><small>ENGLISH</small></div>
            <div className="portal-caption"><span className="status-dot" /> ACADEMY SYSTEMS ONLINE</div>
          </div>
        </section>

        <section className="setup-layout" id="mission-control">
          <div className="setup-panel panel">
            <div className="section-heading">
              <div><span className="section-kicker">MISSION CONTROL / 01</span><h2>Build your expedition</h2><p>Choose a world, pick a mode, then crack the codes.</p></div>
              <span className="section-icon">⌘</span>
            </div>

            <label className="field-label" htmlFor="player-name">YOUR EXPLORER NAME</label>
            <input id="player-name" className="name-input" value={playerName} maxLength={22} placeholder="Enter your name" onChange={(event) => setPlayerName(event.target.value)} />

            <div className="field-heading"><div><span className="field-label">CHOOSE YOUR WORLD</span><small>One world. A thousand discoveries.</small></div><span className="subtle-tag">04 PATHS</span></div>
            <div className="world-grid">
              {WORLDS.map((world) => (
                <button key={world.id} className={`world-card ${world.color} ${subject === world.id ? "active" : ""}`} onClick={() => setSubject(world.id)} aria-pressed={subject === world.id}>
                  <span className="world-icon">{world.icon}</span><span className="world-check">{subject === world.id ? "✓" : "+"}</span>
                  <strong>{world.name}</strong><small>{world.sub}</small>
                  <span className="world-description">{world.id === "All" ? "Mixed challenges across all subjects." : world.id === "Mathematics" ? "Equations, geometry and number logic." : world.id === "Science" ? "Discover matter, motion and living cells." : "Decode grammar, vocabulary and language."}</span>
                </button>
              ))}
            </div>

            <div className="field-heading mode-heading"><div><span className="field-label">SELECT YOUR INTENSITY</span><small>Set the pace that works for you.</small></div></div>
            <div className="mode-grid">
              {MODES.map((item) => (
                <button key={item.id} className={`mode-card ${mode === item.id ? "active" : ""}`} onClick={() => setMode(item.id)} aria-pressed={mode === item.id}>
                  <span className="mode-icon">{item.icon}</span><strong>{item.label}</strong><small>{item.text}</small>
                  <span className="mode-time">{item.time}s / question</span>
                  {item.id === "Blitz" && <span className="xp-badge">1.5× XP</span>}
                </button>
              ))}
            </div>

            <div className="round-control">
              <div><span className="field-label">MISSION LENGTH</span><p>{Math.min(roundSize, availableQuestions.length)} puzzles <i>·</i> 3 lives <i>·</i> 3 hints</p></div>
              <div className="round-buttons">
                {[5, 8, 12, 18].map((count) => (
                  <button key={count} className={roundSize === count ? "active" : ""} onClick={() => setRoundSize(count)} aria-pressed={roundSize === count}>{count}</button>
                ))}
              </div>
            </div>

            <div className="mission-summary">
              <span className="summary-mark">✦</span>
              <div><strong>{WORLDS.find((world) => world.id === subject)?.name} is ready</strong><small>{Math.min(roundSize, availableQuestions.length)} puzzles · {mode} mode · 3 lives</small></div>
              <span className="ready-tag">READY</span>
            </div>

            <button className="primary-button launch-button" onClick={startGame}>Launch expedition <span>→</span></button>
            <p className="fine-print">Your best score and crystal collection are saved on this device.</p>
          </div>

          <aside className="side-panels">
            <section className="panel profile-panel">
              <div className="panel-label-row"><span className="section-kicker">YOUR RECORD</span><span className="saved-tag">LOCAL SAVE</span></div>
              <div className="profile-row"><div className="profile-avatar">{(playerName.trim()[0] || "E").toUpperCase()}</div><div><strong>{playerName.trim() || "Explorer"}</strong><small>Rank: {getRank(save.bestScore).name}</small></div></div>
              <div className="record-grid">
                <div><span>BEST SCORE</span><strong>{save.bestScore.toLocaleString()}</strong></div>
                <div><span>EXPEDITIONS</span><strong>{save.sessions}</strong></div>
              </div>
              <div className="crystal-progress"><div><span>CRYSTAL COLLECTION</span><strong>◇ {save.crystals}</strong></div><div className="crystal-track"><div style={{ width: `${save.crystals % 100}%` }} /></div></div>
            </section>

            <section className="panel roadmap-panel">
              <div className="panel-label-row"><span className="section-kicker">THE ACADEMY MAP</span><span className="map-icon">⌖</span></div>
              {[
                ["01", "Initiation Hall", "Warm-up puzzles"],
                ["02", "The Logic Lab", "Reasoning and calculation"],
                ["03", "Knowledge Vault", "Concept mastery"],
                ["04", "Final Nexus", "The ultimate challenge"],
              ].map(([number, name, desc]) => (
                <div className="roadmap-row" key={number}><span className="road-number">{number}</span><div><strong>{name}</strong><small>{desc}</small></div><span className="open-tag">OPEN</span></div>
              ))}
              <div className="roadmap-note"><span>✧</span> Every correct answer brings you closer to mastery.</div>
            </section>

            <section className="tip-card"><span>✧</span><div><strong>Explorer wisdom</strong><p>Hints give you clues, streaks give you bonus XP, and every explanation helps you learn.</p></div></section>
          </aside>
        </section>

        <footer className="site-footer"><span className="footer-brand">NEXUS <i>ACADEMY</i></span><span>Designed for curious Class 9 minds</span><span>THINK DEEPER · GO FURTHER</span></footer>
      </main>
    );
  }

  if (screen === "results") {
    const flawless = answers.length > 0 && correctCount === answers.length;
    const newRecord = score > 0 && score >= save.bestScore;
    const achievements = [
      ...(flawless ? [{ icon: "💎", name: "Flawless Mind" }] : []),
      ...(bestStreak >= 4 ? [{ icon: "🔥", name: "Combo Master" }] : []),
      ...(score >= 500 ? [{ icon: "⚡", name: "XP Collector" }] : []),
      ...(answers.length >= 8 ? [{ icon: "🗺", name: "Deep Explorer" }] : []),
    ];

    return (
      <main className="nexus-app results-screen">
        <header className="topbar"><button className="brand" onClick={goHome}><span className="brand-mark">N</span><span className="brand-text"><strong>NEXUS</strong><small>LEARNING ARCADE</small></span></button><span className="report-tag">✦ EXPEDITION REPORT</span></header>

        <section className="result-hero">
          <div className="result-emblem">{rank.icon}</div>
          <span className="eyebrow">{lives === 0 ? "MISSION ENDED · KEEP EXPLORING" : "MISSION COMPLETE"}</span>
          <h1>{playerName.trim() || "Explorer"},<br /><span className="gradient-text">{lives === 0 ? "your next level awaits." : "well played."}</span></h1>
          <p>Every challenge is a lesson. Every mistake is a clue. Here's your expedition report.</p>
        </section>

        <section className="results-dashboard">
          <div className="panel final-score-panel">
            <div className="panel-label-row"><span className="section-kicker">YOUR FINAL SCORE</span>{newRecord && <span className="record-tag">✦ NEW RECORD</span>}</div>
            <div className="final-score">{score.toLocaleString()} <small>XP</small></div>
            <div className="result-score-track"><div style={{ width: `${accuracy}%` }} /></div>
            <div className="result-score-labels"><span>{accuracy}% accuracy</span><span>{correctCount}/{answers.length} correct</span></div>
            <div className="rank-banner"><span className="rank-icon">{rank.icon}</span><div><small>YOUR ACADEMY RANK</small><strong>{rank.name}</strong></div><span className="rank-stars">✦ ✦ ✦</span></div>
          </div>

          <div className="metrics-grid">
            <div className="panel metric-card"><span className="metric-icon green-icon">✓</span><small>CORRECT ANSWERS</small><strong>{correctCount}<i> / {answers.length}</i></strong><span>Knowledge unlocked</span></div>
            <div className="panel metric-card"><span className="metric-icon orange-icon">🔥</span><small>BEST STREAK</small><strong>{bestStreak}</strong><span>Consecutive correct</span></div>
            <div className="panel metric-card"><span className="metric-icon blue-icon">◷</span><small>TIME PLAYED</small><strong>{Math.floor(elapsed / 60)}<i>m </i>{elapsed % 60}<i>s</i></strong><span>Time in the academy</span></div>
            <div className="panel metric-card"><span className="metric-icon violet-icon">◇</span><small>CRYSTALS EARNED</small><strong>+{Math.floor(score / 100)}</strong><span>Added to your collection</span></div>
          </div>
        </section>

        <section className="panel achievements-panel">
          <div className="section-heading compact-heading"><div><span className="section-kicker">YOUR ACHIEVEMENTS</span><h2>Badges of brilliance</h2></div><span className="section-icon">✧</span></div>
          {achievements.length ? <div className="achievement-grid">{achievements.map((item) => <div className="achievement" key={item.name}><span>{item.icon}</span><strong>{item.name}</strong><small>UNLOCKED</small></div>)}</div> : <div className="empty-achievements"><span>✧</span><div><strong>Your next badge is waiting.</strong><p>Build a longer streak, earn more XP, or complete a flawless round.</p></div></div>}
        </section>

        <section className="review-section">
          <div className="section-heading compact-heading"><div><span className="section-kicker">MISSION DEBRIEF</span><h2>Review your discoveries</h2><p>Revisit the puzzles and understand the reasoning.</p></div><span className="review-count">{answers.length} ANSWERED</span></div>
          <div className="review-list">
            {answers.map((item, index) => (
              <article className="panel review-card" key={`${item.id}-${index}`}>
                <span className={`review-check ${item.correct ? "is-correct" : "is-incorrect"}`}>{item.correct ? "✓" : "×"}</span>
                <div className="review-content">
                  <div className="review-meta"><span>{item.subject}</span><span>·</span><span>{item.topic}</span></div>
                  <h3>{item.question}</h3>
                  <div className="review-answer"><span>Your answer</span><strong className={item.correct ? "answer-good" : "answer-bad"}>{item.chosen}</strong></div>
                  {!item.correct && <div className="review-answer"><span>Correct answer</span><strong className="answer-good">{item.expected}</strong></div>}
                  <p>{item.explanation}</p>
                </div>
                <span className={`review-xp ${item.correct ? "xp-earned" : ""}`}>+{item.earned} XP</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel next-mission"><span className="next-emblem">✦</span><div><span className="section-kicker">READY FOR ANOTHER ADVENTURE?</span><h2>The next mystery awaits.</h2><p>Choose another subject, switch difficulty, and explore a new path.</p></div><button className="primary-button" onClick={goHome}>Choose another quest <span>→</span></button></section>

        <footer className="site-footer"><span className="footer-brand">NEXUS <i>ACADEMY</i></span><span>Progress over perfection</span><span>KEEP THINKING · KEEP GROWING</span></footer>
      </main>
    );
  }

  return (
    <main className="nexus-app gameplay-screen">
      <header className="topbar game-topbar">
        <button className="brand" onClick={() => setExitDialog(true)}><span className="brand-mark">N</span><span className="brand-text"><strong>NEXUS</strong><small>LEARNING ARCADE</small></span></button>
        <div className="global-progress-wrap"><div className="progress-caption"><span>EXPEDITION PROGRESS</span><strong>{current + 1} / {total}</strong></div><div className="global-progress"><div style={{ width: `${total ? ((current + 1) / total) * 100 : 0}%` }} /></div></div>
        <div className="game-top-actions"><button className="sound-button" onClick={() => setSoundOn((previous) => !previous)} aria-label={soundOn ? "Mute sounds" : "Enable sounds"}>{soundOn ? "♫" : "♪"}</button><button className="exit-button" onClick={() => setExitDialog(true)}>Exit ↗</button></div>
      </header>

      {question && <>
        <div className="mission-breadcrumb"><span>ACADEMY</span><i>/</i><span>{question.subject.toUpperCase()}</span><i>/</i><strong>CHALLENGE {String(current + 1).padStart(2, "0")}</strong></div>
        <section className="game-layout">
          <div className="challenge-column">
            <div className="challenge-heading"><div><span className="section-kicker">ACTIVE PUZZLE</span><h1>Crack the <span className="gradient-text">code.</span></h1></div><div className="challenge-code"><span>{question.icon}</span><div><strong>{question.room}</strong><small>ACADEMY CHALLENGE SYSTEM</small></div></div></div>

            <section className="panel puzzle-card">
              <div className="puzzle-topline"><span><i>✧</i> {question.room.toUpperCase()}</span><small>NX-{question.id}</small></div>
              <div className="puzzle-art"><div className="puzzle-art-ring ring-a" /><div className="puzzle-art-ring ring-b" /><div className="puzzle-symbol">{question.icon}</div><span className="puzzle-corner tl">+</span><span className="puzzle-corner tr">×</span><span className="puzzle-corner bl">÷</span><span className="puzzle-corner br">=</span></div>

              <div className="question-block"><div className="question-label">QUESTION {String(current + 1).padStart(2, "0")} <i>·</i> {question.topic.toUpperCase()} <span className={`difficulty-tag tag-${question.level.toLowerCase()}`}>{question.level}</span></div><h2>{question.question}</h2><p>Select the best answer to unlock the next chamber.</p></div>

              <div className="answer-grid">
                {question.options.map((option, index) => {
                  const hidden = hiddenOptions.includes(option);
                  const isCorrect = option === question.answer;
                  const isSelected = selected === option;
                  let className = "answer-choice";
                  if (hidden) className += " answer-hidden";
                  if (revealed && isCorrect) className += " answer-correct";
                  if (revealed && isSelected && !isCorrect) className += " answer-incorrect";
                  return <button key={`${question.id}-${option}`} className={className} disabled={revealed || hidden} onClick={() => answerQuestion(option)}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span className="answer-option-text">{option}</span><span className="answer-arrow">{revealed && isCorrect ? "✓" : revealed && isSelected ? "×" : "↗"}</span></button>;
                })}
              </div>

              {hintUsed && !revealed && <div className="hint-reveal"><span>✧</span><div><small>ACADEMY CLUE</small><p>{question.hint}</p></div></div>}

              {revealed && <div className={`answer-feedback ${selected === question.answer ? "feedback-success" : "feedback-error"}`}>
                <div className="feedback-heading"><span className="feedback-icon">{selected === question.answer ? "✓" : "!"}</span><div><strong>{selected === question.answer ? "Brilliant deduction!" : outcome === "timeout" ? "The clock ran out." : outcome === "skip" ? "Puzzle bypassed." : "Not quite this time."}</strong><small>{selected === question.answer ? `+${answers[answers.length - 1]?.earned ?? 0} XP earned` : `Correct answer: ${question.answer}`}</small></div></div>
                <p>{question.explanation}</p>
                <button className="continue-button" onClick={nextQuestion}>{lives <= 0 ? "Open mission report" : current + 1 >= total ? "Complete expedition" : "Continue to next chamber"} <span>→</span></button>
              </div>}

              <div className="puzzle-footer"><span><i>✦</i> {question.points} BASE XP</span><span>THINK BEFORE YOU LOCK IN</span></div>
            </section>

            {!revealed && <section className="powerups-section">
              <div className="powerups-heading"><div><span className="section-kicker">FIELD TOOLS</span><h3>Need a little help?</h3></div><span>USE WISELY</span></div>
              <div className="powerup-grid">
                <button className="powerup-card" onClick={useHint} disabled={hintUsed || hintsLeft <= 0}><span className="powerup-icon hint-icon">✧</span><span className="powerup-copy"><strong>Reveal a clue</strong><small>{hintUsed ? "Already used" : "Get a helpful hint"}</small></span><span className="powerup-status">{hintsLeft} left</span></button>
                <button className="powerup-card" onClick={useFiftyFifty} disabled={fiftyUsed}><span className="powerup-icon fifty-icon">½</span><span className="powerup-copy"><strong>50 : 50</strong><small>{fiftyUsed ? "Already used" : "Remove two wrong answers"}</small></span><span className="powerup-status">{fiftyUsed ? "USED" : "READY"}</span></button>
                <button className="powerup-card" onClick={() => answerQuestion(null, "skip")}><span className="powerup-icon skip-icon">↷</span><span className="powerup-copy"><strong>Skip puzzle</strong><small>Move on with a life penalty</small></span><span className="powerup-status">−1 ♥</span></button>
              </div>
            </section>}
          </div>

          <aside className="game-sidebar">
            <section className={`panel timer-panel ${timeLeft <= 8 ? "timer-warning" : ""}`}><div className="panel-label-row"><span className="section-kicker">TIME LEFT</span><span className="live-label">LIVE</span></div><div className="timer-dial" style={{ "--timer-progress": `${(timeLeft / currentMode.time) * 100}%` }}><div className="timer-inner"><span>◷</span><strong>{String(timeLeft).padStart(2, "0")}</strong><small>SECONDS</small></div></div><p className="timer-message">{timeLeft <= 8 ? "Hurry! Lock in your answer." : "Focus beats the clock."}</p><div className="timer-mode"><span>DIFFICULTY</span><strong>{mode.toUpperCase()}</strong></div></section>

            <section className="panel performance-panel"><div className="panel-label-row"><span className="section-kicker">PERFORMANCE</span><span className="score-spark">✦</span></div><div className="score-display"><span>⚡</span><div><small>TOTAL EXPERIENCE</small><strong>{score.toLocaleString()} <i>XP</i></strong></div></div><div className="detail-row"><span>Current streak</span><strong>×{(1 + Math.min(streak, 5) * 0.1).toFixed(1)}</strong></div><div className="detail-row"><span>XP multiplier</span><strong>×{currentMode.multiplier}</strong></div><div className="score-tip">{streak >= 2 ? `🔥 ${streak} correct in a row. Keep going!` : "Answer correctly to build your combo."}</div></section>

            <section className="panel lives-panel"><div className="panel-label-row"><span className="section-kicker">ENERGY SHIELDS</span><strong>{lives} / 3</strong></div><div className="lives-row">{[0, 1, 2].map((life) => <span key={life} className={life < lives ? "heart-active" : "heart-lost"}>♥</span>)}</div><div className="lives-track"><div style={{ width: `${(lives / 3) * 100}%` }} /></div><p>{lives === 3 ? "All shields charged. Make every answer count." : lives === 2 ? "One shield spent. Stay sharp." : lives === 1 ? "Final shield! Choose with care." : "No shields remaining."}</p></section>

            <section className="panel mini-map"><div className="panel-label-row"><span className="section-kicker">EXPEDITION MAP</span><span>⌖</span></div><div className="mini-map-grid">{questions.map((item, index) => <div title={`Puzzle ${index + 1}: ${item.topic}`} key={item.id} className={`map-cell ${index === current ? "map-current" : ""} ${index < answers.length ? answers[index]?.correct ? "map-cleared" : "map-missed" : ""}`}>{index < answers.length ? (answers[index]?.correct ? "✓" : "×") : index === current ? "◆" : String(index + 1).padStart(2, "0")}</div>)}</div><div className="map-legend"><span><i className="legend-green" /> Cleared</span><span><i className="legend-purple" /> Current</span></div><div className="map-foot"><span>CHAMBERS EXPLORED</span><strong>{answers.length} / {total}</strong></div></section>
            <section className="sidebar-tip"><span>✧</span><div><strong>Thinker's tip</strong><p>Read each option carefully. Speed matters, but understanding matters more.</p></div></section>
          </aside>
        </section>
      </>}

      <footer className="site-footer game-footer"><span className="footer-brand">NEXUS <i>ACADEMY</i></span><span>Stay curious. Stay focused.</span><span>CLASS IX LEARNING ARCADE</span></footer>

      {exitDialog && <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setExitDialog(false); }}><section className="panel exit-dialog" role="dialog" aria-modal="true" aria-labelledby="exit-heading"><span className="exit-emblem">↗</span><span className="section-kicker">PAUSE EXPEDITION</span><h2 id="exit-heading">Leaving the academy?</h2><p>Your current round will end. Its score will not be added to your saved expedition record.</p><div className="dialog-actions"><button className="secondary-button" onClick={() => setExitDialog(false)}>Stay and solve</button><button className="primary-button" onClick={goHome}>Exit mission <span>→</span></button></div></section></div>}
    </main>
  );
}

export default App;
