// Create a new file at: core-service/src/templates/inquiry.template.ts

export const createInquiryEmailTemplate = (data: {
  propertyName: string;
  propertyUrl: string;
  inquirerName: string;
  inquirerEmail: string;
  inquirerPhone: string;
  message: string;
}): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #dddddd; }
            .header { background-color: #ff9800; color: #ffffff; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; color: #333333; line-height: 1.6; }
            .content h2 { color: #ff9800; font-size: 20px; margin-top: 0; }
            .property-link { display: inline-block; background-color: #ff9800; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
            .info-box { border: 1px solid #eeeeee; border-radius: 5px; padding: 15px; margin-bottom: 20px; }
            .info-box p { margin: 5px 0; }
            .message-box { background-color: #f9f9f9; border-left: 4px solid #ff9800; padding: 15px; margin-top: 10px; font-style: italic; }
            .footer { background-color: #f4f4f4; color: #777777; padding: 20px; text-align: center; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New Property Inquiry</h1>
            </div>
            <div class="content">
                <h2>You've received a new inquiry on Rentverse!</h2>
                <p>A potential buyer/tenant is interested in your property. Please respond to them at your earliest convenience.</p>

                <div class="info-box">
                    <h3>Property Details</h3>
                    <p><strong>Title:</strong> ${data.propertyName}</p>
                    <a href="${data.propertyUrl}" class="property-link">View Property Listing</a>
                </div>

                <div class="info-box">
                    <h3>Inquirer's Information</h3>
                    <p><strong>Name:</strong> ${data.inquirerName}</p>
                    <p><strong>Email:</strong> <a href="mailto:${data.inquirerEmail}">${data.inquirerEmail}</a></p>
                    <p><strong>Phone:</strong> <a href="tel:${data.inquirerPhone}">${data.inquirerPhone}</a></p>
                </div>

                <h3>Message</h3>
                <div class="message-box">
                    <p>"${data.message}"</p>
                </div>
            </div>
            <div class="footer">
                <p>This email was sent from the Rentverse platform.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};
