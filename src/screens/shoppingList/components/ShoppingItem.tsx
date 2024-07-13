import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

type ShoppingItemProps = {
    name: string,
    cost: number,
    store: string,
    count: number,
    critical: boolean
};

function ShoppingItem(props: ShoppingItemProps) {
    const [selected, setSelected] = useState(false);

    return (
        <View style={styles.shoppingitembar}>
            {/* Checkbox */}
            <View style={[styles.checkbox]}>
                <Text style={styles.checkboxtext} onPress={ () => {
                    if (!selected) {
                        // TODO: Open the modal to add item to receipt.

                        console.log(`Bought: ${props.name}`);
                    }

                    setSelected(!selected);
                } }>{selected ? 'X' : ''}</Text>
            </View>

            <View style={styles.shoppingitem}>
                {/* Item and Price */}
                <View style={styles.shoppingitembar}>
                    <Text style={[styles.whitetext, {flex: 10}]}>{props.name}</Text>
                    <Text style={[props.critical ? styles.redtxt : styles.whitetext, {flex: 3, textAlign: 'right', paddingEnd: 10}]}>{`$${props.cost}`}</Text>
                </View>

                {/* Store and Quantity */}
                <View style={styles.shoppingitembar}>
                    <Text style={[styles.smallgreytext, {flex: 10}]}>{props.store}</Text>
                    <Text style={[props.critical ? styles.redtxt : styles.smallgreytext, {flex: 3, textAlign: 'right', paddingEnd: 10}]}>{props.count}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    shoppingitem: {
        flexDirection: 'column',
        flex: 15
    },
    shoppingitembar: {
        flexDirection: 'row',
        paddingStart: 10,
        paddingEnd: 10
    },

    checkbox: {
        justifyContent: 'center',
        marginVertical: 5,
        borderWidth: 3,
        borderColor: '#FFFFFF',
        flex: 1
    },
    checkboxtext: {
        color: '#FFFFFF',
        fontSize: 20,
        textAlign: 'center'
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
