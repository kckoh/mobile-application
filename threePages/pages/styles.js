import {StyleSheet, Dimensions} from "react-native";

const {width:SCREEN_WIDTH} = Dimensions.get("window");

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        // borderWidth: 1
    },
});

export default style;