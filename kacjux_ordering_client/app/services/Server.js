import React, { Component } from "react";
import { Alert } from "react-native";

const apiPostNewOrder = "http://localhost:5000/api/orders/";

exports.postNewOrder = params => {
  return fetch(apiPostNewOrder, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  })
    .then(res => {
      if (res.status === 201) {
        Alert.alert(
          "Alert Title",
          res.status.toString(),
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        return res.json();
      } else {
        Alert.alert(
          "Alert Title",
          res.status.toString(),
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      }
    })
    .catch(error => {
      Alert.alert(
        "Alert Title",
        error.toString(),
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    });
};
