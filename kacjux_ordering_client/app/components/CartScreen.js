import React, { Component } from "react";
import { Text, View, FlatList, Image } from "react-native";
import { Button } from "react-native-elements";
import Styles from "../styles/StyleSheet";

export default class CartScreen extends Component {
  static navigationOptions = {
    headerTitle: <Text style={Styles.title}>Cart</Text>
  };

  constructor(props) {
    super(props);
    this.state = {
      orderItems: this.props.navigation.getParam("orderItems", null),
      orderNo: this.props.navigation.getParam("orderNo", null)
    };
  }

  // Save order to database
  _submitOrdersHandler = () => {
    // Send request
    this.state.orderItems.forEach(item => {
      // Send each new order to the database
      const quantity = item.quantity;
      const totalPrice = item.price * quantity;
      const orderItem = item.id;
      const note = null;

      const newOrder = {
        OrderNo: this.state.orderNo,
        TotalPrice: `$${totalPrice}`,
        OrderItem: orderItem,
        Quantity: quantity,
        Note: note
      };

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
  };

  // handler for adding an item
  _itemPlusHandler = id => {
    const data = this.state.data.find(d => d.id === id);
    data.quantity++;
    this._addTotalItem();
    this._addTotalPrice(data.price);
    this.setState({ data: this.state.data });
    // increment recursively when holding button
    this.timer = setTimeout(this._itemPlusHandler.bind(this, id), 85);
  };

  // handler for removing an item
  _itemMinusHandler = id => {
    const data = this.state.data.find(d => d.id === id);
    if (data.quantity > 0) {
      data.quantity--;
      this._minusTotalItem();
      this._minusTotalPrice(data.price);
    }
    this.setState({ data: this.state.data });
    // increment recursively when holding button
    this.timer = setTimeout(this._itemMinusHandler.bind(this, id), 85);
  };

  // increment recursively when holding button
  _stopTimer = () => {
    clearTimeout(this.timer);
  };

  // rendering data for item list
  _renderItem = ({ item }) => {
    return (
      <View style={Styles.horizontalView}>
        {/* image */}
        <Image source={item.image} style={Styles.cartItemImage} />
        {/* item title */}
        <Text style={Styles.itemTitle}>{item.key}</Text>
        {/* Price */}
        <Text style={Styles.itemPrice}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
        {/* - counter + */}
        <View style={Styles.itemCounterContainer}>
          <Button
            title="-"
            buttonStyle={Styles.itemButton}
            onPressIn={this._itemMinusHandler.bind(this, item.id)}
            onPressOut={this._stopTimer}
          />
          <View style={Styles.itemNumber}>
            <Text> {item.quantity} </Text>
          </View>
          <Button
            title="+"
            buttonStyle={Styles.itemButton}
            onPressIn={this._itemPlusHandler.bind(this, item.id)}
            onPressOut={this._stopTimer}
          />
        </View>
      </View>
    );
  };

  render() {
    return (
      <View>
        <FlatList data={this.state.orderItems} renderItem={this._renderItem} />
        <Text>{this.state.orderNo}</Text>
      </View>
    );
  }
}
