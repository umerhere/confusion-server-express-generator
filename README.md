# AUTHENTICATION

## Basic Authentication

You simply pass username and password in authentication headers (FOR POSTMAN, select Basic Auth from headers)
Base64EcnodedString contains the username and password once the user is authenticated

## Cookies and Express Sessions

To use **signed cookie**, We are using this value 12345-67890-09876-54321 as our signature, now once the user is logged in through Basic Auth, we will store the username and password in our cookies so that the username and passowrd is checked next time the user logs in

For **sessions**, almost same mechanism works except, in express sessions, when user logs in, we get a session file created in our project under sessions directory which contains username and password. A new session under cookie is created if you see it on postman

**DIFFERENCE** 
- A session is stored on the server. A cookie is stored as a file on your computer by your browser. A session cookie () is stored on your computer which is used by the server to track individual user sessions
- Cookie is not dependent on session, but Session is dependent on Cookie.
- The maximum cookie size is 4KB whereas in session, you can store as much data as you like.
- Cookie does not have a function named unsetcookie() (THE COOKIES creator can set the expiry time of cookie tho) while in Session you can use Session_destroy(); which is used to destroy all registered data or to unset some
- Cookie ends depending on the lifetime you set for it while a session ends when a user closes his browser

## PASSPORT

Paasport is an authentication middleware which supports various strategies that can be used for user authentication, including a local strategy like using username and password, or even third party authentication or using OAuth or OAuth 2.0, like using Facebook, Twitter, or Google+, and so on.
**Basic Authentication & Cookies/Sessions** involves a lot of repetitive code and repetitive tasks handling errors and devising ways of checking the user authentication and then authenticating the user and so on. All this is simplified within **Passport** using various strategies that can be used for authenticating users.

**PASSPORT simplified: Password is authentication middleware with several authentication strategies like local strategy, 0ath, webTokens**

**Local Strategy** is based upon registering users into your system using a username and password, and then thereafter authenticating them using the username and password.

**USAGE**
On the routes on which we want to perform authentication, we just specify passport authenticate and then specify the specific authentication strategy (local, Oauth etc) that we want to use for the user authentication.

Passport itself adds a user property to the request message. So req.user becomes available for us with the user's information in there, which we can subsequently use within our express application to handle the request coming from specific users.

**For Local Strategy**, we install passport-local. Furthermore for local strategy, we have a plugin called **passport-local-mongoose** which makes it even more flexible for login/signup with various methods.
**Passport-local-mongoose**
- stores username and password. The password is stored in hashed form
- Store a user and see it in db shell. you'll notice salt and hash instead of passowrd field. 
- The salt is used as a way of encrypting the password and then stores the hashed password in hash field
- Also provides serialization and deserialization for sessions
    
**LOCAL STRATEGY simplified: local strategy uses passport-local and further passport-local-mongoose plugin for authentication**

**WEB TOKENS**

With cookie based authentication, we notice that cookies are stored on the client side, and the cookies are included in **every outgoing request** message whereby, the server is reminded about that specific client, by extracting information from the cookie. Cookie can be used together with sessions, whereby the cookies store the session ID, and then when the server receives the incoming request from the cookie, it extracts the session ID and uses that as an index into the server-side session store to retrieve the session information for the particular client. Now, this approach as I said, is not very scalable because if you have **thousands of sessions**, the server needs to keep track of all these **thousands of sessions on the server side**.

**Problems with Session-based authentications and WEB-BASED Tokens**
-Needs stateless servers
-Mobile Application does not handle session based authentication very well. The app running on mobile and web won't do well with session based authenticaiton. This is where we need **Web Tokens**. Furthermore, token-based authentication also helps us to deal with what are called **CORS** or **CSRF** problems

**JWT** is such a web based signed token. Morever, JWT tokens are more most suited for REST servers

**JWT Strategy**
We'll use jwt-strategy for jwt authentication. Before you create token, **YOU NEED ANOTHER STRATEGY FIRST TO AUTHENTICATE, IF AUTHENTICATION IS SUCCESSFULL, THEN JWT TOKEN WILL BE CREATED** . In our project, we'll first authenticate user's username and password with **LOCAL STRATEGY**, if successfull, then we'll create **JWT-TOKEN**

Earlier, we used to create **session** after local-strategy authenticates the user, now we'll create a *JWT TOKEN* after the local strategy authenticates.

**STEPS TO USE JWT AUHTENTICATION IN CODE**
1. Install "passport-jwt": "^4.0.0" and "jsonwebtoken": "^8.3.0"
2. Create config.js in root directory, this will have basic configration like secretKey and mongoURL
3. Create authenticate.js file. See all the methods we have created there.
4. Since we using jwt instead of sessions, remove sessions from app.js file. Also remove the auth function from routes. We'll add the authentication on routes in each route file.
5. In userRoutes, the JWT will be created after the PASSPORT-LOCAL-STRATEGY authenticates the username and password. Once authenticated by local strategy, we'll get the token in response
6. When testing on postman, Copy the JWT token from response as it will be needed to add on authentication header with request.
7. Now for GET requests, no authentication is required. While for POST, PUT, DELETE, add authentication on each endpoint's routes file. JWT verifyUser method will verify the JWT you added earlier (6th step) in the authentication header.

**HOW JWT AUTHENTICATION WORKS?**
1. In userRoutes, User access /login route and gives username and password in the req body.
2. Local strategy authenticates the username and password. if true, it calls getToken function and adds the token in response.
3. We paste the token in authentication headers and call any protected routes (let say, we call POST /dish)
4. In dishRouter, POST method is secure, so verifyUser is called from authenticate.js
5. VerifyUser is called from authenticate.js . passport.authenticate uses jwtStrategy created ubove with name jwtPassport. In jwtPassport, options are passed in which, first we extract token. This is how the JWT Strategy authenticates the user.

# MONGOOSE

## BASICS

We have created a data folder where all the documents will be stored

Now to run the mongoDB server, type : **mongod --dbpath=data --bind_ip 127.0.0.1**

Now to access the server, open another terminal and type **mongo**

This should allow us to access the server

**COMMANDS**

	run db : this will tell us the database we'are connected to

	run use confusion  : this will create a new database named confusion

	run db.help() : will list all the available commands 
	
	run db.dihses.insert({"name": "Uthappizza", "description": "Test"}) : Now we'are already in confusion database, 

		if confusion has collection nam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ed dishes, we'll select it otherwise this command will create the new collection

	run db.dishes.find() or db.dishes.find().pretty() : to view all the data inside collection dishes
    
## MONGOOSE POPULATION. JOINS IN MONGODB?

In mongoDB, we don't have joins, instead we can store reference to other documents within a document by using ObjectIds

If we can reference another document into our document using objectIds then mongoose helps us to do **population** of this information from the other document into the current document. This is called **mongoose population**

```python
#EXAMPLE
#we have dishes field, inside dishes we have comments document
var comment = new Schema({
    rating: { type: Number, required: true},
    content: { type: String, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId, #this field will now contain an ObjectId which is reference to a user document
        ref: 'User' #this specifies that schema of document you refering ubove is of the type User schema
    }
})

#Now when you ask mongoose to populate this comment document, it will populate the author field from the user document
Dishes.find({}) #find specific dish
.populate('comment.author') #this call will go and fetch from the database each individual author record and take that user record and then populate it into the dishes document
.then((err, dish))
#Expensive Operation...
```

**ILLUSTRATION OF UBOVE CODE**

Suppose You want to fetch a dish with its comments (comments has author field). You'll first get the dish with **find({}) method**, this will give you the comments as well (because we have added comments as a sub document of dish document, rather than creating a ObjectId field of comments as well) and Now you want the author of the comments from database. Now **populate** will iterate over users table and fetch that specific user for us. 
