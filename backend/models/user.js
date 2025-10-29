const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true

    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    address:{
        type:String,
        require : true
    },
 aadharNumber: {
  type: String,
  required: true,
  validate: {
    validator: function(v) {
       return /^\d{12}$/.test(v.replace(/\s+/g, '')); // format: "XXXX XXXX XXXX"
    },
    message: props => `${props.value} is not a valid Aadhaar number format!`
  }
},
    password:{
        type:String,
        require:true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isvoted:{
        type:Boolean,
        default:false
    }

});


userSchema.pre('save',async function (next){
    const person = this;//jab koi user ayga to this sa uska data access kar lega

    //Hash the password only is it has been modified for is new
    if(!person.isModified('password')) return next();//aghar koi new user ha to passworad ma change hoge ya koi old user pwd change karega to next call hoga aurr aggee ka code run nhi hoga
    //is modified funtion ka argument agar change  hoga to true return kar dega varna false
    try{
         //generation of salt for pwd
         const salt = await bcrypt.genSalt(10);

         //hashing the password
         const hashedPassword = await bcrypt.hash(person.password,salt);//person object have a password

         //Overriding theplain password with the hashed one
         person.password = hashedPassword;

         next();
    }
    catch(err){
        next(err);
    }
})

userSchema.methods.comparePassword = async function (candidatePassword){
    try{
    //use bcrypt to compare the provided password with the hassed password
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
    }catch(err){
        throw(err);
    }
}
const user = mongoose.model('user',userSchema);
module.exports=user;