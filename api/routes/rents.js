const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Rent = require('../models/rent');
const Car = require('../models/car');

router.get('/', (req, res, next) => {
  Rent.find()
    .select('car quantity _id')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        rents: docs.map(doc => {
          return {
            _id: doc._id,
            car: doc.car,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http://localhost:7000/rents/' + doc._id
            }
          }
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post('/', (req, res, next) => {
  Car.findById(req.body.carId)
    .then(car => {
      if (!car) {
        return res.status(404).json({
          message: 'Car not found'
        });
      }
      const rent = new Rent({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        car: req.body.carId
      });
      return rent.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Rent stored',
        createdRent: {
          _id: result._id,
          car: result.car,
          quantity: result.quantity
        },
        request: {
          type: 'GET',
          url: 'http://localhost:7000/rents/' + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:rentId', (req, res, next) => {
  Rent.findById(req.params.rentId)
    .exec()
    .then(rent => {
      if (!rent) {
        return res.status(404).json({
          message: 'Rent not found'
        });
      }
      res.status(200).json({
        rent: rent,
        request: {
          type: 'GET',
          url: 'http://localhost:7000/rents'
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:rentId', (req, res, next) => {
  Rent.remove({ _id: req.params.rentId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Rent deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:7000/rents',
          body: {
            carId: 'ID',
            quantity: 'Number'
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;