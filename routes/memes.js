var express = require('express');
var router = express.Router();

const memesCtrl = require('../controllers/memes');
const ensureLoggedIn = require('../config/ensureLoggedIn');
//const meme = require('../models/meme');
// getting all memes
router.get('/', memesCtrl.index);
// posting new meme
router.post('/', ensureLoggedIn, memesCtrl.create)
// Getting the "New Meme" page
router.get('/new', ensureLoggedIn, memesCtrl.new);
// getting a specific meme
router.get('/:id', memesCtrl.show)

// updating meme 
router.post('/:id/updateForm', ensureLoggedIn, memesCtrl.updateForm);

router.post('/:id/update', ensureLoggedIn, memesCtrl.update);
//router.put('/:id/update', memesCtrl.update)
// deleting 
router.post('/:id/delete', ensureLoggedIn, memesCtrl.remove)


module.exports = router;
