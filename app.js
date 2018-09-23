const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash')
const app = express();

//connect to mongoose

mongoose.connect("mongodb://localhost/node-app")
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
//badyparser middleware
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//session &flash middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
app.use(flash());

//配置全局变量,
app.use((req,res,next) => {
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg');
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
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({data:"desc"})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });
        })
    
})

//添加
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
})
//编辑
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id:req.params.id
    })
        .then(idea => {
            res.render('ideas/edit',{idea:idea});
    })
    
})
app.post('/ideas', urlencodedParser,(req, res) => {
    console.log(req.body);
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: "请输入标题!" });
    }
    if (!req.body.details) {
        errors.push({ text: "请输入详情!" });
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors:errors,
            title: req.body.title,
            details:req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
        }
        new Idea(newUser)
            .save()
            .then(idea => {
            res.redirect('/ideas')
        })
    }
    
})

//实现编辑
app.put('/ideas/:id',urlencodedParser, (req,res) => {
    Idea.findOne({
        _id:req.params.id
    })
        .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save().
            then(idea => {
            res.redirect("/ideas")
        })``
    })
})
//实现删除
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({
        _id:req.params.id
    }).then(() => {
        req.flash('success_msg',"数据删除成功")
        res.redirect("/ideas")
    })
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on ${port}`);
})