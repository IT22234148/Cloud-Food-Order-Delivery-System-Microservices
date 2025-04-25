import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
  driverId: { type: String, unique: true }, // Custom driver ID
  name: { type: String, required: true },
  driverAvailability: { type: Boolean, default: true },
  driverLocation: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
});

// Add a 2dsphere index to the driverLocation field
DriverSchema.index({ driverLocation: '2dsphere' });

// Pre-save hook to generate a custom driverId
DriverSchema.pre('save', async function (next) {
  if (!this.driverId) {
    const count = await mongoose.model('Driver').countDocuments();
    this.driverId = `DR${(count + 1).toString().padStart(3, '0')}`; // Generate ID like DR001, DR002
  }
  next();
});

const Driver = mongoose.model('Driver', DriverSchema);
export default Driver;
