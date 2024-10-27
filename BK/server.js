const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Datalytics API!');
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  price: { type: Number, required: true },
  image_url: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

// Event Schema
const eventSchema = new mongoose.Schema({
  eventName: String,
  eventDate: String,
  eventLocation: String,
  description: String,
  imageBase64: String
});

const Event = mongoose.model('Event', eventSchema);

// UserRole Schema
const userRoleSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true }
});

const UserRole = mongoose.model('UserRole', userRoleSchema);

const corsOptions = {
  origin: ['http://localhost:4200','https://datalyticscit.vercel.app/','https://datalyticsadmin.vercel.app/'], // or your actual localhost URL and port
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));


// Signup Route
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });

  try {
    await user.save();
    console.log('User created:', user);
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error.message);
    if (error.code === 11000) {
      if (error.keyValue && error.keyValue.email) {
        return res.status(400).send({ message: 'Email already exists' });
      } else if (error.keyValue && error.keyValue.username) {
        return res.status(400).send({ message: 'Username already exists' });
      }
    } else {
      return res.status(500).send('Error creating user: ' + error.message);
    }
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      return res.status(401).send('Invalid credentials: User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid credentials: Incorrect password');
    }

    res.status(200).send({ message: 'Login successful', token: 'your_generated_token_here' });
  } catch (error) {
    console.error('Server error during login:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

// Get All Users Route
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).send({ message: 'No users found' });
    }
    res.status(200).send({
      message: 'Users fetched successfully',
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
      })),
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send({ message: 'Error fetching users', error: err.message });
  }
});

// Delete User Route
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send({ message: 'Failed to delete user', error: err.message });
  }
});

// Get All Products Route
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send({
      message: 'Products fetched successfully',
      products: products.map(product => ({
        id: product._id,
        product_name: product.product_name,
        price: product.price,
        image_url: product.image_url,
      })),
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send({ message: 'Error fetching products', error: err.message });
  }
});

// Insert Event Route
app.post('/api/events', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).send({ message: 'Event added successfully!' });
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).send({ message: 'Failed to add event. Please try again.' });
  }
});

// Get All Events Route
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).send({ message: 'Events fetched successfully', events });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).send({ message: 'Error fetching events', error: err.message });
  }
});

// Delete Event Route
app.delete('/api/events/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).send({ message: 'Event not found' });
    }
    res.status(200).send({ message: 'Event deleted successfully', event: deletedEvent });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).send({ message: 'Error deleting event', error: err.message });
  }
});

// Add User Role Route
app.post('/api/addUserRole', async (req, res) => {
  const { username, email, department, role } = req.body;
  try {
    const newUserRole = new UserRole({ username, email, department, role });
    await newUserRole.save();
    res.status(201).send({ message: 'User role added successfully', userRole: newUserRole });
  } catch (error) {
    res.status(500).send({ message: 'Error adding user role', error: error.message });
  }
});

// Get All User Roles Route
app.get('/api/userRoles', async (req, res) => {
  try {
    const userRoles = await UserRole.find();
    res.status(200).send({ message: 'User roles fetched successfully', userRoles });
  } catch (error) {
    console.error('Error fetching user roles:', error.message);
    res.status(500).send({ message: 'Error fetching user roles', error: error.message });
  }
});

// Delete User Role Route
app.delete('/api/userRoles/:id', async (req, res) => {
  try {
    const deletedUserRole = await UserRole.findByIdAndDelete(req.params.id);
    if (!deletedUserRole) {
      return res.status(404).send({ message: 'User role not found' });
    }
    res.status(200).send({ message: 'User role deleted successfully', userRole: deletedUserRole });
  } catch (error) {
    console.error('Error deleting user role:', error.message);
    res.status(500).send({ message: 'Error deleting user role', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
