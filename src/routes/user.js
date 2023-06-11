const express = require('express');
const router  = express.Router();
const userController = require('../controller/user');
const {validateSeller} = require('../middleware/common');
const {protect} = require('../middleware/Auth');
const upload = require('../middleware/Multer');


router.get("/", userController.getAllUser);
router.get("/:id", userController.getDetailUser);
router.put("/:id",  protect, upload, userController.updateUser);
router.delete("/:id", protect, userController.deleteUser);

// Authenticated

router.post('/register', validateSeller, userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/refreshtoken', userController.refreshToken);
router.get('/get/profile', protect, userController.profileUser);


module.exports = router;