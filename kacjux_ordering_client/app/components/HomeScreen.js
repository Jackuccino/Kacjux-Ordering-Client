import React, { Component } from "react";
import { Alert, Text, View, Image, FlatList } from "react-native";

import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Entypo";
import IconBadge from "react-native-icon-badge";

import Styles from "../styles/StyleSheet";
import { postNewOrder, getAllItems } from "../services/Server";
import { getImage } from "../helper/ImageHelper";

export default class HomeScreen extends Component {
  static navigationOptions = {
    headerTitle: <Text style={Styles.title}>Table# 1</Text>,
    headerRight: (
      <View style={Styles.headerView}>
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
      tableNo: 1
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
              amount: 0
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
        <View style={Styles.itemTitlePrice}>
          <Text style={Styles.itemDescription}>{item.description}</Text>
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

  // return a list of selected items
  _getSelectedItems = () => {
    return this.state.data.filter(d => d.amount != 0);
  };

  // return a string of current day+month
  _getDate = () => {
    const date = new Date();
    return (
      (date.getMonth() + 1).toString() +
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
          <Button
            title="Cart"
            buttonStyle={Styles.cartButton}
            textStyle={Styles.cartText}
            containerViewStyle={Styles.cartContainerView}
            onPress={() =>
              navigate("Cart", {
                orderItems: this._getSelectedItems(),
                orderNo: this.state.tableNo.toString() + this._getDate()
              })
            }
          />
        </View>
      </View>
    );
  }
}
