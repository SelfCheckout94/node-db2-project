const express = require("express");
const {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
} = require("./cars-middleware");
const Cars = require("./cars-model");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const cars = await Cars.getAll();
    res.status(200).json(cars);
  } catch (err) {
    next();
  }
});

router.get("/:id", checkCarId, (req, res) => {
  res.status(200).json(req.car);
});

router.post(
  "/",
  checkCarPayload,
  checkVinNumberUnique,
  checkVinNumberValid,
  async (req, res, next) => {
    try {
      const newCar = await Cars.create(req.body);
      res.status(200).json(newCar);
    } catch (err) {
      next();
    }
  }
);

// eslint-disable-next-line
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    custom: "Something wen wrong with the cars router",
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
