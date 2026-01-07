const mongoose = require("mongoose");

const geoSchema = new mongoose.Schema({
  lat: {
    type: String,
    required: true
  },
  lng: {
    type: String,
    required: true
  }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true
  },
  suite: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  zipcode: {
    type: String,
    required: true
  },
  geo: geoSchema
}, { _id: false });

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  catchPhrase: {
    type: String
  },
  bs: {
    type: String
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: addressSchema,
  phone: {
    type: String
  },
  website: {
    type: String
  },
  company: companySchema
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);
