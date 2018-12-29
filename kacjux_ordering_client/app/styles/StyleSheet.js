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
    margin: 15
  },
  itemImage: {
    margin: 10,
    height: 150,
    justifyContent: "center",
    backgroundColor: "lightblue"
  },
  itemText: {
    textAlign: "center",
    fontSize: 25
  },
  itemTitleContainer: {
    justifyContent: "center",
    flexDirection: "row"
  },
  itemTitle: {
    textAlign: "center",
    fontSize: 20
  },
  itemNumber: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    height: 40,
    width: 50
  },
  itemButton: {
    width: "auto",
    borderRadius: 30,
    width: 40,
    height: 40
  }
});
