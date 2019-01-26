import React, { Component } from "react";
import { Alert, Text, View, Image, FlatList } from "react-native";

import { Button, Icon } from "react-native-elements";
import IconBadge from "react-native-icon-badge";

import Styles from "../styles/StyleSheet";
import { getAllItems } from "../services/Server";
import { getImage } from "../helper/ImageHelper";

export default class HomeScreen extends Component {
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

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      numCols: 2,
      totalPrice: 0,
      totalItem: 0,
      tableNo: 1,
      status: 0
    };
    this.timer = null;
    this._getItems();
  }

  _getItems = () => {
    // api get
    const result = getAllItems()
      .then(res => {
        if (res.result === "ok") {
          const items = res.items;
          items.forEach(item => {
            const data = {
              id: item.ItemId,
              key: item.Key,
              image: getImage(item.Key),
              description: item.Description,
              price: parseFloat(item.Price.replace("$", "")),
              type: item.Type,
              quantity: 0
            };
            this.state.data.push(data);
          });
          this.setState({ data: this.state.data });
        } else {
          console.log("Get items failed.");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Update quantity and total prices after changing those in the cart
  _updateData = (data, status) => {
    var totalItem = 0;
    var totalPrice = 0;
    data.forEach(newData => {
      const oldData = this.state.data.find(d => d.id == newData.id);
      oldData.quantity = newData.quantity;
    });

    this.state.data.forEach(newData => {
      totalItem += newData.quantity;
      totalPrice += newData.quantity * newData.price;
    });

    this.setState({
      data: this.state.data,
      totalItem: totalItem,
      totalPrice: totalPrice,
      status: status
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
        <Image source={item.image} style={Styles.itemImage} />
        <View style={Styles.itemTitlePrice}>
          {/* title */}
          <Text style={Styles.itemTitle}>{item.key}</Text>
          {/* Price */}
          <Text style={Styles.itemPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <View style={Styles.itemTitlePrice}>
          <Text style={Styles.itemDescription}>{item.description}</Text>
        </View>
        {/* - counter + */}
        <View style={Styles.itemCounterContainer}>
          <Button
            icon={{
              name: "remove",
              size: 15
            }}
            buttonStyle={Styles.itemButton}
            onPressIn={this._itemMinusHandler.bind(this, item.id)}
            onPressOut={this._stopTimer}
          />
          <View style={Styles.itemNumber}>
            <Text> {item.quantity} </Text>
          </View>
          <Button
            icon={{
              name: "add",
              size: 15
            }}
            containerViewStyle={{ borderRadius: 30 }}
            borderRadius={30}
            buttonStyle={Styles.itemButton}
            onPressIn={this._itemPlusHandler.bind(this, item.id)}
            onPressOut={this._stopTimer}
          />
        </View>
      </View>
    );
  };

  // return a list of selected items
  _getSelectedItems = () => {
    return this.state.data.filter(d => d.quantity != 0);
  };

  // return a string of current day+month
  _getDate = () => {
    const date = new Date();
    return (
      (date.getMonth() + 1).toLocaleString("en-us", { month: "long" }) +
      date.getDate().toString() +
      date.getHours().toString() +
      date.getMinutes().toString()
    );
  };

  // Main()
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={Styles.container}>
        {/* item list */}
        <View>
          <FlatList
            contentContainerStyle={Styles.itemContentContainer}
            data={this.state.data}
            renderItem={this._renderItem}
            numColumns={this.state.numCols}
            extraData={this.state}
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
          {this.state.status == 0 ? (
            <Button
              disabled={this.state.totalItem === 0}
              title="Cart"
              buttonStyle={Styles.cartButton}
              textStyle={Styles.cartText}
              containerViewStyle={Styles.cartContainerView}
              onPress={() =>
                navigate("Cart", {
                  orderItems: this._getSelectedItems(),
                  orderNo: this.state.tableNo.toString() + this._getDate(),
                  totalItem: this.state.totalItem,
                  totalPrice: this.state.totalPrice,
                  onBack: this._updateData
                })
              }
            />
          ) : (
            <Button
              disabled={this.state.totalItem === 0}
              title="Order"
              buttonStyle={Styles.cartButton}
              textStyle={Styles.cartText}
              containerViewStyle={Styles.cartContainerView}
              onPress={() =>
                navigate("Cart", {
                  orderItems: this._getSelectedItems(),
                  orderNo: this.state.tableNo.toString() + this._getDate(),
                  totalItem: this.state.totalItem,
                  totalPrice: this.state.totalPrice,
                  status: this.state.status,
                  onBack: this._updateData
                })
              }
            />
          )}
        </View>
      </View>
    );
  }
}
