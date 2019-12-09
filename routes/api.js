// Route handlers
const express = require('express');
const router = express.Router();
const uuid = require('uuid/v1')
const moment = require('moment')

//import data models
const User = require("../models/user");
const Business = require("../models/business");
const Photo = require("../models/photo");
const Review = require("../models/review");

const PATH = '/Users/tongw/Downloads/yelp_photos/photos/'

//---------------------------------------------------user------------------------------------------------
//user login and validation identity
router.post('/login', function(req, res){
    User.findOne({email : req.body.email}, function(err, u) {
        //console.log(req.body)
        if (err){
            res.json({err:err})
        } 
        else if (u){
            let id = u['_id']
            if (u.password === req.body.password) {
                console.log(id)
                res.cookie('userId', id,{
                    maxAge: 6*100000,
                    httpOnly: false
                }).json({ret_code: 0, id : id})
            }
            else res.json({ret_code: 1, ret_msg: 'password is not correct, try again!'});
        }
        else{
            res.json({ret_code: 2, msg: 'Invalid Email!'})
        }
      })
});

//user signin, save new user into database
router.post('/signup', function(req, res){
    let date = moment(new Date()).format('YYYY-MM-DD')
    let u = new User(req.body);
    let uid = uuid();
    u.user_id = uid;
    u.review_count = 0;
    u.yelping_since = date;
    u.save().then(item => {
        //res.send("new user has created");
        res.json({ret_code: 0,item})
    })
    .catch(err => {
        res.status(400).send("unable to save new user into database")
    })
})

//userpage search business by business name
router.post('/byBname/', function(req, res){
    Business.find({name : req.body.name}, function(err, b_list){
        if (err) {
            res.json({err:err})
        }
        else res.json(b_list);
    }).limit(5);
})


//-----------------------------------------------------photo-------------------------------------------------
let photos = []
//find photo by business_id
// router.post('/photo', (req, res) => {
//     Photo.find({'business_id' : req.body.business_id})
//     .exec()
//     .then(data=>{
//         photos = data.map(x => x.photo_id)
//     })
//     .then(data=>{
//         photos.forEach(p => {console.log(p),
//             res.sendFile(`${PATH}${p}.jpg`)
//         }
//         );
//     })
// })


//find photoId by business_id
router.post('/photoId/', function(req,res){
    Photo.find({'business_id' : req.body.business_id}, function(err, p_list) {
        if (err) {
            throw err;
        }
        else {
            photos = p_list.map(x => x.photo_id)
            console.log(photos)
            res.json({photos})

        }
    })
})

//get photo by photoID
router.get('/photo/:photo_id', function(req, res){
    const PATH = '/Users/tongw/Downloads/yelp_photos/photos/'
     res.sendFile(`${PATH}${req.params.photo_id}.jpg`)
     console.log(req.params.photo_id)
    //res.sendFile(`${PATH}1RjZ8f0jfznHs51hPRSQ.jpg`)
    //res.sendFile('/Users/tongw/Downloads/yelp_photos/photos/__1RjZ8f0jfznHs51hPRSQ.jpg')
})

//Not recommend to update a photo, user can delete it.
//UPDATE a specific photo, only the business_id, caption and label could be changed.
// router.put("/photo/:id", function(req, res) {
//     Photo.findById(req.params.id, function(err, photo) {
//       photo.business_id = req.body.business_id;
//       photo.caption = req.body.caption;
//       photo.label = req.body.label;
//       photo.save();
//       res.json(photo);
//     });
//   });
  
//   //DELETE a specific photo
//   router.delete("/photo/:id", function(req, res){
//     Photo.findById(req.params.id, function(err, photo) {
//       photo.remove(function(err){
//           if(err){
//             res.status(500).send(err);
//           }
//           else{
//             res.status(204).send('removed');
//           }
//       });
//     });
//   });


//just test
router.get('/hello', function(req, res){
    if(req.cookie){
        console.log(req.cookies.userId)
        res.json({msg:'Welcome'})
    }
    else{
        res.json({msg:'Hello'})
    }
})

//-------------------------------------------------review-------------------------------------------

//GET Reviews by a specific business
router.get("/review/business/:business_id", function(req, res){
  Review.find({business_id: req.params.business_id}, function(err, review_list) {
    res.json(review_list);
  });
});

//GET Reviews by a specific user
router.get("/review/user/:uid", function(req, res){
  Review.find({user_id: req.params.uid}, function(err, review_list) {
    res.json(review_list);
  });
});

//*GET Reviews by a review_id
router.get("/review/id/:rid", function(req, res){
  Review.find({review_id: req.params.rid}, function(err, review_list) {
    res.json(review_list);
  });
});

//CREATE a new Review
//create review 为什么要用cookie????
// router.post('/review', function(req, res){
//   //save business_id into cookie
//   //setCookie('business_id', req.body.business_id);
//   let review = new Review(req.body);
//   review.save();
//   res.status(201).send(review);
// });

//DELETE a specific Review
//business cannot delete user review
// router.delete("/review/id/:review_id", function(req, res){  
//   Review.get({review_id: req.params.review_id}, function(err, review) {
//     //save business_id into cookie
//     setCookie('business_id', business_id);
//   })
//   Review.deleteMany({review_id: req.params.review_id}, function(err, review) {
//     if(err){
//       res.status(500).send(err);
//     }
//     else{
//       res.status(204).send('removed');
//     }
//   });
// });


//delete one review, refresh new stars and review_count in business
// router.put("/review/business", function(req, res) {
//   Business.find({business_id: req.cookies.business_id}, function(err, business) {
//     var newstars0 = getCookie('newstars');
//     business.stars = newstars0;
//     business.review_count = business.review_count - 1;
//     business.save();
//   });
// });


//user create a new review, update user review count and business review count 
router.post("/newReview", (req, res) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
    let v
    let b
    let stars
    let rid = uuid()
    let date = moment(new Date()).format('YYYY-MM-DD')
    User.findOne({'user_id' : req.body.user_id})
    .exec()
    .then(data=>{
        v=data.review_count
    })
    .then(
        data=>{
            Business.findOne({'business_id' : req.body.business_id})
            .exec()
            .then(data=>{
                b = data.review_count
                stars = data.stars
            })
            .then(data=>{
                let review = new Review(req.body);
                review.review_id = rid
                review.date = date
                review.save();
                User.update({'user_id' : req.body.user_id}, {$set : {review_count : v+1}}, function(error){
                    if(error){
                        console.log(error);
                    } else {
                        console.log(v)
                    }
                })
                let nStar = Math.round((stars*b + req.body.stars) / (b+1));
                Business.update({business_id : req.body.business_id}, {$set : {review_count : b+1, stars : nStar}}, function(error){
                    if(error){
                        console.log(error);
                    } else {
                        console.log(b)
                        console.log(nStar)
                    }
                })
                res.json(review)
            })
        }
    )
    })


//user delete a review and update the review count in user review_counts and business review_counts
router.delete('/reviewD/:rid', (req, res) => {
    let uid, bid, rstar, urC, brC, bstar, review
    console.log(req.params.rid)
    Review.find({'review_id' : req.params.rid})
    .exec()
    .then(data=>{
        console.log(data)
        review = data
        uid = data[0].user_id
        bid = data[0].business_id
        rstar = data[0].stars
    })
    .then(data=>{
        Business.findOne({'business_id' : bid})
        .exec()
        .then(
            data => {
            console.log(data)
            brC = data.review_count
            bstar = data.stars
        })
        .then(data => {
            User.findOne({user_id : uid})
            .exec()
            .then(data => {
                console.log(data)
                urC = data.review_count
            })
            .then(data => {
                User.update({user_id : uid}, {$set : {review_count : urC-1}}, function(err) {
                    if (err) {
                        console.log(err);
                    } else{
                        console.log(urC)
                    }
                })
                let nStar = Math.round((bstar*brC - rstar)/(brC-1));
                Business.update({business_id : bid}, {$set : {review_count : brC-1, stars : nStar}}, function(err) {
                    if (err) {
                        console.log(err)
                    } else{
                        console.log(brC)
                    }
                })
                Review.findOneAndRemove({'review_id' : req.params.rid}, function(err){
                    if (err) {
                        res.json(err)
                    }
                    else res.json({msg: 'remove successfully'})
                })
                //res.json(review)
            })
        })
    })
})



//-------------------------------------------business-------------------------------------------------

//find 5 business by city name, sort by review counts
router.post('/cityB', function(req,res) {
    Business.find({'city' : req.body.city})
    .sort({review_count:-1}).limit(5)
    .then(data=>
        res.json(data))
})
  
  
  //GET all business information
  router.get("/business", function(req, res){
    Business.find({}, function(err, business_list) {
      res.json(business_list);
    }).limit(5);
  });
  
  //GET a specific business, Business Login System
  router.get("/business/id/:business_id", function(req, res){
    Business.find({business_id: req.params.business_id}, function(err, business) {
      res.json(business);
    });
  });
  
//   //CREATE a new business
//   router.post('/business', function(req, res){
//     let business = new Business(req.body);
//     business.save();
//     res.status(201).send(business);
//   });
  
  //UPDATE a specific business, just name, address, city, state, hour, is_open could be updated
  router.put("/business/", function(req, res) {
    //Business.findById(req.params.id, function(err, business) {
     Business.findOne({business_id : req.body.business_id}, function(err, business){
      business.name = req.body.name;
      business.address = req.body.address;
      business.city = req.body.city;
      business.state = req.body.state;
      business.hour = req.body.hour;    
      business.is_open = req.body.is_open;
      business.save();
      res.json(business);
    });
  });
  
  //DELETE a specific business, deleteMany or deleteOne
//   router.delete("/business/id/:business_id", function(req, res){
//     Business.deleteMany({business_id: req.params.business_id}, function(err, review) {
//       if(err){
//         res.status(500).send(err);
//       }
//       else{
//         res.status(204).send('removed');
//       }
//     });
//   });


    

module.exports = router;