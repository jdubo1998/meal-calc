import { Button, FlatList, Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import ShoppingItem from './components/ShoppingItem';
import ShoppingHeader from './components/ShoppingHeader';
import DataManager, { Item } from '../../shared/DataManager';
import { useEffect, useState } from 'react';

type ShoppingtListItem = {
    name: string,
    store: string,
    cost: number,
    quantity: number
}

type PriceModalProps = {
    // item: Item
    onRequestClose: (item: any) => void
}

const PriceModal = (props: PriceModalProps) => {
    const [unit, setUnit] = useState('each');
    
    const [unitType, setUnitType] = useState<number>(1);
    const [units, setUnits] = useState<string[]>(['each', 'can', 'serving', 'scoop']);

    var shoppingItem = {
        name: '',
        store: '',
        cost: 0,
        quantity: 0
    }

    return (
        <View>
            <Text style={[styles.lgwhitetxt, {textAlign: 'center'}]}>Name</Text>

            <View style={[{margin: 10}, styles.vseperator]} />

            <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
                <Text style={unitType == 1 ? [styles.greytxt, {color: '#FFFFFF'}] : styles.greytxt} onPress={ () => {setUnitType(1); setUnits(['each', 'can', 'serving', 'scoop']);} }>Serving</Text>
                <Text style={unitType == 2 ? [styles.greytxt, {color: '#FFFFFF'}] : styles.greytxt} onPress={ () => {setUnitType(2); setUnits(['gram', 'ounce', 'pound']);} }>Weight</Text>
                <Text style={unitType == 3 ? [styles.greytxt, {color: '#FFFFFF'}] : styles.greytxt} onPress={ () => {setUnitType(3); setUnits(['cup', 'ounce', 'milliliter']);} }>Volume</Text>
            </View>
            <View style={[{marginTop: 10, marginBottom: 10, marginStart: 30, marginEnd: 30, borderColor: '#777777'}, styles.vseperator]} />
            <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
                {units.map((val) => {
                    return(<Text key={val} style={val == unit ? [styles.greytxt, {color: '#FFFFFF'}] : styles.greytxt} onPress={() => {
                        setUnit(val);
                    }}>{val}</Text>);
                })}
            </View>

            <View style={[{margin: 10}, styles.vseperator]} />

            <View style={{flexDirection: 'row'}}>
                <Text style={[styles.greytxt, {flex: 5}]}>Total Cost</Text>
                <TextInput keyboardType='number-pad' style={[styles.greytxt, {flex: 8, textAlign: 'right'}]} onChangeText={ (text) => {
                    shoppingItem.cost = Number.parseFloat(text);
                }}>0</TextInput>
                <Text style={[styles.greytxt, {flex: 4}]}>   $</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                <Text style={[styles.greytxt, {flex: 5}]}>Quantity</Text>
                <TextInput keyboardType='number-pad' style={[styles.greytxt, {flex: 8, textAlign: 'right'}]} onChangeText={ (text) => {
                    shoppingItem.quantity = Number.parseFloat(text);
                }}>0</TextInput>
                <Text style={[styles.greytxt, {flex: 4}]}>   {unit.substring(0,5)}</Text>
            </View>
            <View style={{margin: 10}}/>
            <Button title={'Add'} onPress={ () => {
                console.log(`Add   ${shoppingItem.cost}   ${shoppingItem.quantity}`);
                props.onRequestClose(shoppingItem);
            }}/>
        </View>
    );
}

const ShoppingList = () => {
    const [shoppingList, setShoppingList] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    // Execute on first mount
    useEffect(() => {
        const getLog = async () => {
            const data = await DataManager.getInstance().getShoppingList();

            setShoppingList(data);
        }

        getLog();
    }, []);

    return (
        <View style={styles.centered}>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modal}>
                    <PriceModal 
                        onRequestClose={(response: ShoppingtListItem) => {
                            setModalVisible(false);

                            // TODO: Do something with the item that is being added.
                            console.log(response);
                        }} />
                </View>
            </Modal>

            <View style={{flex: 1}}>
                <View style={styles.topbar}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}/>
                        <Text style={[styles.lgwhitetxt, {flex: 1, textAlign: 'right', paddingRight: 10}]} onPress={ () => {
                            setModalVisible(true);
                        } }>[+]</Text>
                    </View>
                </View>
                <View style={styles.mainscreen}>
                    <FlatList
                        style={{flexGrow: 0}}
                        keyExtractor={list => list.name}
                        data={shoppingList}
                        renderItem={list => // Pantry Item
                            <View>
                                <ShoppingHeader name={list.item.name} price={list.item.cost}/>
                                <FlatList
                                    style={{flexGrow: 0}}
                                    keyExtractor={item => item.id}
                                    data={list.item.items}
                                    renderItem={item => 
                                        {
                                            const stock = item.item.receipt_total_qty-item.item.meallog_total_qty;

                                            console.log(item.item);

                                            return (
                                                <ShoppingItem
                                                    name={item.item.name}
                                                    cost={item.item.receipt_price}
                                                    store={item.item.store}
                                                    count={stock}
                                                    critical={stock <= item.item.crit} />
                                            );
                                        }
                                    }/>
                            </View>} />
                </View>
            </View>
        </View>
    );
}

export default ShoppingList;

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    modal: {
        // TODO: Make this prettier.
        marginTop: '50%',
        margin: 30,
        padding: 10,
        // alignItems: 'center',
        backgroundColor: '#000000'
    },

    vseperator: {
        borderBottomColor: '#FFFFFF',
        borderBottomWidth: (StyleSheet.hairlineWidth*4)
    },

    topbar: {
        backgroundColor: '#777777',
        alignItems: 'center',
        paddingTop: 40
    },
    lgwhitetxt: {
        color: '#ffffff',
        fontSize: 30
    },
    greytxt: {
        color: '#B0B0B0',
        fontSize: 20
    },
    mainscreen: {
        backgroundColor: '#222222',
        flex: 1
    }
});
