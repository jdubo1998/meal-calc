import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import ShoppingItem from './components/ShoppingItem';
import ShoppingHeader from './components/ShoppingHeader';

// count        How many actual packages are in the pantry.
// qty          How many meals are left in the pantry.
// count_qty    How many meals does each package contains when bought new.
var pantryItems = [
    {id: "0", pantry: "0", name: "Rice", count: 1, qty: 10, crit_qty: 6, count_qty: 25, date: "2/4/24"},
    {id: "1", pantry: "0", name: "Chicken Chunk Cans", count: 1, qty: 1, crit_qty: 1, count_qty: 1, date: "1/20/24"},
    {id: "2", pantry: "0", name: "Tuna Packets", count: 0, qty: 0, crit_qty: 1, count_qty: 1, date: "1/5/24"},
    {id: "3", pantry: "1", name: "Yogurt", count: 3, qty: 0, crit_qty: 2, count_qty: 1, date: "1/25/24"}
]

var mealLogItems = [
    { id : "0", meal: "0", name: "Egg McMuffin", qty: 2, price: 2.5, cals: 300, carbs: 20, fats: 3, prot: 15, date: "2/10/24"},
    { id : "1", meal: "0", name: "Sausage McGriddle", qty: 1, price: 3.25, cals: 265, carbs: 22, fats: 4, prot: 15, date: "2/10/24"},
    { id : "2", meal: "2", name: "Yogurt", qty: 1, price: 0.64, cals: 80, carbs: 0, fats: 0, prot: 12, date: "2/10/24"}
]

var lists = [
    {id: "0", name: "Critical"},
    {id: "1", name: "Other"}
]

const filteredPantry = (pantry: string) => {
    if (pantry == "-1") {
        return pantryItems;
    } else {
        return pantryItems.filter((val) => { return val.pantry == pantry; }); 
    }
}

function PantryLog() {
    return (
        <View style={{flex: 1}}>
            <View style={styles.topbar}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}/>
                    <Text style={[styles.lgwhitetxt, {flex: 1, textAlign: 'right', paddingRight: 10}]}>[+]</Text>
                </View>
            </View>
            <View style={styles.mainscreen}>
                <FlatList
                    style={{flexGrow: 0}}
                    keyExtractor={pantry => pantry.id}
                    data={lists}
                    renderItem={item => // Pantry Item
                        <View>
                            <ShoppingHeader name={item.item.name} price={0}/>
                            <FlatList
                                style={{flexGrow: 0}}
                                keyExtractor={item => item.id}
                                data={filteredPantry(item.item.id)}
                                renderItem={item => 
                                    <ShoppingItem name={item.item.name} count={item.item.count} critical={item.item.qty <= item.item.crit_qty} />
                                }/>
                        </View>} />
            </View>
        </View>
    );
}

export default PantryLog;

const styles = StyleSheet.create({
    topbar: {
        backgroundColor: '#777777',
        alignItems: 'center',
        paddingTop: 40
    },
    lgwhitetxt: {
        color: '#ffffff',
        fontSize: 30
    },
    mainscreen: {
        backgroundColor: '#222222',
        flex: 1
    }
});
