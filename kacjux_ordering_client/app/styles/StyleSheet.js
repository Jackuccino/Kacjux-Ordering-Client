import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    margin: 5
  },
  horizontalView: {
    flex: 1,
    flexDirection: "row"
  },
  cartContainerView: {
    marginLeft: 0,
    marginRight: 0
  },
  cartButton: {
    backgroundColor: "red",
    width: 150,
    height: 70
  },
  cartText: {
    fontSize: 30
  },
  bottom: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "grey",
    width: "38%",
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 70
  },
  extraBottomSpace: {
    height: 70
  },
  itemContentContainer: {
    paddingBottom: 70
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
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center"
  },
  itemPrice: {
    flex: 1,
    textAlign: "right",
    fontSize: 20,
    alignSelf: "center"
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
  itemMinusButton: {
    width: "auto",
    borderRadius: 30,
    width: 40,
    height: 40,
    padding: 0,
    paddingLeft: 10,
    backgroundColor: "red"
  },
  itemPlusButton: {
    width: "auto",
    borderRadius: 30,
    width: 40,
    height: 40,
    padding: 0,
    paddingLeft: 10,
    backgroundColor: "#007bff"
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
    marginLeft: 45,
    marginRight: 12
  },
  totalPrice: {
    fontSize: 25,
    textAlign: "left",
    color: "white"
  },
  cartItemImage: {
    width: 40,
    height: 40,
    margin: 5
  },
  submitButton: {
    backgroundColor: "green",
    width: 150,
    height: 70
  },
  cartItemList: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20
  },
  textAreaContainer: {
    borderColor: "lightgrey",
    borderWidth: 1,
    padding: 5,
    margin: 20,
    textAlignVertical: "top",
    height: 150
  },
  scrollViewStyle: {
    flex: 1,
    justifyContent: "space-between",
    paddingBottom: 70
  },
  itemInvisible: {
    backgroundColor: "transparent"
  },
  sideMenuBarContainer: {
    width: 120
  },
  menuContainer: {
    flex: 1
  },
  menuHeader: {
    fontSize: 20,
    textAlign: "center",
    borderBottomWidth: 1,
    borderColor: "grey",
    fontWeight: "bold",
    padding: 5
  },
  defaultBackgroundColor: {
    backgroundColor: "#f5fcff"
  },
  sectionListContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionHeader: {
    fontSize: 25,
    fontWeight: "bold",
    margin: 5
  },
  searchBarTextInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5
  },
  searchBarItem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#ddd",
    borderColor: "#bbb",
    borderWidth: 1,
    borderRadius: 5
  },
  searchBarItemText: {
    color: "#222"
  },
  searchBarItemContainer: {
    maxHeight: 140
  },
  searchBarContainer: {
    padding: 5
  },
  summaryCancelButton: {
    flex: 1,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 70
  },
  summaryItemQuantity: {
    justifyContent: "center",
    alignItems: "center",
    width: 40
  }
});
