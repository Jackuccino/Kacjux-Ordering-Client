import React, { Component } from "react";
import { Alert, Text, View, TextInput } from "react-native";

import SubmitOrders from "./app/components/SubmitOrders";
import DishList from "./app/components/DishList";
import Styles from "./app/components/StyleSheet";
import { Button } from "react-native-elements";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { id: 1, key: "A", count: 0 },
        { id: 2, key: "B", count: 0 },
        { id: 3, key: "C", count: 0 },
        { id: 4, key: "D", count: 0 },
        { id: 5, key: "E", count: 0 },
        { id: 6, key: "F", count: 0 },
        { id: 7, key: "G", count: 0 },
        { id: 8, key: "H", count: 0 },
        { id: 9, key: "I", count: 0 },
        { id: 10, key: "J", count: 0 },
        { id: 11, key: "K", count: 0 },
        { id: 12, key: "L", count: 0 },
        { id: 13, key: "M", count: 0 },
        { id: 14, key: "N", count: 0 },
        { id: 15, key: "O", count: 0 },
        { id: 16, key: "P", count: 0 }
      ],
      numCols: 4
    };
    this.timer = null;
  }

  // handler for adding an item
  _itemPlusHandler = id => {
    this.state.data.find(d => d.id === id).count++;
    this.setState({ data: this.state.data });
    // increment recursively when holding button
    this.timer = setTimeout(this._itemPlusHandler.bind(this, id), 80);
  };

  // handler for removing an item
  _itemMinusHandler = id => {
    const data = this.state.data.find(d => d.id === id);
    if (data.count > 0) {
      data.count--;
    }
    this.setState({ data: this.state.data });
    // increment recursively when holding button
    this.timer = setTimeout(this._itemMinusHandler.bind(this, id), 80);
  };

  // increment recursively when holding button
  _stopTimer = () => {
    clearTimeout(this.timer);
  };

  // rendering data for item list
  _renderItem = ({ item }) => {
    return (
      <View style={Styles.itemGrid}>
        {/* title */}
        <Text style={Styles.itemTitle}>Title {item.key}</Text>
        {/* image */}
        <View style={Styles.itemImage}>
          <Text style={Styles.itemText}>Image {item.key}</Text>
        </View>
        {/* - counter + */}
        <View style={Styles.itemTitleContainer}>
          <Button
            title="-"
            buttonStyle={Styles.itemButton}
            onPressIn={this._itemMinusHandler.bind(this, item.id)}
            onPressOut={this._stopTimer}
          />
          <View style={Styles.itemNumber}>
            <Text> {item.count} </Text>
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
          <SubmitOrders onSubmitOrders={this._submitOrdersHandler} />
        </View>
      </View>
    );
  }
}
