const {
    selectAllProduct,
    selectProduct,
    countData,
    insertProduct,
    findId,
    // findName,
    deleteProduct,
    updateProduct
  } = require("../model/product");

  const { uploadPhotoCloudinary } = require('../../cloudinary')
  const commonHelper = require("../helper/common");
  const { v4: uuidv4 } = require('uuid');
  
  const productController = {

    getAllProduct: async(req, res) => {
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 100;
        const offset = (page - 1) * limit;
        let sortBY = req.query.sortBY || "id_products";
        let sort = req.query.sort || 'ASC';
        let searchParam = req.query.search || "";
        const result = await selectAllProduct(limit, offset, searchParam,sortBY,sort);
        
        const {
          rows: [count],
        } = await countData();
        const totalData = parseInt(count.count);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = {
          currentPage: page,
          limit: limit,
          totalData: totalData,
          totalPage: totalPage,
        };

        commonHelper.response(res , result.rows, 200, "get data success",pagination);
      } catch (error) {
        console.log(error);
      }
    },


    getDetailProduct: async (req, res) => {
      const id = req.params.id;
      const { rowCount } = await findId(id);
        if (!rowCount) {
          return res.json({message: "product not Found"})
        }
      selectProduct(id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "get data success");
        })
        .catch((err) => res.send(err));
    },

    updateProduct: async (req, res) => {
      const id = req.params.id;
      const { name, stock, buy_price, sell_price } = req.body;

      const oldDataResult = await selectProduct(id);
      const oldData = oldDataResult.rows[0];
  
      const { rowCount } = await findId(id);
      if (!rowCount) return commonHelper.response(res, null, 401, "Failed getting product");
  
      const data = {
        id,
        name, 
        stock, 
        buy_price,
        sell_price,
      };
  
      if (req.file) {
        const upload = await uploadPhotoCloudinary(req.file.path);
        data.photo = upload.secure_url || url
        console.log(data.photo);
      } else {
        data.photo = oldData.photo;
        console.log(data.photo);
      }
  
      updateProduct(data).then(result => {
        commonHelper.response(res, result.rows, 201, "Data product updated!");
      }).catch(error => {
        res.status(500).send(error);
      })
    },


    deleteProduct: async (req, res) => {
      try {
        const id = req.params.id;
        console.log(id);
        const { rowCount } = await findId(id);

        if (!rowCount) {
         return res.json({message: "Product not Found"})
        }
        deleteProduct(id)
          .then((result) =>
            commonHelper.response(res, result.rows, 200, "Product deleted")
          )
          .catch((err) => res.send(err));
      } catch (error) {
        console.log(error);
      }
    },

    inputProduct: async (req, res) => {
      const id = uuidv4();
      const { name, stock, buy_price, sell_price} = req.body;

      if (req.file == undefined) return commonHelper.response(res, null, 400, "Please input image");
      const upload = await uploadPhotoCloudinary(req.file.path);
  
      const data = {
        id,
        name,
        stock,
        buy_price,
        sell_price,
        photo: upload.secure_url
      }

      console.log(data);

      insertProduct(data)
      .then(result => {
        commonHelper.response(res, result, 201, "Product created")
      })
      .catch(error => {
        res.status(500).send(error);
      })
    }

  };
  
  module.exports = productController;