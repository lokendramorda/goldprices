const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const multer = require('multer'); // For handling file uploads
const path = require('path');
const fs = require('fs');
require('dotenv').config();


// Express app setup
const app = express();
const port = process.env.PORT || 5000; 

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors({
  origin: 'http://localhost:3000'  // Frontend URL
}));

// MongoDB URI and client setup
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// MongoDB connection
async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Terminate the process if connection fails
  }
}

connectDB();

// Routes

// 1. Upload item (accept base64 image)
app.post('/upload', async (req, res) => {
  const { itemId, category, description, price, photo } = req.body; // Item fields
  const base64Image = photo; // Base64 image string
  
  // Check if an item with the same itemId already exists
  const itemsCollection = client.db('yourDatabase').collection('items');
  const existingItem = await itemsCollection.findOne({ itemId });

  if (existingItem) {
    return res.status(400).json({ message: 'Item with this ID already exists' });
  }

  // Prepare image as a buffer for storage
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, ''); // Strip the base64 header
  const buffer = Buffer.from(base64Data, 'base64'); // Convert to buffer

  const newItem = {
      itemId,
      category,
      description,
      price,
      photo: buffer,  // Store the image buffer in MongoDB
  };

  try {
      const result = await itemsCollection.insertOne(newItem);
      res.status(200).json({ message: 'Item uploaded successfully', item: result.insertedId });
  } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Error uploading item', error });
  }
});


// 2. Retrieve item by ID (send image as base64)
app.get('/item/:id', async (req, res) => {
    const itemId = req.params.id;
    const itemsCollection = client.db('yourDatabase').collection('items');

    try {
        const item = await itemsCollection.findOne({ itemId });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Convert image buffer back to base64
        const base64Image = item.photo.toString('base64');
        const imageUrl = `data:image/png;base64,${base64Image}`;
        
        // Include the image in the response
        res.status(200).json({ ...item, photo: imageUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving item', error });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
