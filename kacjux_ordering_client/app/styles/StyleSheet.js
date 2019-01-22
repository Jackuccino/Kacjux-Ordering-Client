import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  title: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    margin: 5
  },
  headerView: {
    flex: 1,
    flexDirection: "row"
  },
  cartContainerView: {
    marginLeft: 0,
    marginRight: 0
  },
  cartButton: {
    backgroundColor: "green",
    width: 160,
    height: 60
  },
  cartText: {
    fontSize: 30
  },
  bottom: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "lightgrey",
    width: "45%",
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 60
  },
  extraBottomSpace: {
    height: 60
  },
  itemContentContainer: {
    paddingBottom: 60
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
    width: 20,
    height: 20,
    backgroundColor: "red"
  },
  cartIcon: {
    marginLeft: 50,
    marginRight: 15
  },
  totalPrice: {
    fontSize: 25,
    textAlign: "left"
  }
});
