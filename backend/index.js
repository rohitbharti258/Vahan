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

function createEntityTable(entityName, attributes,res) {
    let query = `CREATE TABLE IF NOT EXISTS \`${entityName}\` (`;
    query+="ID INT AUTO_INCREMENT PRIMARY KEY,"
    for (const attr in attributes) {
        query += `\`${attributes[attr].name}\` ${attributes[attr].type} Default Null,`;
    }
    query = query.slice(0, -1) + ')';
    connection.query(query, (err,results) => { 
      console.log(results)

        if (err) {
            console.error('Error creating table:', err); 
            res.status(500).send(err);
            return;
        }
        if(results.warningStatus>0){
          res.status(400).send("Table Already Exists");
          return;
        } 
        res.status(200).send("Table created SuccessFully")
    });
} 

app.get('/allEntities', (req, res) => {
    const query = 'show tables'; 
    connection.query(query, (err, results) => { 
        if (err)  {
          res.status(400).send(err);
          return;
        }
        res.send(results);
    });
});

app.post('/vahan/addEntity', (req, res) => {
    const { entity, attr } = req.body;
    createEntityTable(entity, attr,res);
})

app.post('/vahan/addData/:entityName',(req,res)=>{
    const entityName = req.params.entityName;
    const {attributes,value,index} = req.body;
    
    if(index!=null) {
        value[index] = new Date(value[index]);   
    }
    const attrList = Object.values(attributes).join(', ');
    const valueList = attributes.map((index)=> attributes[index]='?');
    valueList.join(', ')
    console.log(valueList.length)
    const query = `INSERT INTO \`${entityName}\` (${attrList}) VALUES(${ valueList })`;

        connection.query(query, Object.values(value), (err,results) => {
          console.log(results)
          if (err) {
            console.error('Error in inserting Data:', err); 
            res.status(500).send('Internal Server Error');
            return;
        }
        if(results.warningStatus>0){
          res.status(400).send("Cant Add data or dupliacte ids");
          return;
        } 
        res.status(200).send("Data inserted SuccessFully")
        });
})

app.get('/vahan/getData/:entityName',(req,res)=>{
    const entity = req.params.entityName;
    const query = `SELECT * FROM \`${entity}\``;
    connection.query(query, (err, results) => {
    if (err)  {
      res.status(400).send(err);
      return;
    } else {
      console.log(results)
      res.send(results);
    }
  });
})

app.get('/vahan/getattributes/:entityName',(req,res)=>{
    const entity = req.params.entityName;
    const query = `SHOW COLUMNS FROM \`${entity}\``;
    connection.query(query, (err, results) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.send(results);
    }
  });

})

app.put('/vahan/updateData/:entityName', (req, res) => {
  const { entityName } = req.params;
  const { update,id } = req.body;
  const updates = Object.entries(update)
    .map(([key, value]) => `${update[key].type} = ${mysql.escape(update[key].value)}`)
    .join(', ');

  const sql = `UPDATE \`${entityName}\` SET ${updates} WHERE id = ${id}`;
console.log(sql)
  connection.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('Record updated successfully!');
  });
});

app.delete('/vahan/deleteData/:entityName/', (req, res) => {
  const { entityName} = req.params;
  const id = req.body.id;
  const query = `DELETE FROM \`${entityName}\` WHERE id = ${id}`;
  connection.query(query, (err, result) => {
    if (err) {
      res.status(400).send(err);
      return;
    }
    res.status(200).send(result);
  });
});


app.delete('/vahan/deleteEntity/:entityName/', (req, res) => {
  const { entityName} = req.params;
  const query = `DROP TABLE \`${entityName}\``;
  connection.query(query, (err, result) => {
    if (err)  {
      res.status(400).send(err);
      return;
    }
    console.log('Entity deleted:', result);
    res.send(result);
  });
});
app.listen(8000, () => {
    console.log(`Server is running on port 8000`);
});
