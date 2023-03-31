const { ObjectId } = require('bson');
const express = require('express');
const express_handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const product = require('./Product');
const e = require('express');
const app = express();
const uri ="mongodb+srv://user:o9NABjohhcAFTZti@cluster0.rwudpjs.mongodb.net/userManager?retryWrites=true&w=majority";

app.listen(3030,()=>{
    console.log("Server đang chạy");
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.engine('.hbs', express_handlebars.engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.get('/', async (req, res) => {
    await mongoose.connect(uri);
    console.log("Thành Công");

    let list = await product.find().lean();
    let i =1;
    res.render('index', {
        layout: 'main',
        data : list,
        helper:{
            foo(){
                return String(i++);
            }
        }
    });
});

app.post('/', async (req, res) => {
    await mongoose.connect(uri);
    console.log("Thành Công");
    let name = req.body.name;
    let price = req.body.price;
    let quantity = req.body.quantity;

    let addProduct = new product({
        name:name,
        price:price,
        quantity:quantity,
    })

    await addProduct.save();

    let list = await product.find().lean();
    res.render('index', {
        layout: 'main',
        data : list,
    });
});

app.post('/homeDelete', async (req, res) => {
   
  
    let id = req.body.idDelete;
    
    try {
        await mongoose.connect(uri);
        console.log(id);
        console.log("Thành Công");
        await product.deleteOne({_id:id});
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});

app.post('/homeUpdateInfor', async (req, res) => {
    await mongoose.connect(uri);
    console.log("Thành Công");
    let id = req.body.idUpdate;
    let productEdit = await product.findOne({_id:id}).lean();
    let name = productEdit.name;
    let price = productEdit.price;
    let quantity = productEdit.quantity;
    res.render('edit', {
        layout: 'main',
        idEdit:id,
        nameEd : name,
        priceEd : price,
        quantityEd : quantity,
    });
});

app.post('/home', async (req, res) => {
    await mongoose.connect(uri);
    
    let id = req.body.edit;
    console.log(id);
    let name = req.body.name;
    let price = req.body.price;
    let quantity = req.body.quantity;

    let editProduct = new product({
       _id:id,
    })

    await editProduct.updateOne({name:name,price:price,quantity:quantity});


    res.redirect("/");
});