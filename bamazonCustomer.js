//require necessary node packages
var mysql = require("mysql");
var inquirer = require("inquirer");

var con = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon",
});

con.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + con.threadId);
  con.query("SELECT*FROM products", function(err, result) {
    if (err) throw err;
    console.log(result);
    inquirer
      .prompt([
        {
          type: "input",
          name: "item_Id",
          message: "Enter the ID number of the item you'd like to purchase.",
        },
        {
          type: "unput",
          name: "order_quantity",
          message: "Please enter how many you'd like to purchase.",
        },
      ])
      .then(function(answer) {
        var item = answer.item_Id;
        var quantity = answer.order_quantity;
        orderItem(item, quantity);
      });
  });
  //   con.end();
});

function orderItem(item, quantity) {
  //   con.connect(function(err) {
  //     if (err) throw err;
  con.query("SELECT*FROM products WHERE ?", [{ id: item }], function(
    err,
    result
  ) {
    if (err) throw err;
    console.log(
      "remaining stock of " +
        result[0].product_name +
        ": " +
        result[0].stock_quantity
    );
    if (result[0].stock_quantity < quantity) {
      console.log("Insufficient Quantity!");
    } else {
      console.log(item);
      var newStock =
        parseFloat(result[0].stock_quantity) - parseFloat(quantity);
      con.query(
        "UPDATE products SET stock_quantity = " +
          newStock +
          " WHERE id = " +
          item,
        function(err, result) {
          console.log("Thank you for your purchase!");
        }
      );
    }
    con.end();
  });
  //   });
}
