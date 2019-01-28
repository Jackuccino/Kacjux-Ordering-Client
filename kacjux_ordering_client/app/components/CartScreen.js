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
            navigation.getParam("orderItems", null),
            navigation.getParam("status", 0)
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
      orderNo: navigation.getParam("orderNo", null),
      totalItem: navigation.getParam("totalItem", 0),
      totalPrice: navigation.getParam("totalPrice", 0),
      note: ""
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
      const note = this.state.note;

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

    const { navigation } = this.props;
    navigation.goBack();
    // 1 means order submitted
    navigation.state.params.onBack(navigation.getParam("orderItems", null), 1);
  };

  // handler for adding an item
  _itemPlusHandler = id => {
    const data = this.state.orderItems.find(d => d.id === id);
    data.quantity++;
    this._addTotalItem();
    this._addTotalPrice(data.price);
    this.setState({ orderItems: this.state.orderItems });
    this.props.navigation.setParams({ orderItems: this.state.orderItems });
    // increment recursively when holding button
    this.timer = setTimeout(this._itemPlusHandler.bind(this, id), 85);
  };

  // handler for removing an item
  _itemMinusHandler = id => {
    const data = this.state.orderItems.find(d => d.id === id);
    if (data.quantity > 0) {
      data.quantity--;
      this._minusTotalItem();
      this._minusTotalPrice(data.price);
    }
    this.setState({ orderItems: this.state.orderItems });
    this.props.navigation.setParams({ orderItems: this.state.orderItems });
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

  // delete items in cart
  _deleteItem = id => {
    const item = this.state.orderItems.find(i => i.id == id);
    if (this.state.totalItem > 0) {
      this.state.totalItem -= item.quantity;
    }
    if (this.state.totalPrice > 0) {
      this.state.totalPrice -= (item.quantity * item.price).toFixed(2);
    }
    item.quantity = 0;
    this.setState({
      orderItems: this.state.orderItems,
      totalItem: this.state.totalItem,
      totalPrice: this.state.totalPrice
    });
    this.props.navigation.setParams({ orderItems: this.state.orderItems });
  };

  // rendering data for item list
  _renderItem = ({ item }) => {
    return item.quantity == 0 ? null : (
      <View style={Styles.cartItemList}>
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
            icon={{ name: "remove" }}
            buttonStyle={Styles.itemButton}
            onPressIn={this._itemMinusHandler.bind(this, item.id)}
            onPressOut={this._stopTimer}
          />
          <View style={Styles.itemNumber}>
            <Text> {item.quantity} </Text>
          </View>
          <Button
            icon={{ name: "add" }}
            buttonStyle={Styles.itemButton}
            onPressIn={this._itemPlusHandler.bind(this, item.id)}
            onPressOut={this._stopTimer}
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
    return (
      <ScrollView contentContainerStyle={Styles.scrollViewStyle}>
        <ScrollView>
          {/* cart item list */}
          <View>
            <FlatList
              contentContainerStyle={Styles.itemContentContainer}
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
              this.setState({ note: text });
            }}
            value={this.state.note}
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
              <Text style={Styles.iconBadgeText}>{this.state.totalItem}</Text>
            }
            IconBadgeStyle={Styles.iconBadge}
            Hidden={this.state.totalItem === 0}
            extraData={this.state}
          />
          <Text style={Styles.totalPrice}>
            ${this.state.totalPrice.toFixed(2)}
          </Text>
          <Button
            disabled={this.state.totalItem === 0}
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
