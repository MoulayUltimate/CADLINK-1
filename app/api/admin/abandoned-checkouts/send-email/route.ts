import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const RESEND_API_KEY = process.env.RESEND_API_KEY

export async function POST(req: NextRequest) {
    try {
        const { email, checkoutId, items, recoveryUrl } = await req.json()

        if (!email || !checkoutId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Create HTML content using table-based layout for better email client support
        const itemsList = items.map((item: any) => `
            <tr>
                <td style="padding: 0 0 16px 0; border-bottom: 1px solid #333333;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                            <td width="80" valign="top">
                                <img src="https://cadlink.store${item.image}" alt="${item.name}" width="64" height="64" style="width: 64px; height: 64px; object-fit: contain; border-radius: 8px; background-color: #ffffff; display: block;" />
                            </td>
                            <td valign="middle" style="padding-left: 16px;">
                                <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 600;">${item.name}</h3>
                                <p style="margin: 0; color: #0168A0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 700;">$${item.price}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr><td height="16" style="font-size: 0; line-height: 0;">&nbsp;</td></tr>
        `).join('')

        const htmlContent = `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>Complete your purchase</title>
                <style type="text/css">
                    body { margin: 0; padding: 0; min-width: 100%; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; }
                    a { color: #0168A0; text-decoration: none; }
                    .button { display: inline-block; background-color: #0168A0; color: #ffffff; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; mso-padding-alt: 0; text-underline-color: #0168A0; }
                    /* Mobile styles */
                    @media only screen and (max-width: 600px) {
                        .container { width: 100% !important; padding: 20px !important; }
                    }
                </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #000000;">
                <center style="width: 100%; table-layout: fixed; background-color: #000000; padding-bottom: 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #000000; margin: 0 auto; max-width: 600px;">
                        <!-- Header -->
                        <tr>
                            <td align="center" style="padding: 40px 0;">
                                <!-- Fallback to text if image fails or use a PNG if available. AVIF is not supported in Gmail -->
                                <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: 1px;">CADLINK<span style="color: #0168A0;">.STORE</span></h1>
                            </td>
                        </tr>

                        <!-- Main Content -->
                        <tr>
                            <td class="container" style="background-color: #111111; border-radius: 16px; padding: 40px; border: 1px solid #222222;">
                                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                    <tr>
                                        <td align="center" style="padding-bottom: 24px;">
                                            <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 800; color: #ffffff;">Transaction <span style="color: #0168A0;">Incomplete</span></h1>
                                            <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #888888;">Your cart has been reserved. Complete your order now.</p>
                                        </td>
                                    </tr>

                                    <!-- Items -->
                                    ${itemsList}

                                    <!-- Discount Code -->
                                    <tr>
                                        <td align="center" style="padding: 24px 0;">
                                            <div style="background-color: rgba(1, 104, 160, 0.1); border: 1px dashed #0168A0; border-radius: 8px; padding: 16px 24px; display: inline-block;">
                                                <p style="margin: 0 0 4px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #0168A0;">Exclusive Code</p>
                                                <p style="margin: 0; font-family: monospace; font-size: 24px; font-weight: bold; color: #ffffff;">CAD10</p>
                                            </div>
                                        </td>
                                    </tr>

                                    <!-- CTA Button -->
                                    <tr>
                                        <td align="center" style="padding-top: 16px;">
                                            <!--[if mso]>
                                            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${recoveryUrl || 'https://cadlink.store/checkout'}" style="height:54px;v-text-anchor:middle;width:220px;" arcsize="15%" stroke="f" fillcolor="#0168A0">
                                            <w:anchorlock/>
                                            <center>
                                            <![endif]-->
                                                <a href="${recoveryUrl || 'https://cadlink.store/checkout'}" class="button" style="background-color: #0168A0; color: #ffffff; display: inline-block; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">Resume Transaction</a>
                                            <!--[if mso]>
                                            </center>
                                            </v:roundrect>
                                            <![endif]-->
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td align="center" style="padding: 30px; color: #444444; font-size: 12px;">
                                <p style="margin: 0 0 10px 0;">© 2024 CADLINK Store. All rights reserved.</p>
                                <p style="margin: 0;">
                                    <a href="https://cadlink.store/contact" style="color: #666666; text-decoration: underline;">Support</a> &nbsp;•&nbsp;
                                    <a href="https://cadlink.store/privacy-policy" style="color: #666666; text-decoration: underline;">Privacy</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                </center>
            </body>
            </html>
        `

        // Send email via Resend
        const fromEmail = 'CADLINK <support@cadlink.store>'

        console.log('Sending email with key present:', !!RESEND_API_KEY)

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [email],
                subject: 'You left something behind 👀 (10% OFF inside)',
                html: htmlContent
            })
        })

        if (!res.ok) {
            const errorData = await res.json()
            console.error('Resend API Error:', errorData)
            return NextResponse.json({
                error: errorData.message || 'Resend API rejected the request',
                details: errorData
            }, { status: res.status })
        }

        const data = await res.json()
        return NextResponse.json({ success: true, id: data.id })

    } catch (error: any) {
        console.error('Failed to send recovery email:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
