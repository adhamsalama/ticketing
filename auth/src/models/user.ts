import mongoose from 'mongoose';
import { Password } from '../utils/password';

// Interface that describes properties required to create a new user
interface UserAttrs {
    email: string,
    password: string
};

// Interface that describes properties a User Model has
// Document is an instance of Model
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// Interface that describes properties a User Document has
interface UserDoc extends mongoose.Document {
    email: string,
    password: string,
}
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret.__id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }

});

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
})
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('user', userSchema);

// const buildUser = (attrs: UserAttrs) => {
//     return new User(attrs);
// };

export { User };