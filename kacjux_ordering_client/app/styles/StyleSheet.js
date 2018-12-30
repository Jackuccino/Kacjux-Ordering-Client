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
    alignItems: "center",
    margin: 5,
    backgroundColor: "#F1F5FC"
  },
  itemTitlePrice: {
    margin: 5,
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-start"
  },
  itemImage: {
    height: 300,
    width: "100%"
  },
  itemTitle: {
    flex: 1,
    fontSize: 20
  },
  itemPrice: {
    flex: 1,
    textAlign: "right",
    fontSize: 20
  },
  itemCounterContainer: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    margin: 5
  },
  itemNumber: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    height: 40,
    width: 60
  },
  itemButton: {
    width: "auto",
    borderRadius: 30,
    width: 40,
    height: 40
  },
  iconBadgeText: {
    color: "white"
  },
  iconBadge: {
    width: 30,
    height: 30,
    backgroundColor: "red"
  }
});
