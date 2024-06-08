import { Schema, model } from 'mongoose';
import { v4 as uuid } from 'uuid';
const documentSchema = new Schema({
    _id: {
        type: String,
        default: uuid,
    },
    title: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        default: {}, // Sets the default value to an empty object if no data is provided
    },
});
const Document = model('Document', documentSchema);
export default Document;
