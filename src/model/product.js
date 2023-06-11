const Pool = require('../config/db');

const selectAllProduct = (limit, offset, searchParam, sortBY, sort) => {
  return Pool.query(`SELECT * FROM product WHERE name ILIKE '%${searchParam}%' ORDER BY ${sortBY} ${sort} LIMIT ${limit} OFFSET ${offset} `);
}

const selectProduct = (id) =>{
    return Pool.query(`SELECT * FROM product WHERE id_products='${id}'`);
}

const insertProduct = (data) => {
  const { id, name, stock, buy_price, sell_price, photo } = data;
  return Pool.query(`INSERT INTO product (id_products,name,stock,buy_price,sell_price,photo ) VALUES('${id}','${name}','${stock}','${buy_price}','${sell_price}','${photo}')`);
}

const updateProduct = (data) =>{
  const { id, name, stock, buy_price, sell_price, photo } = data;
  return Pool.query(`UPDATE product SET name='${name}', stock='${stock}', buy_price='${buy_price}', sell_price='${sell_price}',photo='${photo}' WHERE id_products='${id}'`);
}

const deleteProduct = (id) =>{
    return Pool.query(`DELETE FROM product WHERE id_products='${id}'`);
}

const countData = () => {
  return Pool.query('SELECT COUNT(*) FROM product')
}

const findId = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT id_products FROM product WHERE id_products='${id}'`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  )
}

// const findName = (id_worker) => {
//   return new Promise((resolve, reject) =>
//     Pool.query(`SELECT id_worker FROM product where id_worker='${id_worker}'`, (error, result) => {
//       if (!error) {
//         resolve(result)
//       } else {
//         reject(error)
//       }
//     })
//   )
// }

module.exports = {
  selectAllProduct,
  // findName,
  selectProduct,
  insertProduct,
  updateProduct,
  deleteProduct,
  countData,
  findId
}