import React, { Component } from "react";
import {
  ScrollView,
  View,
  FlatList,
  TextInput,
  Image,
  Text,
  Alert
} from "react-native";
import { Button, Icon } from "react-native-elements";
import IconBadge from "react-native-icon-badge";
import Styles from "../styles/StyleSheet";

export default class OrderScreen extends Component {
  // Render the header of the navigation bar
  static navigationOptions = ({ navigation }) => ({
    headerTitle: <Text style={Styles.title}>Order Summary</Text>,
    headerRight: (
      <Text style={Styles.title}>
        Order Number: {navigation.getParam("orderNo", null)}
      </Text>
    )
  });

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      // Holds the selected items and gets from navigation parameter
      orderItems: navigation.getParam("orderItems", null),
      // Holds the order number and gets from navigation parameter
      orderNo: navigation.getParam("orderNo", null)
    };
  }

  _cancelOrderHandler = () => {
    Alert.alert(
      "Alert Title",
      "Cancel",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  };

  /************************************************************
   * Purpose:
   *    Render items in the FlatList
   * Params:
   *    item: the corresponding item in the FlatList
   * Returns:
   *    N/A
   *************************************************************/
  _renderItem = ({ item }) => {
    return (
      <View style={Styles.cartItemList}>
        {/* image */}
        <Image
          borderRadius={50}
          source={{ uri: item.image }}
          style={Styles.cartItemImage}
        />
        {/* item title */}
        <Text style={Styles.itemTitle}>{item.key}</Text>
        {/* Price */}
        <Text style={Styles.itemPrice}>
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>
    );
  };

  render() {
    const { navigation } = this.props;
    return (
      <ScrollView contentContainerStyle={Styles.scrollViewStyle}>
        <ScrollView>
          {/* cart item list */}
          <View>
            <FlatList
              data={this.state.orderItems}
              renderItem={this._renderItem}
              extraData={this.state}
            />
          </View>
        </ScrollView>
        <View>
          {/* cart note */}
          <TextInput
            editable={false}
            style={Styles.textAreaContainer}
            underlineColorAndroid="transparent"
            multiline={true}
            numberOfLines={10}
            value={navigation.getParam("note", "")}
            scrollEnabled={true}
          />
        </View>
        {/* cancel button bar */}
        <View style={Styles.bottom}>
          <Text style={[Styles.totalPrice, { marginLeft: 45 }]}>Total: </Text>
          <Text style={Styles.totalPrice}>
            ${navigation.getParam("totalPrice", 0).toFixed(2)}
          </Text>
          <Button
            title="Cancel"
            buttonStyle={Styles.cartButton}
            textStyle={Styles.cartText}
            containerViewStyle={Styles.cartContainerView}
            onPress={this._cancelOrderHandler}
          />
        </View>
      </ScrollView>
    );
  }
}
