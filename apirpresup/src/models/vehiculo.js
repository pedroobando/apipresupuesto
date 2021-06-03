const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const VehiculoSchema = Schema(
  {
    placa: {
      type: String,
      required: true,
      index: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    marca: {
      type: String,
      trim: true,
    },
    modelo: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

VehiculoSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

VehiculoSchema.plugin(mongoosePaginate);

module.exports = model('Vehiculo', VehiculoSchema);
