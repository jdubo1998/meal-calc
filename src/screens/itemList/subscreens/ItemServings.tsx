import { View, Text, StyleSheet, TextInput } from "react-native";
import DataManager, { Item, fatGoal, carbGoal, protGoal, LogItem } from "../../../shared/DataManager";
import { ItemServingRouteProp } from "../../../../App";
import React, { useEffect, useState } from "react";

const types = ['Serving', 'Weight', 'Volume'];

type QtyEditorProps = {
    type: number,
    qty: number,
    unit: string,
    onQtyChange: (qty: number) => void,
    onUnitChange?: (text: string) => void
}

const QtyEditor = (props: QtyEditorProps) => {
    return (
        <View>
            <View style={styles.nutritionbar}>
                <Text style={[styles.whitetxt, {flex: 1}]}>{types[props.type]}</Text>
                <TextInput style={[styles.whitetxt, {flex: 1}]} keyboardType='decimal-pad' onChangeText={(text) => {
                    try {
                        const qty = Number.parseFloat(text);

                        props.onQtyChange(qty);
                    } catch {}
                }}>{props.qty}</TextInput>
                <Text style={[styles.whitetxt, {flex: 1}]}>{props.unit}</Text>

                {/* // TODO: Allow for you to change the unit type. */}
                {/* <TextInput style={[styles.whitetxt, {flex: 1}]} onChangeText={(text) => props.onUnitChange(text)}>{props.unit}</TextInput> */}
            </View>
        </View>
    );
}

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
                <Text style={[styles.whitetxt, {flex: 2}]}>{props.qty}</Text>
                {/* // TODO: Make this a drop down instead of textinput. */}
                <Text style={[styles.whitetxt, {flex: 3}]}>{props.unit}</Text>
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
}

const ServingRow = (props: ServingRowProps) => {
    console.log();
    return (
        <View style={styles.nutritionbar}>
            <ServingEdit type={0} qty={props.serv_qty ? props.serv_qty : 0} unit={props.serv_unit ? props.serv_unit : ''} />
            <ServingEdit type={1} qty={props.weight_qty ? props.weight_qty : 0} unit={props.weight_unit ? props.weight_unit : ''} />
            <ServingEdit type={2} qty={props.vol_qty ? props.vol_qty : 0} unit={props.vol_unit ? props.vol_unit : ''} />
        </View>
    );
}

type CaloriesRowProps = {
    value: number
}

const CaloriesRow = (props: CaloriesRowProps) => {
    return (
        <View style={styles.nutritionbar}>
            <Text style={[styles.lgwhitetxt, {flex: 8}]}>Calories</Text>
            <Text style={[styles.lgwhitetxt, {flex: 2, paddingEnd: 10, textAlign: "right"}]}>{props.value}</Text>
        </View>
    );
}

type NutritionRowProps = {
    label: string,
    item: Item,
    attr: string,
    unit: string,
    subvalue?: string,
    servMult?: number
}

const NutritionRow = (props: NutritionRowProps) => {
    const servMult = props.servMult ? props.servMult : 1;

    return (
        <View style={styles.nutritionbar}>
            <Text style={[styles.whitetxt, {flex: 12}]}>{props.label}</Text>
            <Text style={[styles.greytxt, {flex: 2}]}>{props.subvalue ? `${props.subvalue}%` : ""}</Text>
            <TextInput style={[styles.whitetxt, {flex: 2, textAlign: "right"}]} keyboardType="number-pad" onChangeText={(text) => {
                try {
                    // props.value = Number.parseFloat(text);
                    (props.item as any)[props.attr] = Number.parseFloat(text);
                } catch (e) {}
            }}>
                {(props.item as any)[props.attr] * servMult}
            </TextInput>
            <Text style={[styles.whitetxt, {flex: 2}]}>{props.unit}</Text>
        </View>
    );
}

const ItemServing = ( {route, navigation}: ItemServingRouteProp ) => {
    const [item, setItem] = useState<Item>();
    const [qty, setQty] = useState<number>(1);
    const [unit, setUnit] = useState<string>();

    // console.log(route.params.logItem);

    useEffect(() => {
        const getItem = async (item_id: number) => {
            setItem(await DataManager.getInstance().getItem(item_id));
        };

        getItem(route.params.logItem.item_id);
    }, []);

    if (item == undefined) {
        return(<View/>);
    }

    return (
        <View style={{flex: 1}}>
            <View style={styles.topbar}>
                <View style={{flexDirection: 'row'}}>
                    <TextInput style={[styles.lgwhitetxt, {flex: 1, paddingLeft: 10}]}>{item.name}</TextInput>
                    <Text style={[styles.lgwhitetxt, {flex: 1, textAlign: 'right', paddingRight: 10}]} onPress={() => {
                        route.params.logItem.qty = qty;
                        navigation.navigate('MealLog', {newLogItem: route.params.logItem});
                    }}>Save</Text>
                </View>
            </View>
            <View style={styles.mainscreen}>
                <View style={styles.nutritioncard}>
                    {route.params.logItem ? <QtyEditor
                        type={(route.params.logItem as any).unit_type}
                        qty={route.params.logItem.qty}
                        unit={`${route.params.logItem.unit}`}
                        onQtyChange={(qty) => !Number.isNaN(qty) ? setQty(qty) : setQty(1)} /> : <View/>}

                    <View style={styles.nutritionsuperthickseperator} />
                    <CaloriesRow value={item.cals * qty}/>
                    <View style={styles.nutritionthickseperator} />
                    <Text />
                    <NutritionRow servMult={qty} label="Total Fat" item={item} attr={"fats"} unit="g" subvalue={(item.fats*qty*100/fatGoal).toPrecision(2)} />
                    <View style={[{marginStart:30}, styles.nutritionseperator]} />
                    <NutritionRow servMult={qty} label="       Saturated Fat" item={item} attr={"sat_fat"} unit="g" />
                    
                    <View style={styles.nutritionseperator} />
                    <NutritionRow servMult={qty} label="Cholesterol" item={item} attr={"cholest"} unit="mg" />
                    <View style={styles.nutritionseperator} />
                    <NutritionRow servMult={qty} label="Sodium" item={item} attr={"sodium"} unit="mg" />

                    <View style={styles.nutritionseperator} />
                    <NutritionRow servMult={qty} label="Total Carbohydrates" item={item} attr={"carbs"} unit="g" subvalue={(item.carbs*qty*100/carbGoal).toPrecision(2)} />
                    <View style={[{marginStart:30}, styles.nutritionseperator]} />
                    <NutritionRow servMult={qty} label="       Dietary Fiber" item={item} attr={"fiber"} unit="g" />
                    <View style={[{marginStart:30}, styles.nutritionseperator]} />
                    <NutritionRow servMult={qty} label="       Total Sugars" item={item} attr={"sugar"} unit="g" />
                    <View style={styles.nutritionseperator} />
                    <NutritionRow servMult={qty} label="Protein" item={item} attr={"prot"} unit="g" subvalue={(item.prot*qty*100/protGoal).toPrecision(2)} />
                    {route.params.mealLogProps ? <QtyEditor
                        type={route.params.mealLogProps.unit_type}
                        qty={route.params.mealLogProps.qty}
                        unit={route.params.mealLogProps.unit}
                        onQtyChange={(qty) => setQty(qty)} /> : <View/>}
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

export default ItemServing;
