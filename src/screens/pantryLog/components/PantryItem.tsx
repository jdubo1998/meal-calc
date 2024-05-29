import { View, Text, StyleSheet } from "react-native";

type PantryItemProps = {
    name: string,
    count: number,
    critical: boolean
};

function LogItem(props: PantryItemProps) {
    return (
        <View style={styles.mealbar}>
            <Text style={[styles.greytxt, {flex: 10}]}>{props.name}</Text>
            <Text style={[props.critical ? styles.redtxt : styles.greytxt, {flex: 1, paddingEnd: 10, alignItems: "flex-end"}]}>{props.count}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    mealbar: {
        flexDirection: 'row',
        paddingStart: 10,
        paddingEnd: 10
    },
    redtxt: {
        color: '#AA0000',
        fontSize: 15
    },
    greytxt: {
        color: '#B0B0B0',
        fontSize: 20
    }
});

export default LogItem;
