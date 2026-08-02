const { Fee, Student } = require('../models');

exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.findAll({ include: [Student], order: [['createdAt', 'DESC']] });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fees', error });
  }
};

exports.createFee = async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    res.status(400).json({ message: 'Error creating fee', error });
  }
};

exports.updateFeeStatus = async (req, res) => {
  try {
    const fee = await Fee.findByPk(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    await fee.update({ status: req.body.status, paymentDate: req.body.paymentDate });
    res.json(fee);
  } catch (error) {
    res.status(400).json({ message: 'Error updating fee', error });
  }
};

exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByPk(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    await fee.destroy();
    res.json({ message: 'Fee deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting fee', error });
  }
};
