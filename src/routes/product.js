const express = require('express');
const router  = express.Router();
const productController = require('../controller/product');
const {validateSeller} = require('../middleware/common');
const {protect} = require('../middleware/Auth');
const upload = require('../middleware/Multer');


router.get("/", productController.getAllProduct);
router.get("/detail/:id", productController.getDetailProduct);
router.post('/', upload, validateSeller, productController.inputProduct);
router.delete("/delete/:id", protect, productController.deleteProduct);
router.put("/update/:id", protect, upload, validateSeller, productController.updateProduct);

module.exports = router;