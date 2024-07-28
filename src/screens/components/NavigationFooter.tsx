import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { useNavigation, NavigatorScreenParams  } from "@react-navigation/native";

const NavigationFooter = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.bottombar}>
            <Button title="Logs" onPress={() => {
                // navigation.navigate('Root', {screen: 'Pantry'});
            }}/>
            <Button title="Pantry" onPress={() => {
                // navigation.navigate('RootStack', {screen: 'PantryLog'});
            }}/>
            <Button title="Shopping" onPress={() => {
                
            }}/>
            {/* <Button title="" onPress={() => {
                
            }}/> */}
        </View>
    );
}

const styles = StyleSheet.create({
    bottombar: {
        backgroundColor: '#777777',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
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

export default NavigationFooter;
