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

  async getOneItemRelations(req, res, next) {
    const {itemId, payer} = req.body
    console.log(req.body, itemId, payer)
    try{
      const OneItemRelations = await itemModel.getItemPaymentRelation(itemId, payer)
      res.status(200).json({
        data: OneItemRelations,
        message: 'OneItemRelations'
      })
    } catch(err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}