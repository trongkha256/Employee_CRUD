"use strict";
const express = require('express')
const session = require('express-session')
const cookieParser = require("cookie-parser");
const { sqlLogin, Employees,addEmployee } = require('./database')
var CryptoJS = require("crypto-js");

const keymahoa = '0000'

const app = express()
const port = 8000

app.set('trust proxy', 1)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'SESSION FOR THE BEST',
}))

app.use(express.static('public'))

app.get('/api/employee', (req, res) => {
    if (req.session.userid) {
        Employees(req.session.userid)
            .then(data =>
                { 
                    data.forEach((item,index)=>{
                        var byte = CryptoJS.AES.decrypt(item.LUONG.toString('utf-8'),keymahoa)
                        item.LUONG = byte.toString(CryptoJS.enc.Utf8)
                    })
                    res.json(data);
                })
            .catch(errors=>console.log(errors))
    } else
        res.status(401).send("You are not login !")
});

app.post('/api/login', (req, res) => {
    sqlLogin(req.body.username, req.body.password)
        .then(data => {
            if (data) {
                req.session.userid = data;
                req.session.pass = req.body.password;
                res.status(200).json({ message: "success" })
            }
            else {
                res.status(401).json({ error: "Username or password is incorrect" })
            }
        })
})

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.send("You are logged out");
});

app.get('*', (req, res)=>{
    res.sendFile(__dirname + '/public/index.html')
})

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`)
})

app.post('/api/addEmployee', (req, res) => {
    addEmployee(req.body.MANV, req.body.HOTEN, req.body.EMAIL,req.body.LUONG,req.body.TENDN,req.body.MATKHAU)
        .then(data => {
            res.json({ message: "success" })
        })
        .catch(error => {
            res.json({ error: "error" })
        })
})

