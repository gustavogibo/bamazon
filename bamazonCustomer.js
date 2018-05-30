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

  connection.query(
    "SELECT * FROM users WHERE username= ? AND password= ?",
    [
      input.username,
      md5(input.password)
    ],
    function(err, res) {
      
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

        console.log(0);

      }
    }
  );


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

  });

}

function checkStock(quantity, productId) {

  var updatedQuantity = 0;

  connection.query("SELECT * FROM products WHERE item_id = ?", [productId], function(err, result) {

    console.log(productId);

    if(parseInt(result[0].stock_quantity) > parseInt(quantity)) {

      updatedQuantity = parseInt(result[0].stock_quantity) - parseInt(quantity);

      updateStock(productId, updatedQuantity, quantity, result[0].price);

    } else {

      console.log("There is not enough quantity for this item. Please choose a smaller quantity.");

      setTimeout(function (productId) {

        selectItemQuantity(productId);

      }, 1000);

    }

  });

}

function updateStock(id, finalQuantity, quantity, price) {

  connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [finalQuantity, id], function(err, result) {

    var finalPrice = parseInt(quantity) * parseFloat(price);
    console.log("Product Updated! Your total is " +finalPrice+". See you next time!");

    setTimeout(function () {
      optionsGuest();
    }, 2000);


  });

}

function optionsManager() {

  var manager = [{
    type:"list",
    message:"Please, select your options",
    choices: ["View products for sale", "View low inventory", "Add to Inventory", "Add new product"],
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

    }

  });

  

}

function addToInventory() {

}

function optionsSupervisor() {

}
