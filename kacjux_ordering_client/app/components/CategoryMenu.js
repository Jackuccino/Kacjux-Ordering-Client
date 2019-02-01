import React, { Component } from "react";
import {
  View,
  FlatList,
  Text,
  ScrollView,
  TouchableHighlight,
  SectionList
} from "react-native";
import SearchableDropdown from "react-native-searchable-dropdown";
import Styles from "../styles/StyleSheet";

export class CategoryMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionYs: [],
      numberOfections: 0,
      yForEachItem: 471,
      enableScroll: true,
      initState: true
    };
  }

  _getSectionYs = () => {
    const list = [];
    let counter = 0;
    this.props.itemData.forEach(section => {
      counter++;
      list.push(Math.ceil(section.data.length / this.props.numColumns));
    });
    this.setState({
      sectionYs: list,
      numberOfections: counter
    });
  };

  _getSearchableItemList = () => {
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

  _resetHighlight = () => {
    for (var ref in this.titleRef) {
      this.titleRef[ref].setNativeProps({
        style: Styles.defaultBackgroundColor
      });
    }
  };

  _onMenuScroll = event => {
    // For scroll to highlight side menu header
    if (this.state.sectionYs.length === 0) {
      this._getSectionYs();
    }

    if (this.state.enableScroll === true) {
      // If A is been highlighted, dont reset
      if (!this.state.initState) {
        this._resetHighlight();
      } else {
        this.setState({ initState: false });
      }

      // Scroll and highlight side header
      this._highlightOnScroll(
        event.nativeEvent.contentOffset.y,
        0,
        this.state.yForEachItem * this.state.sectionYs[0]
      );
    }
  };

  _highlightOnScroll = (y, index, upperBound) => {
    if (y < upperBound) {
      this.titleRef[index].setNativeProps({
        style: { backgroundColor: "lightgrey" }
      });
      return;
    }

    if (index < this.state.sectionYs.length) {
      this._highlightOnScroll(
        y,
        index + 1,
        upperBound + this.state.yForEachItem * this.state.sectionYs[index + 1]
      );
    }

    return;
  };

  // avoid highlighting when tabbing side menu
  _onEndScroll = event => {
    this.setState({ enableScroll: true });
  };

  // scroll to item
  _scrollToSection = id => {
    // avoid highlighting when tabbing side menu
    this.setState({ enableScroll: false });

    this._resetHighlight();
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
          style={[
            Styles.menuHeader,
            {
              backgroundColor:
                item.id === 0
                  ? "lightgrey"
                  : Styles.defaultBackgroundColor.defaultBackgroundColor
            }
          ]}
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
                itemIndex: item.itemId / this.props.numColumns,
                sectionIndex: item.sectionId
              })
            }
            containerStyle={Styles.searchBarContainer}
            textInputStyle={Styles.searchBarTextInput}
            itemStyle={Styles.searchBarItem}
            itemTextStyle={Styles.searchBarItemText}
            itemsContainerStyle={Styles.searchBarItemContainer}
            items={this._getSearchableItemList()}
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
            onScrollEndDrag={this._onEndScroll}
          />
        </View>
      </View>
    );
  }
}

export default CategoryMenu;
