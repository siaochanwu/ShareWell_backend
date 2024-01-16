const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

module.exports = class Item {
  constructor() {

  }

  //1.find all item
  async findAllItems(projectId) {
    try{
      const allItems = await prisma.$queryRaw`SELECT I.*, U.name as payer FROM Item as I 
      LEFT JOIN User as U ON I.payerId=U.id where I.projectId=${projectId}`
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
      await prisma.$transaction(async (tx) => {
        const newItem = await tx.item.create({
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
  
        for (let user of users) {
          console.log('user: ', user, payerId)
          if(user == payerId) {
            const result = await this.createItemGroup(user, itemId, receiver)
            // console.log('1111 result', result)
          } else {
            const result = await this.createItemGroup(user, itemId, -eachPayment)
            // console.log('22222 result', result)
          }
        }
        return newItem
      })
    } catch(err) {
      console.error('Transaction failed, rollback...', err.message);
      prisma.$rollback();
    } finally {
      await prisma.$disconnect();
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

  async getItemPaymentRelation(itemId, payer) {
    try {
      const allItems = await prisma.$queryRaw`SELECT I.*, U.name as name FROM ItemGroup as I 
      LEFT JOIN User as U ON I.userId=U.id where I.itemId=${itemId}`
      allItems.map((item) => item.payer = payer)
      return allItems
    } catch(err) {
      throw err
    }
  }


  
};
