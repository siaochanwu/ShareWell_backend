const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

module.exports = class Item {
  constructor() {

  }

  //1.find all item

  async findAllItems(projectId) {
    try{
      const allItems = await prisma.item.findMany({
        where: {
          projectId: projectId
        }
      })
      return allItems
    } catch(err) {
      throw err
    }

  }

  //2.add one item
  //calculate pay and receive save to itemGroup table
  async createNewItem({projectId, name, price, itemDate, payerId, payment, users}) {
    const eachPayment = price / users.length;
    const receiver = payment - eachPayment;
    const itemId = uuidv4()
    //收 (+)  付 (-)

    try {
      const newItem = await prisma.item.create({
        data: {
          id: itemId,
          name,
          projectId,
          price,
          date: new Date(itemDate),
          payerId,
          payment
        }
      })

      users.map(async(user) => {
        if(user == payerId) {
          const result = await this.createItemGroup(user, itemId, receiver)
          // console.log('1111 result', result)
        } else {
          const result = await this.createItemGroup(user, itemId, -eachPayment)
          // console.log('22222 result', result)
        }
      })

      //會比前面更早執行
      return newItem
    } catch(err) {
      throw err
    }
  }

  async createItemGroup(userId, itemId, payment) {
    try {
      const itemGroup = await prisma.itemGroup.create({
        data: {
          id: uuidv4(),
          userId,
          itemId,
          payment
        }
      })
      console.log(itemGroup)
    } catch(err) {
      throw err
    }
  }


  
};
