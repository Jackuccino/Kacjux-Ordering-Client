import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from "./HomeScreen";
import CartScreen from "./CartScreen";
import OrderScreen from "./OrderScreen";

/************************************************************
 * Purpose:
 *    Create a navigation system
 * Params:
 *    N/A
 * Returns:
 *    N/A
 *************************************************************/
const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen, // Home page
    Cart: CartScreen, // Cart page
    Order: OrderScreen // Order summary page
  },
  {
    initialRouteName: "Home" // start with home page
  }
);

export default createAppContainer(AppNavigator);
