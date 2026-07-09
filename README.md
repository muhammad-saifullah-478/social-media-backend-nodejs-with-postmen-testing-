# 🚀 Social Media App Backend

A RESTful Backend API for a Social Media Application built with Node.js, Express.js, MongoDB, and JWT Authentication. This backend provides user authentication, tweet/post management, likes, reposts, comments, bookmarks, impressions, and user profile features.

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv

## ✨ Features

* User Registration & Login
* JWT Authentication & Authorization
* Create Posts/Tweets
* Get All Posts
* Get Single Post
* Like & Unlike Posts
* Repost Posts
* Add Impressions
* Comment on Posts
* Bookmark Posts
* User Profile Management
* Discover Other Users

## 📌 API Endpoints

### Authentication

#### Register User

```http
POST /api/users/register
```

```json
{
  "fullname": "Saif",
  "username": "saif123",
  "email": "saif@gmail.com",
  "password": "123456"
}
```

#### Login User

```http
POST /api/users/login
```

```json
{
  "email": "saif@gmail.com",
  "password": "123456"
}
```

Response:

```json
{
  "token": "JWT_TOKEN_HERE"
}
```

### Authorization Header

```http
Authorization: Bearer YOUR_TOKEN
```

### Posts/Tweets

#### Create Post

```http
POST /api/tweets/create
```

#### Get All Posts

```http
GET /api/tweets
```

#### Get Single Post

```http
GET /api/tweets/:tweetId
```

#### Like / Unlike Post

```http
PUT /api/tweets/like/:tweetId
```

#### Repost Post

```http
PUT /api/tweets/repost/:tweetId
```

#### Add Impression

```http
PUT /api/tweets/impression/:tweetId
```

#### Comment on Post

```http
POST /api/tweets/comment/:tweetId
```

```json
{
  "text": "Nice post 🔥"
}
```

#### Bookmark Post

```http
PUT /api/tweets/bookmark/:tweetId
```

### Users

#### Get User Profile

```http
GET /api/users/profile/:userId
```

#### Get Other Users

```http
GET /api/users/others
```

## 🚀 Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run the server:

```bash
npm run dev
```

Server URL:

```text
http://localhost:5000
```

## 👨‍💻 Author

Saifullah

MERN Stack Developer
