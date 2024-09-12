const Tenant = require('../models/Tenant');

const createOrGetDefaultTenant = async () => {
  try {
    let defaultTenant = await Tenant.findOne({ subdomain: 'default' });
    
    if (!defaultTenant) {
      defaultTenant = new Tenant({
        name: 'Default Tenant',
        subdomain: 'default',
        // Add any other default fields you need
      });
      await defaultTenant.save();
      console.log('Default tenant created successfully');
    } else {
      console.log('Default tenant already exists');
    }
    
    return defaultTenant;
  } catch (error) {
    console.error('Error creating/getting default tenant:', error);
    throw error;
  }
};

module.exports = createOrGetDefaultTenant;