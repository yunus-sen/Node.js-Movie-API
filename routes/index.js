const express = require('express');
const router = express.Router();
const User=require('../models/Users');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Express' });
});



router.post('/register', (req, res, next)=> {
    const{username,password}=req.body;

    bcrypt.hash(password, 10).then((hash) =>{
        // Store hash in your password DB.
        const user=new User({
            password:hash,
            username
        });
        const promise=user.save();
        promise.then((data)=>{
            res.json(data);
        }).catch((err)=>{
            res.send(err);
        });
    });

});


router.get('/users', (req, res, next)=> {
    const promise=User.find({});
    promise.then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.send(err);
    });
});

router.post('/authenticate',(req,res,nex)=>{
    const {username,password}=req.body;

    User.findOne({username},(err,data)=>{
        if(err)
            throw err;
        if(!data)
            res.json({
                status:false,
                message:'user was not found.'
            });
        else{
            bcrypt.compare(password, data.password, function(err, result) {
                if(!result){
                    res.json({
                        status:false,
                        message:'hatalı şifre veya kullanıcı adı.'
                    });
                }else{
                    const payload={
                        username
                    };
                    const token=jwt.sign(payload,req.app.get('api_secret_key'),{
                        expiresIn:720
                    } );
                    res.json({
                        status:true,
                        token
                    });

                }
            });
        }
    });
});


module.exports = router;
