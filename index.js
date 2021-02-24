const express = require('express');
const sqlite = require('sqlite3');
const bp = require('body-parser')

const db = new sqlite.Database(__dirname + '/arkademy.sqlite', (err) => {
    if(err) throw err;
});

var CREATE_TABLE = "CREATE TABLE IF NOT EXISTS produk ( id INTEGER PRIMARY KEY AUTOINCREMENT, nama_produk TEXT NOT NULL, keterangan TEXT NOT NULL, harga INTEGER NOT NULL, jumlah INTEGER NOT NULL )";

db.serialize(function() {
    // Create table
    db.run(CREATE_TABLE, function(err) {
        if (err) {console.log(err);}
    });

});

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bp.urlencoded({ extended: false}))

// Show data in database to hompage
app.get('/', (req,res) => {
    db.serialize(() => {
        const sql = 'SELECT * FROM produk';
        db.all(sql, (err, rows) => {
            if(err) throw err;
            res.render('index.ejs', {produk: rows})
        })
    })
});

// Detail data
app.get('/:id', (req,res) => {
    const {id} = req.params;

    db.serialize(() => {
        const sql = `SELECT * FROM produk WHERE id=${id}`;
        db.get(sql, (err, row) => {
            if(err) throw err;
            res.render('detail.ejs', {produk: row});
        })
    })
});

// Insert data 
app.post('/', (req,res) => {
    const { nama_produk, keterangan, harga, jumlah } = req.body;
    db.serialize(() => {
        const sql = `INSERT INTO produk (nama_produk, keterangan, harga, jumlah) VALUES('${nama_produk}', '${keterangan}', '${harga}', '${jumlah}')`;
        db.all(sql, (err, rows) => {
            if(err) throw err;
            res.redirect('/');
        });
    });
});

// Edit data
app.get('/:id/edit', (req,res) => {
    const {id} = req.params;

    db.serialize(() => {
        const sql = `SELECT * FROM produk WHERE id=${id}`;
        db.get(sql, (err, row) => {
            if(err) throw err;
            res.render('edit.ejs', {produk: row});
        })
    })
});

// Update data
app.post('/:id/edit', (req,res) => {
    const {id} = req.params;
    const { nama_produk, keterangan, harga, jumlah } = req.body;

    db.serialize(() => {
        const sql = `UPDATE produk SET nama_produk='${nama_produk}', keterangan='${keterangan}', jumlah='${harga}', harga='${jumlah}' WHERE id=${id}`;
        db.run(sql, (err) => {
            if(err) throw err;
            res.redirect('/');
        });
    });
});

// Delete data
app.get('/:id/delete', (req,res) => {
    const { id } = req.params;

    db.serialize(() => {
        const sql = `DELETE FROM produk WHERE id=${id}`;
        db.run(sql, (err, row) => {
            if(err) throw err;
            res.redirect('/');
        });
    });
})

app.listen(8080, () => {
    console.log('aplikasi berjalan di port http://localhost:8080/')
})