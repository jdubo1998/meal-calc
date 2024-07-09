import { View, Text, StyleSheet } from "react-native";

type ShoppingItemProps = {
    name: string,
    cost: number,
    store: string,
    count: number,
    critical: boolean
};

function ShoppingItem(props: ShoppingItemProps) {
    return (
        <View style={styles.shoppingitem}>
            <View style={styles.shoppingitembar}>
                <Text style={[styles.whitetext, {flex: 1}]}>X</Text>
                <Text style={[styles.whitetext, {flex: 10}]}>{props.name}</Text>
                <Text style={[props.critical ? styles.redtxt : styles.whitetext, {flex: 3, textAlign: 'right', paddingEnd: 10}]}>{`$${props.cost}`}</Text>
            </View>
            <View style={styles.shoppingitembar}>
                <View style={{flex: 1}}/>
                <Text style={[styles.smallgreytext, {flex: 10}]}>{props.store}</Text>
                <Text style={[props.critical ? styles.redtxt : styles.smallgreytext, {flex: 3, textAlign: 'right', paddingEnd: 10}]}>{props.count}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    shoppingitem: {
        flexDirection: 'column'
    },
    shoppingitembar: {
        flexDirection: 'row',
        paddingStart: 10,
        paddingEnd: 10
    },
    redtxt: {
        color: '#AA0000',
        fontSize: 15
    },
    whitetext: {
        color: '#FFFFFF',
        fontSize: 20
    },
    smallgreytext: {
        color: '#B0B0B0',
        fontSize: 15
    }
});

export default ShoppingItem;
