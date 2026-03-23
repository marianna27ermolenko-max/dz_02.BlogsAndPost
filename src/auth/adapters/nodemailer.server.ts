import nodemailer from "nodemailer";
import { SETTINGS } from "../../common/settings/setting";
import { emailExamples } from "./emailExamples";

export const nodemailerServise = {

  async sendEmail(email: string, code: string, subject: string = 'Your code is here',){
  
    let transport = nodemailer.createTransport({

      service: "Mail.ru",
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.EMAIL_PASS,
      },
    });
 
    let arg = {
        from: `"Marianna" <${SETTINGS.EMAIL}>`,
        to: email,
        subject: subject,
        html: emailExamples.registrationEmail(code),
    }

    let info = await transport.sendMail(arg);
    return !!info; 
  },
};
