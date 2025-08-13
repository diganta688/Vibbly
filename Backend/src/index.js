require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth.route');
const messageRoutes = require('./routes/message.route');
const connectDB = require('./lib/db');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const bodyParser = require('body-parser');
const {app, server} = require("./lib/socket"); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(bodyParser.json({ limit: "15mb" }));
app.use(bodyParser.urlencoded({ limit: "15mb", extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes); 


server.listen(process.env.PORT || 3000, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});