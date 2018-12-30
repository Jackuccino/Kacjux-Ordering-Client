import React, { Component } from "react";
import { Alert, Text, View, Image } from "react-native";

import SubmitOrders from "./app/components/SubmitOrders";
import DishList from "./app/components/DishList";
import Styles from "./app/styles/StyleSheet";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/Entypo";
import IconBadge from "react-native-icon-badge";

import { postNewOrder } from "./app/services/Server";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 1,
          key: "Mar Far Chichen",
          image: require("./app/assets/images/mfch.png"),
          price: 9,
          amount: 0
        },
        {
          id: 2,
          key: "Lemon Chichen",
          image: require("./app/assets/images/lemonch.jpg"),
          price: 10,
          amount: 0
        },
        {
          id: 3,
          key: "Sesame Chichen",
          image: require("./app/assets/images/sesamech.jpg"),
          price: 11,
          amount: 0
        },
        {
          id: 4,
          key: "Title D",
          image: require("./app/assets/images/mfch.png"),
          price: 13,
          amount: 0
        },
        {
          id: 5,
          key: "Title E",
          image: require("./app/assets/images/mfch.png"),
          price: 14.0,
          amount: 0
        },
        {
          id: 6,
          key: "Title F",
          image: require("./app/assets/images/mfch.png"),
          price: 15.0,
          amount: 0
        },
        {
          id: 7,
          key: "Title G",
          image: require("./app/assets/images/mfch.png"),
          price: 16.0,
          amount: 0
        },
        {
          id: 8,
          key: "Title H",
          image: require("./app/assets/images/mfch.png"),
          price: 17.0,
          amount: 0
        },
        {
          id: 9,
          key: "Title I",
          image: require("./app/assets/images/mfch.png"),
          price: 18.0,
          amount: 0
        },
        {
          id: 10,
          key: "Title J",
          image: require("./app/assets/images/mfch.png"),
          price: 19.0,
          amount: 0
        },
        {
          id: 11,
          key: "Title K",
          image: require("./app/assets/images/mfch.png"),
          price: 20.0,
          amount: 0
        },
        {
          id: 12,
          key: "Title L",
          image: require("./app/assets/images/mfch.png"),
          price: 21.0,
          amount: 0
        },
        {
          id: 13,
          key: "Title M",
          image: require("./app/assets/images/mfch.png"),
          price: 22.0,
          amount: 0
        },
        {
          id: 14,
          key: "Title N",
          image: require("./app/assets/images/mfch.png"),
          price: 23.0,
          amount: 0
        },
        {
          id: 15,
          key: "Title O",
          image: require("./app/assets/images/mfch.png"),
          price: 24.0,
          amount: 0
        },
        {
          id: 16,
          key: "Title P",
          image: require("./app/assets/images/mfch.png"),
          price: 25.0,
          amount: 0
        }
      ],
      numCols: 2,
      totalPrice: 0
    };
    this.timer = null;
  }

  // handler for adding an item
  _itemPlusHandler = id => {
    this.state.data.find(d => d.id === id).amount++;
    this.setState({ data: this.state.data });
    this._getTotalPrice();
    // increment recursively when holding button
    this.timer = setTimeout(this._itemPlusHandler.bind(this, id), 85);
  };

  // handler for removing an item
  _itemMinusHandler = id => {
    const data = this.state.data.find(d => d.id === id);
    if (data.amount > 0) {
      data.amount--;
    }
    this.setState({ data: this.state.data });
    this._getTotalPrice();
    // increment recursively when holding button
    this.timer = setTimeout(this._itemMinusHandler.bind(this, id), 85);
  };

  // increment recursively when holding button
  _stopTimer = () => {
    clearTimeout(this.timer);
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

  // fetch data to database
  _submitOrdersHandler = () => {
    // Send request
    const orderItems = this.state.data.filter(d => d.amount != 0);
    orderItems.forEach(item => {
      // Send each new order to the database
      const quantity = item.amount;
      const totalPrice = item.price * quantity;
      const orderItem = item.id;
      const note = null;

      const newOrder = {
        OrderNo: 1,
        TotalPrice: `$${totalPrice}`,
        OrderItem: orderItem,
        Quantity: quantity,
        Note: note
      };

      postNewOrder(newOrder)
        .then(res => {
          if (res.result === "ok") {
            // success
          } else {
            // failure
          }
        })
        .catch(error => {
          // post failed
        });
    });
  };

  _getTotalPrice = () => {
    var totalPrice = 0;
    const items = this.state.data.filter(data => data.amount != 0);
    items.forEach(item => {
      totalPrice += item.amount * item.price;
    });
    this.setState({ totalPrice: totalPrice });
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
          <IconBadge
            MainElement={
              <Icon name="shopping-cart" size={40} style={Styles.cartIcon} />
            }
            BadgeElement={
              <Text style={Styles.iconBadgeText}>
                {this.state.data.filter(data => data.amount != 0).length}
              </Text>
            }
            IconBadgeStyle={Styles.iconBadge}
            Hidden={
              this.state.data.filter(data => data.amount != 0).length === 0
            }
          />
          <Text style={Styles.totalPrice}>
            ${this.state.totalPrice.toFixed(2)}
          </Text>
          <SubmitOrders onSubmitOrders={this._submitOrdersHandler} />
        </View>
      </View>
    );
  }
}
