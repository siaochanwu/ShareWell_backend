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
      throw err
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
      throw err
    }
  }
}