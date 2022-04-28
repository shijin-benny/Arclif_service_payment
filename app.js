const express = require('express');
const dotenv = require('dotenv');
const app = express();
const bodyParser = require('body-parser');
const Router = require('./router/payment');
const cors = require('cors');
const mongoose = require('mongoose');
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));
// router
app.use('/api/', Router);
// view engine setup
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
// port setup
const port = process.env.PORT || 3008;
// mongoose connection
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Database Connected Successfully');
});
// server start
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});





