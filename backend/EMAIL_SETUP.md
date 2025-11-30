# Email Configuration Guide for OTP System

LegalSenser uses **Nodemailer** to send OTP codes via email for user registration.

## Gmail Setup (Recommended)

### Prerequisites
- A Gmail account
- 2-Factor Authentication enabled

### Step-by-Step Setup

1. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Find "2-Step Verification" and turn it ON
   - Follow the setup process

2. **Generate App Password**
   - Visit: https://myaccount.google.com/apppasswords
   - If you don't see this option, make sure 2FA is enabled
   - Select App: **Mail**
   - Select Device: **Other (Custom name)**
   - Enter name: **LegalSenser Backend**
   - Click **Generate**
   - Copy the 16-character password (remove spaces)

3. **Update .env File**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password_here
   EMAIL_FROM=LegalSenser <noreply@legalsenser.com>
   ```

4. **Test Configuration**
   The server will verify email configuration on startup.

---

## Alternative Email Providers

### Outlook/Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
EMAIL_FROM=LegalSenser <your_email@outlook.com>
```

**Note:** You may need to enable "Allow less secure apps" in Outlook settings.

### Yahoo Mail

```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your_email@yahoo.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=LegalSenser <your_email@yahoo.com>
```

**Note:** Yahoo also requires App Passwords. Generate one at: https://login.yahoo.com/account/security

### Custom SMTP Server

```env
EMAIL_HOST=smtp.your-domain.com
EMAIL_PORT=587
EMAIL_USER=your_email@your-domain.com
EMAIL_PASSWORD=your_password
EMAIL_FROM=LegalSenser <noreply@your-domain.com>
```

---

## Email Template

The OTP email includes:
- Professional HTML design
- Large, easy-to-read OTP code
- 10-minute expiration notice
- Security warning message
- Plain text fallback for compatibility

### Customization

To customize the email template, edit:
`backend/src/services/emailService.ts`

You can modify:
- Colors and styling
- Logo and branding
- Message content
- Expiration time

---

## Testing

### Test Email Sending

After configuration, test by:

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Watch for verification message:**
   ```
   Email service is ready to send emails
   ```

3. **Test OTP endpoint:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/sendotp \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

4. **Check your inbox** for the OTP email

---

## Troubleshooting

### "Invalid login" or "Authentication failed"

**Solution:**
- Ensure 2FA is enabled on Gmail
- Use App Password, not your regular Gmail password
- Remove any spaces from the App Password
- Double-check EMAIL_USER is correct

### "Connection timeout" or "ETIMEDOUT"

**Solution:**
- Check your internet connection
- Verify EMAIL_HOST and EMAIL_PORT
- Check if your firewall is blocking SMTP (port 587)
- Try port 465 with `secure: true` in the transporter config

### "Recipient address rejected"

**Solution:**
- Ensure the email address is valid
- Check if the domain accepts emails
- Some providers block emails to certain domains

### OTP not being received

**Solution:**
- Check spam/junk folder
- Verify EMAIL_FROM is properly formatted
- Check email server logs
- Test with a different email address

### "Email service configuration error"

**Solution:**
- Verify all email environment variables are set
- Check for typos in .env file
- Ensure .env file is loaded (check with `console.log(process.env.EMAIL_USER)`)

---

## Security Best Practices

1. **Never commit .env file** to version control
   - Already in .gitignore
   - Use .env.example for templates

2. **Use App Passwords** instead of account passwords
   - More secure
   - Can be revoked without changing main password

3. **Rotate credentials** periodically
   - Generate new App Password every few months
   - Update .env file

4. **Monitor usage**
   - Gmail has sending limits (500 emails/day for free accounts)
   - Consider using a dedicated email service for production

5. **Rate limiting**
   - Implement rate limiting on OTP endpoint
   - Prevent abuse and spam

---

## Production Considerations

For production environments, consider using:

### Dedicated Email Services

1. **SendGrid**
   - 100 emails/day free
   - Better deliverability
   - Analytics and tracking

2. **Amazon SES**
   - Pay-as-you-go pricing
   - High deliverability
   - Scalable

3. **Mailgun**
   - 5,000 emails/month free
   - REST API
   - Email validation

4. **Postmark**
   - Excellent deliverability
   - Transaction email specialist
   - Detailed analytics

### Configuration Example (SendGrid)

```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
EMAIL_FROM=LegalSenser <noreply@your-verified-domain.com>
```

---

## OTP Settings

Current OTP configuration:
- **Length:** 6 digits
- **Characters:** Numbers only (0-9)
- **Expiration:** 10 minutes
- **Storage:** MongoDB with TTL index

To modify OTP settings, edit:
- Length: `backend/src/controller/auth.ts` (otpGenerator.generate)
- Expiration: `backend/src/models/otp.ts` (expires field)

---

## Email Flow

1. User enters email on signup page
2. Frontend calls `/api/auth/sendotp` with email
3. Backend generates 6-digit OTP
4. OTP stored in MongoDB with 10-minute TTL
5. Email sent via Nodemailer
6. User receives email with OTP
7. User enters OTP on frontend
8. Frontend calls `/api/auth/signup` with OTP
9. Backend verifies OTP
10. User account created
11. Used OTP deleted from database

---

## Support

For issues with email configuration:
1. Check the troubleshooting section above
2. Review server logs for detailed error messages
3. Test with a different email provider
4. Ensure all environment variables are set correctly

---

## Summary

✅ **Nodemailer** replaces Twilio for OTP delivery  
✅ OTP sent via **email** instead of SMS  
✅ **Gmail** with App Passwords recommended  
✅ **10-minute** OTP expiration  
✅ Professional HTML email template  
✅ Multiple provider support  
✅ Production-ready with dedicated services  

The email-based OTP system is more cost-effective and easier to set up than SMS-based solutions, while providing a better user experience.
