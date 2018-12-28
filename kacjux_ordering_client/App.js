import React, { Component } from "react";
import { Text, View, FlatList } from "react-native";

import SubmitOrders from "./app/components/SubmitOrders";
import DishList from "./app/components/DishList";
import Styles from "./app/components/StyleSheet";

const data = [
  { key: "Image A" },
  { key: "Image B" },
  { key: "Image C" },
  { key: "Image D" },
  { key: "Image E" },
  { key: "Image F" },
  { key: "Image G" },
  { key: "Image H" },
  { key: "Image I" },
  { key: "Image J" },
  { key: "Image K" },
  { key: "Image L" },
  { key: "Image M" },
  { key: "Image N" },
  { key: "Image O" },
  { key: "Image P" }
];
const numCols = 4;

type Props = {};
export default class App extends Component<Props> {
  _renderItem = ({ item, index }) => {
    return (
      <View style={Styles.itemGrid}>
        <Text style={Styles.itemText}>{item.key}</Text>
      </View>
    );
  };
  _submitOrdersHandler = () => {};
  render() {
    return (
      <View style={Styles.container}>
        <View style={Styles.top}>
          <Text style={Styles.title}>Prototype: Submit an Order</Text>
        </View>
        <DishList
          data={data}
          renderItem={this._renderItem}
          numColumns={numCols}
        />
        <View style={Styles.bottom}>
          <SubmitOrders onSubmitOrders={this._submitOrdersHandler} />
        </View>
      </View>
    );
  }
}
