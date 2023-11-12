const dynamoose = require("dynamoose");
const placesSchema = new dynamoose.Schema(
  {
    id: { type: String, hashKey: true },
    userId: String,
    location: {
      type: Object,
      schema: {
        lat: Number,
        lng: Number,
      },
    },
    address: String,
    title: String,
  },
  {
    timestamps: true,
  }
);
const Places = dynamoose.model("Places", placesSchema);
module.exports = Places;
