const apiPostNewOrder = "http://96.41.173.63:8080/api/orders/";
const apiGetAllItems = "http://96.41.173.63:8080/api/items/";

exports.postNewOrder = params => {
  return fetch(apiPostNewOrder, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });
};

exports.getAllItems = () => {
  return fetch(apiGetAllItems);
};
