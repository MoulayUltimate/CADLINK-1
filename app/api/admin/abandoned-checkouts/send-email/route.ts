import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const RESEND_API_KEY = process.env.RESEND_API_KEY

export async function POST(req: NextRequest) {
    try {
        const { email, checkoutId, items, recoveryUrl } = await req.json()

        if (!email || !checkoutId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Create HTML content
        const itemsList = items.map((item: any) => `
            <div style="background: #111111; border: 1px solid #222222; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
                <img src="https://cadlink.store${item.image}" alt="${item.name}" style="width: 64px; height: 64px; object-fit: contain; border-radius: 8px; background: #ffffff;" />
                <div>
                    <h3 style="margin: 0 0 4px 0; font-size: 15px; color: #ffffff; font-weight: 600;">${item.name}</h3>
                    <p style="margin: 0; color: #0168A0; font-weight: bold;">$${item.price}</p>
                </div>
            </div>
        `).join('')

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { background-color: #000000; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; }
                    .wrapper { background-color: #000000; padding: 40px 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: #050505; border: 1px solid #222; border-radius: 24px; overflow: hidden; box-shadow: 0 0 40px rgba(1, 104, 160, 0.15); }
                    .header { background: #0a0a0a; padding: 40px 0; text-align: center; border-bottom: 1px solid #1a1a1a; }
                    .logo { height: 32px; object-fit: contain; }
                    .content { padding: 40px 30px; text-align: center; }
                    .h1 { font-size: 28px; font-weight: 800; margin: 0 0 16px 0; color: #ffffff; letter-spacing: -0.5px; }
                    .p { color: #888888; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0; }
                    .accent { color: #0168A0; }
                    .code-block { background: rgba(1, 104, 160, 0.1); border: 1px dashed #0168A0; color: #0168A0; padding: 16px 24px; border-radius: 12px; display: inline-block; margin: 0 0 32px 0; }
                    .code-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; display: block; opacity: 0.8; }
                    .code-value { font-family: monospace; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
                    .cta-button { display: inline-block; background: #0168A0; color: #ffffff; padding: 18px 36px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px; transition: all 0.2s; box-shadow: 0 4px 20px rgba(1, 104, 160, 0.4); }
                    .footer { padding: 30px; text-align: center; color: #444444; font-size: 12px; border-top: 1px solid #1a1a1a; background: #0a0a0a; }
                    .footer a { color: #666666; text-decoration: none; margin: 0 8px; }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <div class="container">
                        <div class="header">
                            <img src="https://cadlink.store/images/cropped-ixtzd985wxrrucij9vkr.avif" alt="CADLINK" class="logo" />
                        </div>
                        
                        <div class="content">
                            <h1 class="h1">Transaction <span class="accent">Incomplete</span></h1>
                            <p class="p">Your session was interrupted, but your cart has been secured. Resume your transaction now to ensure product availability.</p>
                            
                            <div style="text-align: left; margin-bottom: 32px;">
                                ${itemsList}
                            </div>

                            <div class="code-block">
                                <span class="code-label">Exclusive Discount Code</span>
                                <span class="code-value">CAD10</span>
                            </div>

                            <div>
                                <a href="${recoveryUrl || 'https://cadlink.store/checkout'}" class="cta-button">Resume Transaction</a>
                            </div>
                        </div>

                        <div class="footer">
                            <p style="margin-bottom: 16px;">© 2024 CADLINK Store. All systems operational.</p>
                            <div>
                                <a href="https://cadlink.store/contact">Support</a> •
                                <a href="https://cadlink.store/privacy-policy">Privacy</a> •
                                <a href="https://cadlink.store/terms-of-service">Terms</a>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `

        // Send email via Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'CADLINK <hello@cadlink.store>',
                to: [email],
                subject: 'You left something behind 👀 (10% OFF inside)',
                html: htmlContent
            })
        })

        if (!res.ok) {
            const error = await res.json()
            console.error('Resend API Error:', error)
            throw new Error(error.message || 'Failed to send email')
        }

        const data = await res.json()

        // Update checkout status in KV if possible (will need to call the main abandoned checkouts API or do it here)
        // For now, we'll just return success and let the frontend update the UI

        return NextResponse.json({ success: true, id: data.id })

    } catch (error: any) {
        console.error('Failed to send recovery email:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
