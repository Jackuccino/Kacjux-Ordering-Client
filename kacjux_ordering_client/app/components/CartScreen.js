/*************************************************************
 * Cart page
 *
 * Author:		JinJie Xu
 * Date Created:	2/1/2019
 **************************************************************/

import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  ScrollView
} from "react-native";
import { Button, Icon } from "react-native-elements";
import IconBadge from "react-native-icon-badge";
import Styles from "../styles/StyleSheet";

import { postNewOrder } from "../services/Server";

export default class CartScreen extends Component {
  // Render the header of the navigation bar
  static navigationOptions = ({ navigation }) => ({
    headerTitle: <Text style={Styles.title}>Cart</Text>,
    headerLeft: (
      <Icon
        name={"arrow-back"}
        onPress={() => {
          navigation.goBack();
          navigation.state.params.onBack(
            null,
            navigation.getParam("totalItem", 0),
            navigation.getParam("totalPrice", 0),
            0,
            navigation.getParam("note", ""),
            navigation.getParam("orderNo", null)
          );
        }}
      />
    )
  });

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
    const { navigation } = this.props;
    this.state = {
      // Holds the selected items and gets from navigation parameter
      orderItems: navigation.getParam("orderItems", null),
      // Holds the order number and gets from navigation parameter
      orderNo: navigation.getParam("orderNo", null)
    };
  }

  /************************************************************
   * Purpose:
   *    Call api and post the order to the database
   * Params:
   *    N/A
   * Returns:
   *    N/A
   *************************************************************/
  _submitOrdersHandler = async () => {
    const { navigation } = this.props;

    // Make a deep copy of the order items before changing quantities to 0
    const copyOrderItems = JSON.parse(JSON.stringify(this.state.orderItems));
    let success = false;

    // Note and table number is the same for each item, so define before loop
    const note = navigation.getParam("note", "");
    const tableNum = navigation.getParam("tableNum", 1);
    const orderNo = this.state.orderNo;

    // Send request
    for (const item of this.state.orderItems) {
      // Send each new order to the database
      const quantity = item.quantity;
      const totalPrice = item.price * quantity;
      const orderItem = item.id;

      // Create an Order object
      const newOrder = {
        OrderNo: orderNo,
        TotalPrice: `$${totalPrice}`,
        OrderItem: orderItem,
        Quantity: quantity,
        Note: note,
        TableNum: tableNum
      };

      // Call api and save to database
      await postNewOrder(newOrder)
        .then(res => {
          if (res.ok) {
            success = true;
          } else {
            success = false;
            console.log("Place order failed.");
          }
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (success) {
      navigation.goBack();
      // 1 means order submitted
      navigation.state.params.onBack(copyOrderItems, 0, 0, 1, note, orderNo);
    }
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
    // Tell counter to update the orderItem
    this.setState({ orderItem: this.state.orderItems });

    // increment recursively when holding button
    //this.timer = setTimeout(this._itemPlusHandler.bind(this, item), 85);
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
    // If the total item is 1, which means this is the last item to be deleted
    // Go back to home screen since the cart will be empty
    const { navigation } = this.props;
    if (navigation.getParam("totalItem", 0) === 1) {
      navigation.goBack();
      navigation.state.params.onBack(0, 0, 0, navigation.getParam("note", ""));
    }

    if (item.quantity > 0) {
      item.quantity--;
      this._minusTotalItem();
      this._minusTotalPrice(item.price);
    }
    // Tell counter to update the orderItem
    this.setState({ orderItem: this.state.orderItems });

    // increment continuously when holding button
    //this.timer = setTimeout(this._itemMinusHandler.bind(this, item), 85);
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
    const { navigation } = this.props;
    navigation.setParams({
      totalPrice: navigation.getParam("totalPrice", 0) + price
    });
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
    const { navigation } = this.props;
    navigation.setParams({
      totalPrice: navigation.getParam("totalPrice", 0) - price
    });
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
    const { navigation } = this.props;
    navigation.setParams({
      totalItem: navigation.getParam("totalItem", 0) + 1
    });
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
    const { navigation } = this.props;
    navigation.setParams({
      totalItem: navigation.getParam("totalItem", 0) - 1
    });
  };

  /************************************************************
   * Purpose:
   *    Delete an item from the cart
   * Params:
   *    N/A
   * Returns:
   *    N/A
   *************************************************************/
  _deleteItem = item => {
    const { navigation } = this.props;
    const totalItem = navigation.getParam("totalItem", 0);

    // Same as _itemMinusHandler
    // If the total item is 1, which means this is the last item to be deleted
    // Go back to home screen since the cart will be empty
    if (totalItem - item.quantity === 0) {
      navigation.goBack();
      navigation.state.params.onBack(0, 0, 0, navigation.getParam("note", ""));
    }

    const totalPrice = navigation.getParam("totalPrice", 0);

    // Update total number of items
    if (totalItem > 0) {
      navigation.setParams({
        totalItem: totalItem - item.quantity
      });
    }

    // Update total price
    if (totalPrice > 0) {
      navigation.setParams({
        totalPrice: totalPrice - (item.quantity * item.price).toFixed(2)
      });
    }

    // Quantity of the item is set to 0 because the entire item is deleted
    item.quantity = 0;

    // Tell counter to update the orderItem
    this.setState({ orderItem: this.state.orderItems });
  };

  /************************************************************
   * Purpose:
   *    Render items in the FlatList
   * Params:
   *    item: the corresponding item in the FlatList
   * Returns:
   *    N/A
   *************************************************************/
  _renderItem = ({ item }) => {
    return item.quantity === 0 ? null : (
      <View style={Styles.cartItemList}>
        {/* image */}
        <Image
          borderRadius={50}
          source={{ uri: item.image }}
          style={Styles.cartItemImage}
        />
        {/* item title */}
        <Text style={Styles.itemTitle}>{item.key}</Text>
        {/* Price */}
        <Text style={Styles.itemPrice}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
        {/* - counter + */}
        <View style={Styles.itemCounterContainer}>
          <Button
            icon={{ name: "remove" }}
            containerViewStyle={{ borderRadius: 30 }}
            borderRadius={30}
            buttonStyle={Styles.itemMinusButton}
            onPress={this._itemMinusHandler.bind(this, item)}
            //onPressIn={this._itemMinusHandler.bind(this, item.id)}
            //onPressOut={this._stopTimer}
          />
          <View style={Styles.itemNumber}>
            <Text> {item.quantity} </Text>
          </View>
          <Button
            icon={{ name: "add" }}
            containerViewStyle={{ borderRadius: 30 }}
            borderRadius={30}
            buttonStyle={Styles.itemPlusButton}
            onPress={this._itemPlusHandler.bind(this, item)}
            //onPressIn={this._itemPlusHandler.bind(this, item.id)}
            //onPressOut={this._stopTimer}
          />
        </View>
        {/* Trash Icon (delete) */}
        <Icon
          name="delete-outline"
          color="red"
          type="material-community"
          size={40}
          onPress={this._deleteItem.bind(this, item)}
        />
      </View>
    );
  };

  /************************************************************
   * Purpose:
   *    Render the cart page
   * Params:
   *    N/A
   * Returns:
   *    N/A
   *************************************************************/
  render() {
    const { navigation } = this.props;
    return (
      <ScrollView contentContainerStyle={Styles.scrollViewStyle}>
        <ScrollView>
          {/* cart item list */}
          <View>
            <FlatList
              data={this.state.orderItems}
              renderItem={this._renderItem}
              extraData={this.state}
            />
          </View>
        </ScrollView>
        <View>
          {/* cart note */}
          <TextInput
            style={Styles.textAreaContainer}
            underlineColorAndroid="transparent"
            placeholder="Special note here..."
            placeholderTextColor="grey"
            multiline={true}
            numberOfLines={10}
            maxLength={999}
            onChangeText={text => {
              navigation.setParams({ note: text });
            }}
            value={navigation.getParam("note", "")}
            scrollEnabled={true}
          />
        </View>
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
              <Text style={Styles.iconBadgeText}>
                {navigation.getParam("totalItem", 0)}
              </Text>
            }
            IconBadgeStyle={Styles.iconBadge}
            extraData={this.state}
          />
          <Text style={Styles.totalPrice}>
            ${navigation.getParam("totalPrice", 0).toFixed(2)}
          </Text>
          <Button
            title="Submit"
            buttonStyle={Styles.submitButton}
            textStyle={Styles.cartText}
            containerViewStyle={Styles.cartContainerView}
            onPress={this._submitOrdersHandler}
          />
        </View>
      </ScrollView>
    );
  }
}
