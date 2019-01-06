import React from "react";
import { View, FlatList } from "react-native";
import Styles from "../styles/StyleSheet";

export default props => {
  return (
    <FlatList
      contentContainerStyle={Styles.itemContentContainer}
      data={props.data}
      renderItem={props.renderItem}
      numColumns={props.numColumns}
      extraData={props.extraData}
    />
  );
};
