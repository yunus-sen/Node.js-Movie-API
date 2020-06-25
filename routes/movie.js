const express = require('express');
//movie model.
const router = express.Router();
const Movie=require('../models/Movie');


router.get('/', (req, res, next)=> {
  const promise =Movie.find({});

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});


router.get('/between/:start_year/:end_year', (req, res, next)=> {
  const{start_year, end_year}=req.params;
  const promise =Movie.find({
    year:{
          "$gte":parseInt(start_year ),"$lte":parseInt(end_year )
    }
  });

  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

router.get('/top10',(req,res,next)=>{
  const promise=Movie.find({ }).limit(10).sort({imbd_score:-1});
  promise.then((data)=>{
    if(!data)
      next({message:"Movie was not found"});
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});


router.get('/:movie_id',(req,res,next)=>{
  const promise=Movie.findById(req.params.movie_id);
  promise.then((data)=>{
    if(!data)
      next({message:"Movie was not found"});
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});




router.put('/:movie_id',(req,res,next)=>{
  const promise=Movie.findByIdAndUpdate(req.params.movie_id,req.body,{new :true});
  promise.then((data)=>{
    if(!data)
      next({message:"Movie was not found"});
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

router.delete('/:movie_id',(req,res,next)=>{
  const promise=Movie.findByIdAndRemove(req.params.movie_id);
  promise.then((data)=>{
    if(!data)
      next({message:"Movie was not found"});
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

router.post('/',(req,res)=>{

  //const {title,imbd_score,category,country,year,test }=req.body;

  const movie=new Movie(req.body);
 /* 1.yol
     movie.save((err,data)=>{
    res.json(data);
  });*/

  //2. yol saglıklı olan

  const promise=movie.save();

  promise.then((data)=>{
    res.json({status:1});
  }).catch((err)=>{
    res.send(err);
  });

})
module.exports = router;
