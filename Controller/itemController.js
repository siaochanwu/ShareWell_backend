const model = require('../Model/item')
const itemModel = new model()

module.exports = class itemController {
  constructor() {

  }

  async getAllItems(req, res, next) {
    const {id} = req.params
    try{
      const allItem = await itemModel.findAllItems(id)
      res.status(200).json({
        data: allItem,
        message: 'allItem'
      })
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async createItem (req, res, next) {
    console.log(req.body)
    try{
      const createNewItem = await itemModel.createNewItem(req.body)
      res.status(200).json({
        data: createNewItem,
        message: 'createNewItem'
      })
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  
  async deleteItem(req, res, next) {
    const {id} = req.params
    try{
      const deleteOneItem = await itemModel.deleteOneItem(id)
      res.status(200).json({
        data: deleteOneItem,
        message: 'deleteOneItem'
      })
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async getOneItemRelations(req, res, next) {
    const {itemId} = req.body
    try{
      const OneItemRelations = await itemModel.getItemPaymentRelation(itemId)
      res.status(200).json({
        data: OneItemRelations,
        message: 'OneItemRelations'
      })
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async getPaymentByUserAndProject(req, res, next) {
    const {userId} = req.body
    try{
      const paymentByUserAndProject = await itemModel.getPaymentTotalByUserAndProject(userId)
      res.status(200).json({
        data: paymentByUserAndProject,
        message: 'paymentByUserAndProject'
      })
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async getUserItem(req, res, next) {
    const {userId} = req.body
    const {projectid} = req.params
    try{
      const getUserItems = await itemModel.findUserItems(userId, projectid)
      res.status(200).json({
        data: getUserItems,
        message: 'getUserItems'
      })
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }


}