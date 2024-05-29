import { View, Text, StyleSheet } from "react-native";

type MealHeaderProps = {
    name: string,
    price: number,
    cals: number
};

function LogHeader(props: MealHeaderProps) {
    return (
        <View style={styles.mealbar}>
            <Text style={[styles.whiteheader, {flex: 10}]}>{props.name}</Text>
            <View style={{flex: 3}}/>
            <Text style={[styles.whiteheader, {flex: 4}]}>${props.price}</Text>
            <Text style={[styles.whiteheader, {flex: 4, paddingStart: 20}]}>{props.cals}</Text>
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
        fontSize: 20
    }
});

export default LogHeader;
