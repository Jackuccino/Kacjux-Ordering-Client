const apiPostNewOrder = "http://66.190.224.156:8080/api/orders/";
const apiGetAllItems = "http://66.190.224.156:8080/api/items/";
const apiCancelOrder = "http://66.190.224.156:8080/api/orders/delete-order/";
const apiModifyOrder = "http://66.190.224.156:8080/api/orders/change-quantity/";
const apiDeleteItemFromOrder =
  "http://66.190.224.156:8080/api/orders/remove-item/";

exports.postNewOrder = (params) => {
  return fetch(apiPostNewOrder, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
};

exports.getAllItems = () => {
  return fetch(apiGetAllItems);
};

exports.cancelOrder = (id) => {
  return fetch(apiCancelOrder + id, { method: "DELETE" });
};

exports.modifyOrder = (id, params) => {
  return fetch(apiModifyOrder + id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(params),
  });
};

exports.deleteItemFromOrder = (id, params) => {
  return fetch(apiDeleteItemFromOrder + id, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "DELETE",
    body: JSON.stringify(params),
  });
};
