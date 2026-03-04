module.exports=[69617,a=>{"use strict";let b=(0,a.i(61237).default)("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);a.s(["Download",()=>b],69617)},6966,a=>{"use strict";let b=(0,a.i(61237).default)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);a.s(["ArrowRight",()=>b],6966)},60120,a=>{"use strict";var b=a.i(46447),c=a.i(30564);let d=(0,a.i(61237).default)("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);var e=a.i(6966),f=a.i(69617),g=a.i(71214),h=a.i(1470);function i(){(0,h.useRouter)();let{clearCart:a}=(0,g.useCart)(),i=(0,h.useSearchParams)().get("payment_intent"),j=(0,c.useRef)(!1);return(0,c.useEffect)(()=>{if(i){let b=`order_recorded_${i}`;if(sessionStorage.getItem(b)||j.current)return;j.current=!0;let c=localStorage.getItem("checkout_email")||"unknown@example.com";fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:c,name:localStorage.getItem("checkout_name")||"Valued Customer",amount:75.19,paymentIntent:i,currency:"USD"})}).then(()=>{sessionStorage.setItem(b,"true")}).catch(a=>{console.error("Failed to record order",a),j.current=!1}),a()}},[i,a]),(0,b.jsx)("div",{className:"min-h-screen bg-[#0f172a] flex items-center justify-center p-4",children:(0,b.jsxs)("div",{className:"max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-500 relative z-10",children:[(0,b.jsx)("div",{className:"w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6",children:(0,b.jsx)(d,{className:"w-10 h-10 text-green-400"})}),(0,b.jsx)("h1",{className:"text-3xl font-black text-white mb-2",children:"Payment Successful!"}),(0,b.jsx)("p",{className:"text-gray-400 mb-8",children:"Thank you for your purchase. A confirmation email has been sent to you."}),(0,b.jsxs)("div",{className:"space-y-3",children:[(0,b.jsxs)("button",{onClick:()=>{let a=localStorage.getItem("checkout_name")||"Valued Customer",b=localStorage.getItem("checkout_email")||"N/A",c=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),d=i?`ORD-${i.substring(3,11).toUpperCase()}`:"ORD-PENDING",e=`
            <html>
            <head>
                <title>Invoice - ${d}</title>
                <style>
                    body { font-family: sans-serif; padding: 40px; color: #333; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 40px; }
                    .store-name { font-size: 24px; font-weight: 900; color: #0168A0; }
                    .invoice-title { font-size: 32px; font-weight: 900; }
                    .details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                    .section-title { font-size: 12px; font-weight: 900; text-transform: uppercase; color: #999; margin-bottom: 10px; }
                    table { w-full; border-collapse: collapse; width: 100%; }
                    th { text-align: left; border-bottom: 1px solid #eee; padding: 10px 0; font-size: 12px; text-transform: uppercase; color: #999; }
                    td { padding: 20px 0; border-bottom: 1px solid #eee; }
                    .total-row { font-weight: 900; font-size: 18px; }
                    .footer { margin-top: 60px; font-size: 12px; color: #999; text-align: center; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="store-name">CADLINK</div>
                        <div>Professional Sign Making Software</div>
                    </div>
                    <div class="invoice-title">INVOICE</div>
                </div>
                
                <div class="details">
                    <div>
                        <div class="section-title">Billed To</div>
                        <div style="font-weight: bold;">${a}</div>
                        <div>${b}</div>
                    </div>
                    <div>
                        <div class="section-title">Order Details</div>
                        <div><strong>Order ID:</strong> ${d}</div>
                        <div><strong>Date:</strong> ${c}</div>
                        <div><strong>Status:</strong> Paid</div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style="text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div style="font-weight: bold;">CADLINK V11 Professional</div>
                                <div style="font-size: 12px; color: #666;">Lifetime License - Instant Digital Delivery</div>
                            </td>
                            <td style="text-align: right; font-weight: bold;">$75.19</td>
                        </tr>
                        <tr class="total-row">
                            <td style="text-align: right;">Total Paid</td>
                            <td style="text-align: right;">$75.19</td>
                        </tr>
                    </tbody>
                </table>

                <div class="footer">
                    <p>Thank you for your business! If you have any questions, please contact support.</p>
                    <p>&copy; ${new Date().getFullYear()} CADLINK. All rights reserved.</p>
                </div>

                <script>
                    window.onload = () => {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `,f=window.open("","_blank");f&&(f.document.write(e),f.document.close())},className:"w-full bg-[#0168A0] hover:bg-[#015580] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2",children:[(0,b.jsx)(f.Download,{className:"w-4 h-4"}),"Download Invoice"]}),(0,b.jsxs)("button",{onClick:()=>window.location.href="/",className:"w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 relative z-50 cursor-pointer",children:["Return to Store",(0,b.jsx)(e.ArrowRight,{className:"w-4 h-4"})]})]})]})})}function j(){return(0,b.jsx)(c.Suspense,{fallback:(0,b.jsx)("div",{className:"min-h-screen bg-[#0f172a]"}),children:(0,b.jsx)(i,{})})}a.s(["default",()=>j],60120)}];

//# sourceMappingURL=_7fb9aeab._.js.map