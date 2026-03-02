export const emailTemplate = (token) => {
  // In production set CLIENT_URL=https://yourdomain.com in your .env
  const clientUrl = process.env.CLIENT_URL || "http://localhost:4200";

  return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Confirm Your Email</title>

<style type="text/css">
  body { margin: 0; padding: 0; background-color: #f5f7fa; }
  a { text-decoration: none; }
  p {
    font-size: 15px;
    line-height: 24px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-weight: 300;
    color: #6b7280;
  }
  h1 {
    font-size: 22px;
    font-family: 'Helvetica', Arial, sans-serif;
    font-weight: 700;
    color: #1a1a2e;
  }
</style>
</head>

<body align="center">
<div style="text-align: center; padding: 40px 16px;">

  <table align="center" width="560" cellpadding="0" cellspacing="0"
         style="background-color:#ffffff; border-radius:16px;
                box-shadow:0 4px 24px rgba(0,0,0,0.08); overflow:hidden;">

    <!-- Header bar -->
    <tr>
      <td style="background-color:#1a1a2e; padding:24px 40px; text-align:left;">
        <span style="font-family:'Helvetica',Arial,sans-serif;
                     font-size:18px; font-weight:700; color:#ffffff;">
          Note App
        </span>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding: 48px 40px; text-align: center;">

        <!-- Icon -->
        <div style="width:72px; height:72px; border-radius:50%;
                    background-color:#f0f4ff; display:inline-flex;
                    align-items:center; justify-content:center;
                    margin-bottom:28px;">
          <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
               width="36" height="36" alt="email icon"
               style="display:block;" />
        </div>

        <h1 style="margin:0 0 12px;">Confirm Your Email</h1>

        <p style="margin:0 0 32px; max-width:380px; margin-left:auto; margin-right:auto;">
          Thanks for signing up! Click the button below to verify your email address
          and activate your account.
        </p>

        <a href="${clientUrl}/auth/verify-email/${encodeURIComponent(token)}"
           target="_blank"
           style="background-color:#1a1a2e;
                  font-size:15px;
                  font-family:'Helvetica', Arial, sans-serif;
                  font-weight:500;
                  text-decoration:none;
                  padding:14px 36px;
                  color:#ffffff;
                  border-radius:8px;
                  display:inline-block;">
          Confirm Email
        </a>

        <p style="margin-top:32px; font-size:13px; color:#9ca3af;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        <p style="font-size:12px; color:#d1d5db;">
          Or copy this link into your browser:<br/>
          <span style="word-break:break-all; color:#4361ee;">
            ${clientUrl}/auth/verify-email/${encodeURIComponent(token)}
          </span>
        </p>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color:#f9fafb; padding:20px 40px; text-align:center;
                 border-top:1px solid #e5e7eb;">
        <p style="margin:0; font-size:12px; color:#9ca3af;">
          © ${new Date().getFullYear()} Note App. All rights reserved.
        </p>
      </td>
    </tr>

  </table>
</div>
</body>
</html>`;
};
