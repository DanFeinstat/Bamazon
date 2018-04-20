var mysql = require("mysql");
var inquirer = require("inquirer");

var con = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon",
});

function initProgram() {
  con.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + con.threadId);
    actionMenu();
  });
}

function allProducts() {
  con.query("SELECT*FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(
        "Product id: " +
          res[i].id +
          "\n Name: " +
          res[i].product_name +
          "\n Department: " +
          res[i].department_name +
          "\n Price: " +
          res[i].price +
          "\n Stock: " +
          res[i].stock_quantity
      );
    }
    newAction();
  });
}

function lowInvProducts() {
  //   con.connect(function(err) {
  //     if (err) throw err;
  //     console.log("connected as id " + con.threadId);
  con.query("SELECT*FROM products WHERE stock_quantity < 5", function(
    err,
    res
  ) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(
        "Product id: " +
          res[i].id +
          "\n Name: " +
          res[i].product_name +
          "\n Department: " +
          res[i].department_name +
          "\n Price: " +
          res[i].price +
          "\n Stock: " +
          res[i].stock_quantity
      );
    }
    newAction();
  });
}

function restock(id, newQuantity) {
  //   con.connect(function(err) {
  //     if (err) throw err;
  //     console.log("connected as id " + con.threadId);
  con.query("SELECT stock_quantity FROM products WHERE id = " + id, function(
    err,
    res
  ) {
    var stock = res[0].stock_quantity;
    console.log(
      "the current stock of item " + id + " before updating was " + stock
    );
    con.query(
      "UPDATE products SET stock_quantity = " +
        newQuantity +
        " WHERE id =" +
        id,
      function(err, res) {
        if (err) throw err;
        con.query(
          "SELECT stock_quantity FROM products WHERE id = " + id,
          function(err, res) {
            if (err) throw err;
            var stock = res[0].stock_quantity;
            console.log("The new stock quantity is " + stock);
            newAction();
          }
        );
      }
    );
  });
}

function addNewProduct(name, department, price, quantity) {
  //   con.connect(function(err) {
  //     if (err) throw err;
  //     console.log("connected as id " + con.threadId);
  con.query(
    "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES('" +
      name +
      "','" +
      department +
      "'," +
      price +
      "," +
      quantity +
      ")",
    function(err, res) {
      if (err) throw err;
      con.query("SELECT*FROM products ORDER BY id DESC LIMIT 1", function(
        err,
        res
      ) {
        if (err) throw err;
        console.log(
          "Your new item is: " +
            res[0].product_name +
            "\n department: " +
            res[0].department_name +
            "\n price: " +
            res[0].price +
            "\n remaining stock: " +
            res[0].stock_quantity
        );
        newAction();
      });
    }
  );
}

function actionMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "actions",
        choices: [
          "View Products for Sale",
          "View Low Inventory Items",
          "Adjust Stock of an Item",
          "Add New Product",
        ],
        message: "Hello manager! \n Please select one of the following options",
      },
    ])
    .then(function(answer) {
      var action = answer.actions;
      if (action == "View Products for Sale") {
        allProducts();
      } else if (action == "View Low Inventory Items") {
        lowInvProducts();
      } else if (action == "Adjust Stock of an Item") {
        inquirer
          .prompt([
            {
              type: "input",
              name: "id",
              message: "Please enter the integar id number of the product",
            },
            {
              type: "input",
              name: "quant",
              message: "Please enter the new stock quantity of said product",
            },
          ])
          .then(function(answer) {
            restock(answer.id, answer.quant);
          });
      } else {
        inquirer
          .prompt([
            {
              type: "input",
              name: "name",
              message: "Please enter the name of the product to be added.",
            },
            {
              type: "input",
              name: "department",
              message: "now enter the department of said item.",
            },
            {
              type: "input",
              name: "price",
              message: "what is the sales price of the item?",
            },
            {
              type: "input",
              name: "quant",
              message: "How many of these items are in stock?",
            },
          ])
          .then(function(answer) {
            let name = answer.name;
            let department = answer.department;
            let price = parseFloat(answer.price);
            let quant = parseFloat(answer.quant);
            addNewProduct(name, department, price, quant);
          });
      }
    });
}

function newAction() {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "new_action",
        message: "Continue working?",
      },
    ])
    .then(function(answer) {
      if (answer.new_action) {
        actionMenu();
      } else {
        console.log("Have a great day!");
        con.end();
      }
    });
}

initProgram();
