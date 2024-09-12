const Tenant = require('../models/Tenant');

const identifyTenant = async (req, res, next) => {
  try {
    const subdomain = req.hostname.split('.')[0];
    let tenant;

    if (subdomain === 'localhost' || subdomain === process.env.DEFAULT_DOMAIN) {
      tenant = await Tenant.findOne({ subdomain: 'default' });
    } else {
      tenant = await Tenant.findOne({ subdomain });
    }

    if (!tenant) {
      console.warn(`No tenant found for subdomain: ${subdomain}`);
      return res.status(404).json({ message: 'Tenant not found' });
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    console.error('Error identifying tenant:', error);
    next(error);
  }
};

module.exports = identifyTenant;