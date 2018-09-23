const express = require('express');
const exphbs = require('express-handlebars');
const path=require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


const app = express();

const ideas=require('./routes/ideas')
const users = require('./routes/users');
require('./config/passport')(passport);

const db=require("./config/database")

//connect to mongoose

//mongoose.connect("mongodb://localhost/node-app")
mongoose.connect(db.mongoURL,{ useNewUrlParser: true } )
    .then(() => {
    console.log("Mongdb connected...")
    }).catch((err) => {
        console.log(err)
    })

//引入模型
require('./models/Idea');
const Idea = mongoose.model('ideas');

//handlebar middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//使用静态文件
app.use(express.static(path.join(__dirname,'public')))

app.use(methodOverride('_method'));

//session &flash middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//配置全局变量,
app.use((req,res,next) => {
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user||null;
    next()
})

//配置路由
app.get('/', (req, res) => {
    const title="大家好,我是张为杰"
    res.render('index', {
        title:title
    });
})
app.get('/about', (req, res) => {
    res.render('about');
})

//使用routers
app.use('/',ideas)
app.use('/users',users)






const port = process.env.PORT||5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`);
})