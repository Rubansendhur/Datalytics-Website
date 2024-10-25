const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
require('dotenv').config();
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 5000;

const router = express.Router(); // Initialize the router

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Make email unique
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);


const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  price: { type: Number, required: true }, // Changed to 'price' for consistency
  image_url: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

// Signup Route
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword });

  try {
    await user.save();
    console.log('User created:', user); // Log the created user
    res.status(201).send({ message: 'User created successfully' }); // Send success response
  } catch (error) {
    console.error('Error creating user:', error.message); // Log error
    if (error.code === 11000) {
      // Handle duplicate key error for both username and email
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
  
  console.log('Login Request:', req.body); // Log login request data

  try {
    // Check if user exists by username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      console.warn('Login failed: User not found'); // Log warning
      return res.status(401).send('Invalid credentials: User not found');
    }

    // Compare the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.warn('Login failed: Incorrect password'); // Log warning
      return res.status(401).send('Invalid credentials: Incorrect password');
    }

    // Successful login
    console.log('Login successful for user:', user.username);
    return res.status(200).send({ message: 'Login successful', token: 'your_generated_token_here' }); // Send a token or user info if needed

  } catch (error) {
    
    console.error('Server error during login:', error.message); // Log server error
    res.status(500).send('Server error: ' + error.message);
  }
});
// Get All Users Route
// Get All Users Route
// Delete User Route
app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
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
    const products = await Product.find(); // Fetch all products from the database
    if (products.length === 0) {
      return res.status(404).send({ message: 'No products found' }); // Return a message if no products are found
    }
    // Return structured response with all product data
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
    console.error('Error fetching products:', err); // Log the error for debugging
    res.status(500).send({ message: 'Error fetching products', error: err.message }); // Return structured error response
  }
});

const storage = multer.memoryStorage(); // Use memory storage instead of disk storage
const upload = multer({ storage: storage });

const eventSchema = new mongoose.Schema({
  eventName: String,
  eventDate: String,
  eventLocation: String,
  description: String,
  imageBase64: String
});

const Event = mongoose.model('Event', eventSchema);

// API endpoint to insert an event
app.post('/api/events', async (req, res) => {
  try {
    const eventData = req.body;
    console.log('Received event data:', eventData); // Log incoming data
    const newEvent = new Event(eventData);
    await newEvent.save();
    res.status(201).send({ message: 'Event added successfully!' });
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).send({ message: 'Failed to add event. Please try again.' });
  }
});
module.exports = router;
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
// Route to Fetch All Events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    if (events.length === 0) {
      return res.status(404).send({ message: 'No events found' });
    }
    res.status(200).send({ message: 'Events fetched successfully', events });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).send({ message: 'Error fetching events', error: err.message });
  }
});
app.delete('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  console.log("Event ID to delete:", id);

  // Validate the ID format (assuming MongoDB's 24-character hexadecimal format)
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).send({ message: 'Invalid event ID format' });
  }

  try {
    // Attempt to find and delete the event by its ID
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      // If no event is found with the given ID, return a 404 status
      return res.status(404).send({ message: 'Event not found' });
    }

    // Return a success message and the deleted event data
    res.status(200).send({ message: 'Event deleted successfully', event: deletedEvent });
  } catch (err) {
    // Handle any unexpected errors during deletion
    console.error('Error deleting event:', err);
    res.status(500).send({ message: 'Error deleting event', error: err.message });
  }
});


const userRoleSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, required: true }
});

const UserRole = mongoose.model('UserRole', userRoleSchema);
app.post('/api/addUserRole', async (req, res) => {
  console.log('hi');
  const { username, email, department, role } = req.body;

  if (!username || !email || !department || !role) {
    return res.status(400).send('Username, email, department, and role are required');
  }

  try {
    const newUserRole = new UserRole({ username, email, department, role });
    await newUserRole.save();
    console.log( 'User role added successfully');
    res.status(201).send({ message: 'User role added successfully', userRole: newUserRole });
  } catch (error) {
    res.status(500).send({ message: 'Error adding user role', error: error.message });
  }
});

app.get('/api/userRoles', async (req, res) => {
  try {
    const userRoles = await UserRole.find(); // Fetch all user roles from the database
    console.log(userRoles);
     // Log the success
    res.status(200).send({ message: 'User roles fetched successfully', userRoles });
  } catch (error) {
    console.error('Error fetching user roles:', error.message); // Log the error for debugging
    res.status(500).send({ message: 'Error fetching user roles', error: error.message });
  }
});
app.delete('/api/userRoles/:id', async (req, res) => {
  const { id } = req.params; // Get user ID from request parameters

  try {
    const deletedUserRole = await UserRole.findByIdAndDelete(id); // Delete user role from the database

    if (!deletedUserRole) {
      return res.status(404).send({ message: 'User role not found' }); // If not found, send a 404 error
    }

    console.log('User role deleted successfully');
    res.status(200).send({ message: 'User role deleted successfully', userRole: deletedUserRole });
  } catch (error) {
    console.error('Error deleting user role:', error.message); // Log the error for debugging
    res.status(500).send({ message: 'Error deleting user role', error: error.message });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
