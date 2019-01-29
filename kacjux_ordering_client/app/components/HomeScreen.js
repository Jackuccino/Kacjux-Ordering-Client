import React, { Component } from "react";
import { Text, View, Image, FlatList, SectionList } from "react-native";

import { Button, Icon } from "react-native-elements";
import IconBadge from "react-native-icon-badge";

import Styles from "../styles/StyleSheet";
import { getAllItems } from "../services/Server";
import { getImage } from "../helper/ImageHelper";
import CategoryMenu from "./CategoryMenu";

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
      titleData: [
        { key: "APPETIZERS" },
        { key: "SELECTED DELICIOUS CUISINE" },
        { key: "FAMILY STYLE DINNERS" },
        { key: "HOT SPICY & HOUSE SPECIALS" },
        { key: "COMBINATION PLATES" },
        { key: "VEGETABLE & TOFU DISHES" },
        { key: "RICE" },
        { key: "CHOW MEIN OR CHOP SUEY" },
        { key: "EGG FOO YOUNG" },
        { key: "SOUP, WON TONS & NOODLES" },
        { key: "FOR OUR LITTLE FRIENDS" },
        { key: "FROM THE BROILER" },
        { key: "FROM THE GRILL" },
        { key: "SANDWICHES" },
        { key: "SALAD" },
        { key: "SOUP" },
        { key: "DESSERT" },
        { key: "BEVERAGE" },
        { key: "LUNCH SPECIAL" }
      ],
      itemData: [],
      numCols: 2,
      totalPrice: 0,
      totalItem: 0,
      tableNo: 1,
      status: 0,
      note: ""
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
            // For FlatList
            this.state.itemData.push(data);

            // For SectionList
            // const section = this.state.data.find(d => d.title == data.type);
            // if (section === null) {
            //   section = { title: data.type, data: [] };
            //   this.state.data.push(section);
            // }
            // section.data.push(data);
          });
          this.setState({ data: this.state.itemData });
        } else {
          console.log("Get items failed.");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // Update quantity and total prices after changing those in the cart
  _updateData = (data, status, note) => {
    var totalItem = 0;
    var totalPrice = 0;
    data.forEach(newData => {
      const oldData = this.state.itemData.find(d => d.id === newData.id);
      oldData.quantity = newData.quantity;
    });

    this.state.itemData.forEach(newData => {
      totalItem += newData.quantity;
      totalPrice += newData.quantity * newData.price;
    });

    this.setState({
      data: this.state.itemData,
      totalItem: totalItem,
      totalPrice: totalPrice,
      status: status,
      note: note
    });
  };

  // handler for adding an item
  _itemPlusHandler = id => {
    const data = this.state.itemData.find(d => d.id === id);
    data.quantity++;
    this._addTotalItem();
    this._addTotalPrice(data.price);
    this.setState({ data: this.state.itemData });
    // increment recursively when holding button
    this.timer = setTimeout(this._itemPlusHandler.bind(this, id), 85);
  };

  // handler for removing an item
  _itemMinusHandler = id => {
    const data = this.state.itemData.find(d => d.id === id);
    if (data.quantity > 0) {
      data.quantity--;
      this._minusTotalItem();
      this._minusTotalPrice(data.price);
    }
    this.setState({ data: this.state.itemData });
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
    if (item.type === "empty") {
      return <View disabled style={[Styles.itemGrid, Styles.itemInvisible]} />;
    }
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
    return this.state.itemData.filter(d => d.quantity !== 0);
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

  // Add empty object to the last row if uneven
  _formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({
        id: -1,
        key: "",
        image: null,
        description: "",
        price: 0,
        type: "empty",
        quantity: 0
      });
      numberOfElementsLastRow++;
    }

    return data;
  };

  // Main()
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={Styles.container}>
        {/* item list */}
        <CategoryMenu
          contentContainerStyle={Styles.itemContentContainer}
          titleData={this.state.titleData}
          itemData={this._formatData(this.state.itemData, this.state.numCols)}
          renderItem={this._renderItem}
          numColumns={this.state.numCols}
          extraData={this.state}
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
          {this.state.status == 0 ? (
            //  Go to Cart View
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
                  note: this.state.note,
                  onBack: this._updateData
                })
              }
            />
          ) : (
            //Go to Order View
            <Button
              disabled={this.state.totalItem === 0}
              title="Order"
              buttonStyle={Styles.cartButton}
              textStyle={Styles.cartText}
              containerViewStyle={Styles.cartContainerView}
              onPress={() => navigate("OrderView", {})}
            />
          )}
        </View>
      </View>
    );
  }
}
