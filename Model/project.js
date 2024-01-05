const {PrismaClient} = require('@prisma/client')
const { v4: uuidv4 } = require('uuid');


const prisma = new PrismaClient()

module.exports = class project {
  constructor() {
    this.findAllProjectGroupData = this.findAllProjectGroupData.bind();
    this.createProjectGroup = this.createProjectGroup.bind();
    this.deleteProjectGroup = this.deleteProjectGroup.bind();
    
  }

  //find all
    //find projectGroup

  async findAllProjectData() {
    const allProject = await prisma.Project.findMany()
    // console.log(allProject)
    for (let i = 0; i < allProject.length; i++) {
      allProject[i].users = []
      const data = await this.findAllProjectGroupData(allProject[i].id)
      data.map((item) => {
        allProject[i].users.push(item.name)
      })
      // console.log(allProject[i].users)
    }
    return allProject
  }

  async findAllProjectGroupData(projectId) {
    //userId > user_name  join
    const allProjectGroup = await prisma.$queryRaw`SELECT U.name FROM ProjectGroup as P LEFT JOIN User as U ON P.userId=U.id where P.projectId=${projectId}`;
    //array
    return allProjectGroup
  }



  //create new
    //create projectGroup table []
  async createProject({name, startDate, endDate, currency, location, users}) {
    const projectId = uuidv4();
    try {
      const createProjectData = await prisma.Project.create({
        data: {
          id: projectId,
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          currency,
          location,
        }
      })

      for (let i = 0; i < users.length; i++) {
        await this.createProjectGroup(users[i], projectId)
      }

      return createProjectData
    } catch(err) {
      console.log(err)
    }
  }

  
  async createProjectGroup(userId, projectId) {
    try {
      const createProjectGroup = await prisma.ProjectGroup.create({
        data: {
          id: uuidv4(),
          userId,
          projectId
        }
      })

      return createProjectGroup

      // return new Promise((resolve, reject) => {

      // })
    } catch(err) {
      console.log(err)
    }
    
  }

  
  //update 
    //check whether projectGroup change

  //delete
    //delete projectGroup as well

  async deleteProject(projectId) {
    console.log('projectId', projectId)
    try {
      const deleteProjectData = await prisma.Project.delete({
        where: {
          id: projectId
        }
      })
      await this.deleteProjectGroup(projectId)

      return deleteProjectData
    } catch(e) {
      console.log(e)
      throw e
    }
  }  

  async deleteProjectGroup(projectId) {
    try {
      const deleteProjectGroup = await prisma.ProjectGroup.deleteMany({
        where: {
          projectId: projectId
        }
      })
      return deleteProjectGroup
    } catch(e) {
      console.log(e)
      throw e
    }
  }

}