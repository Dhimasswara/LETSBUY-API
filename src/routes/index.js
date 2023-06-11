
const express = require('express')
const router = express.Router()
const userRoutes = require('../routes/user')
const productRoutes = require('../routes/product')



router.use('/user', userRoutes)
router.use('/product', productRoutes)








// 

module.exports = router;