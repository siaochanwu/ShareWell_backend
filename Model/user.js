const {PrismaClient} = require('@prisma/client')


const prisma = new PrismaClient()

  module.exports = class user {
    constructor() {

    }

  async findAllUsersData() {
    const allUser = await prisma.User.findMany()
    console.log(allUser)
    return allUser
  }

  async createUser(userData) {
    try {
      const userExist = await prisma.User.findFirst({
        where: {
          email: userData.email
        }
      })

      if(userExist) {
        return `This email ${userData.email} already exists`
      }
    } catch(e) {
      console.log('e', e)
      throw e
    }
    
    const createUserData = await prisma.User.create({
      data: userData 
    })
    return createUserData
  }

  async deleteUser(id) {
    try {
      const deleteuser = await prisma.User.delete({
        where: {
          id
        }
      })
      return deleteuser
    } catch(e) {
      console.log(e)
      throw e
    }
  }

  async updateUser(id, userdata) {
    const {name, nickName, email} = userdata
    try {
      const updateuser = await prisma.User.update({
        where: {
          id
        },
        data: {
          name, 
          nickName, 
          email,
          updatetime: new Date()
        }
      })
      return updateuser
    } catch(e) {
      console.log(e)
      throw e
    } 
  }

}


