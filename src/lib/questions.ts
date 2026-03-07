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
  {
    id: 'apt_16',
    text: 'In a class of 40 students, 25% scored above 90%. How many students scored above 90%?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: '5' },
      { value: 'b', label: '10' },
      { value: 'c', label: '15' },
      { value: 'd', label: '20' },
    ],
  },
  {
    id: 'apt_17',
    text: "Priya says: 'He is the only son of my father's only brother.' How is Priya related to him?",
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: 'Sister' },
      { value: 'b', label: 'Cousin' },
      { value: 'c', label: 'Niece' },
      { value: 'd', label: 'Aunt' },
    ],
  },
  {
    id: 'apt_18',
    text: 'Choose the correct form: "The committee __ its final report after months of deliberation."',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'a',
    options: [
      { value: 'a', label: 'Submitted' },
      { value: 'b', label: 'Submits' },
      { value: 'c', label: 'Submitting' },
      { value: 'd', label: 'Submit' },
    ],
  },
  {
    id: 'apt_19',
    text: 'Ram starts facing North, turns 90° to the right, then turns 90° to the right again. In which direction is he now facing?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'd',
    options: [
      { value: 'a', label: 'North' },
      { value: 'b', label: 'West' },
      { value: 'c', label: 'East' },
      { value: 'd', label: 'South' },
    ],
  },
  {
    id: 'apt_20',
    text: 'In a 3×3 grid of unit squares, how many squares of all sizes (1×1, 2×2, 3×3) are there in total?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'spatial',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: '9' },
      { value: 'b', label: '12' },
      { value: 'c', label: '14' },
      { value: 'd', label: '16' },
    ],
  },
]

// ─── INTEREST INVENTORY (24) ──────────────────────────────────────────────
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
  {
    id: 'int_16',
    text: 'I am fascinated by topics like space exploration, AI, or climate science',
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
    id: 'int_17',
    text: 'I like the idea of launching my own startup or business one day',
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
    id: 'int_18',
    text: 'I find accounting, bookkeeping, and keeping financial records interesting',
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
    id: 'int_19',
    text: 'I enjoy coding, building apps, or designing websites',
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
    id: 'int_20',
    text: 'I enjoy negotiating, persuading, or convincing others in discussions',
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
    id: 'int_21',
    text: 'I enjoy creative writing, drama, or expressing ideas through art',
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
    id: 'int_22',
    text: 'I am interested in how stock markets and investments work',
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
    id: 'int_23',
    text: 'I like analyzing data, graphs, and statistics to find patterns',
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
    id: 'int_24',
    text: 'I enjoy taking on leadership roles in group activities or school clubs',
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
]

// ─── PERSONALITY QUESTIONS (12) ───────────────────────────────────────────
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
  {
    id: 'per_6',
    text: 'When you disagree with a group decision, you usually:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Stick to facts, logic, and present evidence', stream: 'science' },
      { value: 'b', label: 'Share your feelings and talk it through openly', stream: 'humanities' },
      { value: 'c', label: 'Weigh the practical impact and propose an alternative', stream: 'commerce' },
      { value: 'd', label: 'Find a compromise that keeps everyone comfortable', stream: 'humanities' },
    ],
  },
  {
    id: 'per_7',
    text: 'After school, you are most likely to be found:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Watching coding tutorials or science videos online', stream: 'science' },
      { value: 'b', label: 'Writing in a journal or getting lost in a novel', stream: 'humanities' },
      { value: 'c', label: 'Planning how to save up or achieve a personal goal', stream: 'commerce' },
      { value: 'd', label: 'Hanging out with friends or helping a classmate', stream: 'humanities' },
    ],
  },
  {
    id: 'per_8',
    text: 'If your school had a "Business Idea Competition", you would:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Design a tech solution or working prototype', stream: 'science' },
      { value: 'b', label: 'Create a social impact project or awareness campaign', stream: 'humanities' },
      { value: 'c', label: 'Build a detailed business plan with profit projections', stream: 'commerce' },
      { value: 'd', label: 'Focus on community benefit and getting people involved', stream: 'humanities' },
    ],
  },
  {
    id: 'per_9',
    text: 'When making a big decision, you rely most on:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Research, data, and logical analysis', stream: 'science' },
      { value: 'b', label: 'Your instincts and how you feel about it', stream: 'humanities' },
      { value: 'c', label: 'A pros-and-cons list focused on risks and returns', stream: 'commerce' },
      { value: 'd', label: 'Advice from people you trust and respect', stream: 'humanities' },
    ],
  },
  {
    id: 'per_10',
    text: 'Your ideal weekend activity is:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Building something — a project, app, or experiment', stream: 'science' },
      { value: 'b', label: 'Visiting a museum, watching a film, or making art', stream: 'humanities' },
      { value: 'c', label: 'Tracking personal goals and planning the week ahead', stream: 'commerce' },
      { value: 'd', label: 'Volunteering, exploring culture, or meeting new people', stream: 'humanities' },
    ],
  },
  {
    id: 'per_11',
    text: 'In group work, your natural role tends to be:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'The problem-solver who handles the technical parts', stream: 'science' },
      { value: 'b', label: 'The communicator who writes or presents the work', stream: 'humanities' },
      { value: 'c', label: 'The organizer who manages tasks and timelines', stream: 'commerce' },
      { value: 'd', label: 'The motivator who keeps the team spirit high', stream: 'humanities' },
    ],
  },
  {
    id: 'per_12',
    text: 'If given a free choice of internship, you would pick:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'A tech company or research lab', stream: 'science' },
      { value: 'b', label: 'A media house, NGO, or social enterprise', stream: 'humanities' },
      { value: 'c', label: 'A bank, CA firm, or business consulting company', stream: 'commerce' },
      { value: 'd', label: 'A school, hospital, or cultural organisation', stream: 'humanities' },
    ],
  },
]

export const allQuestions = {
  aptitude: aptitudeQuestions,
  interest: interestQuestions,
  personality: personalityQuestions,
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── GRADE GROUP TYPE ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

export type GradeGroup = 'discovery' | 'decision' | 'career'

// Grade 8-9 → 'discovery', Grade 10 → 'decision', Grade 11-12 → 'career'
export function getGradeGroup(grade: string | undefined | null): GradeGroup {
  if (!grade) return 'decision'
  const num = parseInt(grade.replace(/\D/g, ''), 10)
  if (isNaN(num)) return 'decision'
  if (num <= 9) return 'discovery'
  if (num >= 11) return 'career'
  return 'decision'
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── DISCOVERY QUESTIONS — Grade 8 & 9 (prefix: apt_d_, int_d_, per_d_) ──
// ═══════════════════════════════════════════════════════════════════════════

export const discoveryAptitudeQuestions: Question[] = [
  {
    id: 'apt_d_1',
    text: 'Complete the number series: 3, 6, 9, 12, __',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: '13' },
      { value: 'b', label: '14' },
      { value: 'c', label: '15' },
      { value: 'd', label: '16' },
    ],
  },
  {
    id: 'apt_d_2',
    text: 'Find the odd one out: Dog, Cat, Cow, Eagle',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'd',
    options: [
      { value: 'a', label: 'Dog' },
      { value: 'b', label: 'Cat' },
      { value: 'c', label: 'Cow' },
      { value: 'd', label: 'Eagle' },
    ],
  },
  {
    id: 'apt_d_3',
    text: 'A shop opens at 9:30 AM and closes after 8 hours. When does it close?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: '5:00 PM' },
      { value: 'b', label: '5:30 PM' },
      { value: 'c', label: '6:00 PM' },
      { value: 'd', label: '6:30 PM' },
    ],
  },
  {
    id: 'apt_d_4',
    text: 'In a code, CAT is written as "3-1-20" (C=3rd, A=1st, T=20th letter). What is DOG?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: '4-14-6' },
      { value: 'b', label: '4-15-7' },
      { value: 'c', label: '3-14-7' },
      { value: 'd', label: '4-14-7' },
    ],
  },
  {
    id: 'apt_d_5',
    text: 'A rectangle has length 8 cm and width 5 cm. What is its perimeter?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: '24 cm' },
      { value: 'b', label: '26 cm' },
      { value: 'c', label: '28 cm' },
      { value: 'd', label: '40 cm' },
    ],
  },
  {
    id: 'apt_d_6',
    text: 'Choose the word most opposite in meaning to HAPPY:',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: 'Joyful' },
      { value: 'b', label: 'Sad' },
      { value: 'c', label: 'Excited' },
      { value: 'd', label: 'Cheerful' },
    ],
  },
  {
    id: 'apt_d_7',
    text: 'A class has boys and girls in the ratio 3:2. If there are 15 boys, how many girls are there?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: '8' },
      { value: 'b', label: '9' },
      { value: 'c', label: '10' },
      { value: 'd', label: '12' },
    ],
  },
  {
    id: 'apt_d_8',
    text: 'What comes next in the series: A, C, E, G, __?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: 'H' },
      { value: 'b', label: 'I' },
      { value: 'c', label: 'J' },
      { value: 'd', label: 'K' },
    ],
  },
  {
    id: 'apt_d_9',
    text: 'How many faces does a cube have?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'spatial',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: '4' },
      { value: 'b', label: '5' },
      { value: 'c', label: '6' },
      { value: 'd', label: '8' },
    ],
  },
  {
    id: 'apt_d_10',
    text: 'Choose the correctly spelled word:',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: 'Beleive' },
      { value: 'b', label: 'Recieve' },
      { value: 'c', label: 'Achieve' },
      { value: 'd', label: 'Freind' },
    ],
  },
  {
    id: 'apt_d_11',
    text: 'What is 20% of 150?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: '20' },
      { value: 'b', label: '25' },
      { value: 'c', label: '30' },
      { value: 'd', label: '35' },
    ],
  },
  {
    id: 'apt_d_12',
    text: 'Based only on these statements: "All birds can fly. A penguin is a bird." What follows?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: 'Penguins cannot fly in real life' },
      { value: 'b', label: 'The statement is wrong' },
      { value: 'c', label: 'According to these statements, a penguin can fly' },
      { value: 'd', label: 'Cannot determine anything' },
    ],
  },
  {
    id: 'apt_d_13',
    text: 'How many lines of symmetry does an equilateral triangle have?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'spatial',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: '1' },
      { value: 'b', label: '2' },
      { value: 'c', label: '3' },
      { value: 'd', label: '4' },
    ],
  },
  {
    id: 'apt_d_14',
    text: 'Choose the word closest in meaning to BRAVE:',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: 'Cowardly' },
      { value: 'b', label: 'Timid' },
      { value: 'c', label: 'Courageous' },
      { value: 'd', label: 'Afraid' },
    ],
  },
  {
    id: 'apt_d_15',
    text: 'What is 3/4 + 1/2?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: '4/6' },
      { value: 'b', label: '1' },
      { value: 'c', label: '5/4' },
      { value: 'd', label: '7/4' },
    ],
  },
  {
    id: 'apt_d_16',
    text: 'Which shape has exactly 4 lines of symmetry?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'spatial',
    correctAnswer: 'd',
    options: [
      { value: 'a', label: 'Equilateral Triangle' },
      { value: 'b', label: 'Rectangle' },
      { value: 'c', label: 'Regular Pentagon' },
      { value: 'd', label: 'Square' },
    ],
  },
  {
    id: 'apt_d_17',
    text: 'A car travels 240 km in 4 hours. How far will it travel in 1.5 hours at the same speed?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: '60 km' },
      { value: 'b', label: '80 km' },
      { value: 'c', label: '90 km' },
      { value: 'd', label: '100 km' },
    ],
  },
  {
    id: 'apt_d_18',
    text: 'Doctor is to Patient as Teacher is to:',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: 'School' },
      { value: 'b', label: 'Lesson' },
      { value: 'c', label: 'Student' },
      { value: 'd', label: 'Knowledge' },
    ],
  },
  {
    id: 'apt_d_19',
    text: 'You are facing North. You turn 90° to the right. Which direction are you now facing?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'd',
    options: [
      { value: 'a', label: 'North' },
      { value: 'b', label: 'South' },
      { value: 'c', label: 'West' },
      { value: 'd', label: 'East' },
    ],
  },
  {
    id: 'apt_d_20',
    text: 'How many edges does a cuboid (rectangular box) have?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'spatial',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: '8' },
      { value: 'b', label: '10' },
      { value: 'c', label: '12' },
      { value: 'd', label: '16' },
    ],
  },
]

export const discoveryInterestQuestions: Question[] = [
  {
    id: 'int_d_1',
    text: 'I enjoy my Maths class and like solving numerical problems',
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
    id: 'int_d_2',
    text: 'I like reading story books or novels in my free time',
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
    id: 'int_d_3',
    text: 'I am curious about science experiments in the lab',
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
    id: 'int_d_4',
    text: 'I like the idea of running a school stall or organizing a small sale',
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
    id: 'int_d_5',
    text: 'I enjoy drawing, sketching, or making craft projects',
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
    id: 'int_d_6',
    text: 'I like puzzles, brain teasers, and logic games',
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
    id: 'int_d_7',
    text: 'I enjoy writing stories, poems, or school essays',
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
    id: 'int_d_8',
    text: 'I like to keep track of my pocket money and spending',
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
    id: 'int_d_9',
    text: 'I find it exciting to learn how gadgets and devices work',
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
    id: 'int_d_10',
    text: 'I enjoy watching documentaries about history, culture, or nature',
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
    id: 'int_d_11',
    text: 'I like organizing events or activities for my classmates',
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
    id: 'int_d_12',
    text: 'I enjoy learning about computers and how apps or games are made',
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
    id: 'int_d_13',
    text: 'I like helping my friends when they are upset or have a problem',
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
    id: 'int_d_14',
    text: 'I enjoy discussing how shops, prices, and money work in daily life',
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
    id: 'int_d_15',
    text: 'I love learning about planets, space, or the natural world',
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
    id: 'int_d_16',
    text: 'I love observing plants, insects, and animals in nature',
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
    id: 'int_d_17',
    text: 'I enjoy performing in school plays, skits, or cultural events',
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
    id: 'int_d_18',
    text: 'I like the idea of buying things cheap and selling them for more',
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
    id: 'int_d_19',
    text: 'I enjoy learning about different cultures, traditions, and festivals',
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
    id: 'int_d_20',
    text: 'I like being the team leader during group activities in school',
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
    id: 'int_d_21',
    text: 'I enjoy basic coding or making simple games and animations on a computer',
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
    id: 'int_d_22',
    text: 'I enjoy helping younger students or kids understand difficult things',
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
    id: 'int_d_23',
    text: 'I find it interesting to learn how prices and discounts work in shops',
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
    id: 'int_d_24',
    text: 'I like planning and managing a school budget or event fund',
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
]

export const discoveryPersonalityQuestions: Question[] = [
  {
    id: 'per_d_1',
    text: 'Your favourite school subject is (closest match):',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Maths or Science', stream: 'science' },
      { value: 'b', label: 'English, Hindi, or Social Studies', stream: 'humanities' },
      { value: 'c', label: 'Any subject that involves calculating or counting', stream: 'commerce' },
      { value: 'd', label: 'Art, Music, or Drama', stream: 'humanities' },
    ],
  },
  {
    id: 'per_d_2',
    text: 'If your school needed a volunteer for a special task, you would most enjoy:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Setting up a science demo or coding project', stream: 'science' },
      { value: 'b', label: 'Writing for the school magazine or organizing a debate', stream: 'humanities' },
      { value: 'c', label: 'Managing the school store or collecting fees', stream: 'commerce' },
      { value: 'd', label: 'Welcoming new students or organizing a cultural event', stream: 'humanities' },
    ],
  },
  {
    id: 'per_d_3',
    text: 'Your dream school club would be:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Science & Robotics Club', stream: 'science' },
      { value: 'b', label: 'Drama & Creative Writing Club', stream: 'humanities' },
      { value: 'c', label: 'Junior Business & Finance Club', stream: 'commerce' },
      { value: 'd', label: 'Social Service & Community Club', stream: 'humanities' },
    ],
  },
  {
    id: 'per_d_4',
    text: 'When your class has a group project, you usually:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Take charge of the research and data', stream: 'science' },
      { value: 'b', label: 'Write and present the final report', stream: 'humanities' },
      { value: 'c', label: 'Handle the budget and manage resources', stream: 'commerce' },
      { value: 'd', label: 'Make sure everyone works together happily', stream: 'humanities' },
    ],
  },
  {
    id: 'per_d_5',
    text: 'When you grow up, your dream job sounds most like:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Scientist, Doctor, Engineer, or Game Developer', stream: 'science' },
      { value: 'b', label: 'Author, Teacher, Journalist, or Actor', stream: 'humanities' },
      { value: 'c', label: 'Businessman, Bank Manager, or Stock Analyst', stream: 'commerce' },
      { value: 'd', label: 'Social Worker, Counsellor, or Government Officer', stream: 'humanities' },
    ],
  },
  {
    id: 'per_d_6',
    text: 'When you see something broken, your first instinct is to:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Try to fix it and understand how it works', stream: 'science' },
      { value: 'b', label: 'Write a story or draw inspiration from it', stream: 'humanities' },
      { value: 'c', label: 'Think about how much it would cost to replace it', stream: 'commerce' },
      { value: 'd', label: 'Ask someone to help you and talk it through', stream: 'humanities' },
    ],
  },
  {
    id: 'per_d_7',
    text: 'Your favourite thing about school is:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Labs, experiments, and finding out how things work', stream: 'science' },
      { value: 'b', label: 'Reading, discussions, and expressing your opinions', stream: 'humanities' },
      { value: 'c', label: 'Group projects where you manage resources or money', stream: 'commerce' },
      { value: 'd', label: 'Making friends and working well in teams', stream: 'humanities' },
    ],
  },
  {
    id: 'per_d_8',
    text: 'On weekends, you would most like to:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Build a model or experiment with a science kit', stream: 'science' },
      { value: 'b', label: 'Read a book or write stories and poems', stream: 'humanities' },
      { value: 'c', label: 'Play a board game involving strategy or money', stream: 'commerce' },
      { value: 'd', label: 'Spend time with family or help in the community', stream: 'humanities' },
    ],
  },
  {
    id: 'per_d_9',
    text: 'Your favourite YouTube channel or TV show would be about:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Science experiments, robots, or how things are made', stream: 'science' },
      { value: 'b', label: 'History, culture, travel, or real human stories', stream: 'humanities' },
      { value: 'c', label: 'How entrepreneurs built their businesses or made money', stream: 'commerce' },
      { value: 'd', label: 'Social issues, nature, or inspiring people who helped others', stream: 'humanities' },
    ],
  },
  {
    id: 'per_d_10',
    text: 'If you could start a project for your neighbourhood, it would be:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'A science fair or tech workshop for local kids', stream: 'science' },
      { value: 'b', label: 'A library corner or storytelling programme for children', stream: 'humanities' },
      { value: 'c', label: 'A small market where students sell things they made', stream: 'commerce' },
      { value: 'd', label: 'A community campaign to help people in need', stream: 'humanities' },
    ],
  },
  {
    id: 'per_d_11',
    text: 'You feel most confident when you are:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Solving a tricky maths or science problem', stream: 'science' },
      { value: 'b', label: 'Writing, speaking, or presenting in front of others', stream: 'humanities' },
      { value: 'c', label: 'Planning an event or managing money and resources', stream: 'commerce' },
      { value: 'd', label: 'Listening to someone and helping them feel better', stream: 'humanities' },
    ],
  },
  {
    id: 'per_d_12',
    text: 'The adult you admire most would likely be:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'A scientist, engineer, or inventor', stream: 'science' },
      { value: 'b', label: 'A writer, teacher, or humanitarian', stream: 'humanities' },
      { value: 'c', label: 'A successful entrepreneur or business leader', stream: 'commerce' },
      { value: 'd', label: 'A social worker, activist, or community leader', stream: 'humanities' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// ─── CAREER QUESTIONS — Grade 11 & 12 (prefix: apt_c_, int_c_, per_c_) ───
// ═══════════════════════════════════════════════════════════════════════════

export const careerAptitudeQuestions: Question[] = [
  {
    id: 'apt_c_1',
    text: 'Rs. 10,000 is invested at 10% per annum compound interest for 2 years. What is the total amount?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: 'Rs. 11,000' },
      { value: 'b', label: 'Rs. 12,000' },
      { value: 'c', label: 'Rs. 12,100' },
      { value: 'd', label: 'Rs. 12,010' },
    ],
  },
  {
    id: 'apt_c_2',
    text: 'EPHEMERAL most nearly means:',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: 'Lasting forever' },
      { value: 'b', label: 'Short-lived or temporary' },
      { value: 'c', label: 'Extremely important' },
      { value: 'd', label: 'Deeply emotional' },
    ],
  },
  {
    id: 'apt_c_3',
    text: 'In a class of 50, 30 play cricket, 20 play football, and 10 play both. How many play neither?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: '5' },
      { value: 'b', label: '8' },
      { value: 'c', label: '10' },
      { value: 'd', label: '12' },
    ],
  },
  {
    id: 'apt_c_4',
    text: 'Some teachers are writers. All writers are creative. What can we definitely conclude?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: 'All teachers are creative' },
      { value: 'b', label: 'Some teachers are creative' },
      { value: 'c', label: 'No teachers are creative' },
      { value: 'd', label: 'Cannot determine' },
    ],
  },
  {
    id: 'apt_c_5',
    text: 'A cube is painted red on all faces and cut into 27 equal smaller cubes. How many smaller cubes have exactly 2 red faces?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'spatial',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: '8' },
      { value: 'b', label: '10' },
      { value: 'c', label: '12' },
      { value: 'd', label: '16' },
    ],
  },
  {
    id: 'apt_c_6',
    text: 'A can finish a work in 10 days; B in 15 days. How many days if they work together?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: '5 days' },
      { value: 'b', label: '6 days' },
      { value: 'c', label: '7 days' },
      { value: 'd', label: '8 days' },
    ],
  },
  {
    id: 'apt_c_7',
    text: 'Choose the word most opposite in meaning to LOQUACIOUS:',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: 'Talkative' },
      { value: 'b', label: 'Verbose' },
      { value: 'c', label: 'Reticent' },
      { value: 'd', label: 'Eloquent' },
    ],
  },
  {
    id: 'apt_c_8',
    text: '"All that glitters is not gold." What is the best conclusion drawn from this statement?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: 'Gold always glitters' },
      { value: 'b', label: 'Shiny things may or may not be gold' },
      { value: 'c', label: 'Nothing that glitters is gold' },
      { value: 'd', label: 'Gold never glitters' },
    ],
  },
  {
    id: 'apt_c_9',
    text: 'What is the distance between the points (0, 0) and (3, 4) on a coordinate plane?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'spatial',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: '3' },
      { value: 'b', label: '4' },
      { value: 'c', label: '5' },
      { value: 'd', label: '7' },
    ],
  },
  {
    id: 'apt_c_10',
    text: 'The average of 5 numbers is 20. If one number is removed, the average of the remaining 4 becomes 18. What was the removed number?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: '22' },
      { value: 'b', label: '25' },
      { value: 'c', label: '28' },
      { value: 'd', label: '30' },
    ],
  },
  {
    id: 'apt_c_11',
    text: 'Fill in the blank: "Despite the __ criticism, the director\'s film won several prestigious awards."',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: 'Lavish' },
      { value: 'b', label: 'Scathing' },
      { value: 'c', label: 'Minimal' },
      { value: 'd', label: 'Positive' },
    ],
  },
  {
    id: 'apt_c_12',
    text: 'If RAIN is coded as SBJO (each letter shifted +1), then WALK is coded as:',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'a',
    options: [
      { value: 'a', label: 'XBML' },
      { value: 'b', label: 'VZKJ' },
      { value: 'c', label: 'YBML' },
      { value: 'd', label: 'XBNL' },
    ],
  },
  {
    id: 'apt_c_13',
    text: 'A person borrows Rs. 5,000 at 8% per annum simple interest. What is the total interest after 3 years?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: 'Rs. 800' },
      { value: 'b', label: 'Rs. 1,000' },
      { value: 'c', label: 'Rs. 1,200' },
      { value: 'd', label: 'Rs. 1,500' },
    ],
  },
  {
    id: 'apt_c_14',
    text: 'A carpet costs Rs. 200 per sq. metre. How much does it cost to carpet a room 6 m × 4 m?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'c',
    options: [
      { value: 'a', label: 'Rs. 4,000' },
      { value: 'b', label: 'Rs. 4,400' },
      { value: 'c', label: 'Rs. 4,800' },
      { value: 'd', label: 'Rs. 5,200' },
    ],
  },
  {
    id: 'apt_c_15',
    text: 'Two trains start from cities 300 km apart, moving towards each other at 60 km/h and 90 km/h. In how many hours will they meet?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: '1.5 hours' },
      { value: 'b', label: '2 hours' },
      { value: 'c', label: '2.5 hours' },
      { value: 'd', label: '3 hours' },
    ],
  },
  {
    id: 'apt_c_16',
    text: 'What is the angle between the hour and minute hands of a clock at exactly 3:00?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'spatial',
    correctAnswer: 'd',
    options: [
      { value: 'a', label: '45°' },
      { value: 'b', label: '60°' },
      { value: 'c', label: '75°' },
      { value: 'd', label: '90°' },
    ],
  },
  {
    id: 'apt_c_17',
    text: 'The idiom "burning the midnight oil" means:',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'verbal',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: 'Setting something on fire at night' },
      { value: 'b', label: 'Working or studying late into the night' },
      { value: 'c', label: 'Wasting energy unnecessarily' },
      { value: 'd', label: 'Celebrating with candles and lights' },
    ],
  },
  {
    id: 'apt_c_18',
    text: 'A product is marked up 25% over cost price, then sold at a 10% discount on marked price. What is the net profit percentage?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'numerical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: '10%' },
      { value: 'b', label: '12.5%' },
      { value: 'c', label: '15%' },
      { value: 'd', label: '7.5%' },
    ],
  },
  {
    id: 'apt_c_19',
    text: 'Statement: "Students who study regularly perform better in exams." Assumption: Regular study leads to better understanding. Is the assumption implicit?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'logical',
    correctAnswer: 'b',
    options: [
      { value: 'a', label: 'No, it is not implied by the statement' },
      { value: 'b', label: 'Yes, it is clearly implied by the statement' },
      { value: 'c', label: 'Only partially implied' },
      { value: 'd', label: 'Cannot say from the given information' },
    ],
  },
  {
    id: 'apt_c_20',
    text: 'A clock shows the time as 8:20 when seen in a mirror. What is the actual time?',
    type: 'aptitude',
    answerType: 'mcq',
    category: 'spatial',
    correctAnswer: 'a',
    options: [
      { value: 'a', label: '3:40' },
      { value: 'b', label: '4:40' },
      { value: 'c', label: '3:20' },
      { value: 'd', label: '5:20' },
    ],
  },
]

export const careerInterestQuestions: Question[] = [
  {
    id: 'int_c_1',
    text: 'I enjoy studying advanced Mathematics (calculus, probability, or statistics)',
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
    id: 'int_c_2',
    text: 'I enjoy writing articles, essays, or researching social topics',
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
    id: 'int_c_3',
    text: 'I am interested in learning programming or software development',
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
    id: 'int_c_4',
    text: 'I enjoy understanding how companies raise funds or manage their finances',
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
    id: 'int_c_5',
    text: 'I find topics like biotechnology, organic chemistry, or quantum physics exciting',
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
    id: 'int_c_6',
    text: 'I am passionate about psychology, sociology, or political science',
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
    id: 'int_c_7',
    text: 'I enjoy studying economics, marketing, or consumer behavior',
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
    id: 'int_c_8',
    text: 'I like data analysis, working with graphs, or making sense of large datasets',
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
    id: 'int_c_9',
    text: 'I enjoy debating, advocacy, or learning about law and rights',
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
    id: 'int_c_10',
    text: 'I am seriously interested in starting or running a business one day',
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
    id: 'int_c_11',
    text: 'I like the idea of working in healthcare, research labs, or tech companies',
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
    id: 'int_c_12',
    text: 'I am interested in journalism, media production, or content creation',
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
    id: 'int_c_13',
    text: 'I find topics like taxation, accounting, or financial auditing interesting',
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
    id: 'int_c_14',
    text: 'I care deeply about social justice, public policy, or governance',
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
    id: 'int_c_15',
    text: 'I enjoy engineering concepts — designing bridges, circuits, or machines',
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
    id: 'int_c_16',
    text: 'I am curious about artificial intelligence, machine learning, or robotics',
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
    id: 'int_c_17',
    text: 'I enjoy exploring different philosophies, ethical questions, or moral dilemmas',
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
    id: 'int_c_18',
    text: 'I am interested in supply chain management, logistics, or business operations',
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
    id: 'int_c_19',
    text: 'I care about international affairs, diplomacy, or geopolitics',
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
    id: 'int_c_20',
    text: 'I enjoy reading about startup ecosystems, venture capital, or innovative business models',
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
    id: 'int_c_21',
    text: 'I am fascinated by space technology, aerospace engineering, or astrophysics',
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
    id: 'int_c_22',
    text: 'I enjoy teaching, mentoring, or explaining complex ideas to others clearly',
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
    id: 'int_c_23',
    text: 'I find investment management, portfolio analysis, or wealth planning interesting',
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
    id: 'int_c_24',
    text: 'I am interested in management consulting, organisational strategy, or business design',
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
]

export const careerPersonalityQuestions: Question[] = [
  {
    id: 'per_c_1',
    text: 'You receive an internship offer. You would prefer:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'A tech startup building an AI product', stream: 'science' },
      { value: 'b', label: 'A newspaper or magazine as a junior writer', stream: 'humanities' },
      { value: 'c', label: 'A CA firm or investment bank', stream: 'commerce' },
      { value: 'd', label: 'An NGO working on education or environment issues', stream: 'humanities' },
    ],
  },
  {
    id: 'per_c_2',
    text: 'When solving a difficult problem, you tend to:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Draw diagrams, use formulas, and experiment', stream: 'science' },
      { value: 'b', label: 'Look at it from multiple perspectives and discuss', stream: 'humanities' },
      { value: 'c', label: 'Break it into a cost-benefit or logical analysis', stream: 'commerce' },
      { value: 'd', label: 'Gather opinions and talk to people with experience', stream: 'humanities' },
    ],
  },
  {
    id: 'per_c_3',
    text: 'If you could freely choose your college degree, it would be:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Engineering, Medicine, or Computer Science', stream: 'science' },
      { value: 'b', label: 'Law, Journalism, Psychology, or Liberal Arts', stream: 'humanities' },
      { value: 'c', label: 'Business Administration, Economics, or Commerce', stream: 'commerce' },
      { value: 'd', label: 'Political Science, Sociology, or International Relations', stream: 'humanities' },
    ],
  },
  {
    id: 'per_c_4',
    text: 'For you, career success means:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Creating innovations that solve real-world problems', stream: 'science' },
      { value: 'b', label: 'Making a lasting impact on people and society', stream: 'humanities' },
      { value: 'c', label: 'Building financial independence and wealth', stream: 'commerce' },
      { value: 'd', label: 'Earning recognition and influencing public discourse', stream: 'humanities' },
    ],
  },
  {
    id: 'per_c_5',
    text: 'If asked to lead a project at work, you would focus on:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Using data, systems, and technology to deliver results', stream: 'science' },
      { value: 'b', label: 'Communication, empathy, and powerful storytelling', stream: 'humanities' },
      { value: 'c', label: 'Setting targets, tracking budgets, and managing resources', stream: 'commerce' },
      { value: 'd', label: 'Collaborating with everyone and building team consensus', stream: 'humanities' },
    ],
  },
  {
    id: 'per_c_6',
    text: 'When reading news, you are most drawn to articles about:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'New technologies, scientific breakthroughs, or space discoveries', stream: 'science' },
      { value: 'b', label: 'Human stories, cultural shifts, or social movements', stream: 'humanities' },
      { value: 'c', label: 'Market trends, economic policies, or investment news', stream: 'commerce' },
      { value: 'd', label: 'Policy reforms, civil rights, or international relations', stream: 'humanities' },
    ],
  },
  {
    id: 'per_c_7',
    text: 'Your approach to a challenging assignment is:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Break it down systematically and test possible solutions', stream: 'science' },
      { value: 'b', label: 'Research deeply and write a compelling, well-argued response', stream: 'humanities' },
      { value: 'c', label: 'Create a structured plan with clear milestones and metrics', stream: 'commerce' },
      { value: 'd', label: 'Discuss it with peers and incorporate diverse viewpoints', stream: 'humanities' },
    ],
  },
  {
    id: 'per_c_8',
    text: 'You are most energized when you are:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Debugging code, solving equations, or running experiments', stream: 'science' },
      { value: 'b', label: 'Crafting a story, giving a speech, or understanding human behavior', stream: 'humanities' },
      { value: 'c', label: 'Analyzing financial data, setting targets, or building strategy', stream: 'commerce' },
      { value: 'd', label: 'Collaborating with a team to create meaningful change', stream: 'humanities' },
    ],
  },
  {
    id: 'per_c_9',
    text: 'The kind of legacy you want to leave is:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Inventions or discoveries that changed the way people live', stream: 'science' },
      { value: 'b', label: 'Stories, movements, or ideas that inspired generations', stream: 'humanities' },
      { value: 'c', label: 'A successful business or enterprise that created wealth and jobs', stream: 'commerce' },
      { value: 'd', label: 'A community or social cause that genuinely improved lives', stream: 'humanities' },
    ],
  },
  {
    id: 'per_c_10',
    text: 'When working on a team project, you instinctively:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Take the technical lead — research, data, and tools', stream: 'science' },
      { value: 'b', label: 'Draft the narrative, handle presentations, or manage stakeholders', stream: 'humanities' },
      { value: 'c', label: 'Build the project plan, track the budget and deadlines', stream: 'commerce' },
      { value: 'd', label: 'Ensure the whole team is aligned, motivated, and heard', stream: 'humanities' },
    ],
  },
  {
    id: 'per_c_11',
    text: 'Your biggest strength, according to your friends, is:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'Analytical — great at solving complex problems logically', stream: 'science' },
      { value: 'b', label: 'Creative, empathetic, and an exceptional communicator', stream: 'humanities' },
      { value: 'c', label: 'Organised, driven, and excellent at making things happen', stream: 'commerce' },
      { value: 'd', label: 'Warm, intuitive, and a natural connector of people', stream: 'humanities' },
    ],
  },
  {
    id: 'per_c_12',
    text: 'Your ideal learning path for the next 5 years looks like:',
    type: 'personality',
    answerType: 'options',
    options: [
      { value: 'a', label: 'JEE/NEET prep → Engineering or Medical degree → Tech or research career', stream: 'science' },
      { value: 'b', label: 'CLAT/Liberal Arts → Law, Journalism, or Psychology → Creating social impact', stream: 'humanities' },
      { value: 'c', label: 'CA/MBA prep → Finance or Business degree → Leading a company or fund', stream: 'commerce' },
      { value: 'd', label: 'UPSC/Social Work degree → Governance, policy, or NGO leadership', stream: 'humanities' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// ─── QUESTION POOL EXTENSIONS (for randomized retakes) ────────────────────
// ─── Appended to base arrays; getQuestionsForGrade picks a random subset ──
// ═══════════════════════════════════════════════════════════════════════════

// ── DECISION extra (Grade 10) ── apt_21-25, int_25-30, per_13-16 ──────────

const aptitudeQuestionsExtra: Question[] = [
  {
    id: 'apt_21', type: 'aptitude', answerType: 'mcq', category: 'numerical',
    text: 'A train covers 360 km in 4 hours. What is its speed in km/h?',
    options: [
      { value: 'a', label: '80 km/h' },
      { value: 'b', label: '90 km/h' },
      { value: 'c', label: '100 km/h' },
      { value: 'd', label: '110 km/h' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'apt_22', type: 'aptitude', answerType: 'mcq', category: 'verbal',
    text: 'Astronomy is to Stars as Botany is to ___',
    options: [
      { value: 'a', label: 'Plants' },
      { value: 'b', label: 'Animals' },
      { value: 'c', label: 'Rocks' },
      { value: 'd', label: 'Fish' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'apt_23', type: 'aptitude', answerType: 'mcq', category: 'logical',
    text: 'What is the next number in the series: 2, 6, 18, 54, ___?',
    options: [
      { value: 'a', label: '108' },
      { value: 'b', label: '162' },
      { value: 'c', label: '216' },
      { value: 'd', label: '180' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'apt_24', type: 'aptitude', answerType: 'mcq', category: 'spatial',
    text: 'A pentagon has 5 sides. How many diagonals does it have?',
    options: [
      { value: 'a', label: '3' },
      { value: 'b', label: '5' },
      { value: 'c', label: '7' },
      { value: 'd', label: '10' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'apt_25', type: 'aptitude', answerType: 'mcq', category: 'numerical',
    text: 'If 15% of a number is 45, what is the number?',
    options: [
      { value: 'a', label: '200' },
      { value: 'b', label: '250' },
      { value: 'c', label: '300' },
      { value: 'd', label: '350' },
    ],
    correctAnswer: 'c',
  },
]

const interestQuestionsExtra: Question[] = [
  {
    id: 'int_25', type: 'interest', answerType: 'likert', category: 'stem',
    text: 'How much do you enjoy coding or programming activities?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_26', type: 'interest', answerType: 'likert', category: 'stem',
    text: 'How interested are you in learning about space, astronomy and the universe?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_27', type: 'interest', answerType: 'likert', category: 'business',
    text: 'How excited are you about starting and running your own business someday?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_28', type: 'interest', answerType: 'likert', category: 'business',
    text: 'How much do you enjoy learning about investment, stock markets, and how money works?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_29', type: 'interest', answerType: 'likert', category: 'arts_social',
    text: 'How much do you enjoy writing creative stories, poetry, or journaling?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_30', type: 'interest', answerType: 'likert', category: 'arts_social',
    text: 'How interested are you in social justice, human rights, and making society better?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
]

const personalityQuestionsExtra: Question[] = [
  {
    id: 'per_13', type: 'personality', answerType: 'options', category: 'personality',
    text: 'Your favourite way to learn new things is through:',
    options: [
      { value: 'a', label: 'Experiments, data, and testing hypotheses', stream: 'science' },
      { value: 'b', label: 'Practical examples, case studies, and real market situations', stream: 'commerce' },
      { value: 'c', label: 'Reading, discussion, debate, and stories', stream: 'humanities' },
      { value: 'd', label: 'Step-by-step logical reasoning and structured analysis', stream: 'science' },
    ],
  },
  {
    id: 'per_14', type: 'personality', answerType: 'options', category: 'personality',
    text: 'You consider your biggest strength to be:',
    options: [
      { value: 'a', label: 'Analytical thinking and complex problem-solving', stream: 'science' },
      { value: 'b', label: 'Persuasion, negotiation, and influencing outcomes', stream: 'commerce' },
      { value: 'c', label: 'Empathy, communication, and connecting with people', stream: 'humanities' },
      { value: 'd', label: 'Creative expression and bringing new ideas to life', stream: 'humanities' },
    ],
  },
  {
    id: 'per_15', type: 'personality', answerType: 'options', category: 'personality',
    text: 'When making important decisions, you primarily:',
    options: [
      { value: 'a', label: 'Gather data and analyse every fact carefully', stream: 'science' },
      { value: 'b', label: 'Weigh costs, benefits, risks, and expected returns', stream: 'commerce' },
      { value: 'c', label: 'Consider how the decision affects the people involved', stream: 'humanities' },
      { value: 'd', label: 'Trust your intuition and gut instinct', stream: 'humanities' },
    ],
  },
  {
    id: 'per_16', type: 'personality', answerType: 'options', category: 'personality',
    text: 'In a group project, you naturally become:',
    options: [
      { value: 'a', label: 'The researcher who finds and analyses information', stream: 'science' },
      { value: 'b', label: 'The planner who organises tasks, timelines and budgets', stream: 'commerce' },
      { value: 'c', label: 'The communicator who presents ideas and gets buy-in', stream: 'humanities' },
      { value: 'd', label: 'The problem-solver who handles unexpected challenges', stream: 'science' },
    ],
  },
]

// ── DISCOVERY extra (Grade 8-9) ── apt_d_21-25, int_d_25-30, per_d_13-16 ──

const discoveryAptitudeQuestionsExtra: Question[] = [
  {
    id: 'apt_d_21', type: 'aptitude', answerType: 'mcq', category: 'numerical',
    text: 'A bag costs ₹120. After a 25% discount, what is the selling price?',
    options: [
      { value: 'a', label: '₹80' },
      { value: 'b', label: '₹90' },
      { value: 'c', label: '₹95' },
      { value: 'd', label: '₹100' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'apt_d_22', type: 'aptitude', answerType: 'mcq', category: 'verbal',
    text: 'Dictionary is to Words as Atlas is to ___',
    options: [
      { value: 'a', label: 'Maps' },
      { value: 'b', label: 'Numbers' },
      { value: 'c', label: 'Stars' },
      { value: 'd', label: 'Animals' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'apt_d_23', type: 'aptitude', answerType: 'mcq', category: 'logical',
    text: 'What comes next in the pattern: AZ, BY, CX, DW, ___?',
    options: [
      { value: 'a', label: 'EV' },
      { value: 'b', label: 'EU' },
      { value: 'c', label: 'ET' },
      { value: 'd', label: 'FV' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 'apt_d_24', type: 'aptitude', answerType: 'mcq', category: 'spatial',
    text: 'How many faces does a cube have?',
    options: [
      { value: 'a', label: '4' },
      { value: 'b', label: '5' },
      { value: 'c', label: '6' },
      { value: 'd', label: '8' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'apt_d_25', type: 'aptitude', answerType: 'mcq', category: 'numerical',
    text: 'Three-quarters of a number is 60. What is the number?',
    options: [
      { value: 'a', label: '75' },
      { value: 'b', label: '80' },
      { value: 'c', label: '85' },
      { value: 'd', label: '90' },
    ],
    correctAnswer: 'b',
  },
]

const discoveryInterestQuestionsExtra: Question[] = [
  {
    id: 'int_d_25', type: 'interest', answerType: 'likert', category: 'stem',
    text: 'How much do you enjoy solving maths puzzles and brain teasers?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_d_26', type: 'interest', answerType: 'likert', category: 'stem',
    text: 'How interested are you in learning how computers and smartphones work?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_d_27', type: 'interest', answerType: 'likert', category: 'business',
    text: 'How excited are you about earning your own money or running a small business?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_d_28', type: 'interest', answerType: 'likert', category: 'business',
    text: 'How much do you enjoy learning about how shops, brands, and companies work?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_d_29', type: 'interest', answerType: 'likert', category: 'arts_social',
    text: 'How much do you enjoy drawing, painting, crafting, or other creative activities?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_d_30', type: 'interest', answerType: 'likert', category: 'arts_social',
    text: 'How interested are you in learning different languages and about other cultures?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
]

const discoveryPersonalityQuestionsExtra: Question[] = [
  {
    id: 'per_d_13', type: 'personality', answerType: 'options', category: 'personality',
    text: 'Your favourite type of school project is:',
    options: [
      { value: 'a', label: 'A science experiment or maths investigation', stream: 'science' },
      { value: 'b', label: 'Making a business plan or calculating profits', stream: 'commerce' },
      { value: 'c', label: 'Writing an essay, story, or doing a presentation', stream: 'humanities' },
      { value: 'd', label: 'Building or designing something with your hands', stream: 'science' },
    ],
  },
  {
    id: 'per_d_14', type: 'personality', answerType: 'options', category: 'personality',
    text: 'After school, you most enjoy:',
    options: [
      { value: 'a', label: 'Solving puzzles, coding games, or science videos', stream: 'science' },
      { value: 'b', label: 'Managing savings, playing business board games', stream: 'commerce' },
      { value: 'c', label: 'Reading books, watching documentaries, or journaling', stream: 'humanities' },
      { value: 'd', label: 'Drawing, making music, or performing', stream: 'humanities' },
    ],
  },
  {
    id: 'per_d_15', type: 'personality', answerType: 'options', category: 'personality',
    text: 'In a school group activity, you usually:',
    options: [
      { value: 'a', label: 'Come up with new ideas and experiments to try', stream: 'science' },
      { value: 'b', label: 'Organise tasks, keep track of resources and deadlines', stream: 'commerce' },
      { value: 'c', label: 'Make sure everyone is heard and included', stream: 'humanities' },
      { value: 'd', label: 'Lead the group and motivate your teammates', stream: 'commerce' },
    ],
  },
  {
    id: 'per_d_16', type: 'personality', answerType: 'options', category: 'personality',
    text: 'You feel most proud when you have:',
    options: [
      { value: 'a', label: 'Solved a tricky maths or science problem', stream: 'science' },
      { value: 'b', label: 'Earned money or managed a project budget wisely', stream: 'commerce' },
      { value: 'c', label: 'Written something or spoken that moved people', stream: 'humanities' },
      { value: 'd', label: 'Created an artwork, craft or built something cool', stream: 'humanities' },
    ],
  },
]

// ── CAREER extra (Grade 11-12) ── apt_c_21-25, int_c_25-30, per_c_13-16 ───

const careerAptitudeQuestionsExtra: Question[] = [
  {
    id: 'apt_c_21', type: 'aptitude', answerType: 'mcq', category: 'numerical',
    text: 'A shopkeeper buys 50 items at ₹20 each and sells each at ₹28. What is the profit percentage?',
    options: [
      { value: 'a', label: '30%' },
      { value: 'b', label: '35%' },
      { value: 'c', label: '40%' },
      { value: 'd', label: '45%' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'apt_c_22', type: 'aptitude', answerType: 'mcq', category: 'verbal',
    text: 'Litigation is to Lawyer as Surgery is to ___',
    options: [
      { value: 'a', label: 'Nurse' },
      { value: 'b', label: 'Pharmacist' },
      { value: 'c', label: 'Surgeon' },
      { value: 'd', label: 'Radiologist' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'apt_c_23', type: 'aptitude', answerType: 'mcq', category: 'logical',
    text: 'All roses are flowers. Some flowers are red. Which of the following must be true?',
    options: [
      { value: 'a', label: 'All roses are red' },
      { value: 'b', label: 'Some roses may be red' },
      { value: 'c', label: 'No roses are red' },
      { value: 'd', label: 'All flowers are roses' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'apt_c_24', type: 'aptitude', answerType: 'mcq', category: 'spatial',
    text: 'A hexagon has 6 sides. How many diagonals does it have?',
    options: [
      { value: 'a', label: '6' },
      { value: 'b', label: '8' },
      { value: 'c', label: '9' },
      { value: 'd', label: '12' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'apt_c_25', type: 'aptitude', answerType: 'mcq', category: 'numerical',
    text: '₹5000 is invested at 8% compound interest per year. Approximately what is the amount after 2 years?',
    options: [
      { value: 'a', label: '₹5640' },
      { value: 'b', label: '₹5800' },
      { value: 'c', label: '₹5832' },
      { value: 'd', label: '₹5900' },
    ],
    correctAnswer: 'c',
  },
]

const careerInterestQuestionsExtra: Question[] = [
  {
    id: 'int_c_25', type: 'interest', answerType: 'likert', category: 'stem',
    text: 'How interested are you in working with big data, machine learning, or analytics tools?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_c_26', type: 'interest', answerType: 'likert', category: 'stem',
    text: 'How much do you enjoy coding, building software, or developing apps?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_c_27', type: 'interest', answerType: 'likert', category: 'business',
    text: 'How excited are you about studying corporate finance, investment banking, or venture capital?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_c_28', type: 'interest', answerType: 'likert', category: 'business',
    text: 'How much do you enjoy strategic planning, business management, or leadership roles?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_c_29', type: 'interest', answerType: 'likert', category: 'arts_social',
    text: 'How interested are you in studying law, governance, constitutional rights, or public policy?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
  {
    id: 'int_c_30', type: 'interest', answerType: 'likert', category: 'arts_social',
    text: 'How much do you enjoy writing analytical essays, opinion articles, or research reports?',
    options: [
      { value: '1', label: 'Not at all' }, { value: '2', label: 'A little' },
      { value: '3', label: 'Quite a bit' }, { value: '4', label: 'Very much' },
    ],
  },
]

const careerPersonalityQuestionsExtra: Question[] = [
  {
    id: 'per_c_13', type: 'personality', answerType: 'options', category: 'personality',
    text: 'When solving a complex problem, you prefer to:',
    options: [
      { value: 'a', label: 'Research data, run experiments, and test hypotheses', stream: 'science' },
      { value: 'b', label: 'Analyse costs, benefits, risks, and market factors', stream: 'commerce' },
      { value: 'c', label: 'Understand stakeholder perspectives and build consensus', stream: 'humanities' },
      { value: 'd', label: 'Break it into logical frameworks and structured steps', stream: 'science' },
    ],
  },
  {
    id: 'per_c_14', type: 'personality', answerType: 'options', category: 'personality',
    text: 'Your ideal work environment is:',
    options: [
      { value: 'a', label: 'A research lab, tech company, or hospital', stream: 'science' },
      { value: 'b', label: 'A corporate office, trading floor, or startup', stream: 'commerce' },
      { value: 'c', label: 'A courtroom, NGO, school, or media house', stream: 'humanities' },
      { value: 'd', label: 'A design studio or innovation centre', stream: 'humanities' },
    ],
  },
  {
    id: 'per_c_15', type: 'personality', answerType: 'options', category: 'personality',
    text: 'You believe the most critical skill for career success is:',
    options: [
      { value: 'a', label: 'Deep technical expertise and scientific knowledge', stream: 'science' },
      { value: 'b', label: 'Financial acumen, strategy, and business leadership', stream: 'commerce' },
      { value: 'c', label: 'Communication, persuasion, and social awareness', stream: 'humanities' },
      { value: 'd', label: 'Creative problem-solving and design thinking', stream: 'humanities' },
    ],
  },
  {
    id: 'per_c_16', type: 'personality', answerType: 'options', category: 'personality',
    text: 'Your long-term career vision is best described as:',
    options: [
      { value: 'a', label: 'Making scientific breakthroughs or technological innovations', stream: 'science' },
      { value: 'b', label: 'Building a company, leading finance, or driving economic growth', stream: 'commerce' },
      { value: 'c', label: 'Influencing society through law, policy, media, or education', stream: 'humanities' },
      { value: 'd', label: 'Designing life-changing solutions through engineering or medicine', stream: 'science' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// ─── GRADE-BASED QUESTION SELECTOR ────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Returns the COMPLETE question pool for a grade + type (no shuffling, no slicing).
 * Used by Results.tsx during scoring: it filters to questions that were actually answered,
 * which naturally handles the random subset drawn during each assessment attempt.
 */
export function getFullQuestionPool(
  grade: string | undefined | null,
  type: QuestionType
): Question[] {
  const group = getGradeGroup(grade)

  if (group === 'discovery') {
    if (type === 'aptitude') return [...discoveryAptitudeQuestions, ...discoveryAptitudeQuestionsExtra]
    if (type === 'interest') return [...discoveryInterestQuestions, ...discoveryInterestQuestionsExtra]
    return [...discoveryPersonalityQuestions, ...discoveryPersonalityQuestionsExtra]
  }

  if (group === 'career') {
    if (type === 'aptitude') return [...careerAptitudeQuestions, ...careerAptitudeQuestionsExtra]
    if (type === 'interest') return [...careerInterestQuestions, ...careerInterestQuestionsExtra]
    return [...careerPersonalityQuestions, ...careerPersonalityQuestionsExtra]
  }

  // 'decision' — Grade 10
  if (type === 'aptitude') return [...aptitudeQuestions, ...aptitudeQuestionsExtra]
  if (type === 'interest') return [...interestQuestions, ...interestQuestionsExtra]
  return [...personalityQuestions, ...personalityQuestionsExtra]
}

/**
 * Shuffles an array using Fisher-Yates and returns the first `count` items.
 * Ensures every retake surfaces a different random subset from the pool.
 */
function shuffleAndPick<T>(arr: T[], count: number): T[] {
  const pool = [...arr]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, Math.min(count, pool.length))
}

export function getQuestionsForGrade(
  grade: string | undefined | null,
  type: QuestionType
): Question[] {
  const group = getGradeGroup(grade)

  if (group === 'discovery') {
    if (type === 'aptitude')
      return shuffleAndPick([...discoveryAptitudeQuestions, ...discoveryAptitudeQuestionsExtra], 20)
    if (type === 'interest')
      return shuffleAndPick([...discoveryInterestQuestions, ...discoveryInterestQuestionsExtra], 24)
    return shuffleAndPick([...discoveryPersonalityQuestions, ...discoveryPersonalityQuestionsExtra], 12)
  }

  if (group === 'career') {
    if (type === 'aptitude')
      return shuffleAndPick([...careerAptitudeQuestions, ...careerAptitudeQuestionsExtra], 20)
    if (type === 'interest')
      return shuffleAndPick([...careerInterestQuestions, ...careerInterestQuestionsExtra], 24)
    return shuffleAndPick([...careerPersonalityQuestions, ...careerPersonalityQuestionsExtra], 12)
  }

  // 'decision' — Grade 10 (default)
  if (type === 'aptitude')
    return shuffleAndPick([...aptitudeQuestions, ...aptitudeQuestionsExtra], 20)
  if (type === 'interest')
    return shuffleAndPick([...interestQuestions, ...interestQuestionsExtra], 24)
  return shuffleAndPick([...personalityQuestions, ...personalityQuestionsExtra], 12)
}
