const express = require('express');
const app = express();

const port = process.env.PORT || 3000

var bodyParser = require("body-parser");
var cors = require('cors');
var corsOptions = {
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
    optionsSuccessStatus: 204
};


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello World API!')
});

app.post('/message', function(req, res) {
    ret = req.body;
    ret.data = new Date().toLocaleString();
    console.log(ret)
    res.json(ret)
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})