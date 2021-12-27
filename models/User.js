const { Schema, model, ObjectId } = require("mongoose");

const User = new Schema({
  name: { type: String, required: true, unique: false },
  email: { type: String, required: true, unique: true }, // валидация, необх поля
  password: { type: String, required: true },
  historyOfMoves: { type: Array, default: [] },
});

module.exports = model("User", User);
