const express = require('express');
const router = express.Router();
const items = require('./fakeDb');

// GET /items - Get the list of shopping items
router.get('/items', (req, res) => {
  res.json(items);
});

// POST /items - Add an item to the shopping list
router.post('/items', (req, res) => {
  const { name, price } = req.body;
  const newItem = { name, price };
  items.push(newItem);
  res.status(201).json({ added: newItem });
});

// GET /items/:name - Get a single item by name
router.get('/items/:name', (req, res) => {
  const name = req.params.name;
  const item = items.find((item) => item.name === name);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// PATCH /items/:name - Modify a single item's name and/or price
router.patch('/items/:name', (req, res) => {
  const name = req.params.name;
  const { newName, newPrice } = req.body;

  const itemIndex = items.findIndex((item) => item.name === name);

  if (itemIndex !== -1) {
    if (newName) {
      items[itemIndex].name = newName;
    }
    if (newPrice) {
      items[itemIndex].price = newPrice;
    }

    res.json({ updated: items[itemIndex] });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// DELETE /items/:name - Delete a specific item
router.delete('/items/:name', (req, res) => {
  const name = req.params.name;
  const itemIndex = items.findIndex((item) => item.name === name);

  if (itemIndex !== -1) {
    items.splice(itemIndex, 1);
    res.json({ message: 'Deleted' });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

module.exports = router;
