import React from "react";
import { Button } from "react-native-elements";
import Styles from "../styles/StyleSheet";

export default props => {
  return (
    <Button
      title="Submit"
      buttonStyle={Styles.submitButton}
      textStyle={Styles.submitText}
      containerViewStyle={Styles.submitContainerView}
      onPress={props.onSubmitOrders}
    />
  );
};
