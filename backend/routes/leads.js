const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const auth = require('../middleware/auth');

// Analytics — only current user's leads
router.get('/analytics', auth, async (req, res) => {
  try {
    const filter = { createdBy: req.user.id };
    const total = await Lead.countDocuments(filter);
    const newLeads = await Lead.countDocuments({ ...filter, status: 'new' });
    const contacted = await Lead.countDocuments({ ...filter, status: 'contacted' });
    const converted = await Lead.countDocuments({ ...filter, status: 'converted' });
    res.json({ total, new: newLeads, contacted, converted });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all leads — only current user's leads
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 8, search = '', status = '' } = req.query;

    const query = { createdBy: req.user.id };
    if (search) query.name = { $regex: search, $options: 'i' };
    if (status) query.status = status;

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ leads, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create lead — save who created it
router.post('/', auth, async (req, res) => {
  try {
    const lead = new Lead({ ...req.body, createdBy: req.user.id });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update lead — only if it belongs to current user
router.put('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete lead — only if it belongs to current user
router.delete('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;