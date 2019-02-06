/*************************************************************
 * Home Page
 *
 * Author:		JinJie Xu
 * Date Created:	2/1/2019
 **************************************************************/

import React, { Component } from "react";
import { Text, View, Image, SectionList } from "react-native";

import { Button, Icon } from "react-native-elements";
import IconBadge from "react-native-icon-badge";

import Styles from "../styles/StyleSheet";
import { getAllItems } from "../services/Server";
import CategoryMenu from "./CategoryMenu";

export default class HomeScreen extends Component {
  // Render the header of the navigation bar
  static navigationOptions = {
    headerTitle: <Text style={Styles.title}>Table# 1</Text>,
    headerRight: (
      <View style={Styles.horizontalView}>
        <Button title="My Profile" />
        <Button title="Login" />
        <Button title="Sign up" />
      </View>
    )
  };

  /************************************************************
   * Purpose:
   *    Initial states
   * Params:
   *    Properties that get passed to this component
   * Returns:
   *    N/A
   *************************************************************/
  constructor(props) {
    super(props);
    this.state = {
      // Holds all the types of the menu items
      titleData: [],
      // Holds all the menu items from the database
      itemData: [],
      // Holds the ordered items
      orderItems: [],
      // Number of columns in the menu
      numCols: 2,
      // Total price of all selected items
      totalPrice: 0,
      // Total number of selected items
      totalItem: 0,
      // Table number
      tableNo: 1,
      // unique order number
      orderNo: 0,
      // Determine if an order has submitted
      status: 0,
      // Note that entered in cart view
      note: ""
    };
    // For press and hold to add items to order
    // this.timer = null;

    // Get all items from the database
    this._getItems();
  }

  /************************************************************
   * Purpose:
   *    Get all items from the database
   * Params:
   *    N/A
   * Returns:
   *    N/A
   *************************************************************/
  _getItems = () => {
    let titles = []; // holds the types of each item
    let datas = []; // holds all the items fetched from the database
    let section = null; // holds a section in the sectionlist

    // Using Promise to fetch items from the database
    const result = getAllItems()
      .then(res => {
        if (res.result === "ok") {
          const items = res.items;
          items.forEach(item => {
            const data = {
              id: item.ItemId,
              key: item.Key,
              image: item.Image,
              description: item.Description,
              price: parseFloat(item.Price.replace("$", "")),
              type: item.Type,
              quantity: 0,
              index: 0
            };

            // Gather data for side header bar
            if (titles.filter(td => td.key === data.type).length === 0) {
              // Header object has unique id and name
              titles.push({ id: 0, key: data.type });
            }

            // Find the section that the new item should be in
            section = datas.find(d => d.title === data.type);
            // If the section doesn't exist, create a new one
            if (typeof section === "undefined") {
              // Section databset have title and data fields
              section = { title: data.type, data: [], index: 0 };
              datas.push(section);
            }
            // Push to the item to the section
            section.data.push(data);
          });

          // Sort the items in the SectionList
          datas = datas.sort((a, b) => {
            if (a.title < b.title) {
              return -1;
            }
            if (a.title > b.title) {
              return 1;
            }
            return 0;
          });

          // Assign an index to each item in each section
          for (let i = 0; i < datas.length; i++) {
            const data = datas[i];
            data["index"] = i;
            for (let j = 0; j < data.data.length; j++) {
              const item = data.data[j];
              item["index"] = j;
            }
          }

          // Sort headers
          titles = titles.sort((a, b) => {
            if (a.key < b.key) {
              return -1;
            }
            if (a.key > b.key) {
              return 1;
            }
            return 0;
          });

          // Assign unique id for each header
          for (let i = 0; i < titles.length; i++) {
            const title = titles[i];
            title["id"] = i;
          }

          // Save changes to state
          this.setState({
            itemData: datas,
            titleData: titles
          });
        } else {
          // Failed to fetch data from database
          console.log("Get items failed.");
        }
      })
      .catch(err => {
        // Failed to call the api
        console.log(err);
      });
  };

  /************************************************************
   * Purpose:
   *    Update quantity and total prices after returning from the cart
   * Params:
   *    data: selected data
   *    status: determine if the order has been submitted
   * Returns:
   *    N/A
   *************************************************************/
  _updateData = (orderItems, totalItem, totalPrice, status, note, orderNo) => {
    this.setState({
      orderItems: orderItems,
      totalItem: totalItem,
      totalPrice: totalPrice,
      status: status,
      note: note,
      orderNo: orderNo
    });
  };

  /************************************************************
   * Purpose:
   *    Add the quantity of the item and update total item and price
   * Params:
   *    item: the item that is pressed
   * Returns:
   *    N/A
   *************************************************************/
  _itemPlusHandler = item => {
    item.quantity++;
    this._addTotalItem();
    this._addTotalPrice(item.price);

    // increment continuously when holding button
    //this.timer = setTimeout(this._itemPlusHandler.bind(this, item), 100);
  };

  /************************************************************
   * Purpose:
   *    Minus the quantity of the item and update total item and price
   * Params:
   *    item: the item that is pressed
   * Returns:
   *    N/A
   *************************************************************/
  _itemMinusHandler = item => {
    if (item.quantity > 0) {
      item.quantity--;
      this._minusTotalItem();
      this._minusTotalPrice(item.price);
    }
  };

  /************************************************************
   * Purpose:
   *    Stop the timer used for incrementing continuously when holding button
   * Params:
   *    N/A
   * Returns:
   *    N/A
   *************************************************************/
  // _stopTimer = () => {
  //   clearTimeout(this.timer);
  // };

  /************************************************************
   * Purpose:
   *    Add to total price in the state
   * Params:
   *    price: the price that needs to be added to total price
   * Returns:
   *    N/A
   *************************************************************/
  _addTotalPrice = price => {
    this.setState({ totalPrice: this.state.totalPrice + price });
  };

  /************************************************************
   * Purpose:
   *    Subtract from total price in the state
   * Params:
   *    price: the price that needs to be subtracted from total price
   * Returns:
   *    N/A
   *************************************************************/
  _minusTotalPrice = price => {
    this.setState({ totalPrice: this.state.totalPrice - price });
  };

  /************************************************************
   * Purpose:
   *    Add 1 to total item in the state
   * Params:
   *    N/A
   * Returns:
   *    N/A
   *************************************************************/
  _addTotalItem = () => {
    this.setState({ totalItem: this.state.totalItem + 1 });
  };

  /************************************************************
   * Purpose:
   *    Subtract 1 from total item in the state
   * Params:
   *    N/A
   * Returns:
   *    N/A
   *************************************************************/
  _minusTotalItem = () => {
    this.setState({ totalItem: this.state.totalItem - 1 });
  };

  /************************************************************
   * Purpose:
   *    Render section header
   * Params:
   *    { section: { title }}: the title of the section
   * Returns:
   *    N/A
   *************************************************************/
  _renderSectionHeader = ({ section: { title } }) => {
    return <Text style={Styles.sectionHeader}>{title}</Text>;
  };

  /************************************************************
   * Purpose:
   *    Render items in the SectionList
   * Params:
   *    index: the index of the item in the section
   *    section: the section where the item is in
   * Returns:
   *    N/A
   *************************************************************/
  _renderItem = ({ index, section }) => {
    // Get the number of columns from the state
    const numColumns = this.state.numCols;

    // Avoid rendering the item that has been rendered
    // Ex. if column is set to 2, the first two items should be rendered
    // at once, which the indexes of the first two items are 0 and 1.
    // The result of 1 mod 2 is 1 which we want to skip.
    if (index % numColumns !== 0) return null;

    // Initalize a list of compoents
    const items = [];

    // Render one row at a time
    for (let i = index; i < index + numColumns; i++) {
      items.push(
        // if it has uneven items, then add an empty cell
        typeof section.data[i] === "undefined" ? (
          <View
            key={`EX_SPACE${Math.floor(Math.random() * 1000)}`}
            disabled
            style={[Styles.itemGrid, Styles.itemInvisible]}
          />
        ) : (
          <View key={`KEY_DISH${section.data[i].id}`} style={Styles.itemGrid}>
            {/* image */}
            <Image
              source={{ uri: section.data[i].image }}
              style={Styles.itemImage}
            />
            <View style={Styles.itemTitlePrice}>
              {/* title */}
              <Text style={Styles.itemTitle}>{section.data[i].key}</Text>
              {/* Price */}
              <Text style={Styles.itemPrice}>
                ${section.data[i].price.toFixed(2)}
              </Text>
            </View>
            <View style={Styles.itemTitlePrice}>
              <Text style={Styles.itemDescription}>
                {section.data[i].description}
              </Text>
            </View>
            {/* - counter + */}
            <View style={Styles.itemCounterContainer}>
              {section.data[i].quantity === 0 ? null : (
                <Button
                  icon={{
                    name: "remove",
                    size: 15
                  }}
                  containerViewStyle={{ borderRadius: 30 }}
                  borderRadius={30}
                  buttonStyle={[
                    Styles.itemMinusButton,
                    { backgroundColor: "red" }
                  ]}
                  onPress={this._itemMinusHandler.bind(this, section.data[i])}
                />
              )}
              {section.data[i].quantity === 0 ? null : (
                <View style={Styles.itemNumber}>
                  <Text> {section.data[i].quantity} </Text>
                </View>
              )}
              <Button
                icon={{
                  name: "add",
                  size: 15
                }}
                containerViewStyle={{ borderRadius: 30 }}
                borderRadius={30}
                buttonStyle={Styles.itemPlusButton}
                onPress={this._itemPlusHandler.bind(this, section.data[i])}
                //onPressIn={this._itemPlusHandler.bind(this, section.data[i])}
                //onPressOut={this._stopTimer}
              />
            </View>
          </View>
        )
      );
    }

    // Finally return the rendered section
    return <View style={Styles.sectionListContainer}>{items}</View>;
  };

  /************************************************************
   * Purpose:
   *    Get a list of items that their quantities are non-zero
   * Params:
   *    N/A
   * Returns:
   *    selectedItems: a list of items that their quantities are non-zero
   *************************************************************/
  _setSelectedItems = () => {
    let selectedItems = [];
    this.state.itemData.forEach(item => {
      selectedItems = selectedItems.concat(
        item.data.filter(d => d.quantity !== 0)
      );
    });
    return selectedItems;
  };

  /************************************************************
   * Purpose:
   *    Get a string of current date time
   * Params:
   *    N/A
   * Returns:
   *    return a string of current date time
   *************************************************************/
  _getDate = () => {
    // Get the current date
    const date = new Date();
    // The unique format is month + day + hour + minute
    return (
      (date.getMonth() + 1).toLocaleString("en-us", { month: "long" }) +
      date.getDate().toString() +
      date.getHours().toString() +
      date.getMinutes().toString()
    );
  };

  /************************************************************
   * Purpose:
   *    Save a unique order number
   * Params:
   *    N/A
   * Returns:
   *    return a string of a unique order number
   *************************************************************/
  _setOrderNo = () => {
    return this.state.tableNo.toString() + this._getDate();
  };

  /************************************************************
   * Purpose:
   *    Render the home page
   * Params:
   *    N/A
   * Returns:
   *    N/A
   *************************************************************/
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={Styles.container}>
        {/* item list */}
        <CategoryMenu
          contentContainerStyle={Styles.itemContentContainer}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          titleData={this.state.titleData}
          itemData={this.state.itemData}
          numColumns={this.state.numCols}
          extraData={this.state}
          keyExtractor={(item, index) => item + index}
        />
        {/* cart button bar */}
        <View style={Styles.bottom}>
          <IconBadge
            MainElement={
              <Icon
                name="cart-outline"
                size={40}
                type="material-community"
                color="white"
                iconStyle={Styles.cartIcon}
              />
            }
            BadgeElement={
              <Text style={Styles.iconBadgeText}>{this.state.totalItem}</Text>
            }
            IconBadgeStyle={Styles.iconBadge}
            Hidden={this.state.totalItem === 0}
            extraData={this.state}
          />
          <Text style={Styles.totalPrice}>
            ${this.state.totalPrice.toFixed(2)}
          </Text>
          {this.state.status !== 1 ? (
            // Go to Cart View
            <Button
              disabled={this.state.totalItem === 0}
              title="Cart"
              buttonStyle={Styles.cartButton}
              textStyle={Styles.cartText}
              containerViewStyle={Styles.cartContainerView}
              onPress={() => {
                // navigate to Cart
                navigate("Cart", {
                  orderItems: this._setSelectedItems(),
                  orderNo: this._setOrderNo(),
                  totalItem: this.state.totalItem,
                  totalPrice: this.state.totalPrice,
                  note: this.state.note,
                  tableNum: this.state.tableNo,
                  onBack: this._updateData
                });
              }}
              extraData={this.state}
            />
          ) : (
            // Go to Order View
            <Button
              title="Order"
              buttonStyle={Styles.cartButton}
              textStyle={Styles.cartText}
              containerViewStyle={Styles.cartContainerView}
              onPress={() => {
                let totalItem = 0;
                let totalPrice = 0;
                this.state.orderItems.forEach(item => {
                  totalItem += item.quantity;
                  totalPrice += item.price * item.quantity;
                });
                navigate("Order", {
                  orderItems: this.state.orderItems,
                  orderNo: this.state.orderNo,
                  totalItem: totalItem,
                  totalPrice: totalPrice,
                  note: this.state.note
                });
              }}
            />
          )}
        </View>
      </View>
    );
  }
}
