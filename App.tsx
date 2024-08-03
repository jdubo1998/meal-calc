import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import PantryLog from './src/screens/pantryLog/PantryLog';
import MealLog from './src/screens/mealLog/MealLog';
import ItemList from './src/screens/itemList/ItemList';
import ShoppingList from './src/screens/shoppingList/ShoppingList';
import ItemNutrition from './src/screens/itemList/subscreens/ItemNutrition';
import { Item, LogItem, NewLogItemDate } from './src/shared/DataManager';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ItemServing from './src/screens/itemList/subscreens/ItemServings';

type RootStackParamList = {
    PantryLog: undefined,
    MealLog: undefined | {
        newLogItem: LogItem
    },
    ItemList: undefined | {
        year: number,
        month: number,
        day: number,
        meal: number
    },
    ShoppingList: undefined,
    ItemNutrition: {
        item_id?: number,
        item?: Item,
        mealLogProps?: any
    },
    ItemServing: {
        logItem: LogItem,
        newLogItemDate?: NewLogItemDate
    }
};

const STACK1 = createNativeStackNavigator<RootStackParamList>();
const TABSTACK1 = createBottomTabNavigator();

export type PantryLogRouteProp = NativeStackScreenProps<RootStackParamList, 'PantryLog'>;
export type MealLogRouteProp = NativeStackScreenProps<RootStackParamList, 'MealLog'>;
export type ItemListRouteProp = NativeStackScreenProps<RootStackParamList, 'ItemList'>;
export type ShoppingListRouteProp = NativeStackScreenProps<RootStackParamList, 'ShoppingList'>;
export type ItemNutritionRouteProp = NativeStackScreenProps<RootStackParamList, 'ItemNutrition'>;
export type ItemServingRouteProp = NativeStackScreenProps<RootStackParamList, 'ItemServing'>;

const STACK1Screen = () => {
    return (
        <STACK1.Navigator initialRouteName='MealLog'>
            <STACK1.Screen
                name='MealLog'
                component={MealLog}
                options={{headerShown: false}} />
            <STACK1.Screen
                name='ItemList'
                component={ItemList}
                options={{headerShown: false}} />
            <STACK1.Screen
                name='ItemNutrition'
                component={ItemNutrition}
                initialParams={{}}
                options={{headerShown: false}} />
            <STACK1.Screen
                name='ItemServing'
                component={ItemServing}
                initialParams={{}}
                options={{headerShown: false}} />
        </STACK1.Navigator>
    );
}

const App = () => {
    return (
        <NavigationContainer>
            <TABSTACK1.Navigator>
                <TABSTACK1.Screen
                    name='STACK1'
                    component={STACK1Screen}
                    options={{headerShown: false}} />
                <TABSTACK1.Screen
                    name='PantryLog'
                    component={PantryLog}
                    options={{headerShown: false}} />
                <TABSTACK1.Screen
                    name='ShoppingList'
                    component={ShoppingList}
                    options={{headerShown: false}} />
            </TABSTACK1.Navigator>
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

export default App;
