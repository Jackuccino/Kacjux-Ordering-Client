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
  // Header bar
  static navigationOptions = ({ navigation }) => ({
    headerTitle: <Text style={Styles.title}>Cart</Text>,
    headerLeft: (
      <Icon
        name={"arrow-back"}
        onPress={() => {
          navigation.goBack();
          navigation.state.params.onBack(
            navigation.getParam("totalItem", 0),
            navigation.getParam("totalPrice", 0),
            0,
            navigation.getParam("note", "")
          );
        }}
      />
    )
  });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      orderItems: navigation.getParam("orderItems", null),
      orderNo: navigation.getParam("orderNo", null)
    };
  }

  // Save order to database
  _submitOrdersHandler = () => {
    const { navigation } = this.props;

    // Send request
    this.state.orderItems.forEach(item => {
      // Send each new order to the database
      const quantity = item.quantity;
      item.quantity = 0;
      const totalPrice = item.price * quantity;
      const orderItem = item.id;
      const note = navigation.getParam("note", "");
      const tableNum = navigation.getParam("tableNum", 1);

      // Create an Order object
      const newOrder = {
        OrderNo: this.state.orderNo,
        TotalPrice: `$${totalPrice}`,
        OrderItem: orderItem,
        Quantity: quantity,
        Note: note,
        TableNum: tableNum
      };

      // Call api and save to database
      postNewOrder(newOrder)
        .then(res => {
          if (res.result === "ok") {
            // success
            // go to order view
          } else {
            console.log("Place order failed.");
          }
        })
        .catch(err => {
          console.log(err);
        });
    });

    navigation.goBack();
    // 1 means order submitted
    navigation.state.params.onBack(0, 0, 1, "");
  };

  // handler for adding an item
  _itemPlusHandler = id => {
    const data = this.state.orderItems.find(d => d.id === id);
    data.quantity++;
    this._addTotalItem();
    this._addTotalPrice(data.price);
    // Tell counter to update the orderItem
    this.setState({ orderItem: this.state.orderItems });

    // increment recursively when holding button
    //this.timer = setTimeout(this._itemPlusHandler.bind(this, id), 85);
  };

  // handler for removing an item
  _itemMinusHandler = id => {
    const { navigation } = this.props;
    if (navigation.getParam("totalItem", 0) === 1) {
      navigation.goBack();
      navigation.state.params.onBack(0, 0, 0, navigation.getParam("note", ""));
    }

    const data = this.state.orderItems.find(d => d.id === id);
    if (data.quantity > 0) {
      data.quantity--;
      this._minusTotalItem();
      this._minusTotalPrice(data.price);
    }
    // Tell counter to update the orderItem
    this.setState({ orderItem: this.state.orderItems });

    // increment recursively when holding button
    //this.timer = setTimeout(this._itemMinusHandler.bind(this, id), 85);
  };

  // increment recursively when holding button
  // _stopTimer = () => {
  //   clearTimeout(this.timer);
  // };

  _addTotalPrice = price => {
    const { navigation } = this.props;
    navigation.setParams({
      totalPrice: navigation.getParam("totalPrice", 0) + price
    });
  };

  _minusTotalPrice = price => {
    const { navigation } = this.props;
    navigation.setParams({
      totalPrice: navigation.getParam("totalPrice", 0) - price
    });
  };

  _addTotalItem = () => {
    const { navigation } = this.props;
    navigation.setParams({
      totalItem: navigation.getParam("totalItem", 0) + 1
    });
  };

  _minusTotalItem = () => {
    const { navigation } = this.props;
    navigation.setParams({
      totalItem: navigation.getParam("totalItem", 0) - 1
    });
  };

  // delete items in cart
  _deleteItem = id => {
    const { navigation } = this.props;
    if (navigation.getParam("totalItem", 0) === 1) {
      navigation.goBack();
      navigation.state.params.onBack(0, 0, 0, navigation.getParam("note", ""));
    }

    const item = this.state.orderItems.find(i => i.id == id);
    const totalItem = navigation.getParam("totalItem", 0);
    const totalPrice = navigation.getParam("totalPrice", 0);

    if (totalItem > 0) {
      navigation.setParams({
        totalItem: totalItem - item.quantity
      });
    }
    if (totalPrice > 0) {
      navigation.setParams({
        totalPrice: totalPrice - (item.quantity * item.price).toFixed(2)
      });
    }
    item.quantity = 0;

    // Tell counter to update the orderItem
    this.setState({ orderItem: this.state.orderItems });
  };

  // rendering data for item list
  _renderItem = ({ item }) => {
    return item.quantity == 0 ? null : (
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
            onPress={this._itemMinusHandler.bind(this, item.id)}
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
            onPress={this._itemPlusHandler.bind(this, item.id)}
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
          onPress={this._deleteItem.bind(this, item.id)}
        />
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
