import { View, Text, TouchableOpacity } from 'react-native'

interface CompleteSetButtonProps {
  allSetsComplete: boolean
  isViewingPastSet: boolean
  selectedSet: number
  onPress: () => void
}

export function CompleteSetButton({
  allSetsComplete,
  isViewingPastSet,
  selectedSet,
  onPress,
}: CompleteSetButtonProps) {
  const buttonText = allSetsComplete
    ? 'Next Exercise'
    : isViewingPastSet
    ? `Save Set ${selectedSet + 1}`
    : `Complete Set ${selectedSet + 1}`

  return (
    <View className="p-6">
      <TouchableOpacity
        onPress={onPress}
        className={`py-8 rounded-2xl ${
          allSetsComplete
            ? 'bg-green-100 active:bg-green-200'
            : 'bg-gray-200 active:bg-gray-300'
        }`}
        activeOpacity={0.8}
      >
        <View className="items-center gap-1">
          <Text
            className={`text-xl font-semibold ${
              allSetsComplete ? 'text-green-900' : 'text-black'
            }`}
          >
            {buttonText}
          </Text>
          <Text
            className={`text-sm ${
              allSetsComplete ? 'text-green-700' : 'text-gray-500'
            }`}
          >
            Tap anywhere here
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
