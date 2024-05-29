import { Button, View, Text, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import { GoogleSignin, GoogleSigninButton, statusCodes, User } from '@react-native-google-signin/google-signin';
import DataManager from "../../shared/DataManager";
import { Item } from "../../shared/DataManager";

type HeaderProps = {
    // name: string
};

var jprint = (data: any) => {
    console.log(JSON.stringify(data, null, 4));
}

var printPoint = (point: any, readable: boolean = true) => {
    const name = `${point.value[2].stringVal.substring(0,20).replace(',', '')}`;
    const meal = `${point.value[1].intVal}`;
    const start_date = `${new Date(parseInt(point.startTimeNanos)/1000000).toLocaleDateString()}`;
    const start_time = `${new Date(parseInt(point.startTimeNanos)/1000000).toLocaleTimeString()}`;
    const modified_date = `${new Date(parseInt(point.modifiedTimeMillis)).toLocaleDateString()}`;
    const modified_time = `${new Date(parseInt(point.modifiedTimeMillis)).toLocaleTimeString()}`;
    const end_date = `${new Date(parseInt(point.endTimeNanos)/1000000).toLocaleDateString()}`;
    const end_time = `${new Date(parseInt(point.endTimeNanos)/1000000).toLocaleTimeString()}`;

    try {
        for (let val of point.value[0].mapVal) {
            if (val.key == "calories") {
                const calories = `${val.value.fpVal.toFixed(2)}`;

                if (readable) {
                    console.log(`${name.padEnd(25)} ${meal.padEnd(5)} ${start_date.padEnd(13)}`);
                } else {
                    console.log(`${name}, ${calories}, ${meal}, ${start_date}, ${start_time}, ${modified_date}, ${modified_time}, ${end_date}, ${end_time}`);
                }
            }
        }

        // console.log(`   S ${new Date(parseInt(point.startTimeNanos)/1000000).toLocaleDateString().padEnd(15)}   ${new Date(parseInt(point.startTimeNanos)/1000000).toLocaleTimeString()}`);
        // console.log(`   E ${new Date(parseInt(point.endTimeNanos)/1000000).toLocaleDateString().padEnd(15)}   ${new Date(parseInt(point.endTimeNanos)/1000000).toLocaleTimeString()}`);
        // console.log(`   M ${new Date(parseInt(point.modifiedTimeMillis)).toLocaleDateString().padEnd(15)}   ${new Date(parseInt(point.modifiedTimeMillis)).toLocaleTimeString()}`);
        // console.log(`   ${Math.abs((parseInt(point.endTimeNanos)/1000000)-point.modifiedTimeMillis)/60000}`);
    } catch {
        console.log(`   ${point.modifiedTimeMillis}`);
    }
}

var consolelog_bydate1 = (data: any) => {
    var last_date = 0;
    var last_day = 0;

    for (let point of data.point) {
        if (last_date != point.modifiedTimeMillis) { // Seperates with a space if items were not updated at the same time.
            console.log();
            last_date = point.modifiedTimeMillis;
        }
        
        const day = new Date(parseInt(point.modifiedTimeMillis)).getDate();
        if (last_day != day) { // Seperates with the date as the header if items were updated on different days.
            console.log(`---   ${day}   ---`);
            console.log();
            last_day = day;
        }

        printPoint(point);
    }

    for (var i = 0; i < 5; i++) {
        console.log();
    }
}

var consolelog_bydate = (data: any) => {
    var last_date = 0;
    var last_day = 0;

    // const a = '4 4 4      4 4 444 4444  44  4444  4444444444444  4 44 4 4     4 4  4 4 4   44 4  4    4     444 4 4   4 444444 4  4 4   4 4444  4  4 4 44444 44  44444444          4';
    const a = '';
    var i = 0;

    for (let point of data.point) {
        if (last_date != point.modifiedTimeMillis) { // Seperates with a space if items were not updated at the same time.
            // console.log();
            last_date = point.modifiedTimeMillis;
        }
        
        const day = new Date(parseInt(point.modifiedTimeMillis)).getDate();
        if (last_day != day) { // Seperates with the date as the header if items were updated on different days.
            last_day = day;
        }

        try {
            for (let val of point.value[0].mapVal) {
                if (val.key == "calories") {
                    printPoint(point);
                    // printPoint(point, false);
                }
            }
        } catch {
            console.log(`   ${point.modifiedTimeMillis}`);
        }

        i++;
        if (i == a.length) {
            console.log('---')
        }

        while (a.charAt(i) == ' ') {
            console.log();
            i++;
        }
    }

    for (var i = 0; i < 5; i++) {
        console.log();
    }
}

var print_days = (days: any[]) => {
    console.log(days.length);
    for (let day of days) {
        console.log();
        console.log(`---   ${day.date}   ---`);
        console.log();
        for (let meal of day.meals) {
            for (let item of meal) {
                const date = new Date(parseInt(item.date)/1000000).toLocaleDateString();

                try {
                    console.log(`${item.name.padEnd(50)} ${`${item.cal.toFixed(2)}`.padEnd(10)} ${date.padEnd(10)}`);
                } catch {
                    console.log(`*** ${item.name}`);
                }
            }
        }
    }
}

var consolelog_bymeal = (data: any) => {
    var last_date = 0;
    var last_dayindex = -1;
    var last_meal = 0;

    var days: any[] = [];

    for (let point of data.point) {
        for (let val of point.value[0].mapVal) {
            if (val.key == "calories") {
                // Seperates out the date that the items belong to.
                const curDay = new Date(parseInt(point.startTimeNanos)/1000000).getDate();
                const day = last_dayindex != -1 ? parseInt(days[last_dayindex].date.match(/[0-9]+\/([0-9]+)\/[0-9]+/)[1]) : "";
                var foundDay = day == curDay;

                if (last_dayindex == -1 || !foundDay) {
                    for (var d = 0; d < days.length; d++) {
                        if (new Date(days[last_dayindex].date).getDate() == curDay) {
                            last_dayindex = d;
                            foundDay = true;
                            break;
                        }
                    }

                    // For a new day add it to the days.
                    if (!foundDay) {
                        // console.log(`---   Adding ${curDay}   ---`);
                        days.push({
                            date: new Date(parseInt(point.startTimeNanos)/1000000).toLocaleDateString(),
                            meals: [[], [], [], []]
                        });

                        last_dayindex = days.length - 1;
                    }
                }

                const name = point.value[2].stringVal;
                const meal = parseInt(point.value[1].intVal)-1;
                var foundItem = false;

                for (let item of days[last_dayindex].meals[meal]) {
                    if (item.name == name) {
                        console.log(`*** Found ${item.name} replacing ${item.cal} => ${val.value.fpVal}`);
                        item.cal = val.value.fpVal;
                        foundItem = true;
                    }
                }

                if (!foundItem) {
                    days[last_dayindex].meals[meal].push({
                        name: name,
                        date: point.startTimeNanos,
                        cal: val.value.fpVal
                    });
                }
            }
        }
    }

    print_days(days);
}

// TODO: Change how you populate the fields.
var logitem = (data: any) => {
    // DataManager.getInstance().resetTestTables();

    // DataManager.getInstance().printTable('item');
    // DataManager.getInstance().printTable('meal_log');

    for (let point of data.point) {
        const name = point.value[2].stringVal;
        const meal = point.value[1].intVal;
        const start_date: bigint = point.startTimeNanos;
        // jprint(point);

        for (let val of point.value[0].mapVal) {
            const nutrient: string = val.key;
            const value = val.value.fpVal;

            // console.log(nutrient);

            // console.log(item[lookup[nutrient as keyof typeof lookup] as keyof Item]);
            // item[lookup[nutrient as keyof typeof lookup] as keyof Item] = value;
            // console.log(value);
            // console.log(lookup[nutrient as keyof typeof lookup] as keyof Item);
            // console.log(item[lookup[nutrient as keyof typeof lookup] as keyof Item]);
            // item.nutrient = value;

            if (nutrient == 'calories') {
                DataManager.getInstance().logItem(name, meal, value, start_date, 1);
                const month = new Date(Number(start_date/1000000n)).getMonth();
                const day = new Date(Number(start_date/1000000n)).getDate();
                const year = new Date(Number(start_date/1000000n)).getFullYear();

                // console.log(Date.parse(`${year}-${month}-${day}T00:00:00.0Z`));
                // console.log(Date.parse(`${year}-${month}-${day}T00:00:00.0Z`)+(24*60*60*1000));
            }
        }

        // console.log(item);

        // console.log(item.cals);

        // break;
    }
}

function LoginHeader(props: HeaderProps) {
    const [userInfo, setUserInfo] = useState<User>();
    const [accessToken, setAccessToken] = useState("");
    const [date, setDate] = useState("4/20/2024");

    GoogleSignin.configure({
        scopes: [
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/fitness.nutrition.read',
            'https://www.googleapis.com/auth/fitness.nutrition.write'
        ], // what API you want to access on behalf of the user, default is email and profile
        webClientId: '768950932318-pnu9uiacmbvsssanbhujfmd68r4ii5rq.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
        // androidClientId: '768950932318-9ddatcluj23i17ijf28re6dcee5b9npu.apps.googleusercontent.com',
        
        // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        // hostedDomain: '', // specifies a hosted domain restriction
        // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
        // accountName: '', // [Android] specifies an account name on the device that should be used
        // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
        // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
        // profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
    });

    return (
        <View style={styles.topbar}>
            <Button title="SIGN IN" onPress={
                async () => {
                    try {
                        await GoogleSignin.hasPlayServices();

                        const userInfoResponse = await GoogleSignin.signIn();
                        const tokens = await GoogleSignin.getTokens();

                        setAccessToken(tokens.accessToken);
                        setUserInfo(userInfoResponse);
                        console.log(JSON.stringify(userInfo, null, 4));
                        console.log(accessToken);
                    } catch (error: any) {
                        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                            console.log('sign in cancelled');
                        // user cancelled the login flow
                        } else if (error.code === statusCodes.IN_PROGRESS) {
                            console.log('sign in already in progress');
                        // operation (e.g. sign in) is in progress already
                        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                            console.log('google services not available');
                        // play services not available or outdated
                        } else {
                            console.log(`${error.code}   ${error}`);
                        // some other error happened
                        }
                    }
                }
            }/>
            <Button title="Get Nutrition Info" onPress={async () => {
                for (var i = 0; i < 5; i++) {
                    console.log();
                }

                const url = "https://www.googleapis.com/fitness/v1/users/me/dataSources/raw:com.google.nutrition:com.fitnow.loseit:/datasets/";
                // const timeBegin = (Date.now()-(Date.now()%86400000000000)-86400000000000);
                // const timeEnd = (Date.now()-(Date.now()%86400000000000)+86400000000000);

                // const timeBegin = `${Date.parse(`${date}T00:00:00.0`)*1000000}`;
                // const timeEnd = `${Date.parse(`${date}T11:59:59.0`)*1000000}`;

                // const day = 16;
                // const range = 30;
                // const day = 25;
                // const range = 2;
                // const timeBegin = `${Date.parse(`2024-04-${day}T00:00:00.0`)*1000000}`;
                // const timeEnd = `${Date.parse(`2024-04-${day+range}T00:00:00.0`)*1000000}`;

                
                const days = 1;

                const timeBegin = Date.parse(`2024-05-19T00:00:00.0Z`)*1000000;
                const timeEnd = Date.parse(`2024-05-20T05:00:00.0Z`)*1000000;

                // const timeBegin = 1715990400000*1000000;
                // const timeEnd = 1716163200000*1000000;

                // console.log(timeBegin);
                // console.log(timeEnd);
                // console.log(new Date(1716163200000));
                // console.log(new Date(1716163200000));

                const response = await fetch(`${url}${timeBegin}-${timeEnd}?`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    }
                });

                const data = await response.json();

                await DataManager.getInstance().createTables();

                // console.log(typeof data);

                // consolelog_bydate(data);
                // consolelog_bymeal(data);
                logitem(data);
                // jprint(data);
            }}/>
        </View>
    );
}

const styles = StyleSheet.create({
    topbar: {
        backgroundColor: '#777777',
        alignItems: 'center',
        flexDirection: "row"
    },
});

export default LoginHeader;
