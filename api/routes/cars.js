const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Car = require('../models/car');

router.get('/', (req, res, next) => {
  Car.find()
    .select('_id car_brand car_model car_color car_transmission car_dimensions car_rent_min_price')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        cars: docs.map(doc => {
          return {
            car_brand: doc.car_brand,
            car_model: doc.car_model,
            //car_image: doc.car_image,
            car_color: doc.car_color,
            car_transmission: doc.car_transmission,
            car_dimensions: doc.car_dimensions,
            car_rent_min_price: doc.car_rent_min_price,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:7000/cars/' + doc._id
            }
          }
        })
      };
      //if (docs.length >= 0) {
      res.status(200).json(response);
      // } else {
      //   res.status(404).json({
      //     message: 'No entries found'
      //   });
      // }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post('/', (req, res, next) => {
  const car = new Car({
    _id: new mongoose.Types.ObjectId(),
    car_brand: req.body.car_brand,
    car_model: req.body.car_model,
    //car_image: req.body.car_image,
    car_color: req.body.car_color,
    car_transmission: req.body.car_transmission,
    car_dimensions: req.body.car_dimensions,
    car_rent_min_price: req.body.car_rent_min_price
  });
  car
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created car successfully',
        createdCar: {
          car_brand: result.car_brand,
          car_model: result.car_model,
          //car_image: result.car_image,
          car_color: result.car_color,
          car_transmission: result.car_transmission,
          car_dimensions: result.car_dimensions,
          car_rent_min_price: result.car_rent_min_price,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:7000/cars/' + result._id
          }
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

router.get('/:carId', (req, res, next) => {
  const id = req.params.carId;
  Car.findById(id)
    .select('_id car_brand car_model car_color car_transmission car_dimensions car_rent_min_price')
    .exec()
    .then(doc => {
      console.log("From DB", doc);
      if (doc) {
        res.status(200).json({
          car: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:7000/cars'
          }
        });
      } else {
        res.status(404).json({ message: 'No valid entry found for provided ID' });
      }
    })
    .catch(err => { console.log(err); res.status(500).json({ error: err }); });
});

router.patch('/:carId', (req, res, next) => {
  const id = req.params.carId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Car.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http://localhost:7000/cars/' + id
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

router.delete('/:carId', (req, res, next) => {
  const id = req.params.carId;
  Car.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Car deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:7000/cars',
          body: {
            car_brand: 'String',
            car_model: 'String',
            car_color: 'String',
            car_transmission: 'String',
            car_dimensions: 'String',
            car_rent_min_price: 'Number'
          }
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

module.exports = router;