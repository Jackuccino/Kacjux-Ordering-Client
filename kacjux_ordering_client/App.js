import React, { Component } from "react";
import { Alert, Text, View, Image } from "react-native";

import SubmitOrders from "./app/components/SubmitOrders";
import DishList from "./app/components/DishList";
import Styles from "./app/styles/StyleSheet";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Entypo";
import IconBadge from "react-native-icon-badge";

import { postNewOrder } from "./app/services/Server";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 1,
          key: "Mar Far Chichen",
          image: require("./app/assets/images/mfch.png"),
          price: 10.25,
          amount: 0
        },
        {
          id: 2,
          key: "Lemon Chichen",
          image: require("./app/assets/images/lemonch.jpg"),
          price: 11.75,
          amount: 0
        },
        {
          id: 3,
          key: "Sesame Chichen",
          image: require("./app/assets/images/sesamech.jpg"),
          price: 11.5,
          amount: 0
        },
        {
          id: 4,
          key: "Barbeque Pork",
          image: require("./app/assets/images/bbqpork.jpg"),
          price: 8.5,
          amount: 0
        },
        {
          id: 5,
          key: "Pot Stickers",
          image: require("./app/assets/images/potsticker.jpg"),
          price: 9.75,
          amount: 0
        }
      ],
      numCols: 2,
      totalPrice: 0,
      totalItem: 0
    };
    this.timer = null;
  }

  // handler for adding an item
  _itemPlusHandler = id => {
    const data = this.state.data.find(d => d.id === id);
    data.amount++;
    this._addTotalItem();
    this._addTotalPrice(data.price);
    this.setState({ data: this.state.data });
    // increment recursively when holding button
    this.timer = setTimeout(this._itemPlusHandler.bind(this, id), 85);
  };

  // handler for removing an item
  _itemMinusHandler = id => {
    const data = this.state.data.find(d => d.id === id);
    if (data.amount > 0) {
      data.amount--;
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

  _addTotalPrice = price => {
    this.setState({ totalPrice: this.state.totalPrice + price });
  };

  _minusTotalPrice = price => {
    this.setState({ totalPrice: this.state.totalPrice - price });
  };

  _addTotalItem = () => {
    this.setState({ totalItem: this.state.totalItem + 1 });
  };

  _minusTotalItem = () => {
    this.setState({ totalItem: this.state.totalItem - 1 });
  };

  // rendering data for item list
  _renderItem = ({ item }) => {
    return (
      <View style={Styles.itemGrid}>
        {/* image */}
        <Image
          source={item.image}
          height="100"
          width="200"
          style={Styles.itemImage}
        />
        <View style={Styles.itemTitlePrice}>
          {/* title */}
          <Text style={Styles.itemTitle}>{item.key}</Text>
          {/* Price */}
          <Text style={Styles.itemPrice}>${item.price.toFixed(2)}</Text>
        </View>
        {/* - counter + */}
        <View style={Styles.itemCounterContainer}>
          <Button
            title="-"
            buttonStyle={Styles.itemButton}
            onPressIn={this._itemMinusHandler.bind(this, item.id)}
            onPressOut={this._stopTimer}
          />
          <View style={Styles.itemNumber}>
            <Text> {item.amount} </Text>
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

  // fetch data to database
  _submitOrdersHandler = () => {
    // Send request
    const orderItems = this.state.data.filter(d => d.amount != 0);
    orderItems.forEach(item => {
      // Send each new order to the database
      const quantity = item.amount;
      const totalPrice = item.price * quantity;
      const orderItem = item.id;
      const note = null;

      const newOrder = {
        OrderNo: 1,
        TotalPrice: `$${totalPrice}`,
        OrderItem: orderItem,
        Quantity: quantity,
        Note: note
      };

      postNewOrder(newOrder)
        .then(res => {
          if (res.result === "ok") {
            // success
          } else {
            // failure
          }
        })
        .catch(error => {
          // post failed
        });
    });
  };

  render() {
    return (
      <View style={Styles.container}>
        {/* page title */}
        <View style={Styles.top}>
          <Text style={Styles.title}>Prototype: Submit an Order</Text>
        </View>
        {/* item list */}
        <DishList
          data={this.state.data}
          renderItem={this._renderItem}
          numColumns={this.state.numCols}
          extraData={this.state}
        />
        {/* submit button */}
        <View style={Styles.bottom}>
          <IconBadge
            MainElement={
              <Icon name="shopping-cart" size={40} style={Styles.cartIcon} />
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
          <SubmitOrders onSubmitOrders={this._submitOrdersHandler} />
        </View>
      </View>
    );
  }
}
