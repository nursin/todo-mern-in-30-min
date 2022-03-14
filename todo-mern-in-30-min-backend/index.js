import express from 'express';
import { MongoClient, ObjectID } from 'mongodb'
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

let db;
MongoClient.connect('mongodb+srv://admin:PynyxaoF1bhfT45k@cluster0.gw1qf.mongodb.net/todos?retryWrites=true&w=majority', {useUnifiedTopology: true}, async (err, client) => {
    if (err) throw err

    db = client.db('todos')
    await db.dropCollection('todos')
    await db.collection('todos').insertMany([
        {done: false, desc: 'write code'},
        {done: false, desc: 'get code'},
        {done: false, desc: 'delete code'},
        {done: true, desc: 'update code'},
    ]);
});

app.get('/', (req, res) => {
    res.json('did this work')
});

app.get('/todos', async (req, res) => {
    const todos = await db.collection('todos').find().toArray();
    res.json(todos)
});

app.post('/todos', async (req, res) => {
    await db.collection('todos').insertOne(req.body);
    res.json('posted')
});

app.delete('/todos/:id', async (req, res) => {
    await db.collection('todos').deleteOne({_id: ObjectID(req.params.id)});
    res.json('deleted')
});

app.put('/todos/:id', async (req, res) => {
    await db.collection('todos').replaceOne({_id: ObjectID(req.params.id)}, req.body);
    res.json('putted')
});

app.listen(3001, () => {
    console.log('work pls')
});
