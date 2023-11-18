import dynamoose from "dynamoose";

export const userIdIndex = "userId-index";
const placesSchema = new dynamoose.Schema(
  {
    id: { type: String, hashKey: true, required: true },
    userId: {
      index: {
        name: userIdIndex,
        type: "global",
      },
      type: String,
      required: true,
    },
    location: {
      type: Object,
      schema: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Places = dynamoose.model("Places", placesSchema);

export default Places;
