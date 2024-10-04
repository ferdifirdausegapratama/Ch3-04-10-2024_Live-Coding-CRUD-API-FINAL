const fs = require("fs");
// const http = require("http")
const express = require("express");

const app = express();

// middleware untuk membaca json dari request body(client, FE dll) ke kita
app.use(express.json());

// default URL = Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Application is running good...",
  });
});

// kalau HTTP module kan if(req.url === / "Ferdi") {}
app.get("/ferdi", (req, res) => {
  res.status(200).json({
    message: "Ping Successfully !",
  });
});

const cars = JSON.parse(
  fs.readFileSync(`${__dirname}/data/cars.json`, "utf-8")
);

// /api/v1/(collection nya) => collection nya ini harus JAMAK (s)
app.get("/api/v1/cars", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Success get cars data",
    isSuccess: true,
    totalData: cars.length,
    data: {
      cars,
    },
  });
});

// response.data.cars

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
        message: "Success add new car data",
        isSuccess: true,
        data: {
          car: newCar,
        },
      });
    }
  );
});

// get cars by id
app.get("/api/v1/cars/:id", (req, res) => {
  // select * from fsw2 where id="1" OR NAME = "Ferdi"
  const id = parseInt(req.params.id);
  console.log(typeof id);
  const car = cars.find((i) => i?.id == id);
  console.log(car);

  if (!car) {
    console.log("gaada data");
    return res.status(404).json({
      status: "Failed",
      message: `Failed get car data this ${id}`,
      isSuccess: false,
      data: null,
    });
  }

  res.status(200).json({
    status: "success",
    message: "success get cars data",
    isSuccess: true,
    data: {
      car,
    },
  });
});


app.patch("/api/v1/cars/:id", (req, res) => {
  const id = parseInt(req.params.id);
  // UPDATE ........ from (table) where id=req.params.id

  // object destructuring
  const { name, year, type } = req.body;

  // mencari data by id
  const car = cars.find((i) => i?.id == id);
  // error handling jika cars tidak ditemukan
  if (!car) {
    console.log("gaada data");
    return res.status(404).json({
      status: "Failed",
      message: `Failed get car data this ${id}`,
      isSuccess: false,
      data: null,
    });
  }
  // mencari indexnya
  const carIndex = cars.findIndex((car) => car.id == id);
  console.log(carIndex);

  console.log(cars);
  // update sesuai req body
  // object assign = menggunakan objek spread operator
  cars[carIndex] = { ...cars[carIndex], ...req.body };

  // masukkan / rewrite data json dalam file

  fs.writeFile(`${__dirname}/data/cars.json`, JSON.stringify(cars), (err) => {
    // respon hanya menampilkan hasil tidak boleh ada proses (JSON.parse)
    res.status(201).json({
      status: "success",
      message: "success get cars data",
      isSuccess: true,
    });
  });
});

app.delete("/api/v1/cars/:id", (req, res) => {
  const id = req.params.id*1;
  
   // mencari data by id
   const car = cars.find((i) => i.id === id);
   // mencari indexnya
  const carIndex = cars.findIndex((car) => car.id === id);

  // eror handling kalau tidak ketemu
  if(!car) {
    console.log("gak ada data");
    return res.status(404).json({
      status: "Failed",
      message: `failed get car data this id: ${id}`,
      isSuccess: false,
      data: null,
    });
  }
  console.log(carIndex);

  console.log(cars);
  // update sesuai reques bodynya dari client atau frontend
  // object assign = menggunakan objek spread operator
  cars[carsIndex] = {...cars[carIndex], ...req.body};

  // MASUKKAN / REWRITE JSON dalam file 
  fs.writeFile(
    `${__dirname}/data/cars.json`,
    JSON.stringify(cars),
    (err) => {
      res.status(201).json({
        status: "Success",
        message: `Success update car data : ${id}`,
        isSuccess: true,
        data: null,
      });
    }
  );
});

// middleware / handler untuk url yang tidak dapat diakses karena memang tidak ada di aplikasi
// membuat middleware = our own middleware
app.use((req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: "API not exist !!!",
  });
});

app.listen("3000", () => {
  console.log("start aplikasi kita di port 3000");
});