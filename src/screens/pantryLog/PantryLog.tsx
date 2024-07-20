import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import {useEffect, useState} from 'react';
import PantryItem from './components/PantryItem';
import PantryHeader from './components/PantryHeader';
// import DataManager from '../../shared/DataManager';
import LoginHeader from '../components/LoginHeader';
import DataManager, { Item, Pantry } from '../../shared/DataManager';

const PantryLog = () => {
    const [pantries, setPantries] = useState<any[]>([]);

    // DataManager.getInstance().createTables();
    // DataManager.getInstance().insertInto('pantry', PantryFridge);
    // DataManager.getInstance().insertInto('pantry', PantryCupboard);

    // DataManager.getInstance().resetTestTables('receipt');

    useEffect(() => {
        const getFullItemList = async () => {
            setPantries(await DataManager.getInstance().getPantryItems());
            // const pantries = await DataManager.getInstance().getPantryItems();
            // await DataManager.getInstance().printTable('item');
            // await DataManager.getInstance().printTable('receipt');
            // await DataManager.getInstance().printTable('meal_log');
        }

        getFullItemList();
    }, []);
    return (
        <View style={{flex: 1}}>
            <LoginHeader />
            {/* <View style={styles.topbar}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}/>
                    <Text style={[styles.lgwhitetxt, {flex: 1, textAlign: 'right', paddingRight: 10}]}>[+]</Text>
                </View>
            </View> */}
            <View style={styles.mainscreen}>
                <FlatList
                    style={{flexGrow: 0}}
                    keyExtractor={pantry => pantry.name}
                    data={pantries}
                    renderItem={pantry =>
                        <View>
                            <PantryHeader name={pantry.item.name} />
                            <FlatList
                                style={{flexGrow: 0}}
                                keyExtractor={item => `${item.id}`}
                                data={pantry.item.items}
                                renderItem={item => {
                                        var count = item.item.receipt_qty - item.item.meallog_qty;

                                        if (item.item.unit_type == 0) { // Serving
                                            count += item.item.serv_off;
                                        } else if (item.item.unit_type == 1) { // Weight
                                            count += item.item.weight_off;
                                        } else { // Volume
                                            count += item.item.vol_off;
                                        }

                                        return (<PantryItem name={item.item.name} count={count} critical={false} />);
                                    }
                                }/>
                        </View>} />
            </View>
        </View>
    );
}

export default PantryLog;

const styles = StyleSheet.create({
    topbar: {
        // backgroundColor: '#777777',
        backgroundColor: '#FF0000',
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
