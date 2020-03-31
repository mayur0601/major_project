const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersPosts = require('../controllers/posts_controller');

// router.get('/posts',usersPosts.posts);

router.post('/create',passport.checkAuthentication,usersPosts.create);

module.exports = router;