const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Rent were fetched'
  });
});

router.post('/', (req, res, next) => {
  const rent = {
    carId: req.body.carId,
    quantity: req.body.quantity
  }
  res.status(201).json({
    message: 'Rent was created',
    rent: rent
  });
});

router.get('/:rentId', (req, res, next) => {
  res.status(200).json({
    message: 'Rent details',
    rentId: req.params.rentId
  });
});

router.delete('/:rentId', (req, res, next) => {
  res.status(200).json({
    message: 'Rent deleted',
    rentId: req.params.rentId
  });
});

module.exports = router;