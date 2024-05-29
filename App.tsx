import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import PantryLog from './src/screens/pantryLog/PantryLog';
import MealLog from './src/screens/mealLog/MealLog';

export default function App() {
  return (
    // <PantryLog/>
    <MealLog/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
