import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import './global.css';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-4xl font-bold text-foreground mb-4">
        Neural Architect
      </Text>
      <Text className="text-muted-foreground">
        Gamified Pomodoro Application
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
