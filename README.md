# Memes

## Description
A memes website is an online platform dedicated to sharing, creating, and curating memes. This was my second project completed as part of the General Assembly Software Engineering Bootcamp Course. My idea was to replicate it as a much simplified version of these types of websites. The website takes in URL and title to post the meme on the main page, instead of uploading the files from local user storage. For now there are two functions included which is delete (removing the added meme) and update (allowing the user to change the title as well as meme by changing the URL)

## Deployment link
The project is hosted: <a href="https://project2-memes-20789d159558.herokuapp.com/" target="_blank" rel="noopener noreferrer">here</a>.

## Getting Started/Code Installation

1. **Clone the Repository**
    To start, you'll want to clone the repository onto your local machine. Open your terminal and execute the following command:
    `git clone https://github.com/Puzzles65/project2-memes`
2. **Setup Environment Variables**
    Create `.env` file including yours environment variables.

    DATABASE_URL: URL for the project's database.
    GOOGLE_CLIENT_ID: Google OAuth client ID for app identification.
    GOOGLE_SECRET: Google OAuth client secret for authentication.
    GOOGLE_CALLBACK: Callback URL for Google OAuth redirection.
    SECRET: any phrase/word

3. **Run commands**
In your terminal, run the app using:  
`npm start`  
The app should now be running on `http://localhost:3000`.

## Timeframe & Working Team 
It was a solo project and the timeframe was one week.

## Technologies Used
This project required Neon, HTML, CSS and JS.

Frameworks used: 
- Express session package 
- Passport package 
- Passport JS Google OAuth Strategy 
- Passport JS OAuth2.0 Authentication flow entry

## Brief
Requirements:

- Have at least 2 data entities (data resources) in addition to the User Model - one entity that represents the main functional idea for your app and another with a One:Many or Many:Many relationship with that main entity (embedded or referenced).
- Use OAuth authentication.
- Implement basic authorization that restricts access to features that need a logged in user in order to work (typically CUD data operations) by "protecting" those routes from anonymous users using the ensureLoggedIn middleware from the OAuth lesson. In addition, ensure that editing and deletion of a data resource can only be done by the user that created that data (this is done in the controller - refer to the Guide to User-Centric CRUD).
- Have full-CRUD data operations somewhere within the app's features. For example, you can have functionality that Creates & Updates a post and satisfy Delete functionality by implementing the ability to delete comments.
- Be styled such that the app looks and feels similar to apps we use on a daily basis - in other words, it should have a consistent and polished user interface.
- Be deployed online (Heroku).

Full requirements: <a href="https://git.generalassemb.ly/SEI-72-LDN/SEIR-Courses-Materials/blob/main/Unit_1/project-1/project-1-requirements.md" target="_blank" rel="noopener noreferrer">here</a>.

## Planning

For planning I used a Trello board and Excalidraw.
<img src="https://i.imgur.com/ZZ1BbMN.png" alt=""/>

<img src="https://i.imgur.com/kRzYbvg.png" alt=""/>

## Build/Code Process

**Implementing Login** 
```javascript
passport.use(new GoogleStrategy(
{
clientID: process.env.GOOGLE_CLIENT_ID,
clientSecret: process.env.GOOGLE_SECRET,
callbackURL: process.env.GOOGLE_CALLBACK
},
async function(accessToken, refreshToken, profile, cb) {
try {
// A user has logged in with OAuth...
let user = await User.findOne({ googleId: profile.id });
// Existing user found, so provide it to passport
if (user) return cb(null, user);
// We have a new user via OAuth!
user = await User.create({
name: profile.displayName,
googleId: profile.id,
email: profile.emails[0].value,
avatar: profile.photos[0].value
});
return cb(null, user);
} catch (err) {
return cb(err);
passport.serializeUser(function(user, cb) {
cb(null, user._id);
});
passport.deserializeUser(async function(userId, cb) {
cb(null, await User.findById(userId));
})}}))
```
This code sets up Passport with the Google OAuth2 strategy to enable user authentication and login using Google accounts. Passport is a popular authentication middleware for Node.js applications, and the Google OAuth2 strategy allows users to log in using their Google credentials.

**Defining the Meme Schema** 
```javascript
const memeSchema = new Schema({
title: {
type: String,
required: true,
},
imageUrl: {
type: String,
required: true,
},
user: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true,
},
})
```
Inside the models/meme.js file, I outlined the meme's structure using the Mongoose schema. This structure included aspects like title and imageUrl, which represented the meme's title and image URL. The user field acted as a reference to the User model, indicating who made the meme. For tracking creation and changes over time, I used the timestamps: true option, which automatically added createdAt and updatedAt fields.

**Displaying All Memes** 
```javascript
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
// deleting
router.post('/:id/delete', ensureLoggedIn, memesCtrl.remove)
```
In the routes/memes.js file, a route was configured to handle the display of all memes. When users accessed the /memes URL, the index function from the memesCtrl controller was triggered. This function fetched memes from the database and rendered the relevant view to present all the memes.

**Displaying All Memes View** 
```javascript
<% memes.forEach((meme) => { %>
<div class="meme">
<h2><%= meme.title %></h2>
<img src="<%= meme.imageUrl %>" alt="Meme Image">
<p><%= meme.description %></p>
</div>
<% if (user) { %>
<div class="button-group">
<form action="/memes/<%= meme._id %>/updateForm" method="post" class="btn update-form">
<button type="submit" class="button-update">Update</button>
</form>
<form action="/memes/<%= meme._id %>/delete" method="post" class="btn delete-form">
<button type="submit" class="button-delete">Delete</button>
</form>
</div>
<% } %>
<% }) %>
```
The views/memes/index.ejs template shows a collection of all the memes. It maintains a consistent appearance by incorporating shared header and footer elements via partials. Inside this template, there's a loop that iterates through each meme using EJS syntax, allowing us to exhibit their specifics like title, image, and description..

**Creating a New Meme** 
```javascript
// Route for displaying the new meme form
router.get('/new', ensureLoggedIn, memesCtrl.new);
// Route for handling new meme form submission
router.post('/', ensureLoggedIn, memesCtrl.create);
```

I've configured two routes in routes/memes.js to manage the creation of new memes. The /new route displays a form where users can input meme details. It's guarded by the ensureLoggedIn middleware, ensuring that only authenticated users can access it. Handling the form's submission is the responsibility of the create function from the memesCtrl controller. This function processes the form data and establishes a new meme entry in the database.

**New Meme Form View** 
```javascript
<%- include('../partials/header') %>
<h2>Add Meme</h2>

<form class="addMemeForm" action="/memes" method="POST">
<div>
<label for="title">Title:</label>
<input type="text" id="title" name="title" required>
</div>
<div>
<label for="user">User:</label>
<input type="text" id="user" name="user" required>
</div>
<div>
<label for="imageUrl">Image URL:</label>
<input type="text" id="imageUrl" name="imageUrl" required>
</div>
<button type="submit">Submit</button>
</form>

<%- include('../partials/footer') %>
```
The views/memes/new.ejs template is responsible for rendering the form to add a new meme. Users can input the meme's title, user, and image URL in the form fields. Upon submitting the form, a POST request is sent to the /memes route, triggering the creation of a new meme based on the provided information.

## Challenges

The primary learning experience revolved around comprehending the optimal sequence for implementing each segment of code and refining time management skills. While circumstances led to a condensed timeframe of just two days to finalize the project, I see this as a growth opportunity. This situation pushed me to prioritize and focus on the most essential elements, allowing me to enhance my ability to make impactful decisions under constraints. Despite the challenge, I made valuable progress and acquired a clearer understanding of efficient project organization and strategic time allocation.

## Wins

A significant triumph I gained from this project was the ability to visualize the process behind crafting a web application. I now possess a comprehensive overview that outlines the initial steps and the sequential order to follow. This newfound clarity empowers me to approach future projects with a well-structured and confident mindset, ensuring a smoother and more informed development journey.

## Key Learnings/Takeaways

I engaged in an insightful learning journey, gaining familiarity with the foundational aspects of website development using tools like Express, OAuth 2.0, and MongoDB. This project marked an improvement in my planning approach compared to previous experiences. Although unforeseen events affected my time management, it underscored the need for adaptability. 

## Bugs

There are no bugs, but there is a room for improvement. The website works as it supposed to, but adding couple more features would make it better for user experience. 

## Future Improvements
- Adding like and dislike button under each meme with a counter so it shows how many users liked or disliked a particular meme.
- Adding comment section under each meme this could be simplified or comments that also have like/dislike and reply function. 
- Share button - providing with a link or redirecting to most popular social media apps (messenger, instagram)
- CSS make the website stand out and more personal.
- Group memes in different categories (most liked tab or the newest added meme tab in nav bar)
- Instead of adding the meme using URL, uploading the picture/meme from user local storage. 






