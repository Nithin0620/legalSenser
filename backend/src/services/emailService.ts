import nodemailer from "nodemailer";

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Send OTP email to user
 * @param email - Recipient email address
 * @param otp - OTP code to send
 */
export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"LegalSenser" <noreply@legalsenser.com>',
            to: email,
            subject: "Your OTP Code - LegalSenser",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f9f9f9;
                            border-radius: 10px;
                        }
                        .header {
                            background-color: #4F46E5;
                            color: white;
                            padding: 20px;
                            text-align: center;
                            border-radius: 10px 10px 0 0;
                        }
                        .content {
                            background-color: white;
                            padding: 30px;
                            border-radius: 0 0 10px 10px;
                        }
                        .otp-box {
                            background-color: #f3f4f6;
                            border: 2px dashed #4F46E5;
                            padding: 20px;
                            text-align: center;
                            margin: 20px 0;
                            border-radius: 8px;
                        }
                        .otp-code {
                            font-size: 32px;
                            font-weight: bold;
                            color: #4F46E5;
                            letter-spacing: 8px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>LegalSenser</h1>
                        </div>
                        <div class="content">
                            <h2>Your OTP Code</h2>
                            <p>Hello,</p>
                            <p>You have requested an OTP code to complete your registration on LegalSenser.</p>
                            
                            <div class="otp-box">
                                <p style="margin: 0; color: #666;">Your OTP Code:</p>
                                <div class="otp-code">${otp}</div>
                            </div>
                            
                            <p><strong>This code will expire in 10 minutes.</strong></p>
                            <p>If you didn't request this code, please ignore this email.</p>
                            
                            <p>Best regards,<br>The LegalSenser Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply.</p>
                            <p>&copy; 2025 LegalSenser. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                Your OTP Code for LegalSenser
                
                Hello,
                
                You have requested an OTP code to complete your registration on LegalSenser.
                
                Your OTP Code: ${otp}
                
                This code will expire in 10 minutes.
                
                If you didn't request this code, please ignore this email.
                
                Best regards,
                The LegalSenser Team
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP email sent successfully to ${email}: ${info.messageId}`);
    } catch (error: any) {
        console.error("Error sending OTP email:", error);
        throw new Error("Failed to send OTP email");
    }
};

/**
 * Verify email configuration on startup
 */
export const verifyEmailConfig = async (): Promise<boolean> => {
    try {
        await transporter.verify();
        console.log("Email service is ready to send emails");
        return true;
    } catch (error: any) {
        console.error("Email service configuration error:", error.message);
        return false;
    }
};
