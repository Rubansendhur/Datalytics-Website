const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://vgugan16:gugan2004@cluster0.qyh1fuo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB successfully!');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('test', userSchema);

app.post('/signup', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.sendStatus(201);
});
app.delete('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete event with ID: ${id}`);
        const result = await Event.findByIdAndDelete(id);
        console.log(`Delete result: ${result}`);
        if (result) {
            res.sendStatus(204); // Successfully deleted
        } else {
            res.status(404).send({ message: 'Event not found.' });
        }
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send({ message: 'Failed to delete event.' });
    }
});


app.post('/login', async (req, res) => {
    const user = await User.findOne(req.body);
    if (user) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
