# node-app

## 演示地址
 [node-app](https://node-app-0923.herokuapp.com/)
 已经注册了两个测试账号：test1@qq.com/test1,test2@qq.com/test2,

## 说明
通过nodejs实现的一个课程管理系统
1. 使用了handlebars模板引擎;
2. 数据库使用了MongoDB,线上环境使用的是mlab;
3. 使用crypt对注册用户的密码进行加密存储,(前期使用bcrypt加密,heroku项目上线出错后移除);
4. 登录认证使用passport;
5. 使用method-override，实现了对课程修改及删除后对数据库的修改及删除;
6. 使用connect-flash实现相应的提示,例如注册时密码不一致、登录成功等;
7. 使用body-parser实现对post请求的请求体进行解析;
8. 创建登录守卫实现对每个用户数据的保护;
9. 通过在在数据模型中添加user字段,保证每个用户只能访问自己的数据;
10. 注册信息校验在后端实现;

## 技术栈 
通过node、express等

## 使用
```
git https://github.com/zhangwj0520/node-app
cd node-app
npm install
npm start
```





