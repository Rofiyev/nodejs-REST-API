const http = require("http");
const getBodyData = require("./util");
const { v4 } = require("uuid");

let movies = [
  { id: 1, name: "Avatar", country: "United Kingdom", year: 2009 },
  { id: 2, name: "Spider-Man", country: "United States", year: 2018 },
];

const getFilterMovie = (id) => movies.find((item) => item.id == id);

const server = http.createServer(async (req, res) => {
  //*=== GET all data ===*//
  if (req.url === "/" && req.method === "GET") {
    //~ Create response ~//
    const resp = {
      status: "OK",
      movies,
    };

    //~ Send response ~//
    res.writeHead(200, { "Content-Type": "application/json charset=utf8" });
    res.end(JSON.stringify(resp));

    //*=== POST new create data ===*//
  } else if (req.url === "/movies" && req.method === "POST") {
    //~ POST method get body data ~//
    const data = await getBodyData(req);
    const body = JSON.parse(data);

    //~ Create response and added new data ~//
    const newMovie = { id: v4(), ...body };
    movies.push(newMovie);

    //~ Create response ~//
    const resp = {
      status: "Created",
      movie: newMovie,
    };

    //~ Send response ~//
    res.writeHead(200, { "Content-Type": "application/json charset=utf8" });
    res.end(JSON.stringify(resp));

    //*=== Id GET data ===*//
  } else if (req.url.match(/\/movies\/\w+/) && req.method === "GET") {
    //~ get url params and params filter data ~//
    const idParams = req.url.slice("-1");
    const movie = getFilterMovie(idParams);

    //~ Create response ~//
    const resp = {
      status: "OK",
      movie,
    };

    //~ Send response ~//
    res.writeHead(200, { "Content-Type": "application/json charset=utf8" });
    res.end(JSON.stringify(resp));

    //*=== Id PUT changed data ===*//
  } else if (req.url.match(/\/movies\/\w+/) && req.method === "PUT") {
    //~ get url params and params filter data ~//
    const idParams = req.url.slice("-1");
    const { name, country, year, id } = getFilterMovie(idParams);

    //~ get body data ~//
    const data = await getBodyData(req);
    const body = JSON.parse(data);

    //~ Changed data object ~//
    const movie = {
      id,
      name: body.name || name,
      country: body.country || country,
      year: body.year || year,
    };

    //~ Create response ~//
    const resp = {
      status: "Updated",
      movie,
    };

    //~ Send response ~//
    res.writeHead(200, { "Content-Type": "application/json charset=utf8" });
    res.end(JSON.stringify(resp));

    //*=== Id DELETE data ===*//
  } else if (req.url.match(/\/movies\/\w+/) && req.method === "DELETE") {
    //~ get url params and params filter data ~//
    const idParams = req.url.slice("-1");
    movies = movies.filter((item) => item.id != idParams);

    //~ Create response ~//
    const resp = {
      status: "DELETED",
      movies,
    };

    //~ Send response ~//
    res.writeHead(200, { "Content-Type": "application/json charset=utf8" });
    res.end(JSON.stringify(resp));
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server runnning on port: ${PORT}`));
