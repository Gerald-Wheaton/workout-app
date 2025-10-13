import { useState } from 'react'

export interface SetData {
  weight: number
  reps: number
}

export interface Exercise {
  name: string
  setsCompleted: number
  totalSets: number
  setData: SetData[]
  completedSets: boolean[]
}

const createDefaultSetData = (totalSets: number): SetData[] =>
  Array.from({ length: totalSets }, () => ({ weight: 145, reps: 8 }))

const createDefaultCompletedSets = (totalSets: number): boolean[] =>
  Array.from({ length: totalSets }, () => false)

export function useWorkout() {
  const [currentExercise, setCurrentExerciseIndex] = useState(0)
  const [selectedSet, setSelectedSet] = useState(0)

  const [exercises, setExercises] = useState<Exercise[]>([
    {
      name: 'Chest Flyes',
      setsCompleted: 0,
      totalSets: 4,
      setData: createDefaultSetData(4),
      completedSets: createDefaultCompletedSets(4),
    },
    {
      name: 'Bench Press',
      setsCompleted: 4,
      totalSets: 4,
      setData: createDefaultSetData(4),
      completedSets: [true, true, true, true],
    },
    {
      name: 'Incline Press',
      setsCompleted: 4,
      totalSets: 4,
      setData: createDefaultSetData(4),
      completedSets: [true, true, true, true],
    },
    {
      name: 'Cable Crossover',
      setsCompleted: 2,
      totalSets: 4,
      setData: createDefaultSetData(4),
      completedSets: [true, true, false, false],
    },
    {
      name: 'Dumbbell Pullover',
      setsCompleted: 0,
      totalSets: 4,
      setData: createDefaultSetData(4),
      completedSets: createDefaultCompletedSets(4),
    },
    {
      name: 'Push-Ups',
      setsCompleted: 3,
      totalSets: 4,
      setData: createDefaultSetData(4),
      completedSets: [true, true, true, false],
    },
  ])

  const currentExerciseData = exercises[currentExercise]
  const completedSets = currentExerciseData.completedSets
  const setData = currentExerciseData.setData
  const numCompletedSets = completedSets.filter(Boolean).length
  const allSetsComplete = completedSets.every(Boolean)
  const isViewingPastSet = selectedSet < numCompletedSets

  const updateWeight = (newWeight: number) => {
    const newExercises = [...exercises]
    newExercises[currentExercise].setData[selectedSet].weight = newWeight
    setExercises(newExercises)
  }

  const updateReps = (newReps: number) => {
    const newExercises = [...exercises]
    newExercises[currentExercise].setData[selectedSet].reps = newReps
    setExercises(newExercises)
  }

  const setCurrentExercise = (index: number) => {
    setCurrentExerciseIndex(index)
    const nextExercise = exercises[index]
    const nextIncomplete = nextExercise.completedSets.findIndex((c) => !c)
    setSelectedSet(nextIncomplete !== -1 ? nextIncomplete : 0)
  }

  const handleSetAction = () => {
    if (isViewingPastSet) {
      const nextIncompleteIndex = completedSets.findIndex((completed) => !completed)
      if (nextIncompleteIndex !== -1) {
        setSelectedSet(nextIncompleteIndex)
      } else {
        setSelectedSet(completedSets.length - 1)
      }
    } else if (!allSetsComplete) {
      const nextIncompleteIndex = completedSets.findIndex((completed) => !completed)
      if (nextIncompleteIndex !== -1) {
        const newExercises = [...exercises]
        newExercises[currentExercise].completedSets[nextIncompleteIndex] = true
        newExercises[currentExercise].setsCompleted += 1
        setExercises(newExercises)

        if (nextIncompleteIndex < completedSets.length - 1) {
          setSelectedSet(nextIncompleteIndex + 1)
        }
      }
    } else {
      // Move to next incomplete exercise, wrapping around if needed
      const startIndex = (currentExercise + 1) % exercises.length
      let nextExerciseIndex = -1

      // Search from next exercise to end of list
      for (let i = startIndex; i < exercises.length; i++) {
        if (!exercises[i].completedSets.every(Boolean)) {
          nextExerciseIndex = i
          break
        }
      }

      // If not found, search from start to current exercise
      if (nextExerciseIndex === -1) {
        for (let i = 0; i < startIndex; i++) {
          if (!exercises[i].completedSets.every(Boolean)) {
            nextExerciseIndex = i
            break
          }
        }
      }

      // If still not found (all exercises complete), just go to next/first
      if (nextExerciseIndex === -1) {
        nextExerciseIndex = startIndex
      }

      setCurrentExercise(nextExerciseIndex)
    }
  }

  const handleDeleteExercise = (index: number) => {
    const newExercises = exercises.filter((_, i) => i !== index)
    setExercises(newExercises)
    if (currentExercise >= newExercises.length) {
      setCurrentExercise(Math.max(0, newExercises.length - 1))
    }
  }

  const handleUpdateExercise = (index: number, name: string, totalSets: number) => {
    const newExercises = [...exercises]
    newExercises[index] = { ...newExercises[index], name, totalSets }
    setExercises(newExercises)
  }

  return {
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
  }
}
