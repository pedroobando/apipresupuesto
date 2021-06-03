const { Schema, model } = require('mongoose');

const CounterSchema = Schema(
  {
    seq: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// UserSchema.method('toJSON', function () {
//   const { __v, _id, ...object } = this.toObject();
//   object.uid = _id;
//   return object;
// });

module.exports = model('Counter', CounterSchema);
