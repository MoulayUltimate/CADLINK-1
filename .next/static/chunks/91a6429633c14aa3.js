(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,13637,e=>{"use strict";let t=(0,e.i(10965).default)("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);e.s(["Download",()=>t],13637)},95751,e=>{"use strict";let t=(0,e.i(10965).default)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);e.s(["ArrowRight",()=>t],95751)},79205,e=>{"use strict";var t=e.i(1972),i=e.i(75305);let o=(0,e.i(10965).default)("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);var r=e.i(95751),s=e.i(13637),n=e.i(41434),a=e.i(30499);function l(){(0,a.useRouter)();let{clearCart:e}=(0,n.useCart)(),l=(0,a.useSearchParams)().get("payment_intent"),d=(0,i.useRef)(!1);return(0,i.useEffect)(()=>{if(l){let t=`order_recorded_${l}`;if(sessionStorage.getItem(t)||d.current)return;d.current=!0;let i=localStorage.getItem("checkout_email")||"unknown@example.com";fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i,name:localStorage.getItem("checkout_name")||"Valued Customer",amount:75.19,paymentIntent:l,currency:"USD"})}).then(()=>{sessionStorage.setItem(t,"true")}).catch(e=>{console.error("Failed to record order",e),d.current=!1}),e()}},[l,e]),(0,t.jsx)("div",{className:"min-h-screen bg-[#0f172a] flex items-center justify-center p-4",children:(0,t.jsxs)("div",{className:"max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-500 relative z-10",children:[(0,t.jsx)("div",{className:"w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6",children:(0,t.jsx)(o,{className:"w-10 h-10 text-green-400"})}),(0,t.jsx)("h1",{className:"text-3xl font-black text-white mb-2",children:"Payment Successful!"}),(0,t.jsx)("p",{className:"text-gray-400 mb-8",children:"Thank you for your purchase. A confirmation email has been sent to you."}),(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("button",{onClick:()=>{let e=localStorage.getItem("checkout_name")||"Valued Customer",t=localStorage.getItem("checkout_email")||"N/A",i=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),o=l?`ORD-${l.substring(3,11).toUpperCase()}`:"ORD-PENDING",r=`
            <html>
            <head>
                <title>Invoice - ${o}</title>
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
                        <div style="font-weight: bold;">${e}</div>
                        <div>${t}</div>
                    </div>
                    <div>
                        <div class="section-title">Order Details</div>
                        <div><strong>Order ID:</strong> ${o}</div>
                        <div><strong>Date:</strong> ${i}</div>
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
        `,s=window.open("","_blank");s&&(s.document.write(r),s.document.close())},className:"w-full bg-[#0168A0] hover:bg-[#015580] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2",children:[(0,t.jsx)(s.Download,{className:"w-4 h-4"}),"Download Invoice"]}),(0,t.jsxs)("button",{onClick:()=>window.location.href="/",className:"w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 relative z-50 cursor-pointer",children:["Return to Store",(0,t.jsx)(r.ArrowRight,{className:"w-4 h-4"})]})]})]})})}function d(){return(0,t.jsx)(i.Suspense,{fallback:(0,t.jsx)("div",{className:"min-h-screen bg-[#0f172a]"}),children:(0,t.jsx)(l,{})})}e.s(["default",()=>d],79205)}]);