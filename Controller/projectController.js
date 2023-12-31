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

  async getOneProject(req, res, next) {
    console.log(req.params)
    const {projectid} = req.params

    try {
      const findOneProjectData = await projectModel.findOneProjectData(projectid);
      res.status(200).json({ data: findOneProjectData, message: 'findOne' });
    } catch(err) {
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
    console.log(req.params)
    const {projectid} = req.params
    try {
      const deleteProjectData = await projectModel.deleteProject(projectid)
      res.status(200).json({ data: deleteProjectData, message: 'deleteprojectData' });
    } catch(err) {
      throw err
    }
  }

  async getOneProjectUser(req, res, next) {
    console.log(req.params)
    const {projectid} = req.params

    try {
      const getOneProjectUser = await projectModel.findOneProjectGroup(projectid)
      res.status(200).json({ data: getOneProjectUser, message: 'getOneProjectUser' });
    } catch(err) {
      throw err
    }
  }


}