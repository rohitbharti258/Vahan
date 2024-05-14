const express = require('express')
const mysql = require('mysql2');
const cors = require("cors")
const app = express();
// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'qwerty123',
  database: 'vahandb'
});



// Connect to MySQL
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Routes
// Example: Create a new entity
// app.post('/api/entities', (req, res) => {
//   const { entityName } = req.body;
//   const query = `INSERT INTO entities (name) VALUES ('${entityName}')`;
//   connection.query(query, (err, result) => {
//     if (err) throw err;
//     console.log('New entity added:', result);
//     res.send(result);
//   });
// });
app.get('/',(req,res)=>{
    res.send("db ")
})
// Example: Get all entities
app.get('/allEntities', (req, res) => {
  const query = 'show tables';
  connection.query(query, (err, results) => {
    if (err) throw err;
    // console.log('Entities:', results);
    res.send(results);
  });
});

// Example: Update an entity
// app.put('/api/entities/:id', (req, res) => {
//   const { id } = req.params;
//   const { entityName } = req.body;
//   const query = `UPDATE entities SET name = '${entityName}' WHERE id = ${id}`;
//   connection.query(query, (err, result) => {
//     if (err) throw err;
//     console.log('Entity updated:', result);
//     res.send(result);
//   });
// });

// Example: Delete an entity
// app.delete('/api/entities/:id', (req, res) => {
//   const { id } = req.params;
//   const query = `DELETE FROM entities WHERE id = ${id}`;
//   connection.query(query, (err, result) => {
//     if (err) throw err;
//     console.log('Entity deleted:', result);
//     res.send(result);
//   });
// });

// Start server
app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});
