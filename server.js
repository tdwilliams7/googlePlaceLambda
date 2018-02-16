const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const config = require("./config");

const PORT = config.port;
const KEY = config.gmaps.key;
const USER_ERROR_STATUS = 422;

const app = express();
app.use(bodyParser.json());

app.get("/place", (req, res) => {
  const { search } = req.query;
  console.log(search);
  let placeId;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${search}&key=${KEY}`;
  fetch(url)
    .then(places => places.json())
    .then(places => {
      placeId = places.results[0].place_id;
      const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${KEY}`;
      fetch(detailUrl)
        .then(newplace => newplace.json())
        .then(newplace => {
          console.log("newplace: ", newplace.result);
          res.status(200).send(newplace.result);
        })
        .catch(err => res.send(err));
    })
    .catch(err => res.send(err));
});

app.get("/places", (req, res) => {
  const { search } = req.query;
  const placesIds = [];
  const placesArr = [];
  console.log(search);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${search}&key=${KEY}`;
  fetch(url)
    .then(places => places.json())
    .then(places => {
      places.results
        .forEach(place => {
          placesIds.push(place.place_id);
        })
        .then(
          placesIds => console.log(placesIds)
          // placesIds.forEach(placeId => {
          //   const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${KEY}`;
          //   fetch(detailUrl)
          //     .then(newPlace => console.log(newPlace))
          //     .catch(err => res.send(err));
          //   // .then(newPlace => {
          //   //   console.log(newPlace);
          //   //   placesArr.push(newPlace);
          //   // });
          // })
        );
    });
});

const getPlaceId = (endpoint, id) => {};

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
