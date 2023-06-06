var express = require('express');
var router = express.Router();

const memesCtrl = require('../controllers/memes');
//const meme = require('../models/meme');
// getting all memes
router.get('/', memesCtrl.index);
// getting a specific meme
router.get('/:id', memesCtrl.show)
// posting new meme
router.post('/', memesCtrl.create)
// updating meme 
router.put('/:id', memesCtrl.update)
// deleting 
router.delete('/:id', memesCtrl.remove)
// post like 
router.post('/:id/like', memesCtrl.like)
// post dislike
router.post('/:id/dislike', memesCtrl.dislike)
// post comment 
router.post('/:id/comments', memesCtrl.addComment)
// delete comment 
router.delete('/:id/comments/:commentId', memesCtrl.deleteComment)

module.exports = router;
