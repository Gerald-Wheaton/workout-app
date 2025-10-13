import { View, Text, TouchableOpacity } from 'react-native'
import { ChevronUp, ChevronDown } from 'lucide-react-native'
import { SetData } from '@/hooks/use-workout'

interface WeightRepsDisplayProps {
  exerciseName: string
  setData: SetData
  onWeightPress: () => void
  onRepsIncrease: () => void
  onRepsDecrease: () => void
}

export function WeightRepsDisplay({
  exerciseName,
  setData,
  onWeightPress,
  onRepsIncrease,
  onRepsDecrease,
}: WeightRepsDisplayProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4">
      <Text className="text-lg font-normal">
        {exerciseName}
      </Text>

      <View className="flex-row items-center justify-center gap-4">
        <TouchableOpacity onPress={onWeightPress} activeOpacity={0.6}>
          <Text className="text-[80px] font-bold leading-[80px]">
            {setData.weight}
          </Text>
        </TouchableOpacity>

        <Text className="text-3xl text-gray-500">
          ×
        </Text>

        <View className="items-center gap-1">
          <TouchableOpacity onPress={onRepsIncrease} activeOpacity={0.7}>
            <ChevronUp size={20} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-5xl font-bold">
            {setData.reps}
          </Text>
          <TouchableOpacity onPress={onRepsDecrease} activeOpacity={0.7}>
            <ChevronDown size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-sm text-gray-500">
        lbs × reps
      </Text>
    </View>
  )
}
