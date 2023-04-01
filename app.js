// //jshint esversion:6

// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// // const date = require(__dirname + "/date.js");

// const app = express();

// app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));
// mongoose.connect("mongodb://127.0.0.1.27017/todolistDB1")
// .then(()=>{
//   console.log("MongoDB connected successfully");
// })
// .catch((error)=>{
//   console.log("MongoDBconnection error:",error);
// })
// const itemSchema = new mongoose.Schema({
//    name: {
//     type: String,
//     required: true
//    }
// });
// const Item = mongoose.model("Item",itemSchema);
// const Item1 = new Item({
//   name:"Welcome to your todolist!"
// });
// const Item2 = new Item({
//   name:"Hit the + button to add new item"
// });
// const Item3 = new Item({
//   name:"<-- Hit these to delete an item"
// });
// const defaultItems = [Item1,Item2,Item3];
// Item.insertMany(defaultItems);
// // const items = ["Buy Food", "Cook Food", "Eat Food"];
// // const workItems = [];

// app.get("/", function(req, res) {

// // const day = date.getDate();

//   res.render("list", {listTitle: "Today", newListItems: items});

// });

// app.post("/", function(req, res){

//   const item = req.body.newItem;

//   if (req.body.list === "Work") {
//     workItems.push(item);
//     res.redirect("/work");
//   } else {
//     items.push(item);
//     res.redirect("/");
//   }
// });

// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.get("/about", function(req, res){
//   res.render("about");
// });

// app.listen(3000, function() {
//   console.log("Server started on port 3000");
// });
//jshint esversion:6

//above code didnt worked somehow 
//below code works  

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const db = require("./config/db");
// db();
const _ = require("lodash");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', false);
// mongoose.connect('mongodb+srv://admin-sid:siddharth@13@cluster0.iowbsjo.mongodb.net/todolistDB');
// async function main() {
//   // await mongoose.connect('mongodb://0.0.0.0:27017/todolistDB', { useNewUrlParser: true});
//   await mongoose.connect('mongodb+srv://admin-sid:siddharth@13@cluster0.iowbsjo.mongodb.net/todolistDB');
//   console.log("Connected");
// }
mongoose.connect("mongodb+srv://admin-sid:siddharth%4013@cluster0.iowbsjo.mongodb.net/todolistDB");
const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item ({
  name: "Welcome to your to-do-list"
});
const item2 = new Item ({
  name: "Hit + to add item"
});
const item3 = new Item ({
  name: "Hit <-- to delete item"
});
const defaultItems = [item1, item2, item3];
const listSchema = {
  name: String,
  items: [itemsSchema]
}
const List = mongoose.model("List", listSchema);
// Item.insertMany(defaultItems);

//lecture 342 ends here 
//lecture 343 starts here
app.get("/", function(req, res) {

// const day = date.getDate();

Item.find({}).then(function(foundItems){
  if (foundItems.length === 0) {
    Item.insertMany(defaultItems);
    res.redirect("/");
  }else {
    res.render("list", { listTitle: "Today", newListItems: foundItems });
  }
  })
 
.catch(function(err){
  console.log(err);
});

});
//lecture 344 implementation above
app.get("/:customListName",function(req,res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName}).then(function(doc){
  if(!doc){
    const list = new List({
      name: customListName,
      items: defaultItems
    });
    list.save();
    res.redirect("/"+customListName);
  }else{
    res.render("list",{listTitle: doc.name,newListItems:doc.items})
  }
  });
  
  
});
//lecture 347 implementation here 
app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
      name: itemName
  });
  if(listName==="Today"){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}).then(function(doc){
      doc.items.push(item);
      doc.save();
      res.redirect("/"+listName);
    });
  }
  
});
//lecture 347 code above ended
//lecture 346 codes
app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName==="Today"){
    Item.findById(checkedItemId)
    .then((item)=>{
      item.deleteOne();
      res.redirect("/");
    })
  }else{
    List.findOneAndUpdate(
      {name: listName},
      {
        $pull:{items:{_id:checkedItemId}}
      },
      {'new':true}
    ).then((doc)=>{
      console.log(doc);
    }).catch(err=>console.log(err));
    res.redirect("/"+listName)
  }
// //   Item.findById(checkedItemId)
// // .then((item)=>{
// //   item.deleteOne();
// //   res.redirect("/");
// })

});
//lecture 346 codes 
//lecture 347 codes
// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});