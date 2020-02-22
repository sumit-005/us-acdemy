const express = require("express");
const multer = require("multer");
const Post = require("../models/post");
const checkAuth = require('../middleware/check-auth');

const router = express.Router();
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg' : 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({

  destination: (req,file,cb) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid){
      error = null;
    }  
    cb(error, "backend/images");
  },
  filename:(rq,file,cb) => {
    
    const name = file.originalname
    .toLowerCase().split(' ').join('-');
    const  ext = MIME_TYPE_MAP[file.mimetype];
    cb(null,name + '-' + Date.now() + '.' +
     ext );
  }
}); 


router.post('',checkAuth ,multer({storage: storage}).single("image"),(req,res,next) =>{
const url = req.protocol + '://' + req.get("host");

const post = new Post({
  title: req.body.title,
  company: req.body.company,
  description: req.body.description,
  email : req.body.email,
  mblno : req.body.mblno,
  gender : req.body.gender,
  designation : req.body.designation,
  bday : req.body.bday,
  imagePath: url + "/images/" + req.file.filename

});
  post.save().then(createPost=>{
     res.status(201).json({
    message:"Post Added Successfully.",
    post : {
      ...createPost,
      id: createPost._id ,
      // title : req.body.title,
      // company: req.body.company,
      // description: req.body.description,
      // email: req.body.email,
      // mblno : req.body.mblno,
      // gender : req.body.gender,
      // designation : req.body.designation,
      // bday : req.body.bday,
      // imagePath: imagePath
           
    }
  });
  });
});

router.get('/:id',(req,res,next) =>{
  Post.findById(req.params.id)
  .then(post =>{
     
    if(post){
      res.status(200).json(post);
    }else{
      res.status(404).json({message: "Page Not Found"});
    }
  });
});


router.put('/:id',checkAuth,
multer({ storage: storage }).single("image"),
(req,res,next) =>{
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
      _id: req.body.id,
      title : req.body.title,
      company: req.body.company,
      description: req.body.description,
      email: req.body.email,
      mblno : req.body.mblno,
      gender : req.body.gender,
      designation : req.body.designation,
      bday : req.body.bday,
      imagePath: imagePath
  });
  Post.updateOne({_id: req.params.id } , post)
  .then(result=>{
    if(result.nModified > 0 ){
    res.status(200).json({ message: 'Update Successfully... '});
    }else{
      res.status(401).json({ message: 'Not Authorized.. '});
    }
  });
});

router.get('',(req,res,next)=>{
  Post.find().then((documents) =>{

    res.status(200).json({
    message:"Data inserted Successfully1",
    posts:documents
  });

  });

});

router.delete('/:id',checkAuth,  (req,res,next) =>{
 Post.deleteOne({_id: req.params.id}).then((result) =>{
  if(result.n > 0 ){
    res.status(200).json({message: 'Post Deleted!'}); 
    }else{
      res.status(401).json({ message: 'Not Authorized.. '});

    }
     

 });

});



module.exports = router;
