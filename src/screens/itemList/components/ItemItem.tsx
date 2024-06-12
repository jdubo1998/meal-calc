import { View, Text, StyleSheet } from "react-native";

type ItemItemProps = {
    name: string
};

function ItemItem(props: ItemItemProps) {
    return (
        <View style={styles.itembar}>
            <Text style={[styles.whitetext, {flex: 10}]}>{props.name}</Text>
            {/* <Text style={[props.critical ? styles.redtxt : styles.greytxt, {flex: 1, paddingEnd: 10, alignItems: "flex-end"}]}>{props.count}</Text> */}
        </View>
    );
}

const styles = StyleSheet.create({
    itembar: {
        flexDirection: 'row',
        paddingStart: 10,
        paddingEnd: 10
    },
    whitetext: {
        color: '#ffffff',
        fontSize: 20
    }
});

export default ItemItem;
