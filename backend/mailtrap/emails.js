import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try{
        const response = await mailtrapClient.send({
            from : sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        })

        console.log("Email sent successfully", response);
    }

    catch (error){
        console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
    }
}

//welcome email
export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{email}]

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "caf17cef-ac2b-4dfd-abea-43baec010dcf",
            template_variables: {
                company_info_name: "SecureAuth",
                name: name
            }
        })

        console.log("Welcome email sent successfully", response);
    }

    catch(error){
        console.error(`Error sending welcome email`, error);
		throw new Error(`Error sending welcome email: ${error}`);
    }
}

//forgot password email
export const sendPasswordResetEmail = async(email, resetURL) => {
    //get the recipient
    const recipient = [{email}]

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        })

        console.log("Forgot password email sent successfully", response);
    }

    catch(error){
        console.error(`Error sending password reset email`, error);
		throw new Error(`Error sending password reset email: ${error}`);
    }
}