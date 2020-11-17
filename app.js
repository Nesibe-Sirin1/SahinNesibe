const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

app.set('view engine', 'pug');
app.set('views','./views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');

const errorController = require('./controllers/errors');
const sequelize =require('./utility/database');

const Category =require('./models/category');
const Product =require('./models/product');
const { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } = require('constants');
const User=require('./models/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) =>{
    User.findByPk(1)
        .then(user =>{
            req.user =user;
            next();
        })
        .catch(err =>{
            console.log(err);
        })
})

// routesp
app.use('/admin', adminRoutes);
app.use(userRoutes);

app.use(errorController.get404Page);

//Product.hasOne(Category);
Product.belongsTo(Category,{      //bir üün bir category
    foreignKey:{
        allowNull:false
    }
});   
Category.hasMany(Product);   //bir category birden fazla ürün

Product.belongsTo(User);
User.hasMany(Product);

sequelize
    //.sync({ force: true })
    .sync()
    .then(() =>{
        User.findByPk(1)
            .then(user =>{
                if(!user){
                    return User.create({name:'nesibe_sahinnn',email:'nesibe.ns.sahin'});
                }
                return user;
            }).then(user =>{
                Category.count()
                    .then(count => {
                        if(count===0){
                            Category.bulkCreate([
                                {name:'Telefon', description:'telefon kategorisi'},
                                {name:'Bilgisayar', description:'bilgisayar kategorisi'},
                                {name:'Elektronik', description:'Elektronik kategorisi'}
                            ]);
                        }
                    });
            });
    })
    .catch(err => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log('listening on port 3000');
});
