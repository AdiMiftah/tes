const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = require('express')();
const mysql = require('mysql');
const fs = require("fs");
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const session = require('express-session');


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'data_buku',
  multipleStatements: true
});


connection.connect();
global.db = connection;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})


app.use("/", express.static('./public'));

app.use((req, res, next) => {
  res.io = io
  next()
});


const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

// const upload = multer({
//   dest: "/path/to/temporary/directory/to/store/uploaded/files"

//   // you might also want to set some limits: https://github.com/expressjs/multer#limits
// });


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.render('buku.ejs');
});

app.get('/buku_pendor.ejs', function(request, response) {
	response.render('buku_pendor.ejs');
});


app.get('/buku_tamu.ejs', function(request, response) {
	response.render('buku_tamu.ejs');
});

app.get('/selesai.ejs', function(request, response) {
	response.render('selesai.ejs');
});


app.get('/buku_paket.ejs', function(request, response) {
	response.render('buku_paket.ejs');
});

app.post("/admin/ad", urlencodedParser, (req, res) => {
  let sqltext = "INSERT INTO buku_pendor (hari_tgl, perusahaan, nama, no_ip, keperluan, jam_in, jam_out) VALUES ('"+req.body.hari_tgl+"','"+req.body.perusahaan+"','"+req.body.nama+"','"+req.body.no_ip+"','"+req.body.keperluan+"','"+req.body.jam_in+"','"+req.body.jam_out+"')";
  // console.log(sqltext);
  // let sqltext = "DELETE FROM accounts WHERE id = " + req.params.id;
  let query = connection.query(sqltext, (err, results) => {
    // if (err) throw err;
    // console.log(sqltext);
    res.redirect('/selesai.ejs');
  });
}
);

app.post("/admin/tamu", urlencodedParser, (req, res) => {
  let sqltext = "INSERT INTO buku_tamu (hari_tgl, nama, perusahaan, no_kendaraan, tujuan_nama,keperluan, jam_in, jam_out) VALUES ('"+req.body.hari_tgl+"','"+req.body.nama+"','"+req.body.perusahaan+"','"+req.body.no_kendaraan+"','"+req.body.tujuan_nama+"','"+req.body.keperluan+"','"+req.body.jam_in+"','"+req.body.jam_out+"')";
  // console.log(sqltext);
  // let sqltext = "DELETE FROM accounts WHERE id = " + req.params.id;
  let query = connection.query(sqltext, (err, results) => {
    // if (err) throw err;
    // console.log(sqltext);
    res.redirect('/selesai.ejs');
  });
}
);

app.post("/admin/paket", urlencodedParser, (req, res) => {
  let sqltext = "INSERT INTO buku_paket (hari_tgl, expedisi, jumlah, nama_penerima, jam_in, jam_out) VALUES ('"+req.body.hari_tgl+"','"+req.body.expedisi+"','"+req.body.jumlah+"','"+req.body.nama_penerima+"','"+req.body.jam_in+"','"+req.body.jam_out+"')";
  // console.log(sqltext);
  // let sqltext = "DELETE FROM accounts WHERE id = " + req.params.id;
  let query = connection.query(sqltext, (err, results) => {
    // if (err) throw err;
    // console.log(sqltext);
    res.redirect('/selesai.ejs');
  });
}
);
// app.post("/admin/update/:id", urlencodedParser, (req, res) => {

//   let sqltext = "UPDATE pelajar SET username='" + req.body.edit_username +
//       "', name='" + req.body.edit_name +
//       "', password='" + req.body.edit_password +
//       "', email='" + req.body.edit_email +
//       "' WHERE id=" + req.params.id;

//   // console.log(sqltext);
//   let query = connection.query(sqltext, (err, results) => {
//     // if (err) throw err;
//     // console.log(sqltext);
//     res.redirect('/user-management-admin');
//   });
// }
// );

// app.post("/admin/delete/:id", urlencodedParser, (req, res) => {

//   let sqltext = "DELETE FROM list WHERE id = " + req.params.id;
//   let query = connection.query(sqltext, (err, results) => {
//     // if (err) throw err;
//     // console.log(sqltext);
//     res.redirect('/user-management-admin');
//   });
// }
// );
 

// app.get('/api', (req, res) => {
//   let sql = "SELECT * FROM buku_pendor ";
//   let query = connection.query(sql, (err, results) => {
//     if (err) throw err;
//     var string = JSON.stringify(results);
//     signnum = JSON.parse(string);
//     return res.json(signnum);
//   });
// });

server.listen(process.env.PORT || 3000, function() {
  console.log('app running');
});
