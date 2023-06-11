const {
  selectAllUser,
  selectUser,
  updateUser,
  deleteUser,
  countData,
  findId,
  registerUser,
  findEmail,
} = require("../model/user");
const { uploadPhotoCloudinary } = require('../../cloudinary')
const commonHelper = require("../helper/common");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const authHelper = require('../helper/AuthHelper');
const jwt = require('jsonwebtoken');

const userController = {

  getAllUser: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;
      const offset = (page - 1) * limit;
      let sortBY = req.query.sortBY || "id_user";
      let sort = req.query.sort || 'ASC';
      let searchParam = req.query.search || "";
      const result = await selectAllUser(limit, offset, searchParam, sortBY, sort);

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

      commonHelper.response(res, result.rows, 200, "get data success", pagination);
    } catch (error) {
      console.log(error);
    }
  },


  getDetailUser: async (req, res) => {
    const id = req.params.id;
    const { rowCount } = await findId(id);
    if (!rowCount) {
      return res.json({ message: "ID is Not Found" })
    }
    selectUser(id)
      .then((result) => {
        commonHelper.response(res, result.rows, 200, "get data success");
      })
      .catch((err) => res.send(err));
  },


  updateUser: async (req, res) => {
    const id = req.params.id;
    const { name,workplace, jobdesk, address, description, image } = req.body;

    const oldDataResult = await selectUser(id);
    const oldData = oldDataResult.rows[0];
    

    // const upload = await uploadPhotoCloudinary(req.file.path)
    // console.log(upload.secure_url || url);

    const { rowCount } = await findId(id);
    if (!rowCount) return res.json({ message: "Worker Not Found!" });

    const data = {
      id,
      name,
      workplace,
      jobdesk,
      address,
      description,
      // image: upload.secure_url
    };

    if (req.file) {
      const upload = await uploadPhotoCloudinary(req.file.path);
      data.image = upload.secure_url || url
      console.log(data.image);
    } else {
      data.image = oldData.image;
      console.log(data.image);
    }

    // // console.log(req.body);

    updateUser(data).then(result => {
      commonHelper.response(res, result.rows, 201, "Data Worker Updated!");
    }).catch(error => {
      res.status(500).send(error);
    })
  },


  deleteUser: async (req, res) => {
    try {
      const id = req.params.id;
      const { rowCount } = await findId(id);
      const role = req.payload.id;

      if (role !== id) return res.json({ message: 'Permission denied, token not match' })


      if (!rowCount) {
        return res.json({ message: "ID is Not Found" })
      }
      deleteUser(id)
        .then((result) =>
          commonHelper.response(res, result.rows, 200, "Worker deleted")
        )
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
    }
  },

  registerUser: async (req, res) => {
    const { fullname, email, password} = req.body;
    const { rowCount } = await findEmail(email);

    if (rowCount) return commonHelper.response(res, null, 500, "Email already exists")

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);
    const id = uuidv4();

    const data = {
      id,
      fullname,
      email,
      password: passwordHash,
    }


    registerUser(data)
      .then(result => {
        commonHelper.response(res, result.rows, 201, "Data user created")
      })
      .catch(error => {
        res.send(error)
      })
  },

   loginUser: async (req, res) => {
      try {
        const { email, password } = req.body;
        const { rows: [user] } = await findEmail(email);
  
        if (!user) return commonHelper.response(res, null, 401, "Email is invalid" )
  
  
        const validatePassword = bcrypt.compareSync(password, user.password);
        if (!validatePassword) return commonHelper.response(res, null, 401, "Password is invalid" )
  
        delete user.description;
        delete user.password;
  
        let payload = {
          email: user.email,
          id: user.id_user
        }  
  
        user.token = authHelper.generateToken(payload);
        user.refreshToken = authHelper.generateRefreshToken(payload)
  
        commonHelper.response(res, user, 201, "Login Successfull")
      } catch (error) {
        console.log(error);
        return commonHelper.response(res, null, 500, "Failed to login")
      }
    },

  refreshToken: (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
      let decode = jwt.verify(refreshToken, process.env.SECRETE_KEY_JWT);

      const payload = {
        email: decode.email,
        role: decode.role
      };

      const result = {
        token: authHelper.generateToken(payload),
        refreshToken: authHelper.generateRefreshToken(payload)
      };

      commonHelper.response(res, result, 200)
    } catch (error) {
      console.log(error);
    }
  },

  profileUser: async (req, res) => {
    const email = req.payload.email;
    const { rows: [user] } = await findEmail(email);

    delete user.password;

    commonHelper.response(res, user, 200);
  }

};

module.exports = userController;
