import { useState, useRef } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import type Reanimated from 'react-native-reanimated'
import { Edit2, Trash2 } from 'lucide-react-native'
import { Exercise } from '@/hooks/use-workout'
import { Button } from '@tamagui/button'

interface ExerciseCardProps {
  exercise: Exercise
  isCurrentExercise: boolean
  onPress: () => void
  onDelete: () => void
  onUpdate: (name: string, totalSets: number) => void
}

export function ExerciseCard({
  exercise,
  isCurrentExercise,
  onPress,
  onDelete,
  onUpdate,
}: ExerciseCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(exercise.name)
  const [editSets, setEditSets] = useState(exercise.totalSets.toString())
  const swipeableRef = useRef<any>(null)

  const handleSave = () => {
    const sets = parseInt(editSets)
    if (editName.trim() && !isNaN(sets) && sets > 0) {
      onUpdate(editName.trim(), sets)
      setIsEditing(false)
      swipeableRef.current?.close()
    }
  }

  const handleCancel = () => {
    setEditName(exercise.name)
    setEditSets(exercise.totalSets.toString())
    setIsEditing(false)
  }

  const renderRightActions = () => (
    <View className="flex-row gap-2">
      <Button
        onPress={() => {
          setIsEditing(true)
          swipeableRef.current?.close()
        }}
        theme="blue"
        // className="border border-blue-500 bg-blue-200 justify-center items-center rounded-lg"
      >
        <Edit2 size={20} color="#fff" />
      </Button>
      <Button
        onPress={onDelete}
        theme="red"
        // className="border border-red-500 bg-red-200 justify-center items-center rounded-lg"
      >
        <Trash2 size={20} color="#fff" />
      </Button>
    </View>
  )

  if (isEditing) {
    return (
      <View
        className={`p-4 rounded-lg border ${
          isCurrentExercise
            ? 'bg-blue-50 border-blue-400'
            : 'bg-white border-gray-200'
        }`}
      >
        <Text className="text-sm font-medium text-gray-700 mb-2">
          Exercise Name
        </Text>
        <TextInput
          value={editName}
          onChangeText={setEditName}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-3 text-base"
          placeholder="Exercise name"
        />

        <Text className="text-sm font-medium text-gray-700 mb-2">
          Total Sets
        </Text>
        <TextInput
          value={editSets}
          onChangeText={setEditSets}
          keyboardType="numeric"
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-base"
          placeholder="Number of sets"
        />

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={handleCancel}
            className="flex-1 bg-gray-200 rounded-lg py-2 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-base font-medium">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            className="flex-1 bg-blue-500 rounded-lg py-2 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-base font-medium text-white">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View
          className={`p-4 mr-4 rounded-lg border ${
            isCurrentExercise
              ? 'bg-blue-50 border-blue-400'
              : 'bg-white border-gray-200'
          }`}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-base font-medium">{exercise.name}</Text>
              <Text className="text-sm text-gray-500 mt-1">
                {exercise.setsCompleted} / {exercise.totalSets} sets completed
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  )
}
