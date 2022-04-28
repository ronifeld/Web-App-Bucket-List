const db = require("./db_connection");

const drop_stuff_table_sql = "DROP TABLE IF EXISTS stuff";

db.execute(drop_stuff_table_sql);

const create_stuff_table_sql = `
CREATE TABLE stuff (
    item VARCHAR(45) NOT NULL,
    category VARCHAR(150) NOT NULL,
    status VARCHAR(150) NOT NULL,
    description VARCHAR(150) NULL,
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id));  
`
db.execute(create_stuff_table_sql);

// add some sample data to the table
const insert_stuff_table_sql = `
    INSERT INTO stuff
        (item, category, status, description)
    VALUES
        (?, ?, ?, ?)
`

db.execute(insert_stuff_table_sql, [ "Ice Skating", "Adventure" , "Completed", "Go ice skating with friends...try not to fall!" ]);

db.execute(insert_stuff_table_sql, [ "Skydiving", "Adventure" , "Not Started", "Grab a friend and throw them off a plane! (With a parachute of course!)" ]);

db.execute(insert_stuff_table_sql, [ "Build a gingerbread house", "Craft" , "Started", "Make the biggest and tastiest gingerbread house you possibly can!" ]);

db.execute(insert_stuff_table_sql, [ "Write a book", "Academic" , "Started", "Write a real book, and if it's good enough, publish it!" ]);


//read the new contents
const read_stuff_table_sql = "SELECT * FROM stuff";

db.execute(read_stuff_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'stuff' initialized with:")
        console.log(results);
    }
);

db.end();