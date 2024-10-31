const express = require('express');
const router = express.Router();
const serviceProviderController = require('../controllers/serviceProviderController');
const auth = require('../middleware/auth');

router.get('/', serviceProviderController.getServiceProviders);
router.get('/time-slots', serviceProviderController.getTimeSlots);
router.post('/:id/reviews', auth, serviceProviderController.addReview);

module.exports = router;
