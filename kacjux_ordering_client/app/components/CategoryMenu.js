import React, { Component } from "react";
import {
  View,
  FlatList,
  Text,
  ScrollView,
  TouchableHighlight,
  SectionList
} from "react-native";
//import { SearchBar } from "react-native-elements";
import SearchableDropdown from "react-native-searchable-dropdown";
import Styles from "../styles/StyleSheet";

export class CategoryMenu extends Component {
  constructor(props) {
    super(props);
  }

  _setSearchableItemList = () => {
    let list = [];
    this.props.itemData.forEach(section => {
      list = list.concat(
        section.data.map(item => {
          return {
            sectionId: section.index,
            itemId: item.index,
            name: item.key
          };
        })
      );
    });
    return list;
  };

  _onMenuScroll = event => {
    //console.log(event.nativeEvent.contentOffset.y);
  };

  // scroll to item
  _scrollToSection = id => {
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
        onPress={this._scrollToSection.bind(this, item.id)}
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
          <SearchableDropdown
            onItemSelect={item =>
              this.secListRef.scrollToLocation({
                animated: true,
                itemIndex: item.itemId,
                sectionIndex: item.sectionId
              })
            }
            containerStyle={{ padding: 5 }}
            textInputStyle={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5
            }}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: "#ddd",
              borderColor: "#bbb",
              borderWidth: 1,
              borderRadius: 5
            }}
            itemTextStyle={{ color: "#222" }}
            itemsContainerStyle={{ maxHeight: 140 }}
            items={this._setSearchableItemList()}
            placeholder="Search here..."
            resetValue={false}
            underlineColorAndroid="transparent"
          />
          <SectionList
            ref={ref => {
              this.secListRef = ref;
            }}
            contentContainerStyle={this.props.contentContainerStyle}
            sections={this.props.itemData}
            renderItem={this.props.renderItem}
            renderSectionHeader={this.props.renderSectionHeader}
            extraData={this.props.extraData}
            keyExtractor={this.props.keyExtractor}
            onScroll={this._onMenuScroll}
          />
        </View>
      </View>
    );
  }
}

export default CategoryMenu;
