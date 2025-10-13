import { useState } from 'react'
import { View, Text } from 'react-native'
import { Progress } from 'tamagui'
import { useWorkout } from '@/hooks/use-workout'
import { WorkoutHeader } from './workout/workout-header'
import { WeightRepsDisplay } from './workout/weight-reps-display'
import { SetIndicator } from './workout/set-indicator'
import { ExerciseSheet } from './workout/exercise-sheet'
import { WeightDialog } from './workout/weight-dialog'
import { CompleteSetButton } from './workout/complete-set-button'

export function WorkoutScreen() {
  const [weightDialogOpen, setWeightDialogOpen] = useState(false)
  const [exerciseSheetOpen, setExerciseSheetOpen] = useState(false)

  const {
    completedSets,
    currentExercise,
    selectedSet,
    setData,
    exercises,
    numCompletedSets,
    allSetsComplete,
    isViewingPastSet,
    setSelectedSet,
    setCurrentExercise,
    updateWeight,
    updateReps,
    handleSetAction,
    handleDeleteExercise,
    handleUpdateExercise,
  } = useWorkout()

  const handleWeightSelect = (weight: number) => {
    updateWeight(weight)
    setWeightDialogOpen(false)
  }

  return (
    <View className="flex-1 bg-black">
      <WorkoutHeader />

      <View className="px-4">
        <Progress value={60} className="flex-1 h-1">
          <Progress.Indicator animation="medium" />
        </Progress>
      </View>

      <View className="relative mt-8">
        <Text className="text-center text-3xl font-light text-gray-500">
          2:15
        </Text>

        {isViewingPastSet && (
          <Text className="text-center text-sm font-medium text-blue-600 mt-2">
            Viewing Set {selectedSet + 1} (Past Set)
          </Text>
        )}
      </View>

      <WeightRepsDisplay
        exerciseName={exercises[currentExercise].name}
        setData={setData[selectedSet]}
        onWeightPress={() => setWeightDialogOpen(true)}
        onRepsIncrease={() => updateReps(setData[selectedSet].reps + 1)}
        onRepsDecrease={() =>
          updateReps(Math.max(1, setData[selectedSet].reps - 1))
        }
      />

      <SetIndicator
        completedSets={completedSets}
        selectedSet={selectedSet}
        numCompletedSets={numCompletedSets}
        onSetSelect={setSelectedSet}
      />

      <ExerciseSheet
        open={exerciseSheetOpen}
        exercises={exercises}
        currentExercise={currentExercise}
        onOpenChange={setExerciseSheetOpen}
        onExerciseSelect={setCurrentExercise}
        onDeleteExercise={handleDeleteExercise}
        onUpdateExercise={handleUpdateExercise}
      />

      <WeightDialog
        open={weightDialogOpen}
        currentWeight={setData[selectedSet].weight}
        onOpenChange={setWeightDialogOpen}
        onWeightSelect={handleWeightSelect}
      />

      <CompleteSetButton
        allSetsComplete={allSetsComplete}
        isViewingPastSet={isViewingPastSet}
        selectedSet={selectedSet}
        onPress={handleSetAction}
      />
    </View>
  )
}
