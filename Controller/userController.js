const model = require('../Model/user.js')
const userModel = new model()

module.exports = class userController{
  constructor() {

  }
  
  async getAllUser(req, res, next) {
    try {
      const findAllUsersData = await userModel.findAllUsersData();
      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch(err) {
      console.log(err)
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async getOneUser(req, res, next) {
    try {
      const {userId} = req.body
      const getUserData = await userModel.findOneUsersData(userId)
      res.status(200).json({ data: getUserData, message: 'getOneUserData' });
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async createUser(req, res, next) {
    try {
      console.log(req.body)
      const createUserData = await userModel.createUser(req.body)
      res.status(200).json({ data: createUserData, message: 'createUser' });
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async deleteUser(req, res, next) {
    try {
      console.log(req.params)
      const {id} = req.params
      const deleteUserData = await userModel.deleteUser(id)
      res.status(200).json({ data: deleteUserData, message: 'deleteUserData' });
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async updateUser (req, res, next) {
    try {
      console.log(req.params)
      const {id} = req.params
      const updateUserData = await userModel.updateUser(id, req.body)
      res.status(200).json({ data: updateUserData, message: 'updateUserData' });
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

}

