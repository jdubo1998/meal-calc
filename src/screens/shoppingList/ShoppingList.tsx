import { Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ShoppingItem from './components/ShoppingItem';
import ShoppingHeader from './components/ShoppingHeader';
import DataManager, { Item, Receipt } from '../../shared/DataManager';
import { Children, useEffect, useState } from 'react';

type PriceModalProps = {
    onRequestClose: () => void,
    item: Item | null,
    receiptItem?: any
}

var receipts: Receipt[] = [];

const PriceModal = (props: PriceModalProps) => {
    const [unit, setUnit] = useState(props.item ? DataManager.getInstance().getDefUnit(props.item) : 'each');
    
    const [unitType, setUnitType] = useState<number>(props.item ? props.item.unit_type : 0);
    const [units, setUnits] = useState<string[]>(['each', 'can', 'serving', 'scoop']);

    /* ---   Receipt Item Properties   --- */
    const [store, setStore] = useState<string>(props.receiptItem ? props.receiptItem.store : '');
    const [qty, setQty] = useState<number>(props.receiptItem ? props.receiptItem.receipt_qty : 0);
    const [price, setPrice] = useState<number>(props.receiptItem ? props.receiptItem.receipt_price : 0);
    const [taxMult, setTaxMult] = useState<number>(props.receiptItem && props.receiptItem.tax_mult ? props.receiptItem.tax_mult : 1);

    // DataManager.getInstance().resetTestTable('receipt');

    return (
        <View>
            <Text style={[styles.lgwhitetxt, {textAlign: 'center'}]}>{props.item?.name}</Text>

            <View style={[{margin: 10}, styles.vseperator]} />

            <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
                <Text style={unitType == 0 ? [styles.greytxt, {color: '#FFFFFF'}] : styles.greytxt} onPress={ () => {setUnitType(1); setUnits(['each', 'can', 'serving', 'scoop']);} }>Serving</Text>
                <Text style={unitType == 1 ? [styles.greytxt, {color: '#FFFFFF'}] : styles.greytxt} onPress={ () => {setUnitType(2); setUnits(['gram', 'ounce', 'pound']);} }>Weight</Text>
                <Text style={unitType == 2 ? [styles.greytxt, {color: '#FFFFFF'}] : styles.greytxt} onPress={ () => {setUnitType(3); setUnits(['cup', 'ounce', 'milliliter']);} }>Volume</Text>
            </View>
            <View style={[{marginTop: 10, marginBottom: 10, marginStart: 30, marginEnd: 30, borderColor: '#777777'}, styles.vseperator]} />
            <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
                {units.map((val) => {
                    return(
                        <Text key={val} style={val == unit ? [styles.greytxt, {color: '#FFFFFF'}] : styles.greytxt} onPress={() => {
                            setUnit(val);
                        }}>{val}</Text>
                    );
                })}
            </View>

            <View style={[{margin: 10}, styles.vseperator]} />

            <View style={{flexDirection: 'row'}}>
                {/* ---   Price   --- */}
                <Text style={[styles.greytxt, {flex: 5}]}>Price</Text>
                <TextInput keyboardType='number-pad' style={[styles.whitetxt, {flex: 8, textAlign: 'right'}]} onChangeText={ (text) => {
                    setPrice(Number.parseFloat(text));
                }}>{price}</TextInput>
                <Text style={[styles.greytxt, {flex: 2}]}>   $</Text>

                {/* ---   Tax Multiplier   --- */}
                <Text style={[styles.greytxt, {flex: 1, borderBottomWidth: 1, borderBottomColor: '#B0B0B0', textAlign: 'center'}]} onPress={() => {
                    setTaxMult(taxMult == 1 ? 1.085 : 1); // TODO: Add way to customize tax multiplier.
                }}>{taxMult == 1 ? '' : 'T'}</Text>
                <View style={{flex: 1}} />
            </View>

            {/* ---   Quantity   --- */}
            <View style={{flexDirection: 'row'}}>
                <Text style={[styles.greytxt, {flex: 5}]}>Quantity</Text>
                <TextInput keyboardType='number-pad' style={[styles.whitetxt, {flex: 8, textAlign: 'right'}]} onChangeText={ (text) => {
                    setQty(Number.parseFloat(text));
                }}>{qty}</TextInput>
                <Text style={[styles.greytxt, {flex: 4}]}>   {unit.substring(0,5)}</Text>
            </View>

            {/* ---   Store   --- */}
            <View style={{flexDirection: 'row'}}>
                <Text style={[styles.greytxt, {flex: 5}]}>Store</Text>
                <TextInput
                    style={[styles.whitetxt, {flex: 8, textAlign: 'right'}]}
                    onChangeText={ (text) => {
                        setStore(text);
                    }}>{store}</TextInput>
                <View style={{flex: 4}}/>
            </View>

            <View style={{margin: 10}}/>

            <Button title={'Add'} onPress={ () => {
                receipts.push({
                    id: null,
                    source: 0,
                    store: store,
                    item_id: props.receiptItem.id, // TODO: Get id a better way?
                    qty: qty,
                    unit: unit,
                    price: price,
                    tax_mult: taxMult,
                    date_ms: 0
                });

                props.onRequestClose();
            }}/>
        </View>
    );
}

var lastReceiptItem: any | null = null; // TODO: FInd a better way to track this information.

const ShoppingList = () => {
    const [shoppingList, setShoppingList] = useState<any[]>([]);
    const [modalItem, setModalItem] = useState<Item | null>(null); // TODO: Find better way to pass item to modal.
    const [numReceipts, setNumReceipts] = useState<number>(0);
    const [rerender, setRerender] = useState<boolean>(true); // TODO: Figure out better way to force a rerender.

    /* Execute on first mount. */
    useEffect(() => {
        // DataManager.getInstance().resetTestTable('receipt');
        DataManager.getInstance().printTable('receipt');
        // DataManager.getInstance().createTables();
        // DataManager.getInstance().resetTestTable('meal_log');
        // DataManager.getInstance().printTable('meal_log');

        const getLog = async () => {
            const data = await DataManager.getInstance().getShoppingList();
            setShoppingList(data);
        }

        getLog();
    }, []);

    if (!modalItem) {
        lastReceiptItem = null;
    }

    return (
        <View style={styles.centered}>
            <Modal
                transparent={true}
                visible={modalItem != null}
                onRequestClose={() => {
                    setModalItem(null);
                }}>
                <View style={styles.modal}>
                    <PriceModal 
                        onRequestClose={() => {
                            setModalItem(null);
                        }}
                        item={modalItem}
                        receiptItem={lastReceiptItem}/>
                </View>
            </Modal>

            <View style={{flex: 1}}>
                <View style={styles.topbar}>
                    <View style={{flexDirection: 'row'}}>
                        {/* ---   Save Shopping List   --- */}
                        <Text style={[numReceipts > 0 ? styles.lgwhitetxt : styles.lggreytxt, {flex: 1, textAlign: 'right', paddingRight: 10}]} onPress={ () => {
                            const date_utc = new Date(Date.now());

                            if (numReceipts > 0) {
                                DataManager.getInstance().addReceipts(receipts, {
                                    year: date_utc.getFullYear(),
                                    month: date_utc.getMonth()+1,
                                    day: date_utc.getDate()
                                });

                                setNumReceipts(0);
                                receipts = [];
                            }
                        } }>Save</Text>

                        <View style={{flex: 1}}/>
                        {/* ---   Manually Add Item   --- */}
                        <Text style={[styles.lgwhitetxt, {flex: 1, textAlign: 'right', paddingRight: 10}]} onPress={ () => {
                            // TODO: Create new Item
                        } }>[+]</Text>
                    </View>
                </View>
                <View style={styles.mainscreen}>
                    <FlatList
                        style={{flexGrow: 0}}
                        keyExtractor={list => list.name}
                        data={shoppingList}
                        renderItem={list => {
                            return(
                                <TouchableOpacity onPress={() => {
                                    list.item.hidden = !list.item.hidden;
                                    setRerender(!rerender);
                                }}>
                                    <ShoppingHeader name={list.item.name} hidden={list.item.hidden} price={list.item.cost}/>

                                    {
                                        /* If the section of the shopping list is hidden, show as grey and do not show children. */
                                        list.item.hidden ? <View/> : <FlatList
                                            style={{flexGrow: 0}}
                                            keyExtractor={item => item.id}
                                            data={list.item.items}
                                            renderItem={receiptItem => 
                                                {
                                                    const stock = receiptItem.item.receipt_total_qty-receiptItem.item.meallog_total_qty;

                                                    return (
                                                        <ShoppingItem
                                                            item_id={receiptItem.item.id}
                                                            name={receiptItem.item.name.substring(0, 20)}
                                                            cost={receiptItem.item.receipt_price ? receiptItem.item.receipt_price : 0} // TODO: Display as 2 decimal places.
                                                            store={receiptItem.item.store ? receiptItem.item.store.substring(0, 20) : "?"}
                                                            count={stock}
                                                            critical={stock <= receiptItem.item.crit}
                                                            onSelected={(item, selected) => {
                                                                lastReceiptItem = receiptItem.item;

                                                                if (selected) {
                                                                    setModalItem(item);
                                                                    setNumReceipts(numReceipts+1);
                                                                } else {
                                                                    for (var i = 0; i < receipts.length; i++) {
                                                                        if (receipts[i] && receipts[i].item_id == item.id) {
                                                                            delete receipts[i];
                                                                            setNumReceipts(numReceipts-1);
                                                                            break;
                                                                        }
                                                                    }

                                                                    receipts.forEach((item) => {
                                                                        console.log(item);
                                                                    });
                                                                }
                                                            }} />
                                                    );
                                                }
                                            }/>
                                    }
                                </TouchableOpacity>
                            );
                        }} />
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
    whitetxt: {
        color: '#ffffff',
        fontSize: 20
    },
    lgwhitetxt: {
        color: '#ffffff',
        fontSize: 30
    },
    greytxt: {
        color: '#B0B0B0',
        fontSize: 20
    },
    lggreytxt: {
        color: '#B0B0B0',
        fontSize: 30
    },
    mainscreen: {
        backgroundColor: '#222222',
        flex: 1
    }
});
