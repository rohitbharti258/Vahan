const express = require('express')
const mysql = require('mysql2');
const cors = require("cors")
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwerty123',
    database: 'vahandb'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

function createEntityTable(entityName, attributes) {
    let query = `CREATE TABLE IF NOT EXISTS ${entityName} (`;
    query+="ID INT AUTO_INCREMENT PRIMARY KEY,"
    for (const attr in attributes) {
        query += `${attributes[attr].name} ${attributes[attr].type},`;
    }
    query = query.slice(0, -1) + ')';
    connection.query(query, err => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log(`Table ${entityName} created successfully`);
        }
    });
}

app.get('/allEntities', (req, res) => {
    const query = 'show tables';
    connection.query(query, (err, results) => {
        if (err) throw err;
        // console.log('Entities:', results);
        res.send(results);
    });
});

app.post('/vahan/addEntity', (req, res) => {
    console.log(req.body);
    const { entity, attr } = req.body;
    createEntityTable(entity, attr);
    res.json({ message: `Entity ${entity} created successfully` });
})

app.post('/vahan/addData/:entityName',(req,res)=>{
    const entityName = req.params.entityName;
    const {attributes,value} = req.body;
    const attrList = Object.values(attributes).join(', ');
    const valueList = attributes.map((index)=> attributes[index]='?');
    valueList.join(', ')
    // const valueList = Array(attrList.length).fill('?').join(', ');
    console.log(valueList.length)
    const query = `INSERT INTO ${entityName} (${attrList}) VALUES(${ valueList })`;

    return new Promise((resolve, reject) => {
        connection.query(query, Object.values(value), (err) => {
            if (err) reject(err);
            resolve({ message: `Data inserted into '${entityName}'. `});
        });
    });
})

app.get('/vahan/getData/:entityName',(req,res)=>{
    const entity = req.params.entityName;
    const query = `SELECT * FROM ${entity}`;
    connection.query(query, (err, results) => {
    if (err) {
      console.error('Error reading entries:', err);
    } else {
      res.send(results);
    }
  });
})

app.get('/vahan/getattributes/:entityName',(req,res)=>{
    const entity = req.params.entityName;
    const query = `SHOW COLUMNS FROM ${entity}`;
    connection.query(query, (err, results) => {
    if (err) {
      console.error('Error reading entries:', err);
    } else {
      res.send(results);
    }
  });

})

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

app.delete('/vahan/deleteData/:entityName/', (req, res) => {
  const { entityName} = req.params;
  const id = req.body.id;
  const query = `DELETE FROM ${entityName} WHERE id = ${id}`;
  connection.query(query, (err, result) => {
    if (err) throw err;
    console.log('Entity deleted:', result);
    res.send(result);
  });
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000`);
});
