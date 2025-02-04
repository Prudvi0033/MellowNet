import { mailtrapClient, sender } from "../lib/mailtrap.js"

const sendWelcomeEmail = async (email, name, profileUrl) => {
    const recipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from : sender,
            to : recipient,
            subject : "Welcome to Mellow",
            html : createWelcomeEmailTemplate(name, profileUrl),
            category : "Welcome"
        })

        console.log("Welcome email sent succesfully", response);
        
    } catch (error) {
        throw error;
    }
}

export default sendWelcomeEmail