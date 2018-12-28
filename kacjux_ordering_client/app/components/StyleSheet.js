import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  title: {
    fontWeight: "bold",
    fontSize: 50,
    textAlign: "center"
  },
  submitButton: {
    backgroundColor: "green",
    width: 170,
    height: 70,
    marginTop: 15,
    alignSelf: "flex-end"
  },
  submitText: {
    fontSize: 30
  },
  top: {
    height: "10%"
  },
  middle: {
    height: "75%"
  },
  bottom: {
    height: "15%"
  },
  itemContainer: {
    width: "100%"
  },
  itemGrid: {
    flex: 1,
    backgroundColor: "lightblue",
    justifyContent: "center",
    height: 150,
    margin: 15
  },
  itemText: {
    textAlign: "center",
    fontSize: 25
  }
});
