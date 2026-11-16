import 'dotenv/config'
import mongoose from 'mongoose'
export * as schema from './schema.js'

async function useDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL

  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required.')
  }

  const connect = async () => {
    await mongoose.connect(DATABASE_URL)
    console.log('MongoDB connected')
  }

  const disconnect = async () => {
    try {
      await mongoose.disconnect()
      console.log('MongoDB disconnected')
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error)
    }
  }

  return {
    connect,
    disconnect,
    isConnected: () => mongoose.connection.readyState === 1,
  }
}

export default useDatabase
