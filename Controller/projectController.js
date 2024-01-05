const model = require('../Model/project')
const projectModel = new model()

module.exports = class userController{
  constructor() {

  }

  async getAllProject(req, res, next) {
    try {
      const findAllProjectData = await projectModel.findAllProjectData();
      res.status(200).json({ data: findAllProjectData, message: 'findAll' });
    } catch(err) {
      console.log(err)
      throw err
    }
  }


  async createProject(req, res, next) {
    try {
      console.log(req.body)
      const createProjectData = await projectModel.createProject(req.body)
      res.status(200).json({ data: createProjectData, message: 'createProject' });
    } catch(err) {
      throw err
    }
  }

  async deleteUser(req, res, next) {
    try {
      console.log(req.params)
      const {projectid} = req.params
      const deleteProjectData = await projectModel.deleteProject(projectid)
      res.status(200).json({ data: deleteProjectData, message: 'deleteprojectData' });
    } catch(err) {
      throw err
    }
  }


}