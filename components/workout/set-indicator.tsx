import { View, TouchableOpacity } from 'react-native'

interface SetIndicatorProps {
  completedSets: boolean[]
  selectedSet: number
  numCompletedSets: number
  onSetSelect: (index: number) => void
}

export function SetIndicator({
  completedSets,
  selectedSet,
  numCompletedSets,
  onSetSelect,
}: SetIndicatorProps) {
  return (
    <View className="justify-center items-center py-12">
      <View className="flex-row gap-4">
        {completedSets.map((completed, index) => {
          const isClickable = index <= numCompletedSets
          const isSelected = selectedSet === index && isClickable

          return (
            <TouchableOpacity
              key={index}
              onPress={() => isClickable && onSetSelect(index)}
              disabled={!isClickable}
              className="w-11 h-11 items-center justify-center"
              activeOpacity={0.7}
            >
              <View
                className={`h-3 w-3 rounded-full ${
                  completed ? 'bg-black' : 'bg-gray-300'
                } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              />
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
