const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  subdomain: {
    type: String,
    required: true,
    unique: true
  },
  // Add other tenant-specific fields as needed
});

module.exports = mongoose.model('Tenant', TenantSchema);