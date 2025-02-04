

export const createWelcomeEmailTemplate = (name, profileUrl) => {
	return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to MellowNet</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #4A2C2A; max-width: 600px; margin: 0 auto; padding: 20px; background: #FAF3F0;">
    <div style="background: #6B3E3E; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <img src="https://i.pinimg.com/736x/d9/97/3d/d9973db01cc28a3801686e6ccdd43093.jpg" alt="MellowNet Logo" style="width: 150px; margin-bottom: 20px; border-radius: 10px;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to MellowNet!</h1>
    </div>
    <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <p style="font-size: 18px; color: #6B3E3E;"><strong>Hello ${name},</strong></p>
      <p>We’re excited to have you in our relaxed networking space! MellowNet is your place to chill, connect, and share ideas at your own pace.</p>
      <div style="background-color: #F0E0DC; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 16px; margin: 0;"><strong>Here's how to get started:</strong></p>
        <ul style="padding-left: 20px;">
          <li>Complete your profile and add a chill bio</li>
          <li>Connect with like-minded individuals</li>
          <li>Share mellow thoughts and moments</li>
          <li>Relax and explore</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${profileUrl}" style="background-color: #6B3E3E; color: white; padding: 14px 28px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">Complete Your Profile</a>
      </div>
      <p>If you need any help, our support team is here for you.</p>
      <p>Best vibes,<br>The MellowNet Team</p>
    </div>
  </body>
  </html>
  `
}

