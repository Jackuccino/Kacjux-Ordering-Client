import React, { Component } from "react";
import { Text, View, Image, SectionList } from "react-native";

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
      titleData: [],
      itemData: [],
      numCols: 3,
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
    let titles = [];
    let datas = [];
    let section = null;
    let title_id = 0;
    let section_id = 0;
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

            // For side section bar
            if (titles.filter(td => td.key === data.type).length === 0) {
              titles.push({ id: title_id, key: data.type });
              title_id++;
            }

            // For SectionList
            section = datas.find(d => d.title === data.type);
            if (typeof section === "undefined") {
              section = { title: data.type, data: [], index: section_id };
              datas.push(section);
              section_id++;
            }
            section.data.push(data);
          });

          this.setState({
            itemData: datas.sort((a, b) => {
              if (a.title < b.title) {
                if (a.index > b.index) {
                  const index = a.index;
                  a.index = b.index;
                  b.index = index;
                }
                return -1;
              }
              if (a.title > b.title) {
                return 1;
              }
              return 0;
            }),
            titleData: titles.sort((a, b) => {
              if (a.key < b.key) {
                if (a.id > b.id) {
                  const id = a.id;
                  a.id = b.id;
                  b.id = id;
                }
                return -1;
              }
              if (a.key > b.key) {
                return 1;
              }
              return 0;
            })
          });
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
      this.state.itemData.forEach(item => {
        const oldData = item.data.find(d => d.id === newData.id);
        if (typeof oldData !== "undefined") {
          oldData.quantity = newData.quantity;
        }
      });
    });

    this.state.itemData.forEach(item => {
      item.data.forEach(newData => {
        totalItem += newData.quantity;
        totalPrice += newData.quantity * newData.price;
      });
    });

    this.setState({
      totalItem: totalItem,
      totalPrice: totalPrice,
      status: status,
      note: note
    });
  };

  // handler for adding an item
  _itemPlusHandler = item => {
    item.quantity++;
    this._addTotalItem();
    this._addTotalPrice(item.price);

    // increment recursively when holding button
    //this.timer = setTimeout(this._itemPlusHandler.bind(this, item), 100);
  };

  // handler for removing an item
  _itemMinusHandler = item => {
    if (item.quantity > 0) {
      item.quantity--;
      this._minusTotalItem();
      this._minusTotalPrice(item.price);
    }
  };

  // increment recursively when holding button
  // _stopTimer = () => {
  //   clearTimeout(this.timer);
  // };

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

  _renderSectionHeader = ({ section: { title } }) => {
    return <Text style={Styles.sectionHeader}>{title}</Text>;
  };

  // rendering data for item list
  _renderItem = ({ index, section }) => {
    const numColumns = this.state.numCols;

    if (index % numColumns !== 0) return null;

    section.data = this._formatData(section.data, numColumns);

    const items = [];

    for (let i = index; i < index + numColumns; i++) {
      // Checking uneven dishes
      if (i >= section.data.length) {
        break;
      }
      items.push(
        section.data[i].type === "empty" ? (
          <View
            key={`KEY_DISH${section.data[i].id}`}
            disabled
            style={[Styles.itemGrid, Styles.itemInvisible]}
          />
        ) : (
          <View key={`KEY_DISH${section.data[i].id}`} style={Styles.itemGrid}>
            {/* image */}
            <Image source={section.data[i].image} style={Styles.itemImage} />
            <View style={Styles.itemTitlePrice}>
              {/* title */}
              <Text style={Styles.itemTitle}>{section.data[i].key}</Text>
              {/* Price */}
              <Text style={Styles.itemPrice}>
                ${section.data[i].price.toFixed(2)}
              </Text>
            </View>
            <View style={Styles.itemTitlePrice}>
              <Text style={Styles.itemDescription}>
                {section.data[i].description}
              </Text>
            </View>
            {/* - counter + */}
            <View style={Styles.itemCounterContainer}>
              {section.data[i].quantity === 0 ? null : (
                <Button
                  icon={{
                    name: "remove",
                    size: 15
                  }}
                  buttonStyle={[Styles.itemButton, { backgroundColor: "red" }]}
                  onPress={this._itemMinusHandler.bind(this, section.data[i])}
                />
              )}
              {section.data[i].quantity === 0 ? null : (
                <View style={Styles.itemNumber}>
                  <Text> {section.data[i].quantity} </Text>
                </View>
              )}
              <Button
                icon={{
                  name: "add",
                  size: 15
                }}
                containerViewStyle={{ borderRadius: 30 }}
                borderRadius={30}
                buttonStyle={Styles.itemButton}
                onPress={this._itemPlusHandler.bind(this, section.data[i])}
                //onPressIn={this._itemPlusHandler.bind(this, section.data[i])}
                //onPressOut={this._stopTimer}
              />
            </View>
          </View>
        )
      );
    }

    return <View style={Styles.sectionListContainer}>{items}</View>;
  };

  // return a list of selected items
  _getSelectedItems = () => {
    let selectedItems = [];
    this.state.itemData.forEach(item => {
      selectedItems = selectedItems.concat(
        item.data.filter(d => d.quantity !== 0)
      );
    });
    return selectedItems;
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
        id: numberOfElementsLastRow * -1,
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
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          titleData={this.state.titleData}
          itemData={this.state.itemData}
          extraData={this.state}
          keyExtractor={(item, index) => item + index}
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
          {this.state.status === 0 ? (
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
