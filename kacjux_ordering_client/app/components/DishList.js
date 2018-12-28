import React from "react";
import { FlatList } from "react-native";
import Styles from "./StyleSheet";

export default props => {
  return (
    <FlatList
      data={props.data}
      style={Styles.itemContainer}
      renderItem={props.renderItem}
      numColumns={props.numColumns}
    />
  );
};
