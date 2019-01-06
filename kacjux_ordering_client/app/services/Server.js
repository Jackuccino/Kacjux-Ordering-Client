import React, { Component } from "react";
import { Alert } from "react-native";

const apiPostNewOrder = "http://96.41.173.63:8080/api/orders/";
const apiGetNewOrder = "http://96.41.173.63:8080/api/items/";

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
      return res.json();
    })
    .catch(err => {
      console.log(err);
    });
};
