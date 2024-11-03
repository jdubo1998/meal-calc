import { View, Text, StyleSheet } from "react-native";

type MealItemProps = {
    name: string,
    qty: number,
    price: number,
    cals: number
};

function LogItem(props: MealItemProps) {
    return (
        <View style={styles.mealbar}>
            <Text style={[styles.greytext, {flex: 10}]}>{props.name}</Text>
            <Text style={[styles.greytext, {flex: 3}]}>{props.qty}</Text>
            <Text style={[styles.greytext, {flex: 4}]}>${props.price.toFixed(2)}</Text>
            <Text style={[styles.greytext, {flex: 4, paddingStart: 20}]}>{props.cals}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    mealbar: {
        flexDirection: 'row',
        paddingStart: 10,
        paddingEnd: 10
    },
    greytext: {
        color: '#B0B0B0',
        fontSize: 15
    }
});

export default LogItem;
