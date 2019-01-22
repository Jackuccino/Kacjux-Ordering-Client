import React, { Component } from "react";
import { Text, View, FlatList, Image, Button } from "react-native";
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
    orderItems.forEach(item => {
      // Send each new order to the database
      const quantity = item.amount;
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

  // rendering data for item list
  _renderItem = ({ item }) => {
    return (
      <View>
        <Text>{item.key}</Text>
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
