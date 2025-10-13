import { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { Dialog } from 'tamagui'

interface WeightDialogProps {
  open: boolean
  currentWeight: number
  onOpenChange: (open: boolean) => void
  onWeightSelect: (weight: number) => void
}

export function WeightDialog({
  open,
  currentWeight,
  onOpenChange,
  onWeightSelect,
}: WeightDialogProps) {
  const [customWeight, setCustomWeight] = useState('')

  const handleCustomWeightSubmit = () => {
    const weight = Number.parseInt(customWeight)
    if (!isNaN(weight) && weight > 0) {
      onWeightSelect(weight)
      setCustomWeight('')
    }
  }

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          className="w-96 max-w-[90%]"
        >
          <Dialog.Title className="text-lg font-semibold">
            Select Weight
          </Dialog.Title>

          <View className="gap-2 py-4">
            {currentWeight > 5 && (
              <TouchableOpacity
                onPress={() => onWeightSelect(currentWeight - 5)}
                className="h-14 bg-transparent border border-gray-300 rounded-lg justify-start px-4 items-center flex-row"
                activeOpacity={0.7}
              >
                <Text className="text-lg">{currentWeight - 5} lbs</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => onWeightSelect(currentWeight)}
              className="h-14 bg-blue-500 rounded-lg justify-start px-4 items-center flex-row"
              activeOpacity={0.7}
            >
              <Text className="text-lg text-white">{currentWeight} lbs (Current)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onWeightSelect(currentWeight + 5)}
              className="h-14 bg-transparent border border-gray-300 rounded-lg justify-start px-4 items-center flex-row"
              activeOpacity={0.7}
            >
              <Text className="text-lg">{currentWeight + 5} lbs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onWeightSelect(currentWeight + 10)}
              className="h-14 bg-transparent border border-gray-300 rounded-lg justify-start px-4 items-center flex-row"
              activeOpacity={0.7}
            >
              <Text className="text-lg">{currentWeight + 10} lbs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onWeightSelect(currentWeight + 15)}
              className="h-14 bg-transparent border border-gray-300 rounded-lg justify-start px-4 items-center flex-row"
              activeOpacity={0.7}
            >
              <Text className="text-lg">{currentWeight + 15} lbs</Text>
            </TouchableOpacity>

            <View className="flex-row gap-2 mt-4">
              <TextInput
                placeholder="Custom weight"
                keyboardType="numeric"
                value={customWeight}
                onChangeText={setCustomWeight}
                onSubmitEditing={handleCustomWeightSubmit}
                className="flex-1 h-14 border border-gray-300 rounded-lg px-4 text-lg"
              />
              <TouchableOpacity
                onPress={handleCustomWeightSubmit}
                className="h-14 bg-blue-500 rounded-lg px-6 items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-lg text-white font-medium">Set</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
