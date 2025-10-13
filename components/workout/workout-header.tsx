import { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Sheet } from 'tamagui'
import { Menu, Home, Dumbbell, Settings, BarChart3, User } from 'lucide-react-native'

export function WorkoutHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <SafeAreaView edges={['top']} className="bg-white">
        <View className="flex-row justify-between items-center px-4 pb-4">
          <TouchableOpacity
            onPress={() => setMenuOpen(true)}
            className="h-12 w-12 items-center justify-center"
            activeOpacity={0.7}
          >
            <Menu size={28} color="#000" />
          </TouchableOpacity>

          <View className="flex-row gap-2 items-center">
            <View className="h-10 w-10 rounded-full bg-gray-200 items-center justify-center">
              <User size={20} color="#6b7280" />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <Sheet
        modal
        open={menuOpen}
        onOpenChange={setMenuOpen}
        snapPoints={[85]}
        dismissOnSnapToBottom
        animation="medium"
      >
        <Sheet.Overlay opacity={0.5} />
        <Sheet.Frame className="px-4 pt-8">
          <View className="flex flex-col gap-4">
            <TouchableOpacity
              onPress={() => setMenuOpen(false)}
              className="flex-row items-center gap-3"
              activeOpacity={0.7}
            >
              <Home size={20} color="#000" />
              <Text className="text-lg">Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMenuOpen(false)}
              className="flex-row items-center gap-3"
              activeOpacity={0.7}
            >
              <Dumbbell size={20} color="#000" />
              <Text className="text-lg">Routines</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMenuOpen(false)}
              className="flex-row items-center gap-3"
              activeOpacity={0.7}
            >
              <Settings size={20} color="#000" />
              <Text className="text-lg">Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMenuOpen(false)}
              className="flex-row items-center gap-3"
              activeOpacity={0.7}
            >
              <BarChart3 size={20} color="#000" />
              <Text className="text-lg">Dashboard</Text>
            </TouchableOpacity>
          </View>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
