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
          res.status(200).send(newplace.result);
        })
        .catch(err => res.send(err));
    })
    .catch(err => res.send(err));
});

app.get("/places", (req, res) => {
  if (!req.query.search) {
    res
      .status(USER_ERROR_STATUS)
      .json({ error: "Please provide some search stuff" });
  }
  const placesIds = [];
  const placesArr = [];
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${
    req.query.search
  }&key=${KEY}`;
  fetch(url)
    .then(places => places.json())
    .then(places => {
      places.results.forEach(place => {
        placesIds.push(place.place_id);
      });
      const results = placesIds.map(placeId => {
        const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${KEY}`;
        return fetch(detailUrl)
          .then(response => response.json())
          .then(json => {
            return json;
          })
          .catch(err => console.log(err));
      });
      Promise.all(results).then(response => {
        res.status(200).json(response);
      });
    })
    .catch(err => console.log(err));
});

const getPlaceId = (endpoint, id) => {};

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
