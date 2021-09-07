const { getById, getAll } = require("./cars-model");
const vinValidator = require("vin-validator");

const checkCarId = async (req, res, next) => {
  try {
    const car = await getById(req.params.id);
    if (car) {
      req.car = car;
      next();
    } else {
      next({
        status: 404,
        message: `car with id ${req.params.id} is not found`,
      });
    }
  } catch (err) {
    next();
  }
};

const checkCarPayload = (req, res, next) => {
  const { vin, make, model, mileage } = req.body;
  if (!vin) {
    next({
      status: 400,
      message: "vin is missing",
    });
  } else if (!make) {
    next({
      status: 400,
      message: "make is missing",
    });
  } else if (!model) {
    next({
      status: 400,
      message: "model is missing",
    });
  } else if (!mileage) {
    next({
      status: 400,
      message: "mileage is missing",
    });
  } else {
    next();
  }
};

const checkVinNumberValid = (req, res, next) => {
  const { vin } = req.body;
  const isValidVin = vinValidator.validate(vin);
  isValidVin ? next() : next({ status: 400, message: `vin ${vin} is invalid` });
};

const checkVinNumberUnique = async (req, res, next) => {
  const { vin } = req.body;
  const cars = await getAll();
  const existingVin = cars.find((car) => {
    return car.vin === vin;
  });
  !existingVin
    ? next()
    : next({ status: 400, message: `vin ${vin} already exists` });
};

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
};
