const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ImagenSchema = Schema(
  {
    ordsalida: {
      type: Schema.Types.ObjectId,
      ref: 'ordSalida',
      required: true,
    },
    fieldname: {
      type: String,
    },
    originalname: {
      type: String,
    },
    encoding: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    filename: {
      type: String,
    },
    path: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

ImagenSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

ImagenSchema.plugin(mongoosePaginate);

module.exports = model('Imagen', ImagenSchema);
