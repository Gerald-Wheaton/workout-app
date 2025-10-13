// Type definitions for Workout App

// ===== User Profile =====
export interface UserProfile {
  id: string // UUID
  name: string
  email: string
  avatarUrl?: string
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  defaultWeightUnit: 'lbs' | 'kg'
  timerAutoStart: boolean
  restTimerDuration: number // seconds
}

// ===== Exercise Library =====
export interface Exercise {
  id: string // UUID
  name: string // "Chest Flyes", "Bench Press", etc.
  category: ExerciseCategory
  muscleGroups: MuscleGroup[]
  equipment?: Equipment
  description?: string
  videoUrl?: string
  createdAt: Date
  isCustom: boolean // true if user-created
}

export type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'legs'
  | 'arms'
  | 'core'
  | 'cardio'
  | 'other'

export type MuscleGroup =
  | 'chest'
  | 'lats'
  | 'traps'
  | 'deltoids'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'abs'
  | 'obliques'

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'resistance-band'
  | 'other'

// ===== Routine Structure =====
export interface Routine {
  id: string // UUID
  userId: string // Reference to UserProfile
  name: string // "Push Day", "Leg Day", etc.
  description?: string
  exercises: RoutineExercise[] // Ordered list
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface RoutineExercise {
  id: string // UUID
  routineId: string // Reference to parent Routine
  exerciseId: string // Reference to Exercise
  order: number // Position in routine (0-indexed)
  targetSets: number // Number of sets to complete
  targetReps: number // Target reps per set
  targetWeight?: number // Suggested weight
  weightUnit: 'lbs' | 'kg'
  restTime?: number // Seconds between sets
  notes?: string // Exercise-specific notes
}

// ===== Workout Session (Active Workout) =====
export interface WorkoutSession {
  id: string // UUID
  userId: string
  routineId: string
  routineName: string // Snapshot of routine name
  status: 'in-progress' | 'completed' | 'cancelled'
  startTime: Date
  endTime?: Date
  currentExerciseIndex: number // Which exercise user is on
  exercises: WorkoutExercise[]
  totalDuration?: number // Seconds
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface WorkoutExercise {
  id: string // UUID
  sessionId: string
  exerciseId: string
  exerciseName: string // Snapshot
  order: number
  sets: WorkoutSet[]
  status: 'not-started' | 'in-progress' | 'completed'
  startTime?: Date
  endTime?: Date
  notes?: string
}

export interface WorkoutSet {
  id: string // UUID
  workoutExerciseId: string
  setNumber: number // 1-indexed (1, 2, 3, etc.)
  targetReps: number
  actualReps?: number // null until completed
  targetWeight?: number
  actualWeight?: number // null until completed
  weightUnit: 'lbs' | 'kg'
  status: 'incomplete' | 'completed'
  completedAt?: Date
  restTime?: number // Seconds rested after this set
}

// ===== Historical Data (For Analytics) =====
export interface WorkoutHistory {
  id: string
  userId: string
  sessions: WorkoutSession[] // Completed sessions
  createdAt: Date
  updatedAt: Date
}

export interface ExerciseProgress {
  exerciseId: string
  exerciseName: string
  userId: string
  history: ExerciseHistoryEntry[]
}

export interface ExerciseHistoryEntry {
  sessionId: string
  date: Date
  sets: {
    reps: number
    weight: number
    weightUnit: 'lbs' | 'kg'
  }[]
  totalVolume: number // sum of (reps × weight) for all sets
  personalBest?: boolean // Flag if this is a new PR
}

// ===== App State (Runtime) =====
export interface AppState {
  user: UserProfile | null
  currentSession: WorkoutSession | null
  routines: Routine[]
  exercises: Exercise[]
  history: WorkoutSession[]
  theme: 'light' | 'dark'
  isDrawerOpen: boolean
  isExerciseDrawerOpen: boolean
}
