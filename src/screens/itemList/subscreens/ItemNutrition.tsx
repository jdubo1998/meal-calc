import { View, Text, StyleSheet, TextInput } from "react-native";
import DataManager, { Item, fatGoal, carbGoal, protGoal } from "../../../shared/DataManager";
import { ItemNutritionRouteProp } from "../../../../App";
import { useEffect, useState } from "react";

type ServingEditProps = {
    type: number,
    qty: number,
    unit: string
}

const ServingEdit = (props: ServingEditProps) => {
    const types = ['Serving', 'Weight', 'Volume'];

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
            <TextInput style={[styles.lgwhitetxt, {flex: 2, paddingEnd: 10, textAlign: "right"}]}>{props.value}</TextInput>
        </View>
    );
}

type NutritionRowProps = {
    label: string,
    item: Item,
    attr: string,
    unit: string,
    subvalue?: string
}

const NutritionRow = (props: NutritionRowProps) => {
    return (
        <View style={styles.nutritionbar}>
            <Text style={[styles.whitetxt, {flex: 12}]}>{props.label}</Text>
            <Text style={[styles.greytxt, {flex: 2}]}>{props.subvalue ? `${props.subvalue}%` : ""}</Text>
            {/* <Text style={[styles.whitetxt, {flex: 2, textAlign: "right"}]}>{props.value}</Text> */}
            <TextInput style={[styles.whitetxt, {flex: 2, textAlign: "right"}]} keyboardType="number-pad" onChangeText={(text) => {
                try {
                    // props.value = Number.parseFloat(text);
                    (props.item as any)[props.attr] = Number.parseFloat(text);
                } catch (e) {}
            }}>
                {(props.item as any)[props.attr]}
            </TextInput>
            <Text style={[styles.whitetxt, {flex: 2}]}>{props.unit}</Text>
            {/* <Text style={[styles.whitetxt, {flex: 3, paddingEnd: 10, alignItems: "flex-end"}]}>{props.value}</Text>
            <Text style={[styles.whitetxt, {flex: 1, paddingEnd: 10, alignItems: "flex-end"}]}>{props.value}</Text> */}
        </View>
    );
}

const ItemNutrition = ( {route, navigation}: ItemNutritionRouteProp ) => {
    const [item, setItem] = useState<Item>();

    useEffect(() => {
        const getItem = async (item_id: number) => {
            setItem(await DataManager.getInstance().getItem(item_id));
        };

        if (route.params.item != undefined) {
            setItem(route.params.item);
        } else if (route.params.item_id != undefined) {
            getItem(route.params.item_id);
        }
    }, []);

    if (item == undefined) {
        return(<View></View>);
    }

    return (
        <View style={{flex: 1}}>
            <View style={styles.topbar}>
                <View style={{flexDirection: 'row'}}>
                    <TextInput style={[styles.lgwhitetxt, {flex: 1, paddingLeft: 10}]}>{item.name}</TextInput>
                    <Text style={[styles.lgwhitetxt, {flex: 1, textAlign: 'right', paddingRight: 10}]} onPress={() => {
                        // console.log(route.params.item);
                    }}>Save</Text>
                </View>
            </View>
            <View style={styles.mainscreen}>
                <View style={styles.nutritioncard}>
                    <ServingRow 
                        serv_qty={item.serv_qty}
                        serv_unit={item.serv_unit}
                        weight_qty={item.weight_qty}
                        weight_unit={item.weight_unit}
                        vol_qty={item.vol_qty}
                        vol_unit={item.vol_unit} />

                    <View style={styles.nutritionsuperthickseperator} />
                    <CaloriesRow value={item.cals}/>
                    <View style={styles.nutritionthickseperator} />
                    <Text />
                    <NutritionRow label="Total Fat" item={item} attr={"fats"} unit="g" subvalue={(item.fats*100/fatGoal).toPrecision(2)} />
                    <View style={[{marginStart:30}, styles.nutritionseperator]} />
                    <NutritionRow label="       Saturated Fat" item={item} attr={"sat_fat"} unit="g" />
                    
                    <View style={styles.nutritionseperator} />
                    <NutritionRow label="Cholesterol" item={item} attr={"cholest"} unit="mg" />
                    <View style={styles.nutritionseperator} />
                    <NutritionRow label="Sodium" item={item} attr={"sodium"} unit="mg" />

                    <View style={styles.nutritionseperator} />
                    <NutritionRow label="Total Carbohydrates" item={item} attr={"carbs"} unit="g" subvalue={(item.carbs*100/carbGoal).toPrecision(2)} />
                    <View style={[{marginStart:30}, styles.nutritionseperator]} />
                    <NutritionRow label="       Dietary Fiber" item={item} attr={"fiber"} unit="g" />
                    <View style={[{marginStart:30}, styles.nutritionseperator]} />
                    <NutritionRow label="       Total Sugars" item={item} attr={"sugar"} unit="g" />
                    <View style={styles.nutritionseperator} />
                    <NutritionRow label="Protein" item={item} attr={"prot"} unit="g" subvalue={(item.prot*100/protGoal).toPrecision(2)} />
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
