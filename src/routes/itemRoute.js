const express = require('express');
const router = express.Router();
const itemController = require('../controllers').itemController;

// Yeni bir item oluşturma
router.post('/create', itemController.createItem);

// Tüm itemleri listeleme
router.get('/getAll', itemController.getAllItems);

// ID'ye göre bir item getirme
router.post('/getById', itemController.getItemById);

// ID'ye göre bir item güncelleme
router.post('/update', itemController.updateItem);

// ID'ye göre bir item silme
router.post('/delete', itemController.deleteItem);

router.post('/getItemsByPage', itemController.getItemsByPage);

module.exports = router;
