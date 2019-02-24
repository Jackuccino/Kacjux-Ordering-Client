/*************************************************************
 * Menu and side bar Component
 *
 * Author:		JinJie Xu
 * Date Created:	2/1/2019
 **************************************************************/

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
  /************************************************************
   * Purpose:
   *    Initial states
   * Params:
   *    Properties that get passed to this component
   * Returns:
   *    N/A
   *************************************************************/
  constructor(props) {
    super(props);

    this.state = {
      // how many rows in a section,
      // used to calculate y position while scrolling
      sectionRows: [],
      // the number of pixels for each item
      pixelsForEachItem: 471,
      // to avoid onScoll event while pressing header
      enableScroll: true,
      // to avoid reseting color on the first item header
      initState: true
    };

    this._getSectionRows = this._getSectionRows.bind(this);
    this._getSearchableItemList = this._getSearchableItemList.bind(this);
    this._resetHighlight = this._resetHighlight.bind(this);
    this._onMenuScroll = this._onMenuScroll.bind(this);
    this._highlightOnScroll = this._highlightOnScroll.bind(this);
    this._onEndScroll = this._onEndScroll.bind(this);
    this._scrollToSection = this._scrollToSection.bind(this);
    this._renderSideBarMenuItem = this._renderSideBarMenuItem.bind(this);
  }

  /************************************************************
   * Purpose:
   *    Put the number of rows in each section in a list
   *    for calculating the y position of each section
   * Params:
   *    Properties that get passed to this component
   * Returns:
   *    N/A
   *************************************************************/
  _getSectionRows = () => {
    const list = [];
    this.props.itemData.forEach(section => {
      // Since we have multiple columns, the total items in the section
      // is splitted into two items in a row, so the number of rows is
      // total items divide by the number of columns
      list.push(Math.ceil(section.data.length / this.props.numColumns));
    });
    // Save to the state
    this.setState({
      sectionRows: list
    });
  };

  /************************************************************
   * Purpose: 
   *    Map the items from each section to a list of objects that 
        contain the indexes and name of the items and return the 
        list as a dataset of the seachbar
   * Params:
   *    N/A
   * Returns:
   *    A list of searchable items
   *************************************************************/
  _getSearchableItemList = () => {
    let list = [];
    this.props.itemData.forEach(section => {
      // Map the items from each section
      // and concatenate into a list
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

  /************************************************************
   * Purpose:
   *    Reset the highlighted item headers
   * Params:
   *    N/A
   * Returns:
   *    N/A
   *************************************************************/
  _resetHighlight = () => {
    // Loop through each header on the side bar
    // and set the background color back to default
    for (var ref in this.titleRef) {
      this.titleRef[ref].setNativeProps({
        style: Styles.defaultBackgroundColor
      });
    }
  };

  /************************************************************
   * Purpose:
   *    This event gets triggered while the user is
   *    scrolling the menu
   * Params:
   *    event: the onScroll event
   * Returns:
   *    N/A
   *************************************************************/
  _onMenuScroll = event => {
    // For scroll to highlight side menu header
    if (this.state.sectionRows.length === 0) {
      this._getSectionRows();
    }

    if (this.state.enableScroll === true) {
      // If A is been highlighted, don't reset
      if (!this.state.initState) {
        this._resetHighlight();
      } else {
        // Once the user has scrolled the menu,
        // set the initState to false
        this.setState({ initState: false });
      }

      // Scroll and highlight side headers recursively
      this._highlightOnScroll(
        event.nativeEvent.contentOffset.y,
        0,
        this.state.pixelsForEachItem * this.state.sectionRows[0]
      );
    }
  };

  /************************************************************
   * Purpose:
   *    Reset the highlighted item headers
   * Params:
   *    y: the current y position
   *    index: the index of the section
   *    upperBound: the upper bound of the section
   * Returns:
   *    N/A
   *************************************************************/
  _highlightOnScroll = (y, index, upperBound) => {
    // If the current y position is within
    // the section (this.titleRef[index]),
    // highlight the side header (lightgrey)
    if (y < upperBound) {
      this.titleRef[index].setNativeProps({
        style: { backgroundColor: "lightgrey" }
      });
      return;
    }

    // Recursively to check it's under which section
    if (index < this.state.sectionRows.length) {
      this._highlightOnScroll(
        y,
        index + 1,
        upperBound +
          this.state.pixelsForEachItem * this.state.sectionRows[index + 1]
      );
    }
    return;
  };

  /************************************************************
   * Purpose:
   *    Avoid highlighting when tabbing side menu
   *    Get triggered when finish scrolling
   * Params:
   *    event: onEndScroll event
   * Returns:
   *    N/A
   *************************************************************/
  _onEndScroll = event => {
    this.setState({ enableScroll: true });
  };

  /************************************************************
   * Purpose:
   *    Triggered when pressing side header
   *    It will highlight the header and scroll to the section
   * Params:
   *    id: the index of the side header
   * Returns:
   *    N/A
   *************************************************************/
  _scrollToSection = id => {
    // Avoid highlighting when tabbing side menu
    this.setState({ enableScroll: false });

    // Reset all the highlighted headers
    this._resetHighlight();
    // Highlight the pressed header
    this.titleRef[id].setNativeProps({
      style: { backgroundColor: "lightgrey" }
    });

    // Also scroll to the corresponding section
    this.secListRef.scrollToLocation({
      animated: true,
      itemIndex: 0,
      sectionIndex: id
    });
  };

  /************************************************************
   * Purpose:
   *    This is a render function
   *    Render each header in the side header bar
   * Params:
   *    { item }: the header object
   * Returns:
   *    TouchableHighlight: make the text clickable
   *************************************************************/
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
          {/* Side header bar */}
          <ScrollView>
            <FlatList
              data={this.props.titleData}
              renderItem={this._renderSideBarMenuItem}
            />
          </ScrollView>
        </View>
        <View style={Styles.menuContainer}>
          {/* Search bar */}
          <SearchableDropdown
            onItemSelect={item => {
              this.secListRef.scrollToLocation({
                animated: true,
                itemIndex: Math.floor(item.itemId / this.props.numColumns),
                sectionIndex: item.sectionId
              });
            }}
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
          {/* Menu */}
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
