import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import './global.css';

export default function App() {
  return (
    // @ts-expect-error - React 19 compatibility issue with React Native types
    <View className="flex-1 items-center justify-center bg-background">
      {/* @ts-expect-error - React 19 compatibility issue with React Native types */}
      <Text className="text-4xl font-bold text-foreground mb-4">
        Neural Architect
      </Text>
      {/* @ts-expect-error - React 19 compatibility issue with React Native types */}
      <Text className="text-muted-foreground">
        Gamified Pomodoro Application
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
