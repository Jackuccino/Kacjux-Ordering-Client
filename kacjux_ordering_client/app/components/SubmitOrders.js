import React from "react";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import Styles from "./StyleSheet";

export default props => {
  return (
    <Button
      rounded
      title="Submit"
      buttonStyle={Styles.submitButton}
      textStyle={Styles.submitText}
      onPress={props.onSubmitOrders}
    />
  );
};
