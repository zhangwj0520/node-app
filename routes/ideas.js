const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

//引入模型
require('../models/Idea');
const Idea = mongoose.model('ideas');

//badyparser middleware
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// override with POST having ?_method=DELETE

router.get('/ideas', ensureAuthenticated,(req, res) => {
    Idea.find({user:req.user.id})
        .sort({data:"desc"})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });
        })  
})

//添加
router.get('/ideas/add', ensureAuthenticated,(req, res) => {
    res.render('ideas/add');
})
//编辑
router.get('/ideas/edit/:id',ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id:req.params.id
    })
        .then(idea => {
            if (idea.user != req.user.id) {
                req.flash('error_msg', "非法操作!!!");
                res.redirect('/ideas')
            } else {
                res.render('ideas/edit',{idea:idea});
            }
            
    })
    
})
router.post('/ideas', urlencodedParser,(req, res) => {
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
            user:req.user.id
        }
        new Idea(newUser)
            .save()
            .then(idea => {
            req.flash('success_msg',"数据添加成功")
            res.redirect('/ideas')
        })
    }
    
})

//实现编辑
router.put('/ideas/:id',urlencodedParser, (req,res) => {
    Idea.findOne({
        _id:req.params.id
    })
        .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save().
            then(idea => {
            req.flash('success_msg',"数据编辑成功")
            res.redirect("/ideas")
        })``
    })
})
//实现删除
router.delete('/ideas/:id',ensureAuthenticated, (req, res) => {
    Idea.remove({
        _id:req.params.id
    }).then(() => {
        req.flash('success_msg',"数据删除成功")
        res.redirect("/ideas")
    })
})


module.exports = router;