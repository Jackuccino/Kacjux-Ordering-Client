import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from "./HomeScreen";
import CartScreen from "./CartScreen";

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Cart: CartScreen
  },
  {
    initialRouteName: "Home"
  }
);

export default createAppContainer(AppNavigator);
