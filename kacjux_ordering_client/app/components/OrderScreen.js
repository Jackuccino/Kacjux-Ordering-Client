/*************************************************************
 * Order Summary Page
 *
 * Author:		JinJie Xu
 * Date Created:	2/1/2019
 **************************************************************/

import React, { Component } from "react";
import {
  ScrollView,
  View,
  FlatList,
  TextInput,
  Image,
  Text,
  Alert
} from "react-native";
import { Button, Icon } from "react-native-elements";
import {
  cancelOrder,
  modifyOrder,
  deleteItemFromOrder,
  postNewOrder
} from "../services/Server";
import Styles from "../styles/StyleSheet";

export default class OrderScreen extends Component {
  // Render the header of the navigation bar
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Text style={Styles.title}>
        Order Number: {navigation.getParam("orderNo", null)}
      </Text>
    ),
    headerLeft: (
      <Icon
        name={"arrow-back"}
        onPress={() => {
          navigation.goBack();
          navigation.state.params.onBack(
            navigation.getParam("orderItems", null),
            0,
            0,
            1,
            navigation.getParam("note", ""),
            navigation.getParam("orderNo", null)
          );
        }}
      />
    ),
    headerRight:
      navigation.getParam("editable", null) === true ? (
        <Icon
          name="done"
          color="green"
          type="material-icons"
          size={30}
          iconStyle={{ marginRight: 20 }}
          onPress={() => {
            navigation.setParams({
              editable: false
            });
          }}
        />
      ) : (
        <Icon
          name="circle-edit-outline"
          color="red"
          type="material-community"
          size={30}
          iconStyle={{ marginRight: 20 }}
          onPress={() => {
            Alert.alert(
              "Warning",
              "Changes will be saved immediately. Continue?",
              [
                {
                  text: "Cancel",
                  onPress: () => (confirm = false),
                  style: "cancel"
                },
                {
                  text: "Yes",
                  onPress: () => {
                    navigation.setParams({
                      editable: true
                    });
                  }
                }
              ],
              { cancelable: false }
            );
          }}
        />
      )
  });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      // Holds the selected items and gets from navigation parameter
      orderItems: navigation.getParam("orderItems", null),
      // Holds the order number and gets from navigation parameter
      orderNo: navigation.getParam("orderNo", null)
    };

    const newOrderItems = navigation.getParam("newOrderItems", null);
    if (Array.isArray(newOrderItems) && newOrderItems.length > 0) {
      newOrderItems.forEach(item => {
        const check = this.state.orderItems.filter(oi => oi.id === item.id);
        if (check.length === 0) {
          this.state.orderItems = this.state.orderItems.concat(
            JSON.parse(JSON.stringify(item))
          );
          this._submitOrdersHandler(item);
        } else {
          check.forEach(checkItem => {
            checkItem.quantity += item.quantity;
            this._modifyOrderHandler(checkItem, 3);
          });
        }
      });
      navigation.setParams({ orderItems: this.state.orderItems });
    }
  }

  /************************************************************
   * Purpose:
   *    Call api and post the new order to the database
   * Params:
   *    N/A
   * Returns:
   *    N/A
   *************************************************************/
  _submitOrdersHandler = async item => {
    const { navigation } = this.props;

    let success = false;

    // Note and table number is the same for each item, so define before loop
    const note = navigation.getParam("note", "");
    const tableNum = navigation.getParam("tableNum", 1);
    const orderNo = this.state.orderNo;

    // Send request
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

    if (!success) {
      navigation.goBack();
    }
  };

  /************************************************************
   * Purpose:
   *    Call api and modify the order to the database
   * Params:
   *    N/A
   * Returns:
   *    N/A
   *************************************************************/
  _modifyOrderHandler = async (item, flag) => {
    let success = false;
    // Create an Order object
    const newOrder = {
      Quantity: item.quantity,
      OrderItem: item.id
    };

    await modifyOrder(this.state.orderNo, newOrder)
      .then(res => {
        if (res.ok) {
          success = true;
        } else {
          success = false;
          console.log("Modify order failed.");
        }
      })
      .catch(err => {
        console.log(err);
      });

    if (!success) {
      // flag 1 means adding item
      if (flag === 1) this._itemMinusHandler(item);
      else this._itemPlusHandler(item);
    }
  };

  /************************************************************
   * Purpose:
   *    Call api and delete item from the order to the database
   * Params:
   *    N/A
   * Returns:
   *    N/A
   *************************************************************/
  _deleteItemFromOrderHandler = async item => {
    let success = false;
    // Create an Order object
    const newOrder = {
      OrderItem: item.id
    };

    await deleteItemFromOrder(this.state.orderNo, newOrder)
      .then(res => {
        if (res.ok) {
          success = true;
        } else {
          success = false;
          console.log("Delete item from order failed.");
        }
      })
      .catch(err => {
        console.log(err);
      });

    // If failed
    if (!success) this._itemPlusHandler(item);
  };

  /************************************************************
   * Purpose:
   *    Delete the order from the database
   * Params:
   *    N/A
   * Returns:
   *    N/A
   *************************************************************/
  _cancelOrderHandler = async () => {
    Alert.alert(
      "Warning",
      "The order will be deleted. Continue?",
      [
        {
          text: "Cancel",
          onPress: () => (confirm = false),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            let success = false;
            await cancelOrder(this.state.orderNo)
              .then(res => {
                if (res.ok) {
                  success = true;
                } else {
                  success = false;
                  console.log("Delete order failed.");
                }
              })
              .catch(err => {
                console.log(err);
              });

            if (success) {
              const { navigation } = this.props;
              navigation.goBack();
              // 1 means order submitted
              navigation.state.params.onBack(null, 0, 0, 0, "", 0);
            }
          }
        }
      ],
      { cancelable: false }
    );
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
    this._modifyOrderHandler(item, 1);

    // increment recursively when holding button
    //this.timer = setTimeout(this._itemPlusHandler.bind(this, item), 85);
  };

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
      if (item.quantity > 0) this._modifyOrderHandler(item, 0);
      else this._deleteItemFromOrderHandler(item);
    }

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
      this._cancelOrderHandler();
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

    // delete from database as well
    this._deleteItemFromOrderHandler(item);
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
    const { navigation } = this.props;
    return item.quantity === 0 ? null : navigation.getParam(
        "editable",
        null
      ) === true ? (
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
    ) : (
      <View style={Styles.cartItemList}>
        {/* Quantity */}
        <View style={Styles.summaryItemQuantity}>
          <Text> {item.quantity} x </Text>
        </View>
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
      </View>
    );
  };

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
              extraData={this.props.navigation}
            />
          </View>
        </ScrollView>
        <View>
          {/* cart note */}
          <TextInput
            editable={false}
            style={Styles.textAreaContainer}
            underlineColorAndroid="transparent"
            multiline={true}
            numberOfLines={10}
            value={navigation.getParam("note", "")}
            scrollEnabled={true}
          />
        </View>
        {/* cancel button bar */}
        <View style={Styles.bottom}>
          <Text style={[Styles.totalPrice, { marginLeft: 45 }]}>Total: </Text>
          <Text style={Styles.totalPrice}>
            ${navigation.getParam("totalPrice", 0).toFixed(2)}
          </Text>
          <Button
            title="Cancel"
            buttonStyle={Styles.cartButton}
            textStyle={Styles.cartText}
            containerViewStyle={Styles.cartContainerView}
            onPress={this._cancelOrderHandler}
          />
        </View>
      </ScrollView>
    );
  }
}
