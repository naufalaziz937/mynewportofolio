import mongoose from 'mongoose';

export async function connectDatabase(uri: string): Promise<void> {
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected; driver will retry.'));
  mongoose.connection.on('reconnected', () => console.info('MongoDB reconnected.'));
  try { await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 }); console.info('MongoDB connected.'); }
  catch (error) {
    const detail = error as { name?: string; code?: string | number } | undefined;
    console.error('MongoDB connection failed:', detail?.name ?? 'UnknownError', detail?.code ?? 'no-code');
    throw new Error('Unable to connect to MongoDB. Check MONGODB_URI and database availability.');
  }
}
export async function disconnectDatabase(): Promise<void> { await mongoose.disconnect(); }
