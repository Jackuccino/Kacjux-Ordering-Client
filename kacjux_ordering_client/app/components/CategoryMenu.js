import React, { Component } from "react";
import {
  View,
  FlatList,
  Text,
  ScrollView,
  TouchableHighlight,
  Alert
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
        <Text style={Styles.menuHeader}>{item.key}</Text>
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <View style={Styles.horizontalView}>
        <View style={Styles.sideMenuBarContainer}>
          <ScrollView>
            <FlatList
              data={this.props.titleData}
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
            data={this.props.itemData}
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
