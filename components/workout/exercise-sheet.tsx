import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Sheet } from 'tamagui'
import { Edit } from 'lucide-react-native'
import { Exercise } from '@/hooks/use-workout'
import { ExerciseCard } from './exercise-card'

interface ExerciseSheetProps {
  open: boolean
  exercises: Exercise[]
  currentExercise: number
  onOpenChange: (open: boolean) => void
  onExerciseSelect: (index: number) => void
  onDeleteExercise: (index: number) => void
  onUpdateExercise: (index: number, name: string, totalSets: number) => void
}

export function ExerciseSheet({
  open,
  exercises,
  currentExercise,
  onOpenChange,
  onExerciseSelect,
  onDeleteExercise,
  onUpdateExercise,
}: ExerciseSheetProps) {
  return (
    <>
      <TouchableOpacity
        onPress={() => onOpenChange(true)}
        className="absolute bottom-32 right-6 h-14 w-14 rounded-full bg-black items-center justify-center shadow-lg z-50"
        activeOpacity={0.9}
      >
        <Edit size={24} color="#fff" />
      </TouchableOpacity>

      <Sheet
        modal
        open={open}
        onOpenChange={onOpenChange}
        snapPointsMode="percent"
        snapPoints={[40]}
        dismissOnSnapToBottom
        animation="medium"
      >
        <Sheet.Overlay opacity={0.5} />
        <Sheet.Handle />
        <Sheet.Frame>
          <View className="flex flex-col gap-4 p-4">
            <Text className="text-xl font-bold">Select Exercise</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="gap-2">
                {exercises.map((exercise, index) => (
                  <ExerciseCard
                    key={index}
                    exercise={exercise}
                    isCurrentExercise={index === currentExercise}
                    onPress={() => {
                      onExerciseSelect(index)
                      onOpenChange(false)
                    }}
                    onDelete={() => onDeleteExercise(index)}
                    onUpdate={(name, totalSets) =>
                      onUpdateExercise(index, name, totalSets)
                    }
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
