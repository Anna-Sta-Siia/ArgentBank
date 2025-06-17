const mongoose = require('mongoose')

const databaseUrl =
  process.env.DATABASE_URL
  || process.env.MONGO_URL
  || 'mongodb://localhost/argentBankDB'

module.exports = async () => {
  try {
    await mongoose.connect(databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ Database successfully connected to', databaseUrl)
  } catch (error) {
    console.error(`❌ Database Connectivity Error: ${error}`)
    throw error
  }
}

