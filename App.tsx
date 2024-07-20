import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import PantryLog from './src/screens/pantryLog/PantryLog';
import MealLog from './src/screens/mealLog/MealLog';
import ItemList from './src/screens/itemList/ItemList';
import ShoppingList from './src/screens/shoppingList/ShoppingList';
import ItemNutrition from './src/screens/itemList/subscreens/ItemNutrition';
import { Item } from './src/shared/DataManager';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
    PantryLog: undefined,
    MealLog: undefined,
    ItemList: undefined,
    ShoppingList: undefined,
    ItemNutrition: {item: Item}
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export type PantryLogRouteProp = NativeStackScreenProps<RootStackParamList, 'PantryLog'>;
export type MealLogRouteProp = NativeStackScreenProps<RootStackParamList, 'MealLog'>;
export type ItemListRouteProp = NativeStackScreenProps<RootStackParamList, 'ItemList'>;
export type ShoppingListRouteProp = NativeStackScreenProps<RootStackParamList, 'ShoppingList'>;
export type ItemNutritionRouteProp = NativeStackScreenProps<RootStackParamList, 'ItemNutrition'>;

export default function App() {
    return (
        <NavigationContainer>
            <RootStack.Navigator initialRouteName='ItemList'>
                <RootStack.Screen
                    name='PantryLog'
                    component={PantryLog}
                    options={{headerShown: false}} />
                <RootStack.Screen
                    name='MealLog'
                    component={MealLog}
                    options={{headerShown: false}} />
                <RootStack.Screen
                    name='ItemList'
                    component={ItemList}
                    options={{headerShown: false}} />
                <RootStack.Screen
                    name='ShoppingList'
                    component={ShoppingList}
                    options={{headerShown: false}} />
                <RootStack.Screen
                    name='ItemNutrition'
                    component={ItemNutrition}
                    initialParams={{}}
                    options={{headerShown: false}} />
            </RootStack.Navigator>
        </NavigationContainer>
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
