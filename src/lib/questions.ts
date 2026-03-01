export type QuestionType = 'aptitude' | 'interest' | 'personality'
export type AnswerType = 'mcq' | 'likert' | 'options'

export interface Option {
  value: string
  label: string
  stream?: 'science' | 'commerce' | 'humanities'
}

export interface Question {
  id: string
  text: string
  type: QuestionType
  answerType: AnswerType
  options: Option[]
  correctAnswer?: string // for aptitude
  category?: string
}

// ─── APTITUDE QUESTIONS (15) ───────────────────────────────────────────────
export const aptitudeQuestions: Question[] = [
  {
    id: 'apt_1',
    text: 'If a train travels 60 km in 45 minutes, how far will it travel in 2 hours?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'a',
    options: [
      { value: 'a', label: '160 km' },
      { value: 'b', label: '150 km' },
      { value: 'c', label: '180 km' },
      { value: 'd', label: '120 km' },
    ],
  },
  {
    id: 'apt_2',
    text: 'Complete the series: 2, 6, 12, 20, 30, __',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: '40' },
      { value: 'b', label: '42' },
      { value: 'c', label: '44' },
      { value: 'd', label: '38' },
    ],
  },
  {
    id: 'apt_3',
    text: 'Find the odd one out: Rose, Lily, Oak, Lotus',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: 'Rose' },
      { value: 'b', label: 'Lily' },
      { value: 'c', label: 'Oak' },
      { value: 'd', label: 'Lotus' },
    ],
  },
  {
    id: 'apt_4',
    text: 'If APPLE = 50 (A=1, B=2...), what is the value of MANGO?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: '45' },
      { value: 'b', label: '47' },
      { value: 'c', label: '48' },
      { value: 'd', label: '49' },
    ],
  },
  {
    id: 'apt_5',
    text: 'A square has a perimeter of 48 cm. What is its area?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: '100 cm²' },
      { value: 'b', label: '144 cm²' },
      { value: 'c', label: '121 cm²' },
      { value: 'd', label: '169 cm²' },
    ],
  },
  {
    id: 'apt_6',
    text: 'Choose the word most opposite to ANCIENT:',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'a',
    options: [
      { value: 'a', label: 'Modern' },
      { value: 'b', label: 'Old' },
      { value: 'c', label: 'Past' },
      { value: 'd', label: 'Historic' },
    ],
  },
  {
    id: 'apt_7',
    text: 'If all Doctors are Educated, and Ramu is a Doctor, then:',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'a',
    options: [
      { value: 'a', label: 'Ramu is Educated' },
      { value: 'b', label: 'Ramu is not Educated' },
      { value: 'c', label: 'Cannot say' },
      { value: 'd', label: 'Ramu is a student' },
    ],
  },
  {
    id: 'apt_8',
    text: 'What comes next: Circle, Triangle, Circle, Triangle, Circle, __',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'spatial',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: 'Square' },
      { value: 'b', label: 'Triangle' },
      { value: 'c', label: 'Circle' },
      { value: 'd', label: 'Rectangle' },
    ],
  },
  {
    id: 'apt_9',
    text: 'A shopkeeper buys a product at Rs. 80 and sells it at Rs. 100. What is the profit percentage?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: '20%' },
      { value: 'b', label: '25%' },
      { value: 'c', label: '15%' },
      { value: 'd', label: '10%' },
    ],
  },
  {
    id: 'apt_10',
    text: 'Choose the correctly spelled word:',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: 'Accomodate' },
      { value: 'b', label: 'Accommodate' },
      { value: 'c', label: 'Acommodate' },
      { value: 'd', label: 'Acomodate' },
    ],
  },
  {
    id: 'apt_11',
    text: 'Mirror image: If LEFT becomes TFEL in a mirror, what does BOOK become?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'spatial',
    correctAnswer: 'a',
    options: [
      { value: 'a', label: 'KOOB' },
      { value: 'b', label: 'BOOB' },
      { value: 'c', label: 'KOOK' },
      { value: 'd', label: 'BOOD' },
    ],
  },
  {
    id: 'apt_12',
    text: 'In a class, 40% are girls. If there are 12 boys, how many total students are there?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: '18' },
      { value: 'b', label: '20' },
      { value: 'c', label: '22' },
      { value: 'd', label: '24' },
    ],
  },
  {
    id: 'apt_13',
    text: 'Arrange in logical order: Egg, Hen, Chick, Rooster',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: 'Egg → Chick → Hen → Rooster' },
      { value: 'b', label: 'Hen → Egg → Chick → Rooster' },
      { value: 'c', label: 'Rooster → Hen → Egg → Chick' },
      { value: 'd', label: 'Egg → Hen → Chick → Rooster' },
    ],
  },
  {
    id: 'apt_14',
    text: 'Which shape has the maximum lines of symmetry?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'spatial',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: 'Rectangle' },
      { value: 'b', label: 'Square' },
      { value: 'c', label: 'Circle' },
      { value: 'd', label: 'Triangle' },
    ],
  },
  {
    id: 'apt_15',
    text: 'Rearrange TIONS to form a suffix meaning "state of being":',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: 'TIONS' },
      { value: 'b', label: 'STION' },
      { value: 'c', label: 'TION' },
      { value: 'd', label: 'NITOS' },
    ],
  },
]

// ─── INTEREST INVENTORY (15) ──────────────────────────────────────────────
export const interestQuestions: Question[] = [
  {
    id: 'int_1',
    text: 'I enjoy solving math puzzles and problems',
    type: 'interest',
    answerType: 'likert',
    category: 'stem',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_2',
    text: 'I like reading books, stories, or articles',
    type: 'interest',
    answerType: 'likert',
    category: 'arts_social',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_3',
    text: 'I am curious about how machines or electronics work',
    type: 'interest',
    answerType: 'likert',
    category: 'stem',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_4',
    text: 'I enjoy drawing, painting, or creating art',
    type: 'interest',
    answerType: 'likert',
    category: 'arts_social',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_5',
    text: 'I like organizing data and working with numbers in spreadsheets',
    type: 'interest',
    answerType: 'likert',
    category: 'business',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_6',
    text: 'I enjoy discussing social issues and current events',
    type: 'interest',
    answerType: 'likert',
    category: 'arts_social',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_7',
    text: 'I like conducting experiments or science projects',
    type: 'interest',
    answerType: 'likert',
    category: 'stem',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_8',
    text: 'I enjoy writing essays, poems, or stories',
    type: 'interest',
    answerType: 'likert',
    category: 'arts_social',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_9',
    text: 'I like understanding how businesses and markets work',
    type: 'interest',
    answerType: 'likert',
    category: 'business',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_10',
    text: 'I enjoy helping classmates with their problems',
    type: 'interest',
    answerType: 'likert',
    category: 'arts_social',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_11',
    text: 'I like learning about history and cultures',
    type: 'interest',
    answerType: 'likert',
    category: 'arts_social',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_12',
    text: 'I am excited by new technologies and coding',
    type: 'interest',
    answerType: 'likert',
    category: 'stem',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_13',
    text: 'I enjoy debating and public speaking',
    type: 'interest',
    answerType: 'likert',
    category: 'arts_social',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_14',
    text: 'I like working with budgets, money, and finance',
    type: 'interest',
    answerType: 'likert',
    category: 'business',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_15',
    text: 'I enjoy nature, biology, and environmental topics',
    type: 'interest',
    answerType: 'likert',
    category: 'stem',
    options: [
      { value: '1', label: 'Not at all' },
      { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' },
      { value: '4', label: 'Very much' },
    ],
  },
]

// ─── PERSONALITY QUESTIONS (5) ────────────────────────────────────────────
export const personalityQuestions: Question[] = [
  {
    id: 'per_1',
    text: 'When studying for exams, you prefer:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Making charts and diagrams', stream: 'science' },
      { value: 'b', label: 'Re-reading and summarizing notes', stream: 'humanities' },
      { value: 'c', label: 'Solving practice problems', stream: 'science' },
      { value: 'd', label: 'Discussing with friends', stream: 'humanities' },
    ],
  },
  {
    id: 'per_2',
    text: 'Your ideal school project would be:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Building a working model or experiment', stream: 'science' },
      { value: 'b', label: 'Writing a story or making a documentary', stream: 'humanities' },
      { value: 'c', label: 'Creating a business plan or budget', stream: 'commerce' },
      { value: 'd', label: 'Organizing a school event or campaign', stream: 'commerce' },
    ],
  },
  {
    id: 'per_3',
    text: 'When you have free time, you most often:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Watch science/tech videos or code', stream: 'science' },
      { value: 'b', label: 'Read, write, or watch documentaries', stream: 'humanities' },
      { value: 'c', label: 'Track savings or play strategy games', stream: 'commerce' },
      { value: 'd', label: 'Spend quality time with family/friends', stream: 'humanities' },
    ],
  },
  {
    id: 'per_4',
    text: 'The subject you look forward to the most:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Maths or Physics', stream: 'science' },
      { value: 'b', label: 'English or History', stream: 'humanities' },
      { value: 'c', label: 'Economics or Accountancy', stream: 'commerce' },
      { value: 'd', label: 'Any subject I can discuss with others', stream: 'humanities' },
    ],
  },
  {
    id: 'per_5',
    text: 'In 10 years, you see yourself as:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Engineer, Doctor, Scientist, or Tech professional', stream: 'science' },
      { value: 'b', label: 'Journalist, Lawyer, Teacher, or Artist', stream: 'humanities' },
      { value: 'c', label: 'Entrepreneur, CA, Banker, or Manager', stream: 'commerce' },
      { value: 'd', label: 'Social worker, Counsellor, or Government officer', stream: 'humanities' },
    ],
  },
]

export const allQuestions = {
  aptitude: aptitudeQuestions,
  interest: interestQuestions,
  personality: personalityQuestions,
}
