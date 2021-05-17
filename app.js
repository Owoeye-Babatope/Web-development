//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];


mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true })

const itemSchema = {
  name: String,

};

const Item = mongoose.model("item", itemSchema);


// Create new document using mongoose

const item1 = new Item({
name: "Welcome to your To-do list"

})
const item2 = new Item({
  name: "Hit the + button to add an item"

})
const item3 = new Item({
  name: "Hit the - button to delete an item"

});


let itemArray = [item1, item2, item3];

const listSchema = {
  name:String,
  items: [itemSchema],
};

const List = mongoose.model("list", listSchema);
const day = date.getDate();
app.get("/", function(req, res) {
  

  Item.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {

      Item.insertMany(itemArray, (err) => {

        if (err) {
          console.log(err);

        } else {
          console.log("success");
        }


      });
      res.redirect("/");

    } else{
      res.render("list", { listTitle: day, newListItems: foundItems });

    }
    if (err) {
      consolee.log(err);
    } else {
      console.log(foundItems);
    }
    
    
  });




  

});

app.post("/", function(req, res){
 
  const item = req.body.newItem;
  const listName = req.body.list;



  if (item.length === 0) {
    res.redirect("/");
  }else {
    const newDocument = new Item({
      name: item,
    });

    if(listName === day){
      newDocument.save();
      res.redirect("/");
    }else{
      List.findOne({name: listName}, (err, foundList) => {
        foundList.items.push(newDocument);
        foundList.save();
        res.redirect("/" + listName);
      })
    }

    
  }

  
});

app.post("/delete", function(req,res){
   const itemToDelete = req.body.checkbox;
  const listName = req.body.listName;
  // console.log(listName);

  if (listName === day){

    Item.findByIdAndRemove(itemToDelete, (err) => {
      if(!err){
        console.log("Successfully deleted ");
        res.redirect("/")
      }
    });

  }else{
    List.findAndUpdate(itemToDelete, (err) => console.log("Successfully deleted from " + listName + " list"))
    res.redirect("/" + listName);
  }
  //  console.log(itemToDelete);
   
  });
  

app.get("/:paramName", function(req, res){
  const paramName = req.params.paramName;
  // console.log(paramName);
  List.findOne({ name: paramName }, (err, found) => {
    if (!err) {
      if(!found){
        // Create New List
        const list = new List({
          name: paramName,
          items: itemArray,

        });


        list.save();
        res.redirect("/"+paramName);
      }else{
        // show an existing list
        res.render("list", {listTitle: found.name, newListItems: found.items});
      }

    }

  })


  
  
  // res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
