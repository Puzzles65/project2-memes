var express = require('express');
var router = express.Router();

const memesCtrl = require('../controllers/memes');
//const meme = require('../models/meme');
// getting all memes
router.get('/', memesCtrl.index);
// posting new meme
router.post('/', memesCtrl.create)
// Getting the "New Meme" page
router.get('/new', memesCtrl.new);
// getting a specific meme
router.get('/:id', memesCtrl.show)

router.post('/:id/update', memesCtrl.update);
// updating meme 
router.put('/:id', memesCtrl.update)
// deleting 
router.post('/:id/delete', memesCtrl.remove)


module.exports = router;
