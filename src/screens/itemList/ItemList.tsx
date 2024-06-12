import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import DataManager, { Item } from '../../shared/DataManager';
import ItemItem from './components/ItemItem';
import ItemNutrition from './subscreens/ItemNutrition';
import { Milk, ProteinPowder } from '../../../test/Testitems';

// count        How many actual packages are in the pantry.
// qty          How many meals are left in the pantry.
// count_qty    How many meals does each package contains when bought new.

var fullItemList: Item[];

function ItemList() {
    const [itemList, setItemList] = useState<Item[]>([]);

    useEffect(() => {
        const getFullItemList = async () => {
            fullItemList = await DataManager.getInstance().getAllItems();
            setItemList(fullItemList);
        }

        getFullItemList();
    }, []);

    return (
        <View style={{flex: 1}}>
            {/* <ItemNutrition item={ProteinPowder} /> */}
            <View style={styles.topbar}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}/>
                    <Text style={[styles.lgwhitetxt, {flex: 1, textAlign: 'right', paddingRight: 10}]}>[+]</Text>
                </View>
            </View>
            <View style={styles.mainscreen}>
                <FlatList
                    style={{flexGrow: 0}}
                    keyExtractor={item => `${item.id}`}
                    data={itemList}
                    renderItem={item => // Pantry Item
                        <View>
                            <ItemItem name={item.item.name}/>
                        </View>
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
