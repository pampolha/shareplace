import dynamoose from "dynamoose";

export const emailIndex = "email-index";
const usersSchema = new dynamoose.Schema(
  {
    id: { type: String, hashKey: true, required: true },
    name: {
      type: String,
      required: true,
    },
    email: {
      index: {
        name: emailIndex,
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

export default Users;
