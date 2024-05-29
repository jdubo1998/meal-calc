import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import {useState} from 'react';
import LogItem from './components/LogItem';
import LogHeader from './components/LogHeader';
import LoginHeader from '../components/LoginHeader';
import DataManager from '../../shared/DataManager';

// Web Client ID: 768950932318-pnu9uiacmbvsssanbhujfmd68r4ii5rq.apps.googleusercontent.com
// Android Client ID: 768950932318-9ddatcluj23i17ijf28re6dcee5b9npu.apps.googleusercontent.com
// port: 

var mealLogItems = [
    { id : "0", meal: "0", name: "Egg McMuffin", qty: 2, price: 2.5, cals: 300, carbs: 20, fats: 3, prot: 15, date: "2/10/24"},
    { id : "1", meal: "0", name: "Sausage McGriddle", qty: 1, price: 3.25, cals: 265, carbs: 22, fats: 4, prot: 15, date: "2/10/24"},
    { id : "2", meal: "2", name: "Big Mac", qty: 1, price: 5.25, cals: 830, carbs: 22, fats: 5, prot: 20, date: "2/10/24"}
]

const meals = [
    {id: "0", name: "Breakfast"},
    {id: "1", name: "Lunch"},
    {id: "2", name: "Dinner"},
    {id: "3", name: "Snacks"}
]

const filteredMealLog = (meal: string) => {
    if (meal == "-1") {
        return mealLogItems;
    } else {
        return mealLogItems.filter((val) => { return val.meal == meal; }); 
    }
}

const totalFilteredMealLog = (meal: string, attr: string) => {
    return filteredMealLog(meal).map( val => val.qty * val[attr]).reduce((val, tot) => val + tot, 0)
}

const MealLog = () => {
    const [mealLog, setMealLog]: any[] = useState(DataManager.getInstance().getLogItems(5, 19, 2024));

    var calLimit = 2000;
    var limitPercentage = 75;

    var calPercentage = Math.min(limitPercentage, (limitPercentage*(totalFilteredMealLog("-1", "cals")/calLimit)));
    var calLeftPercentage = limitPercentage-(limitPercentage*(totalFilteredMealLog("-1", "cals")/calLimit));
    var calOverPercentage = Math.min(100-limitPercentage, (limitPercentage*(totalFilteredMealLog("-1", "cals")/calLimit))-limitPercentage);
    var calOverPadPercentage = (100-limitPercentage)-Math.max(0, calOverPercentage);

    return (
        <View style={{flex: 1}}>
            <LoginHeader/>
            <View style={styles.topbar}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}/>
                    <Text style={[styles.lgwhitetxt, {flex: 1, textAlign:'center'}]}>{'< '}</Text>
                    <Text style={[styles.lgwhitetxt, {flex: 1, textAlign:'center'}]}>Date</Text>
                    <Text style={[styles.lgwhitetxt, {flex: 1, textAlign:'center'}]}>{' >'}</Text>
                    <View style={{flex: 1}}>
                        {/* <Button title='Login' onPress={promptAsync}/> */}
                    </View>
                </View>

                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    <View style={{flex: 4, flexDirection: 'row', paddingStart: 10, justifyContent: 'space-between'}}>
                        <Text style={styles.smdarkgreytxt}>Carbs</Text>
                        <Text style={styles.smdarkgreytxt}>Fats</Text>
                        <Text style={styles.smdarkgreytxt}>Proteins</Text>
                    </View>
                    <View style={{flex: 3, backgroundColor: '#000000'}}/>
                    <View style={{flex: 2}}>
                        <Text style={[styles.smdarkgreytxt, {alignSelf: 'center', paddingEnd: 10}]}>Meals Cost</Text>
                    </View>
                </View>

                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 4, flexDirection: 'row', paddingStart: 10, justifyContent: 'space-between'}}>
                        <Text style={styles.lgwhitetxt}>{totalFilteredMealLog("-1", "carbs")}g</Text>
                        <Text style={styles.lgwhitetxt}>{totalFilteredMealLog("-1", "fats")}g</Text>
                        <Text style={styles.lgwhitetxt}>{totalFilteredMealLog("-1", "prot")}g</Text>
                    </View>
                    <View style={{flex: 3}}/>
                    <View style={{flex: 2}}>
                        <Text style={[styles.lgwhitetxt, {alignSelf: 'center', paddingEnd: 10}]}>${totalFilteredMealLog("-1", "price")}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 9, flexDirection: 'row', padding: 5}}>
                        <View style={{backgroundColor: 'green', width: `${calPercentage}%`}}/>
                        <View style={{backgroundColor: '#999999', width: `${calLeftPercentage}%`}}/>
                        <View style={{backgroundColor: 'red', width: `${calOverPercentage}%`}}/>
                        <View style={{backgroundColor: '#666666', width: `${calOverPadPercentage}%`}}/>
                    </View>
                    <View style={{flex: 1}}/>
                    <View style={{flex: 4}}>
                        <Text style={[styles.lgwhitetxt, {alignSelf: 'center', paddingEnd: 10}]}>{totalFilteredMealLog("-1", "cals")+""}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.mainscreen}>
                <FlatList
                    style={{flexGrow: 0}}
                    keyExtractor={pantry => pantry.id}
                    data={meals}
                    renderItem={item => // Log Item
                        <View>
                            <LogHeader name={item.item.name} price={totalFilteredMealLog(item.item.id, "price")} cals={totalFilteredMealLog(item.item.id, "cals")} />
                            <FlatList
                                style={{flexGrow: 0}}
                                keyExtractor={item => item.id}
                                data={filteredMealLog(item.item.id)}
                                renderItem={item => 
                                    <LogItem name={item.item.name} qty={item.item.qty} price={item.item.price*item.item.qty} cals={item.item.cals*item.item.qty} />
                                } />
                            <View style={{padding: 10}}/>
                        </View>}/>
            </View>
        </View>
    );
}

export default MealLog;

const styles = StyleSheet.create({
    topbar: {
        backgroundColor: '#777777',
        alignItems: 'center',
        // paddingTop: 40
    },
    lgwhitetxt: {
        color: '#ffffff',
        fontSize: 25
    },
    smdarkgreytxt: {
        color: '#000000',
        fontSize: 10
    },
    
    mainscreen: {
        backgroundColor: '#222222',
        flex: 1
    }
});
