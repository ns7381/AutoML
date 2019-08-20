/**
 * Created by Administrator on 2017/3/22.
 */
var express = require('express');
var proxy = require("express-http-proxy");
var app = express();

var apiProxy = proxy("localhost:8080", {
    forwardPath: function (req, res) {
        return req._parsedUrl.path
    }
});
app.use("/insight-ml/v1/*",apiProxy);
app.use("/insight-ml/", express.static(__dirname));

app.get('/insight-ml', function(req, res) {
    res.sendfile('./index.html');
});
app.listen(3000, function () {
    console.log('cloud-ops ui listening on port 3000!');
});