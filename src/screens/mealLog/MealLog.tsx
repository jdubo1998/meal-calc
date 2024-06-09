import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import {useEffect, useState} from 'react';
import LogItem from './components/LogItem';
import LogHeader from './components/LogHeader';
import { isLoggedIn } from '../components/LoginHeader';
import LoginHeader from '../components/LoginHeader';
import DataManager from '../../shared/DataManager';

// Web Client ID: 768950932318-pnu9uiacmbvsssanbhujfmd68r4ii5rq.apps.googleusercontent.com
// Android Client ID: 768950932318-9ddatcluj23i17ijf28re6dcee5b9npu.apps.googleusercontent.com
// port: 

const meals = [
    {id: "0", name: "Breakfast"},
    {id: "1", name: "Lunch"},
    {id: "2", name: "Dinner"},
    {id: "3", name: "Snacks"}
]

const filterItemsByMeal = (mealLog: any[], meal: string): any[] => {
    if (meal == "-1") {
        return mealLog;
    } else {
        return mealLog.filter((item) => { return `${item.meal}` == meal; }); 
    }
}

const totalFilteredItemsByMeal = (mealLog: any[], meal: string, attr: string): number => {
    return filterItemsByMeal(mealLog, meal).map( val => val.qty * val[attr]).reduce((val, tot) => val + tot, 0);
}

const MealLog = () => {
    const [mealLog, setMealLog] = useState<any[]>([]);
    const [curDate, setCurDate] = useState<number>(Date.now());

    const year = new Date(curDate).getFullYear();
    const month = new Date(curDate).getMonth()+1;
    const day = new Date(curDate).getDate();

    // Execute on first mount
    useEffect(() => {
        const getLog = async () => {
            const data = await DataManager.getInstance().getLogItemsDate(year, month, day);

            setMealLog(data);
        }

        // If the user is logged in to the header then grab the log for the given date
        if (isLoggedIn()) {
            getLog();
        }
    }, [curDate]);

    const calLimit = 1700;
    const limitPercentage = 75;

    const totalCals = totalFilteredItemsByMeal(mealLog, '-1', 'cals');

    const calPercentage = Math.min(limitPercentage, (limitPercentage*(totalCals/calLimit)));
    const calLeftPercentage = limitPercentage-(limitPercentage*(totalCals/calLimit));
    const calOverPercentage = Math.min(100-limitPercentage, (limitPercentage*(totalCals/calLimit))-limitPercentage);
    const calOverPadPercentage = (100-limitPercentage)-Math.max(0, calOverPercentage);

    return (
        <View style={{flex: 1}}>
            <LoginHeader/>
            <View style={styles.topbar}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}/>
                    <Text style={[styles.lgwhitetxt, {flex: 1, textAlign:'center'}]} onPress={() => { setCurDate(curDate - 86400000); }}>{'< '}</Text>
                    <Text style={[styles.lgwhitetxt, {flex: 2, textAlign:'center'}]}>{`${month} - ${day} - ${year}`}</Text>
                    <Text style={[styles.lgwhitetxt, {flex: 1, textAlign:'center'}]} onPress={() => { setCurDate(curDate + 86400000); }}>{' >'}</Text>
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
                        <Text style={styles.lgwhitetxt}>{totalFilteredItemsByMeal(mealLog, '-1', 'carbs')}g</Text>
                        <Text style={styles.lgwhitetxt}>{totalFilteredItemsByMeal(mealLog, '-1', 'fats')}g</Text>
                        <Text style={styles.lgwhitetxt}>{totalFilteredItemsByMeal(mealLog, '-1', 'prot')}g</Text>
                    </View>
                    <View style={{flex: 3}}/>
                    <View style={{flex: 2}}>
                        <Text style={[styles.lgwhitetxt, {alignSelf: 'center', paddingEnd: 10}]}>${totalFilteredItemsByMeal(mealLog, '-1', 'price')}</Text>
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
                        <Text style={[styles.lgwhitetxt, {alignSelf: 'center', paddingEnd: 10}]}>{totalCals+"" /* TODO: Add calories suffix */}</Text>
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
                            <LogHeader name={item.item.name} price={totalFilteredItemsByMeal(mealLog, item.item.id, 'price')} cals={totalFilteredItemsByMeal(mealLog, item.item.id, 'cals')} />
                            <FlatList
                                style={{flexGrow: 0}}
                                keyExtractor={item => item.id}
                                data={filterItemsByMeal(mealLog, item.item.id)}
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
