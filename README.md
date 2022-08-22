# ATHENTICATION

## Strategies of authenticating a user

##### Basic Authentication

You simply pass username and password in authentication headers (FOR POSTMAN, select Basic Auth from headers)
Base64EcnodedString contains the username and password once the user is authenticated

##### Cookies and Express Sessions

To use **signed cookie**, We are using this value 12345-67890-09876-54321 as our signature, now once the user is logged in through Basic Auth, we will store the username and password in our cookies so that the username and passowrd is checked next time the user logs in

For ** sessions **, almost same mechanism works except, in express sessions, when user logs in, we get a session file created in our project under sessions directory which contains username and password. A new session under cookie is created if you see it on postman

** DIFFERENCE ** 
A session is stored on the server. A cookie is stored as a file on your computer by your browser. A session cookie () is stored on your computer which is used by the server to track individual user sessions
Cookie is not dependent on session, but Session is dependent on Cookie.
The maximum cookie size is 4KB whereas in session, you can store as much data as you like.
Cookie does not have a function named unsetcookie() (THE COOKIES creator can set the expiry time of cookie tho) while in Session you can use Session_destroy(); which is used to destroy all registered data or to unset some
Cookie ends depending on the lifetime you set for it while a session ends when a user closes his browser

##### Passport
###### About

Paasport is an authentication middleware which supports various strategies that can be used for user authentication, including a local strategy like using username and password, or even third party authentication or using OAuth or OAuth 2.0, like using Facebook, Twitter, or Google+, and so on.
** Basic Authentication & Cookies/Sessions ** involves a lot of repetitive code and repetitive tasks handling errors and devising ways of checking the user authentication and then authenticating the user and so on. All this is simplified within ** Passport ** using various strategies that can be used for authenticating users.

** PASSPORT simplified: Password is authentication middleware with several authentication strategies like local strategy, 0ath, webTokens **
** Local Strategy ** is based upon registering users into your system using a username and password, and then thereafter authenticating them using the username and password.

** USAGE **
On the routes on which we want to perform authentication, we just specify passport authenticate and then specify the specific authentication strategy (local, Oauth etc) that we want to use for the user authentication.

Passport itself adds a user property to the request message. So req.user becomes available for us with the user's information in there, which we can subsequently use within our express application to handle the request coming from specific users.

** For Local Strategy **, we install passport-local. Furthermore for local strategy, we have a plugin called ** passport-local-mongoose ** which makes it even more flexible for login/signup with various methods.
** Passport-local-mongoose **
    stores username and password. The password is stored in hashed form
        Store a user and see it in db shell. you'll notice salt and hash instead of passowrd field. 
            The salt is used as a way of encrypting the password and then stores the hashed password in hash field
    Also provides serialization and deserialization for sessions
    
** LOCAL STRATEGY simplified: local strategy uses passport-local and further passport-local-mongoose plugin for authentication **
