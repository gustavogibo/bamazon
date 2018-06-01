var mysql = require("mysql");
var inquirer = require("inquirer");
var {table} = require("table");
var md5 = require("md5");
var chalk = require("chalk");


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
  });
  
// connect to the mysql server and sql database
connection.connect(function(err) {
if (err) throw err;
// run the start function after the connection is made to prompt the user
// start();
// viewProducts();
start();
});

function start() {

    var welcomeOptions = [{
      type:"input",
      message:chalk.green("Please inform your username"),
      name:"username"
    },
    {
      type:"password",
      mask: '*',
      message:chalk.green("Please inform your password"),
      name:"password"
    }];

    // inquirer.prompt(welcomeOptions).then(actionUsername(response));
    inquirer.prompt(welcomeOptions).then(function(response) {
      actionUsername(response);

    });

};

function viewProducts(option) {
  var header = ["ID", "Name", "Department", "Price"];
  var headerLowInventory = ["ID", "Name", "Department", "Stock", "Price"];
  var tableResult = [];
  var tablePart;
  var output;

  

  if(option === 1) {

    tableResult.push(header);

    connection.query("SELECT * FROM products", function(err, results) {

      for (let index = 0; index < results.length; index++) {
        
        tablePart = [
          results[index].item_id,
          results[index].product_name,
          results[index].department_name,
          results[index].price
        ];

        tableResult.push(tablePart);
      }

      output = table(tableResult);

      console.log(chalk.green(output));

    });

  } else if(option == 2){

    tableResult.push(headerLowInventory);

    connection.query("SELECT * FROM products", function(err, results) {

      if(results.length > 0) {

        for (let index = 0; index < results.length; index++) {
          
          tablePart = [
            results[index].item_id,
            results[index].product_name,
            results[index].department_name,
            results[index].stock_quantity,
            results[index].price
          ];

          tableResult.push(tablePart);
        }

        output = table(tableResult);

        console.log(chalk.green(output));

      }

    });

  } else {

    tableResult.push(headerLowInventory);

    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, results) {

      if(results.length > 0) {

        for (let index = 0; index < results.length; index++) {
          
          tablePart = [
            results[index].item_id,
            results[index].product_name,
            results[index].department_name,
            results[index].stock_quantity,
            results[index].price
          ];

          tableResult.push(tablePart);
        }

        output = table(tableResult);

        console.log(chalk.green(output));

      } else {

        console.log(chalk.blue("====================="));
        console.log("Everything's fine, sir! No low stock today!");
        console.log(chalk.green("=====================")); 

      }
    });

  }
}

function actionUsername(input) {

  connection.query("SELECT * FROM users WHERE username= ? AND password= ?",[input.username, md5(input.password)], function(err, res) {

      if(err) {

        console.log(err);

        } else {
        
        if(res.length != 0) {

          console.log(chalk.green("================"));
          console.log("Welcome, "+res[0].username+"!");
          console.log(chalk.green("================"));

          switch(res[0].department) {

            case 1:

              setTimeout(function () {
                optionsGuest();
              },1000);
              

            break;

            case 2:

              setTimeout(function () {
                optionsManager();
              },1000);

              

            break;

            case 3:

              setTimeout(function () {
                optionsSupervisor();
              },1000);
              
            break;
          }

        } else {

          console.log(chalk.red("Username and/or password are incorrect. Please try again!"));

          setTimeout(function() {
            start();
          }, 1000);

        }

      }

    });

}

function optionsGuest() {
  viewProducts(1);

  setTimeout(function () { 

    var inputGuest = [{
      type:"input",
      message:chalk.green("Choose the item that you would like to buy by its ID. Type 'q' to exit."),
      name:"itemId"
      }
    ];

    inquirer.prompt(inputGuest).then(function(response) {

      var answer = response.itemId;
      if(answer.toLowerCase() == "q") {
  
        start();
  
      } else {
  
        selectItemQuantity(answer);
  
      }
  
    });

  }, 1000);

}

function selectItemQuantity(itemId) {

  connection.query("SELECT * FROM products WHERE item_id = ?", itemId, function(err, result) {

    if(err) {

      console.log(err);

    } else {

      if(result.length > 0) {

        console.log(chalk.blue("You selected "+result[0].product_name));

        setTimeout(function () {

          var selectQuantity = [{

            type:"input",
            name:"quantity",
            message:chalk.green("Please choose the quantity of the chosen item.")
    
          }];

          inquirer.prompt(selectQuantity).then(function(response, itemId) {

            var answer = response.quantity;
              checkStock(answer, result[0].item_id);
        
          });

        }, 1000);

      } else {

        console.log(chalk.red("Please choose an existing ID!"));
        setTimeout(function () { 
          optionsGuest();
        }, 2000);

      }

    }

  });

}

function checkStock(quantity, productId) {

  var updatedQuantity = 0;

  var updateSales = 0;

  connection.query("SELECT * FROM products WHERE item_id = ?", [productId], function(err, result) {

    if(err) {

      console.log(err);

    } else {
    
      if(parseInt(result[0].stock_quantity) > parseInt(quantity)) {

        updatedQuantity = parseInt(result[0].stock_quantity) - parseInt(quantity);

        updateSales = parseInt(quantity) + parseInt(result[0].product_sales);

        updateStock(productId, updatedQuantity, quantity, result[0].price, updateSales);

      } else {

        console.log(chalk.red("There is not enough quantity for this item. Please choose a smaller quantity."));

        setTimeout(function (productId) {

          selectItemQuantity(productId);

        }, 1000);

      }

    }

  });

}

function updateStock(id, finalQuantity, quantity, price, stock_sales) {

  connection.query("UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?", [finalQuantity, stock_sales, id], function(err, result) {

    if(err) {

      console.log(err);

    } else {

      var finalPrice = parseInt(quantity) * parseFloat(price);
      console.log(chalk.blue("Product Updated! Your total is " +finalPrice.toFixed(2)+". See you next time!"));

      setTimeout(function () {
        optionsGuest();
      }, 2000);

    }

  });

}

function optionsManager() {

  var manager = [{
    type:"list",
    message:chalk.green("Please, select your options"),
    choices: ["View products for sale", "View low inventory", "Add to Inventory", "Add new product", "Log out"],
    name:"action"
  }];

  inquirer.prompt(manager).then(function (response) {

    switch(response.action) {
      case "View products for sale":

        viewProducts(2);

        setTimeout(function() {
          optionsManager();
        }, 2000);

      break;
      case "View low inventory":

        viewProducts(3);

        setTimeout(function() {
          optionsManager();
        }, 2000);

      break;
      case "Add to Inventory":

        addToInventory();

      break;
      case "Add new product":

        addNewProduct();

      break;
      case "Log out":

        setTimeout(function() {

          start();

        }, 1000);

      break;

    }

  });

}

function addToInventory() {

  viewProducts(2);
  
  setTimeout(function () { 

    var inputManager = [{
      type:"input",
      message:chalk.green("Choose the item that you would like to increase its stock. Type 'q' to exit."),
      name:"itemId"
      }
    ];

    inquirer.prompt(inputManager).then(function(response) {

      var answer = response.itemId;
      if(answer.toLowerCase() == "q") {
  
        optionsManager();
  
      } else {
  
        updateInventory(answer);
  
      }
  
    });

  }, 1000);

  

}

function updateInventory(itemId) {

  connection.query("SELECT * FROM products WHERE item_id = ?", itemId, function(err, result) {

    if(err) {

      console.log(err);

    } else {

      if(result.length > 0) {

        console.log(chalk.blue("You selected "+result[0].product_name));

        setTimeout(function () {

          var selectQuantity = [{

            type:"input",
            name:"quantity",
            message:chalk.green("Please choose the quantity that you want to add.")
    
          }];

          inquirer.prompt(selectQuantity).then(function(response) {

            var finalQuantity = parseInt(result[0].stock_quantity) + parseInt(response.quantity);
            
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [finalQuantity, itemId], function(err, result) {

              console.log(chalk.green("Product Updated! The total quantity stock is " +finalQuantity+". See you next time!"));
          
              setTimeout(function () {
                optionsManager();
              }, 2000);
          
          
            });
        
          });

        }, 1000);



      } else {

        console.log(chalk.red("Please choose an existing ID!"));
        setTimeout(function () { 
          optionsManager();
        }, 2000);

      }

    }

  });

}

function addNewProduct() {

  var newProductInfo = [
    {
      type:"input",
      name:"name",
      message:chalk.green("What's the product name?")
    },
    {
      type:"input",
      name:"department",
      message:chalk.green("What's the product department?"),
    },
    {
      type:"input",
      name:"price",
      message:chalk.green("What's the product price?"),
    },
    {
      type:"input",
      name:"quantity",
      message:chalk.green("What's the product quantity?"),
    }
  ];

  inquirer.prompt(newProductInfo).then(function(response) {

    var queryInsert = "INSERT INTO products (product_name, department_name, stock_quantity, price, product_sales) values (?, ?, "+parseInt(response.quantity)+", "+parseFloat(response.price)+", 0)";

    connection.query(queryInsert, [response.name, response.department], function(err, result) {

      if(err) {

        console.log(err);

      } else {

        console.log(chalk.green("Product created! Check it out the updated product list."));

        setTimeout(function () { 
          viewProducts(1);
        }, 1000);

        setTimeout(function () { 
          optionsManager();
        }, 3000);

      }  
  
    });

  });
}

function optionsSupervisor() {

  var supervisor = [{
    type:"list",
    message:chalk.green("Please, select your options"),
    choices: ["Report - Products Sales by department", "Add New Department", "Log out"],
    name:"action"
  }];

  inquirer.prompt(supervisor).then(function (response) {

    switch(response.action) {
      case "Report - Products Sales by department":

        showSalesByDepartment();

        setTimeout(function() {
          optionsSupervisor();
        }, 2000);

      break;
      case "Add New Department":

        addNewDepartment();

      break;
      
      case "Log out":

        setTimeout(function() {

          start();

        }, 1000);

      break;

    }

  });

}

function showSalesByDepartment() {

  var header = ["ID", "Department", "Overhead Costs", "Product Sales", "Profit"];
  var tableResult = [];
  var tablePart;
  var output;

  tableResult.push(header);

  var queryResults = "SELECT dep.department_id, dep.department_name, dep.over_head_costs, SUM(prod.product_sales) as sales, (SUM(prod.product_sales) - dep.over_head_costs) as profit from departments dep INNER JOIN products prod ON dep.department_name = prod.department_name GROUP BY dep.department_name ORDER BY dep.department_id;"

    connection.query(queryResults, function(err, results) {

      for (let index = 0; index < results.length; index++) {
        
        tablePart = [
          results[index].department_id,
          results[index].department_name,
          results[index].over_head_costs,
          results[index].sales,
          results[index].profit
        ];

        tableResult.push(tablePart);
      }

      output = table(tableResult);

      console.log(chalk.green(output));

    });

}

function addNewDepartment() {

  var newDepartment = [
    {
      type:"input",
      name:"name",
      message:chalk.green("What's the department name?"),
    },
    {
      type:"input",
      name:"overhead",
      message:chalk.green("What's the Overhead cost?"),
    }
  ];

  inquirer.prompt(newDepartment).then(function(response) {

    var queryInsert = "INSERT INTO departments (department_name, over_head_costs) values (?, ?)";

    connection.query(queryInsert, [response.name, parseInt(response.overhead)], function(err, result) {

      if(err) {

        console.log(err);

      } else {

        console.log(chalk.green("Department created!"));

        setTimeout(function () { 
          optionsSupervisor();
        }, 3000);

      }  
  
    });

  });

}
