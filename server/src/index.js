const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/industry-directory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

app.post('/api/contacts', async (req, res) => {
  const { name, email, company } = req.body;
  const newContact = new Contact({ name, email, company });

  try {
    await newContact.save();
    res.json('Contact added!');
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
