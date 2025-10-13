# Workout App - Project Implementation Plan

## Table of Contents

1. [Project Overview](#project-overview)
2. [Data Structures](#data-structures)
3. [Component Architecture](#component-architecture)
4. [Implementation Phases](#implementation-phases)
5. [State Management Strategy](#state-management-strategy)
6. [Navigation Flow](#navigation-flow)
7. [Technical Considerations](#technical-considerations)

---

## Project Overview

A React Native workout tracking application that allows users to:

- Track exercises, sets, reps, and weights in real-time
- Navigate through workout routines with visual progress indicators
- Review and edit completed sets
- Switch between exercises mid-workout
- Monitor workout duration with built-in timer

**Tech Stack:**

- React Native with Expo
- TypeScript
- Gluestack UI Component Library (for UI components)
- NativeWind (Tailwind CSS)
- React Context API or Zustand for state management
- AsyncStorage for local data persistence (pre-database)

**Naming Conventions:**

- **Filenames & Directories:** kebab-case (e.g., `workout-screen.tsx`, `exercise-drawer.tsx`, `user-store.ts`)
- **Components:** PascalCase for component names (e.g., `WorkoutScreen`, `ExerciseDrawer`)

---

## Data Structures

### 1. User Profile

```typescript
interface UserProfile {
  id: string // UUID
  name: string
  email: string
  avatarUrl?: string
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
}

interface UserPreferences {
  theme: 'light' | 'dark'
  defaultWeightUnit: 'lbs' | 'kg'
  timerAutoStart: boolean
  restTimerDuration: number // seconds
}
```

### 2. Exercise Library

```typescript
interface Exercise {
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

type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'legs'
  | 'arms'
  | 'core'
  | 'cardio'
  | 'other'

type MuscleGroup =
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

type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'resistance-band'
  | 'other'
```

### 3. Routine Structure

```typescript
interface Routine {
  id: string // UUID
  userId: string // Reference to UserProfile
  name: string // "Push Day", "Leg Day", etc.
  description?: string
  exercises: RoutineExercise[] // Ordered list
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

interface RoutineExercise {
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
```

### 4. Workout Session (Active Workout)

```typescript
interface WorkoutSession {
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

interface WorkoutExercise {
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

interface WorkoutSet {
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
```

### 5. Historical Data (For Analytics)

```typescript
interface WorkoutHistory {
  id: string
  userId: string
  sessions: WorkoutSession[] // Completed sessions
  createdAt: Date
  updatedAt: Date
}

interface ExerciseProgress {
  exerciseId: string
  exerciseName: string
  userId: string
  history: ExerciseHistoryEntry[]
}

interface ExerciseHistoryEntry {
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
```

### 6. App State (Runtime)

```typescript
interface AppState {
  user: UserProfile | null
  currentSession: WorkoutSession | null
  routines: Routine[]
  exercises: Exercise[]
  history: WorkoutSession[]
  theme: 'light' | 'dark'
  isDrawerOpen: boolean
  isExerciseDrawerOpen: boolean
}
```

---

## Component Architecture

### Screen Components

```
App
├── NavigationContainer
│   ├── DrawerNavigator (Side Menu)
│   │   ├── HomeScreen
│   │   ├── RoutinesScreen
│   │   ├── DashboardScreen
│   │   └── SettingsScreen
│   └── WorkoutScreen (Main Focus)
```

### WorkoutScreen Component Hierarchy

```
WorkoutScreen
├── Header
│   ├── MenuButton
│   ├── ProgressBar
│   ├── ThemeToggle
│   └── ProfileAvatar
├── TimerDisplay
├── ExerciseInfoSection
│   ├── ExerciseName
│   ├── WeightRepsDisplay
│   │   ├── WeightInput
│   │   ├── MultiplicationSymbol
│   │   └── RepsControl (with up/down arrows)
│   └── UnitsLabel
├── SetProgressIndicators
│   ├── DotIndicator (×N sets)
│   └── PastSetBanner (conditional)
├── PrimaryActionButton
└── EditExerciseFAB

Modals/Drawers:
├── SideDrawer (Navigation)
└── ExerciseSelectionDrawer
```

### Reusable Components

**Atoms (Smallest Units):**
- These should be components used from the Glue Stack UI library. All basic components MUST be imported from there

**Molecules (Combinations):**

- `Header` - Top navigation bar
- `ProgressBar` - Workout progress indicator
- `Timer` - Elapsed time display
- `WeightRepsControl` - Weight × Reps with controls
- `SetDots` - Row of set indicators
- `ExerciseCard` - Exercise list item in drawer

**Organisms (Complex Components):**

- `WorkoutExerciseView` - Main exercise display
- `ExerciseDrawer` - Exercise selection bottom sheet
- `NavigationDrawer` - Side menu
- `SetHistoryModal` - View/edit past sets

---

## Implementation Phases

### Phase 1: Project Setup & Foundation (Week 1)

**Goal:** Set up project structure, navigation, and basic UI components

**Tasks:**

1. ✅ Initialize React Native + Expo project with TypeScript
2. ✅ Configure NativeWind (Tailwind CSS)
3. ✅ Set up Bun as package manager
4. Install additional dependencies:
   ```bash
   bun add @gluestack-ui/themed @gluestack-style/react react-native-svg
   bun add @react-navigation/native @react-navigation/drawer
   bun add react-native-screens react-native-safe-area-context
   bun add @react-native-async-storage/async-storage
   bun add zustand
   bun add date-fns
   bun add react-native-gesture-handler react-native-reanimated
   ```
5. Create folder structure (using kebab-case):
   ```
   /src
     /components
       /atoms
       /molecules
       /organisms
     /screens
     /navigation
     /store
     /utils
     /types
     /hooks
     /constants
   ```
   Note: All files within these directories should use kebab-case naming (e.g., `workout-screen.tsx`, `exercise-card.tsx`)
6. Define TypeScript types (create `types/index.ts` with all interfaces)
7. Set up theme configuration (colors, spacing, typography)
8. Configure navigation (drawer + stack navigator)
9. Create basic screen placeholders (Home, Routines, Dashboard, Settings, Workout)

**Deliverables:**

- Project structure ready
- Navigation working between screens
- Type definitions complete
- Basic theme toggle functional

---

### Phase 2: State Management & Data Layer (Week 2)

**Goal:** Implement state management and local data persistence

**Tasks:**

1. Create Zustand store structure:
   - `userStore.ts` - User profile and preferences
   - `routineStore.ts` - Routines and exercises library
   - `workoutStore.ts` - Active workout session
   - `historyStore.ts` - Completed workouts
2. Implement AsyncStorage helpers:
   - Save/load user data
   - Save/load routines
   - Save/load workout history
   - Auto-save on state changes
3. Create utility functions:
   - UUID generator
   - Date formatters
   - Timer utilities
   - Volume calculators (reps × weight)
4. Implement data initialization:
   - Default exercise library (seed data)
   - Sample routines for new users
5. Create custom hooks:
   - `useTimer()` - Workout elapsed time
   - `useWorkoutSession()` - Current workout state
   - `useCurrentExercise()` - Active exercise helpers
   - `useSetProgress()` - Set completion tracking

**Deliverables:**

- State management complete
- Data persists across app restarts
- Utility functions tested
- Hooks ready for component use

---

### Phase 4: Workout Screen Implementation (Week 4)

**Goal:** Build the main workout tracking interface

**Tasks:**

1. **WorkoutScreen.tsx** - Main container:

   - Integrate Header component
   - Add Timer display with auto-start
   - Position ExerciseInfoSection
   - Add SetDots component
   - Add PrimaryActionButton
   - Position FAB (edit button)

2. **Set Completion Flow:**

   - "Complete Set X" button handler
   - Update set status to 'completed'
   - Automatically advance to next set
   - Update dot indicators
   - Handle final set completion → "Next Exercise" button
   - Navigate to next exercise on button press

3. **Set Review & Edit Flow:**

   - Make completed dots (black) clickable
   - Show blue ring on selected dot
   - Display "Viewing Set X (Past Set)" banner
   - Change button to "Save Set X"
   - Allow editing weight/reps
   - Save changes and return to current set

4. **Set Navigation Logic:**

   - Track current set index
   - Prevent skipping to future sets
   - Allow reviewing past sets
   - Maintain proper button states

5. **Timer Integration:**
   - Start timer on workout begin
   - Continue running during set reviews
   - Pause when workout is paused
   - Display in MM:SS format

**Deliverables:**

- Fully functional workout tracking
- Set completion and editing working
- Timer tracking workout duration
- Smooth UX with proper feedback

---

### Phase 5: Exercise Selection & Navigation (Week 5)

**Goal:** Implement exercise switching and routine progression

**Tasks:**

1. **ExerciseDrawer Component:**

   - Build bottom sheet UI
   - List all exercises in current routine
   - Show exercise details (name, sets, reps, weight)
   - Indicate completed exercises (green background + checkmark)
   - Highlight current exercise
   - Handle exercise selection
   - Close drawer and navigate to selected exercise

2. **Exercise Navigation:**

   - Open drawer from FAB click
   - Switch to selected exercise
   - Maintain set progress when returning to exercise
   - Handle "Next Exercise" button
   - Auto-advance to next incomplete exercise
   - Handle workout completion (all exercises done)

3. **Progress Tracking:**

   - Update header progress bar as exercises complete
   - Calculate completion percentage
   - Mark exercises as 'completed' when all sets done
   - Track exercise start/end times

4. **Edge Cases:**
   - First exercise navigation
   - Last exercise completion
   - Jumping between exercises
   - Returning to partially complete exercise

**Deliverables:**

- Exercise drawer functional
- Exercise navigation smooth
- Progress tracking accurate
- All edge cases handled

---

### Phase 6: Routine Management (Week 6)

**Goal:** Create, edit, and manage workout routines

**Tasks:**

1. **RoutinesScreen.tsx:**

   - Display list of user's routines
   - Show routine details (name, exercise count)
   - "Start Workout" button for each routine
   - "Create New Routine" button
   - Edit/delete routine options

2. **Create Routine Flow:**

   - Routine name input
   - Exercise selection from library
   - Set order of exercises (drag to reorder)
   - Configure sets/reps/weight for each exercise
   - Save routine

3. **Edit Routine Flow:**

   - Load existing routine
   - Modify name, exercises, order
   - Update sets/reps/weight
   - Add/remove exercises
   - Save changes

4. **Exercise Library Screen:**

   - Display all available exercises
   - Search/filter by muscle group, equipment
   - Add custom exercises
   - Exercise details view

5. **Start Workout from Routine:**
   - Initialize WorkoutSession
   - Copy routine exercises to session
   - Navigate to WorkoutScreen
   - Begin timer

**Deliverables:**

- Full routine CRUD functionality
- Exercise library browsable
- Can start workouts from routines
- Intuitive routine creation UX

---

### Phase 7: Home Screen & Dashboard (Week 7)

**Goal:** Create home screen and basic analytics dashboard

**Tasks:**

1. **HomeScreen.tsx:**

   - Quick stats (workouts this week, current streak)
   - "Continue Workout" button (if session in progress)
   - "Start New Workout" button
   - Recent workout history (last 5)
   - Motivational quote or tip

2. **DashboardScreen.tsx:**

   - Workout frequency chart (last 4 weeks)
   - Exercise distribution (muscle groups trained)
   - Personal records section
   - Total volume over time
   - Streak tracker

3. **Analytics Calculations:**

   - Calculate workout frequency
   - Find personal bests per exercise
   - Compute total volume (reps × weight)
   - Track consistency streaks

4. **Data Visualization:**
   - Simple bar charts for frequency
   - Pie chart for muscle group distribution
   - Line chart for volume over time
   - Use react-native-chart-kit or victory-native

**Deliverables:**

- Engaging home screen
- Useful analytics dashboard
- Visual charts implemented
- User insights displayed

---

### Phase 8: Settings & Preferences (Week 8)

**Goal:** User settings and app customization

**Tasks:**

1. **SettingsScreen.tsx:**

   - User profile section (name, email, avatar)
   - Theme preference (light/dark/system)
   - Default weight unit (lbs/kg)
   - Timer settings (auto-start, rest duration)
   - Notification preferences (future)
   - Data management (export, clear history)

2. **Profile Management:**

   - Edit name and email
   - Upload/change avatar
   - Save changes to AsyncStorage

3. **Theme System:**

   - Light mode colors
   - Dark mode colors
   - System theme detection
   - Smooth transitions
   - Persist preference

4. **Data Export:**
   - Export workout history as JSON
   - Export routines as JSON
   - Share functionality
   - Import data (future enhancement)

**Deliverables:**

- Complete settings screen
- All preferences functional
- Theme system polished
- Data export working

---

### Phase 9: Polish & UX Enhancements (Week 9)

**Goal:** Improve user experience and add finishing touches

**Tasks:**

1. **Animations & Transitions:**

   - Smooth screen transitions
   - Set completion animations
   - Drawer slide animations
   - Button press feedback
   - Progress bar animations

2. **Loading States:**

   - Skeleton screens for data loading
   - Loading spinners where appropriate
   - Optimistic UI updates

3. **Error Handling:**

   - Graceful error messages
   - Retry mechanisms
   - Offline mode support
   - Data validation

4. **Accessibility:**

   - Screen reader support
   - Proper semantic labels
   - Color contrast compliance
   - Touch target sizes
   - Keyboard navigation (if applicable)

5. **Haptic Feedback:**

   - Set completion vibration
   - Button press feedback
   - Error alerts

6. **Empty States:**
   - No routines placeholder
   - No history placeholder
   - First-time user onboarding

**Deliverables:**

- Polished animations
- Robust error handling
- Accessible interface
- Delightful micro-interactions

---

### Phase 10: Testing & Optimization (Week 10)

**Goal:** Ensure app stability and performance

**Tasks:**

1. **Testing:**

   - Unit tests for utility functions
   - Component tests with React Native Testing Library
   - Integration tests for key flows
   - End-to-end test for complete workout
   - Test AsyncStorage persistence

2. **Performance Optimization:**

   - Optimize re-renders with React.memo
   - Lazy load heavy components
   - Optimize list rendering (FlatList)
   - Reduce bundle size
   - Profile and fix performance bottlenecks

3. **Bug Fixes:**

   - Fix any reported issues
   - Edge case handling
   - Device-specific issues

4. **Documentation:**
   - Code comments
   - README with setup instructions
   - User guide (optional)

**Deliverables:**

- Test coverage >70%
- No critical bugs
- Smooth performance
- Complete documentation

---

## State Management Strategy

### Option A: Zustand (Recommended)

Lightweight, easy to use, no boilerplate

**Store Structure:**

```typescript
// src/store/workoutStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface WorkoutState {
  currentSession: WorkoutSession | null
  startWorkout: (routine: Routine) => void
  completeSet: (
    exerciseId: string,
    setId: string,
    reps: number,
    weight: number,
  ) => void
  editSet: (
    exerciseId: string,
    setId: string,
    reps: number,
    weight: number,
  ) => void
  nextExercise: () => void
  selectExercise: (exerciseId: string) => void
  selectSet: (setNumber: number) => void
  endWorkout: () => void
  pauseWorkout: () => void
  resumeWorkout: () => void
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      currentSession: null,

      startWorkout: (routine) => {
        // Initialize workout session from routine
      },

      completeSet: (exerciseId, setId, reps, weight) => {
        // Mark set as complete, advance to next
      },

      // ... other actions
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
```

### Option B: React Context

More boilerplate but no external dependency

---

## Navigation Flow

```
App Launch
  ↓
Check for active session
  ↓
Yes → Resume WorkoutScreen
No → HomeScreen
  ↓
User selects routine
  ↓
WorkoutScreen
  ↓
Complete workout
  ↓
Save to history
  ↓
Navigate back to HomeScreen
```

---

## Technical Considerations

### 1. Timer Management

- Use `setInterval` with cleanup
- Persist elapsed time to state every second
- Resume timer from saved state if app backgrounds
- Use `useEffect` for timer lifecycle

### 2. Data Persistence

- Save workout session after every set completion
- Debounce saves when editing (don't save on every keystroke)
- Use AsyncStorage for all persistent data
- Implement versioning for data schema changes

### 3. Performance

- Use `FlatList` for long exercise lists
- Implement `React.memo` for dot indicators
- Avoid unnecessary re-renders with proper state slicing
- Lazy load exercise library data

### 4. Offline-First Design

- All data stored locally by default
- No network calls required for core functionality
- Future: Sync to cloud when online

### 5. Input Handling

- Weight input: Use numeric keyboard
- Reps input: Use increment/decrement buttons (faster than keyboard)
- Validate inputs (no negative numbers, reasonable ranges)

### 6. Gesture Handling

- Swipe gestures for exercise navigation (optional enhancement)
- Long-press on set dots for quick edit menu (optional)
- Pinch to zoom on timer (optional)

### 7. Notifications (Future)

- Rest timer notifications
- Workout reminder notifications
- Streak reminder notifications

### 8. Accessibility

- VoiceOver/TalkBack support
- Dynamic font sizes
- High contrast mode support

---

## Sample Data for Development

### Default Exercise Library (Seed Data)

```typescript
const defaultExercises: Exercise[] = [
  {
    id: '1',
    name: 'Bench Press',
    category: 'chest',
    muscleGroups: ['chest', 'triceps', 'deltoids'],
    equipment: 'barbell',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Chest Flyes',
    category: 'chest',
    muscleGroups: ['chest'],
    equipment: 'dumbbell',
    isCustom: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Squat',
    category: 'legs',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    equipment: 'barbell',
    isCustom: false,
    createdAt: new Date(),
  },
  // Add 20-30 more common exercises
]
```

### Sample Routine

```typescript
const sampleRoutine: Routine = {
  id: 'routine-1',
  userId: 'user-1',
  name: 'Push Day',
  exercises: [
    {
      id: 're-1',
      routineId: 'routine-1',
      exerciseId: '1', // Bench Press
      order: 0,
      targetSets: 4,
      targetReps: 8,
      targetWeight: 135,
      weightUnit: 'lbs',
      restTime: 90,
    },
    {
      id: 're-2',
      routineId: 'routine-1',
      exerciseId: '2', // Chest Flyes
      order: 1,
      targetSets: 3,
      targetReps: 12,
      targetWeight: 30,
      weightUnit: 'lbs',
      restTime: 60,
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
}
```

---

## File Structure

```
workout-app/
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── Dot.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── Badge.tsx
│   │   ├── molecules/
│   │   │   ├── Header.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Timer.tsx
│   │   │   ├── WeightRepsControl.tsx
│   │   │   ├── SetDots.tsx
│   │   │   └── ExerciseCard.tsx
│   │   └── organisms/
│   │       ├── NavigationDrawer.tsx
│   │       ├── ExerciseDrawer.tsx
│   │       └── WorkoutExerciseView.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── WorkoutScreen.tsx
│   │   ├── RoutinesScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── DrawerNavigator.tsx
│   │   └── types.ts
│   ├── store/
│   │   ├── userStore.ts
│   │   ├── routineStore.ts
│   │   ├── workoutStore.ts
│   │   └── historyStore.ts
│   ├── hooks/
│   │   ├── useTimer.ts
│   │   ├── useWorkoutSession.ts
│   │   ├── useCurrentExercise.ts
│   │   └── useSetProgress.ts
│   ├── utils/
│   │   ├── uuid.ts
│   │   ├── dateFormatters.ts
│   │   ├── volumeCalculators.ts
│   │   └── storage.ts
│   ├── types/
│   │   └── index.ts
│   ├── constants/
│   │   ├── theme.ts
│   │   ├── exercises.ts
│   │   └── config.ts
│   └── App.tsx
├── assets/
├── app.json
├── babel.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Next Steps

1. **Review this plan** - Ensure all features are covered
2. **Adjust timeline** - Modify phases based on your availability
3. **Set up project tracking** - Use GitHub Projects, Trello, or similar
4. **Begin Phase 1** - Start with foundation setup
5. **Iterate rapidly** - Build MVPs of each phase before polishing
6. **Test early and often** - Don't wait until Phase 10 to test

---

## Future Enhancements (Post-MVP)

- **Rest Timer:** Countdown between sets
- **Workout Templates:** Pre-built routines for beginners
- **Exercise Videos:** Embedded form guidance
- **Social Features:** Share workouts with friends
- **Cloud Sync:** Backup data to server
- **Progressive Overload Tracking:** Suggest weight increases
- **Body Metrics:** Track weight, body fat percentage
- **Photo Progress:** Before/after photos
- **Apple Health / Google Fit Integration**
- **Wearable Integration:** Apple Watch, Garmin
- **Audio Cues:** Voice announcements for set completion
- **Customizable Themes:** User-defined color schemes
- **Workout Plans:** Multi-week training programs
- **Exercise Alternatives:** Suggest substitutions for equipment limitations

---

## Database Migration Plan (Future)

When ready to move from AsyncStorage to a real database:

### Option 1: SQLite (Local)

- Use `expo-sqlite` or `react-native-sqlite-storage`
- Migrate data structures to SQL tables
- Keep offline-first approach

### Option 2: Firebase (Cloud)

- Use Firestore for data storage
- Implement real-time sync
- Add authentication

### Option 3: Supabase (Cloud)

- PostgreSQL backend
- Built-in auth
- Real-time subscriptions

### Migration Strategy:

1. Export all data from AsyncStorage to JSON
2. Set up database schema matching TypeScript interfaces
3. Write migration script to transform and import data
4. Update store actions to use database instead of AsyncStorage
5. Test thoroughly with existing data
6. Deploy new version with migration logic

---

## Conclusion

This plan provides a comprehensive roadmap for building your workout tracking app. The data structures are designed to be flexible and ready for future database integration. The phased approach allows you to build incrementally, testing features as you go.

**Key Principles:**

- Mobile-first design
- Offline-first functionality
- Type-safe with TypeScript
- Modular component architecture
- Clean separation of concerns
- User-centric UX

Ready to start building! 💪
