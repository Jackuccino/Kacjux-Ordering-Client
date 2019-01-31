exports.getImage = name => {
  switch (name) {
    case "Barbeque Pork":
      return require("../assets/images/bbqpork.jpg");
    case "Lemon Chicken":
      return require("../assets/images/lemonch.jpg");
    case "Sesame Chicken":
      return require("../assets/images/sesamech.jpg");
    case "Pot Stickers":
      return require("../assets/images/potsticker.jpg");
    case "Mar Far Chicken":
      return require("../assets/images/mfch.png");
    case "Pork Fried Rice":
      return require("../assets/images/pfrice.jpg");
    case "Pork Foo Young":
      return require("../assets/images/porkefy.jpg");
    default:
      return null;
  }
};
