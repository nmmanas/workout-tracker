# Creating a New Tenant

When you need to create a new tenant for your white-label workout tracker application, follow these steps:

1. Access your MongoDB database (either through a MongoDB client or your preferred method).

2. Insert a new document into the `tenants` collection with the following structure:

   ```javascript
   {
     name: "New Tenant Name",
     subdomain: "new-tenant-subdomain",
     // Add any other tenant-specific fields as needed
   }
   ```

   Replace "New Tenant Name" with the actual name of the tenant, and "new-tenant-subdomain" with the desired subdomain for the tenant.

3. After creating the new tenant in the database, you may need to update your DNS settings to point the new subdomain to your application server.

4. If you have any tenant-specific configurations or feature flags, make sure to set them up for the new tenant.

5. Test the new tenant by accessing the application through the new subdomain.

## Creating a New Tenant via API (Optional)

If you prefer to create new tenants programmatically, you can create an API endpoint for this purpose. Here's an example of how to implement this:

1. Create a new route in your `routes` folder, e.g., `tenantManagement.js`:

   ```javascript
   const express = require('express');
   const router = express.Router();
   const Tenant = require('../models/Tenant');
   const auth = require('../middleware/auth');
   const adminAuth = require('../middleware/adminAuth');

   // POST /api/tenants
   router.post('/', auth, adminAuth, async (req, res) => {
     try {
       const { name, subdomain } = req.body;
       
       // Check if tenant with this subdomain already exists
       let tenant = await Tenant.findOne({ subdomain });
       if (tenant) {
         return res.status(400).json({ message: 'Tenant with this subdomain already exists' });
       }

       // Create new tenant
       tenant = new Tenant({
         name,
         subdomain,
         // Add any other necessary fields
       });

       await tenant.save();

       res.status(201).json(tenant);
     } catch (error) {
       console.error('Error creating new tenant:', error);
       res.status(500).json({ message: 'Server error' });
     }
   });

   module.exports = router;
   ```

2. Add this route to your `server.js`:

   ```javascript
   app.use('/api/tenants', require('./routes/tenantManagement'));
   ```

3. Create an admin middleware (`adminAuth.js`) to ensure only admin users can create new tenants:

   ```javascript
   const adminAuth = (req, res, next) => {
     if (!req.user.isAdmin) {
       return res.status(403).json({ message: 'Access denied. Admin only.' });
     }
     next();
   };

   module.exports = adminAuth;
   ```

4. To create a new tenant, send a POST request to `/api/tenants` with the tenant details in the request body. Make sure to include the authentication token in the request headers.

Remember to implement proper security measures and validation when creating new tenants, especially if you're doing it through an API endpoint.