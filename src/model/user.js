const Pool = require('../config/db');

const selectAllUser = (limit, offset, searchParam,sortBY,sort) =>{
  // select workers.*, skills.name from workers inner join skills on workers.id_worker=skills.id_worker
  return Pool.query(`SELECT * FROM users WHERE fullname ILIKE '%${searchParam}%' ORDER BY ${sortBY} ${sort} LIMIT ${limit} OFFSET ${offset} `);
}

const selectUser = (id) =>{
    return Pool.query(`SELECT * FROM users WHERE id_user='${id}'`);
}


const updateUser = (data) =>{
    const { id,name,phone,jobdesk, address, workplace, description, image} = data;
    return Pool.query(`UPDATE users SET name='${name}',jobdesk='${jobdesk}',description='${description}',address='${address}',workplace='${workplace}' , image='${image}' WHERE id_worker='${id}'`);
}

const deleteUser = (id) =>{
    return Pool.query(`DELETE FROM users WHERE id_user='${id}'`);
}

const countData = () =>{
    return Pool.query('SELECT COUNT(*) FROM users')
  }
  
const findId =(id)=>{
    return  new Promise ((resolve,reject)=> 
    Pool.query(`SELECT id_user FROM users WHERE id_user='${id}'`,(error,result)=>{
      if(!error){
        resolve(result)
      }else{
        reject(error)
      }
    })
    )
  }

// AUTHENTICATION

const registerUser = (data) => {
  const { id,fullname,email,password} = data;
    
  return Pool.query(`INSERT INTO users(id_user,fullname,email,password) VALUES('${id}','${fullname}','${email}','${password}')`);
}

const findEmail = (email) => {
  return new Promise((resolve, reject) => {
      Pool.query(`SELECT * FROM users WHERE email='${email}'`, (error, result) => {
          if (!error) {
              resolve(result);
          } else {
              reject(error);
          }
      });
  });
};

module.exports = {
    selectAllUser,
    selectUser,
    updateUser,
    deleteUser,
    countData,
    findId,
    registerUser,
    findEmail
}
