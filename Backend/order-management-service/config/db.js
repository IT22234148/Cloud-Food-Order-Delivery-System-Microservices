// order-management-service/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // Not needed in newer versions
      // useFindAndModify: false, // Not needed in newer versions
    });
    console.log('Order Management Service MongoDB Connected');
  } catch (error) {
    console.error(`Error connecting to Order Management Service MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;