const fs = require("fs");
// const http = require("http")
const express = require("express");

const app = express();

// Middleware to read JSON from request body (client, FE, etc.)
app.use(express.json());

// Default URL = Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Application is running good...",
  });
});

// If using HTTP module it would be like: if(req.url === / "Ferdi") {}
app.get("/ferdi", (req, res) => {
  res.status(200).json({
    message: "Ping Successfully !",
  });
});

const cars = JSON.parse(
  fs.readFileSync(`${__dirname}/data/cars.json`, "utf-8")
);

// /api/v1/(collection name) => collection names should be plural (s)
app.get("/api/v1/cars", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Success Get Cars Data",
    isSuccess: true,
    totalData: cars.length,
    data: {
      cars,
    },
  });
});

// response.data.cars
// Post Cars
app.post("/api/v1/cars", (req, res) => {
  // insert into ......
  const newCar = req.body;

  cars.push(newCar);

  fs.writeFile(
    `${__dirname}/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(201).json({
        status: "Success",
        message: "Success Add New Car Data",
        isSuccess: true,
        data: {
          car: newCar,
        },
      });
    }
  );
});

// Get Cars By ID
app.get("/api/v1/cars/:id", (req, res) => {
  // select * from fsw2 where id="1" OR NAME = "Ferdi"
  const id = parseInt(req.params.id);
  console.log(typeof id);
  const car = cars.find((i) => i?.id == id);
  console.log(car);

  if (!car) {
    console.log("No Data");
    return res.status(404).json({
      status: "Failed",
      message: `Failed Get Car Data This ${id}`,
      isSuccess: false,
      data: null,
    });
  }

  res.status(200).json({
    status: "success",
    message: "Success Get Cars Data",
    isSuccess: true,
    data: {
      car,
    },
  });
});

// Patch Cars
app.patch("/api/v1/cars/:id", (req, res) => {
  //UPDATE ... FROM =(table) WHERE id=req.param.id
  const id = req.params.id * 1;
  // Find data by id
  const car = cars.find((i) => i.id === id);
  // Find index 
  const carIndex = cars.findIndex((i) => i.id === id)

  // Update according to request body (client/frontend)
  // Object assign = using object spread operator

  cars[carIndex] = {...cars[carIndex], ...req.body};


  // Get new data for response API | depends on the need, not mandatory
  const newCar = cars.find((i) => i.id === id);

  if(!car){
    return res.status(404).json({
      status: "Failed",
      message: `Failed To Update Car Data This ${id}`,
      isSuccess: false,
      data: null,
    })
  }
  // Write REWRITE DATA JSON into file
  fs.writeFile(`${__dirname}/data/cars.json`, 
    JSON.stringify(cars), 
    (err) => {
    res.status(201).json({
      status: "Success",
      message: `Success Update Car Data By Id: ${id}`,
      isSuccess: true,
      data: {
        newCar
      }
    });
  });
})

// Delete Cars
app.delete("/api/v1/cars/:id", (req, res) => {
  const id = parseInt(req.params.id);
  
  const { name, year, type } = req.body;

  // Find data by id
  const car = cars.find((i) => i?.id == id);
  // Find its index
  const carIndex = cars.findIndex((car) => car.id == id);
  console.log(carIndex);
  
  // Error handling if cars are not found
  if (!car) {
    console.log("No Data");
    return res.status(404).json({
      status: "Failed",
      message: `Failed To Delate Car Data This ${id}`,
      isSuccess: false,
      data: null,
    });
  }

  // Perform deletion
  cars.splice(carIndex, 1)

  // Write rewrite data json into file
  fs.writeFile(`${__dirname}/data/cars.json`, JSON.stringify(cars), (err) => {
    // Response only displays the result, no further process (JSON.parse)
    res.status(201).json({
      status: "success",
      message: `Success Delete Car Data Id: ${id}`,
      isSuccess: true,
      data: {
        car,
      },
    });
  });
});


// Middleware / handler for URLs that cannot be accessed because they do not exist in the application
// Creating middleware = our own middleware
app.use((req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: "API not exist !!!",
  });
});

app.listen("3000", () => {
  console.log("Start Our Application On Port 3000");
});