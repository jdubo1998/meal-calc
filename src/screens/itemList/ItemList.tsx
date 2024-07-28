import { Button, FlatList, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View, DeviceEventEmitter } from 'react-native';
import { useEffect, useState } from 'react';
import DataManager, { Item, LogItem } from '../../shared/DataManager';
import ItemItem from './components/ItemItem';
import ItemNutrition from './subscreens/ItemNutrition';
import { Milk, ProteinPowder } from '../../../test/Testitems';
import { ItemListRouteProp } from '../../../App';

// count        How many actual packages are in the pantry.
// qty          How many meals are left in the pantry.
// count_qty    How many meals does each package contains when bought new.

var fullItemList: Item[];
var lastFilteredTextLength = 0;

const filterItemList = (filterText: string, itemList: Item[]): Item[] => {
    return itemList.filter((item) => item.name.toLowerCase().includes(filterText) );
}

const ItemList = ( {route, navigation}: ItemListRouteProp) => {
    const [itemList, setItemList] = useState<Item[]>([]);

    useEffect(() => {
        const getFullItemList = async () => {
            fullItemList = await DataManager.getInstance().getAllItems();
        }

        getFullItemList();
        setItemList(fullItemList);
    }, []);

    return (
        <View style={{flex: 1}}>
            {/* <ItemNutrition item={ProteinPowder} /> */}
            <View style={styles.topbar}>
                <View style={{flexDirection: 'row'}}>
                    <TextInput style={[{flex: 7, borderBottomColor: '#ffffff', borderBottomWidth: 1}, styles.whitetext]} onChangeText={(filterText) => {
                        /* If the filter text is being added to, then filter only on the already filtered list to save computations. */
                        if (lastFilteredTextLength < filterText.length) {
                            setItemList(filterItemList(filterText, itemList));

                        /* If the filter text is being deleted, then filter on the full list. */
                        } else {
                            setItemList(filterItemList(filterText, fullItemList));
                        }

                        lastFilteredTextLength = filterText.length;
                    }} />

                    <Text style={[styles.lgwhitetxt, {flex: 1, textAlign: 'right', paddingRight: 10}]}>[+]</Text>
                </View>
            </View>
            <View style={styles.mainscreen}>
                <FlatList
                    style={{flexGrow: 0}}
                    keyExtractor={item => `${item.id}`}
                    data={itemList}
                    renderItem={item => // Pantry Item
                        <TouchableOpacity onPress={() => {
                            // TODO: Add modal for adding information.
                            navigation.navigate('MealLog', {newLogItem: {
                                id: null,
                                source: 0,
                                item_id: item.item.id!,
                                qty: 1,
                                unit: 'cup',
                                meal: 2,
                                date_ns: 1414
                            }});
                        }}>
                            <ItemItem name={item.item.name}/>
                        </TouchableOpacity>
                    } 
                />
            </View>
        </View>
    );
}

export default ItemList;

const styles = StyleSheet.create({
    topbar: {
        backgroundColor: '#777777',
        alignItems: 'center',
        padding: 10
    },
    whitetext: {
        color: '#ffffff',
        fontSize: 20
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
