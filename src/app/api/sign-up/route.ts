import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import connectDb from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'


export async function POST (request:Request){
    // connected db
    await connectDb();

    try {
        // getting username email and password

        const {username,email,password} = await request.json()
            
        // finding user from username
        const exisitngUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
         
        if(exisitngUserVerifiedByUsername){
            return Response.json({
                success:false,
                message: 'Username is already taken'
            },{status:400})
        }

        // finding user by email

        const existingEmail = await UserModel.findOne({
            email
        })
        
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
          
        // checking user email have then return false if not have hashed the password of the user
        
        if(existingEmail){
            if(existingEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Email is already used",
                },{status:400})
            }else{
                const hashPassword = await bcrypt.hash(password,10);
                existingEmail.password = hashPassword;
                existingEmail.verifyCode = verifyCode;
                existingEmail.verifyCodeExpiry = new Date(Date.now() + 36000000)
                await existingEmail.save()
            }
        }else{
            const hashPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                 verifyCode,
                   verifyCodeExpiry: expiryDate,
                   isVerified: false,
                   isAcceptingMessage: true,
                   message: []
            })
            await newUser.save()
        }

        // send verification email

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message: emailResponse.message
            },{status:500})
        }

        return Response.json({
            success: true,
            message: 'User registered successfully. Please verify your email'
        },{status:200})
    } catch (error) {
         console.log('Error registering user',error)
          return Response.json({
            success: false,
            message: "Error registering user"
        },{
            status:500
        })
    }
}