import { View, Text, StyleSheet } from "react-native";

type PantryHeaderProps = {
    name: string
};

function LogHeader(props: PantryHeaderProps) {
    return (
        <View style={styles.mealbar}>
            <Text style={[styles.whiteheader, {flex: 10}]}>{props.name}</Text>
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
    }
});

export default LogHeader;
