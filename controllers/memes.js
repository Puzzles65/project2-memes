const Meme = require('../models/meme');

module.exports = {
  index,
  show,
  create,
  update,
  remove,
  like,
  dislike,
  addComment,
  deleteComment,
  new: newMeme,
};

async function index(req, res) {
  try {
    const memes = await Meme.find({});
    res.render('memes/index', { title: 'All Memes', memes });
  } catch (err) {
    res.status(500).send('Error retrieving memes');
  }
}

async function show(req, res) {
  try {
    const meme = await Meme.findById(req.params.id);
    res.render('memes/show', { title: 'Meme Detail', meme });
  } catch (err) {
    res.status(404).send('Meme not found');
  }
}

function newMeme(req, res) {
  res.render('memes/new', { title: 'Add Memes' });
}

async function create(req, res) {
  try {
    const { title, description, imageUrl } = req.body;
    const user = req.user; 
    
    const newMeme = new Meme({
      title,
      description,
      imageUrl,
      user: user._id, // Assign the ObjectId of the user to the user field
    });

    const savedMeme = await newMeme.save();
    res.redirect(`/memes/${savedMeme._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating meme');
  }
}
async function update(req, res) {
  try {
    const meme = await Meme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/memes/${meme._id}`);
  } catch (err) {
    res.status(500).send('Error updating meme');
  }
}

async function remove(req, res) {
  try {
    await Meme.findByIdAndRemove(req.params.id);
    res.redirect('/memes');
  } catch (err) {
    res.status(500).send('Error deleting meme');
  }
}

async function like(req, res) {
  try {
    const meme = await Meme.findById(req.params.id);
    meme.likes.push(req.user.id); // Assuming you're using user authentication and have access to the user's ID
    await meme.save();
    res.redirect(`/memes/${meme._id}`);
  } catch (err) {
    res.status(500).send('Failed to like the meme');
  }
}

async function dislike(req, res) {
  try {
    const meme = await Meme.findById(req.params.id);
    meme.dislikes.push(req.user.id); 
    await meme.save();
    res.redirect(`/memes/${meme._id}`);
  } catch (err) {
    res.status(500).send('Failed to dislike the meme');
  }
}

async function addComment(req, res) {
  try {
    const meme = await Meme.findById(req.params.id);
    meme.comments.push({
      user: req.body.user,
      content: req.body.content,
    });
    await meme.save();
    res.redirect(`/memes/${meme._id}`);
  } catch (err) {
    res.status(500).send('Failed to add comment');
  }
}

async function deleteComment(req, res) {
  try {
    const meme = await Meme.findById(req.params.id);
    const comment = meme.comments.id(req.params.commentId);
    comment.remove();
    await meme.save();
    res.redirect(`/memes/${meme._id}`);
  } catch (err) {
    res.status(500).send('Failed to delete comment');
  }
}
