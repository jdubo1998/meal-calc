import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

type ShoppingHeaderProps = {
    name: string,
    price: number,
    hidden?: boolean
};

function ShoppingHeader(props: ShoppingHeaderProps) {
    return (
        <View style={styles.mealbar}>
            <Text style={[props.hidden ? styles.greyheader : styles.whiteheader, {flex: 7}]}>{props.name}</Text>
            <Text style={[props.hidden ? styles.greyheader : styles.whiteheader, {flex: 3, paddingEnd: 10, textAlign: 'right'}]}>{'$'+props.price}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    mealbar: {
        flexDirection: 'row',
        paddingStart: 10,
        paddingEnd: 10
    },
    whiteheader: {
        color: '#ffffff',
        fontSize: 30
    },
    greyheader: {
        color: '#B0B0B0',
        fontSize: 30
    }
});

export default ShoppingHeader;
