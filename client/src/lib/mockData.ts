import { 
  Dumbbell, Utensils, Trophy, User, Activity, Calendar, 
  Users, MessageCircle, Star, Heart, Clock, PlayCircle 
} from "lucide-react";

// Imported Assets
import pushupImage from "@assets/generated_images/pushup_challenge_cover.png";
import yogaImage from "@assets/generated_images/yoga_challenge_cover.png";
import absImage from "@assets/generated_images/abs_challenge_cover.png";
import waterImage from "@assets/generated_images/water_hydration_challenge_cover.png";
import walkImage from "@assets/generated_images/walking_step_up_challenge_cover.png";
import sugarImage from "@assets/generated_images/no_sugar_challenge_cover.png";

// --- Types ---

export interface Workout {
  id: number;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  durationMin: number;
  equipment: string;
  muscles: string[];
  thumbnail: string;
  videoUrl?: string;
  description: string;
  caloriesEstimate: number;
  steps: string[];
  tips: string[];
}

export interface Meal {
  id: number;
  title: string;
  category: string;
  tags: string[];
  image: string;
  calories: number;
  macros: { protein: number; carbs: number; fat: number };
  prepTimeMin: number;
  cookTimeMin: number;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  steps: string[];
  description: string;
}

export interface Challenge {
  id: string;
  title: string;
  durationDays: number;
  startInstruction: string;
  dailyPlan: string[]; // Just using strings for simplicity in this prompt
  image: string;
  description: string;
}

export interface Friend {
  id: number;
  name: string;
  bio: string;
  avatar: string;
  interests: string[];
  online: boolean;
}

export interface Trainer {
  id: number;
  name: string;
  bio: string;
  avatar: string;
  rate: number;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  certifications: string[];
  availability: string[];
}

// --- Data Generation Helpers ---

const WORKOUT_IMAGES = [
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop&q=60"
];

const MEAL_IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1476718406336-bb5a9832639a?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1484980972926-edee9698965f?w=800&auto=format&fit=crop&q=60"
];

// --- WORKOUTS ---
const WORKOUT_TITLES = [
  "Titan Strength Protocol", "HIIT Inferno", "Yoga Flow Awakening", "Core Crusher Extreme", 
  "Glute Activation Series", "Cardio Kickboxing", "Upper Body Sculpt", "Leg Day Domination",
  "Mobility Masterclass", "CrossFit WOD Alpha", "Spartan Endurance", "Pilates Power",
  "Kettlebell Chaos", "Bodyweight Beast", "Morning Mobility", "Evening Unwind Yoga",
  "Powerlifting Primer", "Tabata Torch", "Runner's Strength", "Calisthenics Pro"
];

const WORKOUT_DESCRIPTIONS = [
  "Build pure strength with this compound movement focused routine designed to maximize muscle recruitment.",
  "High-intensity intervals to torch fat and boost your metabolism for hours after the workout.",
  "Reconnect with your breath and improve flexibility with this flowing vinyasa sequence.",
  "Target every angle of your abs and obliques for a rock-solid core foundation.",
  "Isolate and activate the glutes for better posture, power, and aesthetics.",
  "Punch and kick your way to fitness with this high-energy combat-inspired cardio session.",
  "Chisel your arms, shoulders, and back with this hypertrophy-focused upper body blast.",
  "Build powerful legs with a mix of heavy lifts and plyometric movements.",
  "Unlock tight joints and improve your range of motion with these essential mobility drills.",
  "Test your endurance and strength with this functional fitness workout of the day.",
  "Push your limits with this military-style endurance circuit.",
  "Strengthen your core and improve alignment with controlled Pilates movements.",
  "Master the kettlebell with dynamic swings, snatches, and presses.",
  "No equipment needed for this full-body strength and conditioning routine.",
  "Wake up your body and mind with this energizing morning flow.",
  "Release tension and prepare for sleep with gentle stretches.",
  "Focus on the big three lifts to build raw power and mass.",
  "20 seconds on, 10 seconds off. Maximum effort intervals.",
  "Strength training specifically designed to improve running economy.",
  "Master your bodyweight with advanced gymnastic movements."
];

const WORKOUT_IMAGES_SPECIFIC = [
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&auto=format&fit=crop&q=60", // Titan Strength (Gym/Barbell)
  "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&auto=format&fit=crop&q=60", // HIIT (Action)
  "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=800&auto=format&fit=crop&q=60", // Yoga (Pose)
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60", // Core (Plank/Abs)
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=60", // Glutes (Squat/Lunge)
  "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&auto=format&fit=crop&q=60", // Kickboxing
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60", // Upper Body (Dumbbells)
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60", // Leg Day (Squat Rack)
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop&q=60", // Mobility (Stretching)
  "https://images.unsplash.com/photo-1517963879466-e9b5ce3825bf?w=800&auto=format&fit=crop&q=60", // CrossFit (Rope/Box)
  "https://images.unsplash.com/photo-1552674605-469523f54050?w=800&auto=format&fit=crop&q=60", // Spartan (Mud/Outdoor)
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=60", // Pilates (Mat)
  "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=800&auto=format&fit=crop&q=60", // Kettlebell
  "https://images.unsplash.com/photo-1598971639058-211a74a96191?w=800&auto=format&fit=crop&q=60", // Bodyweight (Pullup)
  "https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800&auto=format&fit=crop&q=60", // Morning (Sunrise Yoga)
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=60", // Evening (Relaxed)
  "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=800&auto=format&fit=crop&q=60", // Powerlifting (Heavy)
  "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=800&auto=format&fit=crop&q=60", // Tabata (Timer/Sweat)
  "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&auto=format&fit=crop&q=60", // Runner
  "https://images.unsplash.com/photo-1520334297757-1c650b4af96e?w=800&auto=format&fit=crop&q=60"  // Calisthenics (Human Flag/Rings)
];

export const WORKOUTS: Workout[] = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  title: WORKOUT_TITLES[i],
  category: ["Strength", "HIIT", "Yoga", "Core", "Lower Body", "Cardio", "Upper Body", "Lower Body", "Mobility", "CrossFit", "Endurance", "Pilates", "Strength", "HIIT", "Mobility", "Yoga", "Strength", "HIIT", "Cardio", "Strength"][i],
  difficulty: i % 3 === 0 ? "Advanced" : i % 3 === 1 ? "Intermediate" : "Beginner",
  durationMin: 15 + (i % 6) * 10,
  equipment: i % 4 === 0 ? "Barbell" : i % 4 === 1 ? "Dumbbells" : i % 4 === 2 ? "Mat" : "Kettlebell",
  muscles: [["Chest", "Triceps"], ["Full Body"], ["Core", "Flexibility"], ["Abs", "Obliques"], ["Glutes", "Hamstrings"], ["Cardio", "Coordination"], ["Biceps", "Shoulders"], ["Quads", "Calves"], ["Joints"], ["Full Body"], ["Full Body"], ["Core"], ["Full Body"], ["Full Body"], ["Flexibility"], ["Flexibility"], ["Legs", "Back"], ["Full Body"], ["Legs"], ["Upper Body"]][i],
  thumbnail: WORKOUT_IMAGES_SPECIFIC[i],
  description: WORKOUT_DESCRIPTIONS[i],
  caloriesEstimate: 200 + (i * 20),
  steps: [
    "Warm up with 5 minutes of light cardio.",
    "Perform dynamic stretches for the target muscle groups.",
    "Complete 3 sets of the primary compound movement.",
    "Follow with 3 sets of accessory isolation exercises.",
    "Keep rest periods between 60-90 seconds.",
    "Focus on form and controlled eccentric movement.",
    "Cool down with static stretching."
  ],
  tips: [
    "Keep your core engaged throughout every movement.",
    "Don't sacrifice form for weight.",
    "Breathe rhythmically: exhale on exertion.",
    "Stay hydrated during rest periods."
  ]
}));

// --- MEALS ---
const MEAL_TITLES = [
  "Sunrise Avocado Toast", "Quinoa Power Bowl", "Grilled Salmon Delight", "Berry Blast Smoothie", 
  "Chicken Pesto Pasta", "Tofu Stir-Fry", "Oatmeal Superfood Bowl", "Steak & Asparagus",
  "Greek Yogurt Parfait", "Mediterranean Salad", "Turkey Chili", "Veggie Wrap",
  "Protein Pancakes", "Shrimp Tacos", "Lentil Soup", "Caesar Salad",
  "Beef Stir-Fry", "Chia Seed Pudding", "Egg White Omelet", "Tuna Poke Bowl"
];

const MEAL_IMAGES_SPECIFIC = [
  "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&auto=format&fit=crop&q=60", // Avocado Toast
  "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=60", // Quinoa Bowl
  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=60", // Salmon
  "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&auto=format&fit=crop&q=60", // Smoothie
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&auto=format&fit=crop&q=60", // Pesto Pasta
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60", // Tofu/Salad bowl
  "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&auto=format&fit=crop&q=60", // Oatmeal
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60", // Steak
  "https://images.unsplash.com/photo-1488477181946-6428a029177b?w=800&auto=format&fit=crop&q=60", // Parfait
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=60", // Salad
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60", // Chili (Placeholderish)
  "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&auto=format&fit=crop&q=60", // Wrap
  "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=800&auto=format&fit=crop&q=60", // Pancakes
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=60", // Tacos
  "https://images.unsplash.com/photo-1547592166-23acbe346499?w=800&auto=format&fit=crop&q=60", // Soup
  "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop&q=60", // Caesar
  "https://images.unsplash.com/photo-1603133872878-684f208fb74b?w=800&auto=format&fit=crop&q=60", // Stir Fry
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=60", // Pudding/Bowl
  "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=60", // Omelet
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=60"  // Poke
];

const MEAL_CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snack", "Dinner", "Lunch", "Breakfast", "Dinner", "Snack", "Lunch", "Dinner", "Lunch", "Breakfast", "Dinner", "Lunch", "Lunch", "Dinner", "Snack", "Breakfast", "Lunch"];

export const MEALS: Meal[] = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  title: MEAL_TITLES[i],
  category: MEAL_CATEGORIES[i],
  tags: i % 2 === 0 ? ["High Protein"] : ["Vegan"],
  image: MEAL_IMAGES_SPECIFIC[i],
  calories: 300 + (i * 25),
  macros: { protein: 20 + (i % 15), carbs: 30 + (i % 20), fat: 10 + (i % 10) },
  prepTimeMin: 10 + (i % 10),
  cookTimeMin: 15 + (i % 20),
  difficulty: "Easy",
  description: "A delicious and nutritious meal packed with essential vitamins and minerals to fuel your day.",
  ingredients: [
    "1 cup Main Ingredient",
    "1/2 cup Fresh Vegetables",
    "2 tbsp Olive Oil",
    "1 tsp Spices",
    "Sea Salt & Pepper to taste"
  ],
  steps: [
    "Wash and prep all vegetables.",
    "Heat the pan to medium-high heat.",
    "Sear the protein for 3-4 minutes per side.",
    "Sauté vegetables until tender-crisp.",
    "Combine ingredients and season to taste.",
    "Serve immediately and enjoy!"
  ]
}));

// --- CHALLENGES (6) ---
export const CHALLENGES: Challenge[] = [
  {
    id: "pushup-30",
    title: "30-Day Push-Up Mastery",
    durationDays: 30,
    startInstruction: "Start with a max effort test.",
    dailyPlan: Array.from({ length: 30 }).map((_, i) => `Day ${i + 1}: ${10 + i} Push-ups`),
    image: pushupImage,
    description: "Transform your upper body strength in just one month."
  },
  {
    id: "yoga-14",
    title: "14-Day Flexibility Flow",
    durationDays: 14,
    startInstruction: "Find a quiet space and a mat.",
    dailyPlan: Array.from({ length: 14 }).map((_, i) => `Day ${i + 1}: ${['Sun Salutation', 'Hip Openers', 'Backbends'][i % 3]}`),
    image: yogaImage,
    description: "Improve your range of motion and reduce stress."
  },
  {
    id: "abs-30",
    title: "Core Crusher 30",
    durationDays: 30,
    startInstruction: "Prepare for the burn.",
    dailyPlan: Array.from({ length: 30 }).map((_, i) => `Day ${i + 1}: ${30 + (i * 5)}s Plank`),
    image: absImage,
    description: "Chisel your core with daily focused exercises."
  },
  {
    id: "water-7",
    title: "7-Day Hydration Reset",
    durationDays: 7,
    startInstruction: "Get your water bottle ready.",
    dailyPlan: Array.from({ length: 7 }).map((_, i) => `Day ${i + 1}: Drink 3 Liters`),
    image: waterImage,
    description: "Clear your skin and boost energy with optimal hydration."
  },
  {
    id: "steps-21",
    title: "21-Day Step Up",
    durationDays: 21,
    startInstruction: "Walking shoes on!",
    dailyPlan: Array.from({ length: 21 }).map((_, i) => `Day ${i + 1}: ${5000 + (i * 250)} Steps`),
    image: walkImage,
    description: "Build a habit of daily movement."
  },
  {
    id: "sugar-10",
    title: "10-Day No Sugar",
    durationDays: 10,
    startInstruction: "Clean out your pantry.",
    dailyPlan: Array.from({ length: 10 }).map((_, i) => `Day ${i + 1}: Zero added sugar`),
    image: sugarImage,
    description: "Reset your palate and break the sugar addiction."
  }
];

// --- FRIENDS (10) ---
export const FRIENDS: Friend[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: ["Alex", "Sarah", "Mike", "Emma", "David", "Lisa", "James", "Kelly", "Robert", "Sophie"][i],
  bio: "Fitness enthusiast loving the grind.",
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  interests: ["HIIT", "Yoga"],
  online: i % 3 === 0
}));

// --- TRAINERS (10) ---
export const TRAINERS: Trainer[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: ["Coach Carter", "Trainer Jen", "Marcus Fit", "Yoga with Sarah", "Beast Mode Bob", "Pilates Pam", "HIIT Harry", "Strength Steve", "Cardio Chloe", "Wellness Wendy"][i],
  bio: "Certified personal trainer with 10+ years of experience helping clients achieve their goals.",
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=trainer${i}`,
  rate: 50 + (i * 5),
  rating: 4.5 + (Math.random() * 0.5),
  reviewsCount: 10 + (i * 12),
  specialties: ["HIIT", "Nutrition"],
  certifications: ["NASM", "ACE", "ISSA"],
  availability: ["Mon 9:00", "Tue 14:00", "Wed 10:00"]
}));

export const QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "Your body can stand almost anything. It’s your mind that you have to convince.",
  "Fitness is not about being better than someone else. It’s about being better than you were yesterday.",
  "Discipline is doing what needs to be done, even if you don't want to do it."
];

export const WELLNESS_TIPS = [
  { id: 1, title: 'Digital Detox', content: 'Turn off screens 1h before bed.', category: 'Mental' },
  { id: 2, title: 'Hydration', content: 'Drink water upon waking.', category: 'Physical' },
  { id: 3, title: 'Box Breathing', content: 'In 4s, Hold 4s, Out 4s.', category: 'Stress' },
  { id: 4, title: 'Gratitude', content: 'Write 3 things you are thankful for.', category: 'Mental' }
];
