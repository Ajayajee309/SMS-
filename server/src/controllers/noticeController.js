const { Notice } = require('../models');

exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.findAll({ order: [['createdAt', 'DESC']] });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices', error });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ message: 'Error creating notice', error });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    await notice.destroy();
    res.json({ message: 'Notice deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notice', error });
  }
};
