//set up the server
const express = require("express");
const logger = require("morgan");
const db = require("./db/db_connection");
const app = express();

const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;

// Configure Express to use EJS
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Configure express to parse URL encoded POST request bodies
app.use(express.urlencoded({ extended: false }));

// define middleware that logs all incoming requests
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get("/", (req, res) => {
    res.render('index');
});

// define a route for the default home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

const read_stuff_all_sql = `
    SELECT
        id, item, category, status
    FROM
        stuff`

// define a route for the stuff inventory page
app.get("/inventory", (req, res) => {
    db.execute(read_stuff_all_sql, (error, results) => {
        if (error)
            res.status(500).send(error);
        else
            res.render("inventory", { inventory: results });
    })
});

const read_stuff_item_sql = `
    SELECT
        id, item, category, status, description
    FROM
        stuff
    WHERE
        id = ?`

const delete_item_sql = `
    DELETE 
    FROM
        stuff
    WHERE
        id = ?
    `
app.get("/inventory/bucket/:id/delete", ( req, res ) => {
    db.execute(delete_item_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/inventory");
        }
    });
})

// define a route for the item detail page
app.get("/inventory/bucket/:id", (req, res) => {
    db.execute(read_stuff_item_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No item found with id = ${req.params.id}`); // NOT FOUND
        else {
            let data = results[0]; // results is still an array
            //{ item: ___ , quantity:___, description: ___}
            res.render('iceSkating', data)
        }
    })
});
const create_item_sql = `
INSERT INTO stuff
    (item, category, status)
VALUES
    (?, ?, ?)
`
app.post("/inventory", (req, res) => {
    // req.body.name
    // req.body.category
    // req.body.status
    db.execute(create_item_sql, [req.body.name, req.body.category, req.body.status], (error, results) => {
        if (error)
            res.status(500).send(error);
        else {
            res.redirect("/inventory");
        }
    })
});

const update_item_sql = `
    UPDATE
        stuff
    SET
        item =?,
        category =?,
        status =?,
        description = ?
    WHERE
        id = ?
`

app.post("/inventory/bucket/:id", ( req, res ) => {
    db.execute(update_item_sql, [req.body.name, req.body.category, req.body.status, req.body.description, req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/inventory/bucket/${req.params.id}`);
        }
    });
})

// start the server
app.listen(port, () => {
    console.log(`App server listening on ${port}. (Go to http://localhost:${port})`);
});