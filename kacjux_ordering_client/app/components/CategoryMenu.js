import React, { Component } from "react";
import {
  View,
  FlatList,
  Text,
  ScrollView,
  TouchableHighlight,
  SectionList
} from "react-native";
import Styles from "../styles/StyleSheet";

export class CategoryMenu extends Component {
  constructor(props) {
    super(props);
  }

  // scroll to item
  _scrollToIndex = id => {
    for (var ref in this.titleRef) {
      this.titleRef[ref].setNativeProps({
        style: Styles.defaultBackgroundColor
      });
    }
    this.titleRef[id].setNativeProps({
      style: { backgroundColor: "lightgrey" }
    });

    this.secListRef.scrollToLocation({
      animated: true,
      itemIndex: 0,
      sectionIndex: id
    });
  };

  _renderSideBarMenuItem = ({ item }) => {
    return (
      <TouchableHighlight
        underlayColor={"lightgrey"}
        onPress={this._scrollToIndex.bind(this, item.id)}
      >
        <Text
          ref={ref => {
            this.titleRef = {
              ...this.titleRef,
              [item.id]: ref
            };
          }}
          style={Styles.menuHeader}
        >
          {item.key}
        </Text>
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <View style={[Styles.horizontalView]}>
        <View style={Styles.sideMenuBarContainer}>
          <ScrollView>
            <FlatList
              data={this.props.titleData}
              renderItem={this._renderSideBarMenuItem}
            />
          </ScrollView>
        </View>
        <View style={Styles.menuContainer}>
          <SectionList
            ref={ref => {
              this.secListRef = ref;
            }}
            contentContainerStyle={this.props.contentContainerStyle}
            sections={this.props.itemData}
            renderItem={this.props.renderItem}
            renderSectionHeader={this.props.renderSectionHeader}
            //numColumns={this.props.numColumns}
            extraData={this.props.extraData}
            keyExtractor={this.props.keyExtractor}
          />
        </View>
      </View>
    );
  }
}

export default CategoryMenu;
