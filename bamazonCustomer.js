var mysql = require("mysql");
var inquirer = require("inquirer");
var {table} = require("table");
var md5 = require("md5");


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
      message:"Please inform your username",
      name:"username"
    },
    {
      type:"password",
      mask: '*',
      message:"Please inform your password",
      name:"password"
    }];

    // inquirer.prompt(welcomeOptions).then(actionUsername(response));
    inquirer.prompt(welcomeOptions).then(function(response) {
      actionUsername(response);
      // console.log(response);

    });

};

function viewProducts(option) {
  var header = ["ID", "Name", "Department", "Stock", "Price"];
  var tableResult = [];
  var tablePart;
  var output;

  tableResult.push(header);

  if(option === 1) {

    connection.query("SELECT * FROM products", function(err, results) {

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

      console.log(output);

    });

  } else {

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

        console.log(output);

      } else {

        console.log("=====================");
        console.log("Everything's fine, sir! No low stock today!");
        console.log("====================="); 

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

          console.log("================");
          console.log("Welcome, "+res[0].username+"!");
          console.log("================");

          switch(res[0].department) {

            case 1:

              optionsGuest();

            break;

            case 2:

              optionsManager();

            break;

            case 3:

              optionsSupervisor();

            break;
          }



        } else {

          console.log("Username and/or password are incorrect. Please try again!");

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
      message:"Choose the item that you would like to buy by its ID. Type 'q' to exit.",
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
        // console.log("165",result)

        console.log("You selected "+result[0].product_name);

        setTimeout(function () {
            // console.log("170", itemId)
          var selectQuantity = [{

            type:"input",
            name:"quantity",
            message:"Please choose the quantity of the chosen item."
    
          }];

          inquirer.prompt(selectQuantity).then(function(response, itemId) {

            var answer = response.quantity;
              checkStock(answer, result[0].item_id);
        
          });

        }, 1000);



      } else {

        console.log("Please choose an existing ID!");
        setTimeout(function () { 
          optionsGuest();
        }, 2000);

      }

    }

  });

}

function checkStock(quantity, productId) {

  var updatedQuantity = 0;

  connection.query("SELECT * FROM products WHERE item_id = ?", [productId], function(err, result) {

    if(err) {

      console.log(err);

    } else {
    
      if(parseInt(result[0].stock_quantity) > parseInt(quantity)) {

        updatedQuantity = parseInt(result[0].stock_quantity) - parseInt(quantity);

        updateStock(productId, updatedQuantity, quantity, result[0].price);

      } else {

        console.log("There is not enough quantity for this item. Please choose a smaller quantity.");

        setTimeout(function (productId) {

          selectItemQuantity(productId);

        }, 1000);

      }

    }

  });

}

function updateStock(id, finalQuantity, quantity, price) {

  connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [finalQuantity, id], function(err, result) {

    if(err) {

      console.log(err);

    } else {

      var finalPrice = parseInt(quantity) * parseFloat(price);
      console.log("Product Updated! Your total is " +finalPrice+". See you next time!");

      setTimeout(function () {
        optionsGuest();
      }, 2000);

    }

  });

}

function optionsManager() {

  var manager = [{
    type:"list",
    message:"Please, select your options",
    choices: ["View products for sale", "View low inventory", "Add to Inventory", "Add new product", "Log out"],
    name:"action"
  }];

  inquirer.prompt(manager).then(function (response) {

    switch(response.action) {
      case "View products for sale":

        viewProducts(1);

        setTimeout(function() {
          optionsManager();
        }, 2000);

      break;
      case "View low inventory":

        viewProducts(2);

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
  viewProducts(1);
  
  setTimeout(function () { 

    var inputManager = [{
      type:"input",
      message:"Choose the item that you would like to increase its stock. Type 'q' to exit.",
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

        console.log("You selected "+result[0].product_name);

        setTimeout(function () {

          var selectQuantity = [{

            type:"input",
            name:"quantity",
            message:"Please choose the quantity that you want to add."
    
          }];

          inquirer.prompt(selectQuantity).then(function(response) {

            console.log("401", parseInt(result[0].stock_quantity));
            console.log("402", parseInt(response.quantity));

            var finalQuantity = parseInt(result[0].stock_quantity) + parseInt(response.quantity);
            
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [finalQuantity, itemId], function(err, result) {

              console.log("Product Updated! The total quantity stock is " +finalQuantity+". See you next time!");
          
              setTimeout(function () {
                optionsManager();
              }, 2000);
          
          
            });
        
          });

        }, 1000);



      } else {

        console.log("Please choose an existing ID!");
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
      message:"What's the product name?"
    },
    {
      type:"input",
      name:"department",
      message:"What's the product department?",
    },
    {
      type:"input",
      name:"price",
      message:"What's the product price?",
    },
    {
      type:"input",
      name:"quantity",
      message:"What's the product quantity?",
    }
  ];

  inquirer.prompt(newProductInfo).then(function(response) {

    var queryInsert = "INSERT INTO products (product_name, department_name, stock_quantity, price) values (?, ?, "+parseInt(response.quantity)+", "+parseFloat(response.price)+")";

    console.log(queryInsert);

    connection.query(queryInsert, [response.name, response.department], function(err, result) {

      if(err) {

        console.log(err);

      } else {

        console.log("Product created! Check it out the updated product list.");

        setTimeout(function () { 
          viewProducts(1);
        }, 1000);

        setTimeout(function () { 
          optionsManager();
        }, 3000);

      }  
  
    });

  })
}

function optionsSupervisor() {

}
