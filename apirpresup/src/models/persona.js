const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const PersonaSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    dni: {
      type: String,
      required: true,
      index: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    comentario: {
      type: String,
    },
    aprobadoradm: {
      type: Boolean,
      default: false,
    },
    aprobadorseg: {
      type: Boolean,
      default: false,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    creador: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

PersonaSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

PersonaSchema.plugin(mongoosePaginate);
module.exports = model('Persona', PersonaSchema);
