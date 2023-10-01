const mongoose = require("mongoose");
const gyms = require("../seeds/gyms");
const { names } = require("../seeds/seedHelper");
const Gym = require("../models/gym");

mongoose.connect("mongodb://127.0.0.1:27017/gym-finder", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connection established!");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Gym.deleteMany({});
  for (let i = 0; i < 15; i++) {
    const random7 = Math.floor(Math.random() * 7);
    const price = Math.floor(Math.random() * 100) + 10;
    const seedLocation = random7;
    const gym = new Gym({
      street: `${gyms[seedLocation].street}`,
      postcode: `${gyms[seedLocation].postcode}`,
      name: `${sample(names)}`,
      image: "https://source.unsplash.com/collection/4974205",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, deleniti quasi nihil beatae rerum quidem tempore labore ad porro eius molestiae temporibus architecto, ducimus mollitia nesciunt! Laudantium asperiores nesciunt voluptate!",
      memberships: [
        {
          memName: "All Access",
          memPrice: price,
          memDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, deleniti quasi nihil beatae rerum quidem tempore labore ad porro eius molestiae temporibus architect",
        },
        {
          memName: "Striking Pass",
          memPrice: price - 20,
          memDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, deleniti quasi nihil beatae rerum quidem tempore labore ad porro eius molestiae temporibus architect",
        },
        {
          memName: "Grappling Pass",
          memPrice: price - 20,
          memDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, deleniti quasi nihil beatae rerum quidem tempore labore ad porro eius molestiae temporibus architect",
        },
        {
          memName: "Gym Pass",
          memPrice: price - 30,
          memDescription: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, deleniti quasi nihil beatae rerum quidem tempore labore ad porro eius molestiae temporibus architect",
        },
      ],
    });
    await gym.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
