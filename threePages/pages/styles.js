import {StyleSheet, Dimensions} from "react-native";

const {width:SCREEN_WIDTH} = Dimensions.get("window");

export const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
    },
    inputContainer: {
        flex: 2,
        backgroundColor: "white",
        width: SCREEN_WIDTH,
        alignItems: "center",
        justifyContent: "center",
    },
    input:{
        width: SCREEN_WIDTH,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 20,
    },
    picker:{
        width: SCREEN_WIDTH,
        height: 60,
    }
});

export default style;