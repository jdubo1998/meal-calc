import { View, Text, StyleSheet, TextInput } from "react-native";
import DataManager, { Item, fatGoal, carbGoal, protGoal } from "../../../shared/DataManager";
import { ItemNutritionRouteProp } from "../../../../App";

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
    subvalue?: string
}

const NutritionRow = (props: NutritionRowProps) => {
    return (
        <View style={styles.nutritionbar}>
            <Text style={[styles.whitetxt, {flex: 12}]}>{props.label}</Text>
            <Text style={[styles.greytxt, {flex: 2}]}>{props.subvalue ? `${props.subvalue}%` : ""}</Text>
            {/* <Text style={[styles.whitetxt, {flex: 2, textAlign: "right"}]}>{props.value}</Text> */}
            <TextInput style={[styles.whitetxt, {flex: 2, textAlign: "right"}]} keyboardType="number-pad" onChangeText={(text) => {
                // console.log(text);
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

// type ItemNutritionProps = {
//     item: Item
// }

const ItemNutrition = ( {route, navigation}: ItemNutritionRouteProp ) => {
    return (
        <View style={{flex: 1}}>
            <View style={styles.topbar}>
                <View style={{flexDirection: 'row'}}>
                    {/* <Text style={[styles.lgwhitetxt, {flex: 1, textAlign: 'right', paddingRight: 10}]}>Save</Text> */}
                    <Text style={[styles.lgwhitetxt, {flex: 1, textAlign: 'right', paddingRight: 10}]} onPress={() => {
                        // console.log(route.params.item);
                    }}>Save</Text>
                </View>
            </View>
            <View style={styles.mainscreen}>
                <View style={styles.nutritioncard}>
                    <CaloriesRow value={route.params.item.cals}/>
                    <View style={styles.nutritionthickseperator} />
                    <Text />
                    <NutritionRow label="Total Fat" item={route.params.item} attr={"fats"} unit="g" subvalue={(route.params.item.fats*100/fatGoal).toPrecision(2)} />
                    <View style={[{marginStart:30}, styles.nutritionseperator]} />
                    <NutritionRow label="       Saturated Fat" item={route.params.item} attr={"sat_fat"} unit="g" />
                    
                    <View style={styles.nutritionseperator} />
                    <NutritionRow label="Cholesterol" item={route.params.item} attr={"cholest"} unit="mg" />
                    <View style={styles.nutritionseperator} />
                    <NutritionRow label="Sodium" item={route.params.item} attr={"sodium"} unit="mg" />

                    <View style={styles.nutritionseperator} />
                    <NutritionRow label="Total Carbohydrates" item={route.params.item} attr={"carbs"} unit="g" subvalue={(route.params.item.carbs*100/carbGoal).toPrecision(2)} />
                    <View style={[{marginStart:30}, styles.nutritionseperator]} />
                    <NutritionRow label="       Dietary Fiber" item={route.params.item} attr={"fiber"} unit="g" />
                    <View style={[{marginStart:30}, styles.nutritionseperator]} />
                    <NutritionRow label="       Total Sugars" item={route.params.item} attr={"sugar"} unit="g" />
                    <View style={styles.nutritionseperator} />
                    <NutritionRow label="Protein" item={route.params.item} attr={"prot"} unit="g" subvalue={(route.params.item.prot*100/protGoal).toPrecision(2)} />
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
