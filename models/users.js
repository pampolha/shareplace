const dynamoose = require("dynamoose");
const usersSchema = new dynamoose.Schema(
  {
    id: { type: String, hashKey: true },
    name: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);
const Users = dynamoose.model('Users', usersSchema);
module.exports = Users;