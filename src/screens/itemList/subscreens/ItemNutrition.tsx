import { View, Text, StyleSheet, TextInput } from "react-native";
import DataManager, { Item, fatGoal, carbGoal, protGoal } from "../../../shared/DataManager";
import { ItemNutritionRouteProp } from "../../../../App";
import { useEffect, useState } from "react";

const types = ['Serving', 'Weight', 'Volume'];

type ServingEditProps = {
    type: number,
    qty: number,
    unit: string
}

const ServingEdit = (props: ServingEditProps) => {
    return (
        <View style={{flex: 1}}>
            <Text style={styles.greytxt}>{types[props.type]}</Text>
            <View style={{flexDirection: 'row'}}>
                <TextInput style={[styles.whitetxt, {flex: 2}]}>{props.qty}</TextInput>
                {/* // TODO: Make this a drop down instead of textinput. */}
                <TextInput style={[styles.whitetxt, {flex: 3}]}>{props.unit}</TextInput>
            </View>
        </View>
    );
}

type ServingRowProps = {
    serv_qty?: number | null,
    serv_unit?: string | null,
    weight_qty?: number | null,
    weight_unit?: string | null,
    vol_qty?: number | null,
    vol_unit?: string | null,
    onChangeUnitType: (unitType: number) => void,
    onChangeUnitQty: (unitQty: number) => void,
    onChangeUnit: (unit: string) => void
    onChangeUnitCrit: (unitCrit: number) => void,
    onChangeUnitOff: (unitCrit: number) => void
}

const ServingRow = (props: ServingRowProps) => {
    const [unitType, setUnitType] = useState<number>(0);

    return (
        <View>
            <View style={styles.nutritionbar}>
                {/* <ServingEdit type={0} qty={props.serv_qty ? props.serv_qty : 0} unit={props.serv_unit ? props.serv_unit : ''} />
                <ServingEdit type={1} qty={props.weight_qty ? props.weight_qty : 0} unit={props.weight_unit ? props.weight_unit : ''} />
                <ServingEdit type={2} qty={props.vol_qty ? props.vol_qty : 0} unit={props.vol_unit ? props.vol_unit : ''} /> */}
                {/*// TODO: Allow fo user to input multiple types of units. */}
                <Text style={[unitType == 0 ? styles.whitetxt : styles.greytxt, {flex:1}]} onPress={ () => {props.onChangeUnitType(0); setUnitType(0);} }>Serving</Text>
                <Text style={[unitType == 1 ? styles.whitetxt : styles.greytxt, {flex:1}]} onPress={ () => {props.onChangeUnitType(1); setUnitType(1);} }>Weight</Text>
                <Text style={[unitType == 2 ? styles.whitetxt : styles.greytxt, {flex:1}]} onPress={ () => {props.onChangeUnitType(2); setUnitType(2);} }>Volume</Text>
            </View>
            <View style={styles.nutritionbar}>
                <Text style={[styles.greytxt, {flex: 1}]}>Qty</Text>
                <TextInput style={[styles.whitetxt, {flex: 2}]} keyboardType={"number-pad"} onChangeText={ (text) => props.onChangeUnitQty(Number.parseFloat(text)) }>-</TextInput>
                <Text style={[styles.greytxt, {flex: 1}]}>Unit</Text>
                <TextInput style={[styles.whitetxt, {flex: 2}]} onChangeText={ (text) => props.onChangeUnit(text) }>-</TextInput>
                <Text style={[styles.greytxt, {flex: 1}]}>Crit</Text>
                <TextInput style={[styles.whitetxt, {flex: 2}]} keyboardType={"number-pad"} onChangeText={ (text) => props.onChangeUnitCrit(Number.parseInt(text)) }>-</TextInput>
                {/* <Text style={styles.greytxt}>      Off   </Text>
                <TextInput style={[styles.whitetxt]} keyboardType={"number-pad"} onChangeText={ (text) => props.onChangeUnitOff(Number.parseInt(text)) }>-</TextInput> */}
            </View>
        </View>
    );
}

type CaloriesRowProps = {
    value: number,
    onChangeCal: (cals: number) => void
}

const CaloriesRow = (props: CaloriesRowProps) => {
    return (
        <View style={styles.nutritionbar}>
            <Text style={[styles.lgwhitetxt, {flex: 8}]}>Calories</Text>
            <TextInput style={[styles.lgwhitetxt, {flex: 2, paddingEnd: 10, textAlign: "right"}]} keyboardType="decimal-pad" onChangeText={ (text) => {
                const cals = Number.parseFloat(text);

                if (!Number.isNaN(cals)) {
                    props.onChangeCal(cals);
                }
            } }>{props.value}</TextInput>
        </View>
    );
}

type NutritionRowProps = {
    label: string,
    item: Item,
    attr: string,
    unit: string,
    subvalue?: number
}

const NutritionRow = (props: NutritionRowProps) => {
    return (
        <View style={styles.nutritionbar}>
            <Text style={[styles.whitetxt, {flex: 12}]}>{props.label}</Text>
            <Text style={[styles.greytxt, {flex: 2}]}>{props.subvalue != undefined ? props.subvalue.toPrecision(2)+'%' : ''}</Text>
            <TextInput style={[styles.whitetxt, {flex: 2, textAlign: "right"}]} keyboardType="number-pad" onChangeText={(text) => {
                try {
                    // props.value = Number.parseFloat(text);
                    (props.item as any)[props.attr] = Number.parseFloat(text);
                } catch (e) {}
            }}>
                {(props.item as any)[props.attr]}
            </TextInput>
            <Text style={[styles.whitetxt, {flex: 2}]}>{props.unit}</Text>
        </View>
    );
}

const ItemNutrition = ( {route, navigation}: ItemNutritionRouteProp ) => {
    const [item, setItem] = useState<Item>({
        id: null,
        name: "",
        brand: null,
        pantry_id: null,
        unit_type: 0,
        serv_qty: null,
        serv_unit: null,
        serv_off: 0,
        serv_crit: null,
        weight_qty: null,
        weight_unit: null,
        weight_off: 0,
        weight_crit: null,
        vol_qty: null,
        vol_unit: null,
        vol_off: 0,
        vol_crit: null,
        cals: 0,
        prot: 0,
        carbs: 0,
        fats: 0,
        sat_fat: 0,
        cholest: 0,
        sodium: 0,
        fiber: 0,
        sugar: 0
    });

    // TODO: Change how unit is saved once multiple unit types can be recorded.
    const setUnitInfo = (key: string, value: any) => {
        var unit_key = '';
        
        if (item.unit_type == 0) {
            unit_key = 'serv' + '_' + key;
        } else if (item.unit_type == 1) {
            unit_key = 'weight' + '_' + key;
        } else if (item.unit_type == 2) {
            unit_key = 'vol' + '_' + key;
        }

        (item as any)[unit_key] = value;
    }

    useEffect(() => {
        const getItem = async (item_id: number) => {
            setItem(await DataManager.getInstance().getItem(item_id));
        };

        if (route.params && route.params.item) {
            setItem(route.params.item);
        } else if (route.params && route.params.item_id) {
            getItem(route.params.item_id);
        }
    }, []);

    return (
        <View style={{flex: 1}}>
            <View style={styles.topbar}>
                <View style={{flexDirection: 'row'}}>
                    {/* ---   Item Name   --- */}
                    <TextInput style={[styles.lgwhitetxt, {flex: 1, paddingLeft: 10}]} onChangeText={(text) => {
                        item.name = text;
                    }}>{item.name ? item.name : '-'}</TextInput>

                    <Text style={[styles.lgwhitetxt, {flex: 1, textAlign: 'right', paddingRight: 10}]} onPress={() => {
                        DataManager.getInstance().addItem(item);
                        navigation.navigate('ItemList');
                    }}>Save</Text>
                </View>
            </View>
            <View style={styles.mainscreen}>
                <View style={styles.nutritioncard}>
                    {/* ---   Item Brand   --- */}
                    <View style={{flexDirection: "row"}}>
                        <Text style={[styles.whitetxt, {flex: 1}]}>Brand</Text>
                        <TextInput style={[styles.whitetxt, {flex: 3}]} onChangeText={(text) => {
                            item.brand = text;
                        }}>{item.brand ? item.name : '-'}</TextInput>
                    </View>

                    <ServingRow 
                        serv_qty={item.serv_qty}
                        serv_unit={item.serv_unit ? item.serv_unit : '-'}
                        weight_qty={item.weight_qty}
                        weight_unit={item.weight_unit ? item.weight_unit : '-'}
                        vol_qty={item.vol_qty}
                        vol_unit={item.vol_unit ? item.vol_unit : '-'}
                        onChangeUnitType={ (unitType) => {
                            item.unit_type = unitType;

                            item.serv_qty = null;
                            item.weight_qty = null;
                            item.vol_qty = null;

                            item.serv_unit = null;
                            item.weight_unit = null;
                            item.vol_unit = null;

                            item.serv_crit = null;
                            item.weight_crit = null;
                            item.vol_crit = null;

                            // item.serv_off = 0;
                            // item.weight_off = 0;
                            // item.vol_off = 0;
                        } }
                        onChangeUnit={ (unit) => {
                            setUnitInfo('unit', unit);
                        } }
                        onChangeUnitQty={ (unitQty) => {
                            setUnitInfo('qty', unitQty);
                        } }
                        onChangeUnitCrit={ (unitCrit) => {
                            setUnitInfo('crit', unitCrit);
                        } }
                        onChangeUnitOff={ (unitOff) => {
                            // setUnitInfo('off', unitOff);
                        } } />

                    <View style={styles.nutritionsuperthickseperator} />
                    <CaloriesRow value={item.cals} onChangeCal={ (cals) => {item.cals = cals} }/>

                    <View style={styles.nutritionthickseperator} />

                    {/* ---   Fats   --- */}
                    <NutritionRow label="Total Fat" item={item} attr={"fats"} unit="g" subvalue={item.fats*100/fatGoal} />
                    <View style={[{marginStart:30}, styles.nutritionseperator]} />
                    <NutritionRow label="       Saturated Fat" item={item} attr={"sat_fat"} unit="g" />
                    
                    {/* ---   Cholestoral and Sodium   --- */}
                    <View style={styles.nutritionseperator} />
                    <NutritionRow label="Cholesterol" item={item} attr={"cholest"} unit="mg" />
                    <View style={styles.nutritionseperator} />
                    <NutritionRow label="Sodium" item={item} attr={"sodium"} unit="mg" />
                    
                    <View style={styles.nutritionseperator} />

                    {/* ---   Carbs   --- */}
                    <NutritionRow label="Total Carbohydrates" item={item} attr={"carbs"} unit="g" subvalue={item.carbs*100/carbGoal} />
                    <View style={[{marginStart:30}, styles.nutritionseperator]} />
                    <NutritionRow label="       Dietary Fiber" item={item} attr={"fiber"} unit="g" />
                    <View style={[{marginStart:30}, styles.nutritionseperator]} />
                    <NutritionRow label="       Total Sugars" item={item} attr={"sugar"} unit="g" />

                    <View style={styles.nutritionseperator} />

                    {/* ---   Protein   --- */}
                    <NutritionRow label="Protein" item={item} attr={"prot"} unit="g" subvalue={item.prot*100/protGoal} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topbar: {
        backgroundColor: '#777777',
        alignItems: 'center',
        paddingTop: 40
    },
    mainscreen: {
        backgroundColor: '#222222',
        flex: 1
    },

    nutritioncard: {
        flex: 1,
        padding: 10
    },
    nutritionbar: {
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10
    },

    nutritionsuperthickseperator: {
        borderBottomColor: '#ffffff',
        borderBottomWidth: (StyleSheet.hairlineWidth*40)
    },
    nutritionthickseperator: {
        borderBottomColor: '#ffffff',
        borderBottomWidth: (StyleSheet.hairlineWidth*20)
    },
    nutritionseperator: {
        borderBottomColor: '#ffffff',
        borderBottomWidth: (StyleSheet.hairlineWidth*2)
    },

    lgwhitetxt: {
        color: '#ffffff',
        fontSize: 30
    },
    whitetxt: {
        color: '#ffffff',
        fontSize: 20
    },
    greytxt: {
        color: '#B0B0B0',
        fontSize: 20
    }
});

export default ItemNutrition;
