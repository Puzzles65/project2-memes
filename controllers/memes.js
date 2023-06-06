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
  deleteComment
};

async function index(req, res) {
  try {
    const memes = await Meme.find();
    res.render('memes/index', { title: 'All Memes', memes });
  } catch (error) {
    res.render('error', { message: 'Failed to get memes.', error: error.message });
  }
}

async function show(req, res) {
  try {
    const meme = await Meme.findById(req.params.id);
    res.render('memes/show', { title: 'Meme Detail', meme });
  } catch (error) {
    res.render('error', { message: 'Failed to get meme.', error: error.message });
  }
}

async function create(req, res) {
  try {
    const newMeme = await Meme.create(req.body);
    res.redirect(`/memes/${newMeme._id}`);
  } catch (error) {
    res.render('error', { message: 'Failed to create meme.', error: error.message });
  }
}

async function update(req, res) {
  try {
    const updatedMeme = await Meme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.render('memes/show', { title: 'Updated Meme', meme: updatedMeme });
  } catch (error) {
    res.render('error', { message: 'Failed to update meme.', error: error.message });
  }
}

async function remove(req, res) {
  try {
    await Meme.findByIdAndDelete(req.params.id);
    res.redirect('/memes');
  } catch (error) {
    res.render('error', { message: 'Failed to delete meme.', error: error.message });
  }
}

async function like(req, res) {
  try {
    const meme = await Meme.findById(req.params.id);
    meme.likes.push(req.body.userId);
    const updatedMeme = await meme.save();
    res.render('memes/show', { title: 'Liked Meme', meme: updatedMeme });
  } catch (error) {
    res.render('error', { message: 'Failed to like meme.', error: error.message });
  }
}

async function dislike(req, res) {
  try {
    const meme = await Meme.findById(req.params.id);
    meme.dislikes.push(req.body.userId);
    const updatedMeme = await meme.save();
    res.render('memes/show', { title: 'Disliked Meme', meme: updatedMeme });
  } catch (error) {
    res.render('error', { message: 'Failed to dislike meme.', error: error.message });
  }
}

async function addComment(req, res) {
  try {
    const meme = await Meme.findById(req.params.id);
    meme.comments.push({
      user: req.body.userId,
      content: req.body.content,
    });
    const updatedMeme = await meme.save();
    res.render('memes/show', { title: 'Meme with New Comment', meme: updatedMeme });
  } catch (error) {
    res.render('error', { message: 'Failed to add comment to meme.', error: error.message });
  }
}

async function deleteComment(req, res) {
    try {
      const meme = await Meme.findById(req.params.id);
      meme.comments = meme.comments.filter(comment => comment._id.toString() !== req.params.commentId);
      const updatedMeme = await meme.save();
      res.render('memes/show', { title: 'Meme with Comment Deleted', meme: updatedMeme });
    } catch (error) {
      res.render('error', { message: 'Failed to delete comment.', error: error.message });
    }
  } 
