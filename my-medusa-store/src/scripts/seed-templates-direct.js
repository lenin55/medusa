// Import fetch since it's not built into older Node.js versions
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');
const fs = require('fs');

// Read the admin API URL and key from the environment or config
const MEDUSA_ADMIN_URL = process.env.MEDUSA_ADMIN_URL || 'http://localhost:9000/admin';
const COOKIE_FILE_PATH = path.join(__dirname, '.admin-cookie');

// Templates to create
const templates = [
  {
    event_name: "payment.captured",
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Payment Captured</h1>
        <p>Hello {{customer.first_name}},</p>
        <p>We're happy to confirm that your payment of <strong>{{payment.amount}}</strong> has been successfully captured for order #{{order.display_id}}.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h3>Order Details:</h3>
          <p>Order ID: #{{order.display_id}}</p>
          <p>Payment Amount: {{payment.amount}}</p>
          <p>Payment Method: {{payment.provider_id}}</p>
          <p>Transaction Date: {{payment.created_at}}</p>
        </div>
        <p>Thank you for your purchase!</p>
        <p>Best regards,<br>The {{store.name}} Team</p>
      </div>
    `,
    subject: "Payment Confirmation - Order #{{order.display_id}}",
    to: "{{customer.email}}",
  },
  {
    event_name: "order.placed",
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmation</h1>
        <p>Hello {{customer.first_name}},</p>
        <p>Thank you for your order! We've received your order and it's being processed.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h3>Order Summary:</h3>
          <p>Order ID: #{{order.display_id}}</p>
          <p>Order Date: {{order.created_at}}</p>
          <p>Order Total: {{order.total}}</p>
          <p>Shipping Method: {{order.shipping_methods.0.name}}</p>
        </div>
        <h3>Items Ordered:</h3>
        <ul style="padding-left: 20px;">
          {{#each order.items}}
            <li>{{this.title}} - Quantity: {{this.quantity}} - Price: {{this.unit_price}}</li>
          {{/each}}
        </ul>
        <p>We will notify you once your order has been shipped.</p>
        <p>Best regards,<br>The {{store.name}} Team</p>
      </div>
    `,
    subject: "Order Confirmation - #{{order.display_id}}",
    to: "{{customer.email}}",
  },
  {
    event_name: "order.shipment_created",
    template: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Your Order Has Shipped!</h1>
        <p>Hello {{customer.first_name}},</p>
        <p>Great news! Your order #{{order.display_id}} has been shipped and is on its way to you.</p>
        <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <h3>Shipping Details:</h3>
          <p>Order ID: #{{order.display_id}}</p>
          <p>Tracking Number: {{fulfillment.tracking_numbers}}</p>
          <p>Carrier: {{fulfillment.shipping_carrier}}</p>
          <p>Estimated Delivery: {{fulfillment.data.estimated_delivery}}</p>
        </div>
        <h3>Items Shipped:</h3>
        <ul style="padding-left: 20px;">
          {{#each fulfillment.items}}
            <li>{{this.title}} - Quantity: {{this.quantity}}</li>
          {{/each}}
        </ul>
        <p>Thank you for your order!</p>
        <p>Best regards,<br>The {{store.name}} Team</p>
      </div>
    `,
    subject: "Your Order #{{order.display_id}} Has Shipped!",
    to: "{{customer.email}}",
  }
];

// Function to get auth token
async function login() {
  console.log('Authenticating with Medusa admin...');
  
  try {
    // Check if we have a saved cookie
    if (fs.existsSync(COOKIE_FILE_PATH)) {
      const cookie = fs.readFileSync(COOKIE_FILE_PATH, 'utf8');
      console.log('Using saved authentication cookie');
      return cookie;
    }
    
    // Otherwise, prompt for login info
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const email = await new Promise(resolve => {
      readline.question('Enter your admin email: ', resolve);
    });
    
    const password = await new Promise(resolve => {
      readline.question('Enter your admin password: ', resolve);
    });
    
    readline.close();
    
    console.log('Attempting to login with provided credentials...');
    
    // Perform login - using the auth API endpoint
    const response = await fetch(`${MEDUSA_ADMIN_URL}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Login failed: ${data.message || response.statusText}`);
    }
    
    // Extract the token from the response
    const token = data.access_token;
    if (!token) {
      throw new Error('No access token returned from auth endpoint');
    }
    
    // Save the token for later use
    fs.writeFileSync(COOKIE_FILE_PATH, token);
    
    console.log('Authentication successful!');
    return token;
  } catch (error) {
    console.error('Authentication error:', error.message);
    process.exit(1);
  }
}

// Function to create a template
async function createTemplate(template, token) {
  console.log(`Creating template for event: ${template.event_name}`);
  
  try {
    const response = await fetch(`${MEDUSA_ADMIN_URL}/notification-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(template),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create template');
    }
    
    console.log(`✅ Created template for event: ${template.event_name}`);
    return data;
  } catch (error) {
    console.error(`❌ Failed to create template for ${template.event_name}:`, error.message);
    return null;
  }
}

// Main function
async function run() {
  console.log('Starting notification template seeding...');
  
  try {
    // Get authentication token
    const token = await login();
    
    // Create each template
    for (const template of templates) {
      await createTemplate(template, token);
    }
    
    console.log('✅ Template seeding completed!');
  } catch (error) {
    console.error('Error during template seeding:', error);
  }
}

run();