const fs = require('fs')
const path = require('path')
const utils = require('../lib/utils')
const insecurity = require('../lib/insecurity')
const config = require('config')
const db = require('../data/mongodb')

module.exports = function exportProfile () {
  return (req, res, next) =>  {
    const loggedInUser = insecurity.authenticatedUsers.get(req.cookies.token)
    if (loggedInUser && loggedInUser.data && loggedInUser.data.email && loggedInUser.data.id) {
      const jsonFile = 'userData_' + loggedInUser.data.id + '.json'
      console.log(loggedInUser.data)
      const username = loggedInUser.data.username === '' ? 'n.a.' : loggedInUser.data.username
      const email = loggedInUser.data.email
      const updatedEmail = email.replace(/[aeiou]/gi, '*')

      db.orders.find({ $where: "this.email === '" + updatedEmail + "'"}).then(orders => {
        const result = utils.queryResultToJson(orders)
        const data = result.data
        let userData
        if(data.length > 0) {
          let orders = []
          data.map(order => {
            let finalOrder = {
              orderId: order.orderId,
              totalPrice: order.totalPrice,
              products: [...order.products],
              bonus: order.bonus,
              eta: order.eta
            };
            orders.push(finalOrder)
          })

          userData = {
            username,
            email: email,
            orders: orders
          }
        }
        else {
          userData.orders = "No orders placed yet"
        }
        fs.writeFile (path.join(__dirname, '../ftp/', jsonFile), JSON.stringify(userData, null, 2), function(err) {
          if (err) throw err;
          // console.log('Completed');
          const data = fs.readFileSync(path.join(__dirname, '../ftp/', jsonFile));
          res.contentType("application/json");
          res.send(data);
        })
      },
      () => {
        next(new Error('Wrong param for finding orders'))
      })
    } else {
        next(new Error('Blocked illegal activity by ' + req.connection.remoteAddress))
      }
  }
}
