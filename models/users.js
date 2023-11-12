const dynamoose = require("dynamoose");
const usersSchema = new dynamoose.Schema(
  {
    id: { type: String, hashKey: true, required: true },
    name: {
      type: String,
      required: true,
    },
    email: {
      index: {
        name: "email-index",
        type: "global",
      },
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Users = dynamoose.model("Users", usersSchema);
module.exports = Users;
