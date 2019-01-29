import React, { Component } from "react";
import {
  View,
  FlatList,
  Text,
  ScrollView,
  TouchableHighlight
} from "react-native";
import Styles from "../styles/StyleSheet";

export class CategoryMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //
    };
  }

  // scroll to item
  _scrollToIndex = index => {
    this.flatListRef.scrollToIndex({ animated: true, index: index });
  };

  _renderSideBarMenuItem = ({ item }) => {
    return (
      <TouchableHighlight
        underlayColor={"lightgrey"}
        onPress={this._scrollToIndex.bind(this, Math.random())}
      >
        <Text style={Styles.menuHeader} selectionColor="yellow">
          {item.key}
        </Text>
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <View style={Styles.horizontalView}>
        <View style={Styles.sideMenuBarContainer}>
          <ScrollView>
            <FlatList
              data={[
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
              ]}
              renderItem={this._renderSideBarMenuItem}
            />
          </ScrollView>
        </View>
        <View style={Styles.menuContainer}>
          <FlatList
            ref={ref => {
              this.flatListRef = ref;
            }}
            contentContainerStyle={this.props.contentContainerStyle}
            data={this.props.data}
            renderItem={this.props.renderItem}
            numColumns={this.props.numColumns}
            extraData={this.props.extraData}
          />
        </View>
      </View>
    );
  }
}

export default CategoryMenu;
