(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["chunks/275cd_next_dist_esm_build_templates_edge-app-route_329c2daa.js",39597,e=>{"use strict";let t;var n,r=e.i(65669),a=e.i(80820),i=e.i(48522),o=e.i(51615),l=e.i(55371),s=e.i(15629),c=e.i(20575),d=e.i(64995),u=e.i(16441),p=e.i(1522),f=e.i(55475),m=e.i(50710),h=e.i(95418),g=e.i(95574),x=e.i(44525),b=e.i(3891),v=e.i(42336),y=e.i(4865),R=e.i(8592);e.i(66992);var w=e.i(95944);e.i(6157);var k=e.i(21159),C=e.i(49416);let A=process.env.RESEND_API_KEY;async function E(e){let t=await (0,C.verifyAdmin)(e);if(t)return t;try{let{email:t,checkoutId:n,createdAt:r,items:a,recoveryUrl:i}=await e.json();if(!t||!n)return k.NextResponse.json({error:"Missing required fields"},{status:400});let o=a.map(e=>`
            <tr>
                <td style="padding: 0 0 16px 0; border-bottom: 1px solid #333333;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                            <td width="80" valign="top">
                                <img src="https://cadlink.store${e.image}" alt="${e.name}" width="64" height="64" style="width: 64px; height: 64px; object-fit: contain; border-radius: 8px; background-color: #ffffff; display: block;" />
                            </td>
                            <td valign="middle" style="padding-left: 16px;">
                                <h3 style="margin: 0 0 4px 0; font-size: 16px; color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 600;">${e.name}</h3>
                                <p style="margin: 0; color: #0168A0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: 700;">$${e.price}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr><td height="16" style="font-size: 0; line-height: 0;">&nbsp;</td></tr>
        `).join(""),l=`
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
                                    ${o}

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
                                            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${i||"https://cadlink.store/checkout"}" style="height:54px;v-text-anchor:middle;width:220px;" arcsize="15%" stroke="f" fillcolor="#0168A0">
                                            <w:anchorlock/>
                                            <center>
                                            <![endif]-->
                                                <a href="${i||"https://cadlink.store/checkout"}" class="button" style="background-color: #0168A0; color: #ffffff; display: inline-block; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">Resume Transaction</a>
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
                                <p style="margin: 0 0 10px 0;">\xa9 2024 CADLINK Store. All rights reserved.</p>
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
        `;console.log("Sending email with key present:",!!A);let s=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${A}`,"Content-Type":"application/json"},body:JSON.stringify({from:"CADLINK <support@cadlink.store>",to:[t],subject:"You left something behind 👀 (10% OFF inside)",html:l})});if(!s.ok){let e=await s.json();return console.error("Resend API Error:",e),k.NextResponse.json({error:e.message||"Resend API rejected the request",details:e},{status:s.status})}let c=await s.json();if(r)try{let e=process.env.KV;if(e){let t=`abandoned:${r}:${n}`,a=await e.get(t);if(a){let n={...JSON.parse(a),status:"Email Sent",emailSentAt:Date.now()};await e.put(t,JSON.stringify(n))}}}catch(e){console.error("Failed to update KV status:",e)}return k.NextResponse.json({success:!0,id:c.id})}catch(e){return console.error("Failed to send recovery email:",e),k.NextResponse.json({error:e.message||"Internal Server Error"},{status:500})}}e.s(["POST",()=>E,"runtime",0,"edge"],73933);var S=e.i(73933);let T=new l.AppRouteRouteModule({definition:{kind:s.RouteKind.APP_ROUTE,page:"/api/admin/abandoned-checkouts/send-email/route",pathname:"/api/admin/abandoned-checkouts/send-email",filename:"route",bundlePath:""},distDir:process.env.__NEXT_RELATIVE_DIST_DIR||"",relativeProjectDir:process.env.__NEXT_RELATIVE_PROJECT_DIR||"",resolvedPagePath:"[project]/app/api/admin/abandoned-checkouts/send-email/route.ts",nextConfigOutput:"",userland:S}),{workAsyncStorage:P,workUnitAsyncStorage:N,serverHooks:I}=T;function _(){return(0,c.patchFetch)({workAsyncStorage:P,workUnitAsyncStorage:N})}async function D(e,t,n){T.isDev&&(0,d.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let i="/api/admin/abandoned-checkouts/send-email/route";i=i.replace(/\/index$/,"")||"/";let l=await T.prepare(e,t,{srcPage:i,multiZoneDraftMode:!1});if(!l)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:c,params:k,nextConfig:C,parsedUrl:A,isDraftMode:E,prerenderManifest:S,routerServerContext:P,isOnDemandRevalidate:N,revalidateOnlyGenerated:I,resolvedPathname:_,clientReferenceManifest:D,serverActionsManifest:M}=l,F=(0,p.normalizeAppPath)(i),O=!!(S.dynamicRoutes[F]||S.routes[_]),H=async()=>((null==P?void 0:P.render404)?await P.render404(e,t,A,!1):t.end("This page could not be found"),null);if(O&&!E){let e=!!S.routes[_],t=S.dynamicRoutes[F];if(t&&!1===t.fallback&&!e){if(C.experimental.adapterPath)return await H();throw new R.NoFallbackError}}let q=null;!O||T.isDev||E||(q="/index"===(q=_)?"/":q);let j=!0===T.isDev||!O,U=O&&!j;M&&D&&(0,a.setReferenceManifestsSingleton)({page:i,clientReferenceManifest:D,serverActionsManifest:M,serverModuleMap:(0,r.createServerModuleMap)({serverActionsManifest:M})});let z=e.method||"GET",B=(0,u.getTracer)(),K=B.getActiveScopeSpan(),$={params:k,prerenderManifest:S,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:j,incrementalCache:(0,d.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:C.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,n,r)=>T.onRequestError(e,t,r,P)},sharedContext:{buildId:c}},L=new f.NodeNextRequest(e),V=new f.NodeNextResponse(t),W=m.NextRequestAdapter.fromNodeNextRequest(L,(0,m.signalFromNodeResponse)(t));try{let r=async e=>T.handle(W,$).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let n=B.getRootSpanAttributes();if(!n)return;if(n.get("next.span_type")!==h.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${n.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=n.get("next.route");if(r){let t=`${z} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t)}else e.updateName(`${z} ${i}`)}),a=!!(0,d.getRequestMeta)(e,"minimalMode"),l=async l=>{var c,d;let u=async({previousCacheEntry:s})=>{try{if(!a&&N&&I&&!s)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await r(l);e.fetchMetrics=$.renderOpts.fetchMetrics;let c=$.renderOpts.pendingWaitUntil;c&&n.waitUntil&&(n.waitUntil(c),c=void 0);let d=$.renderOpts.collectedTags;if(!O)return await (0,x.sendResponse)(L,V,i,$.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,b.toNodeOutgoingHttpHeaders)(i.headers);d&&(t[y.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let n=void 0!==$.renderOpts.collectedRevalidate&&!($.renderOpts.collectedRevalidate>=y.INFINITE_CACHE)&&$.renderOpts.collectedRevalidate,r=void 0===$.renderOpts.collectedExpire||$.renderOpts.collectedExpire>=y.INFINITE_CACHE?void 0:$.renderOpts.collectedExpire;return{value:{kind:w.CachedRouteKind.APP_ROUTE,status:i.status,body:o.Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:n,expire:r}}}}catch(t){throw(null==s?void 0:s.isStale)&&await T.onRequestError(e,t,{routerKind:"App Router",routePath:i,routeType:"route",revalidateReason:(0,g.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:N})},P),t}},p=await T.handleResponse({req:e,nextConfig:C,cacheKey:q,routeKind:s.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:S,isRoutePPREnabled:!1,isOnDemandRevalidate:N,revalidateOnlyGenerated:I,responseGenerator:u,waitUntil:n.waitUntil,isMinimalMode:a});if(!O)return null;if((null==p||null==(c=p.value)?void 0:c.kind)!==w.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(d=p.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});a||t.setHeader("x-nextjs-cache",N?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),E&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let f=(0,b.fromNodeOutgoingHttpHeaders)(p.value.headers);return a&&O||f.delete(y.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||f.get("Cache-Control")||f.set("Cache-Control",(0,v.getCacheControlHeader)(p.cacheControl)),await (0,x.sendResponse)(L,V,new Response(p.value.body,{headers:f,status:p.value.status||200})),null};K?await l(K):await B.withPropagatedContext(e.headers,()=>B.trace(h.BaseServerSpan.handleRequest,{spanName:`${z} ${i}`,kind:u.SpanKind.SERVER,attributes:{"http.method":z,"http.target":e.url}},l))}catch(t){if(t instanceof R.NoFallbackError||await T.onRequestError(e,t,{routerKind:"App Router",routePath:F,routeType:"route",revalidateReason:(0,g.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:N})}),O)throw t;return await (0,x.sendResponse)(L,V,new Response(null,{status:500})),null}}e.s(["handler",()=>D,"patchFetch",()=>_,"routeModule",()=>T,"serverHooks",()=>I,"workAsyncStorage",()=>P,"workUnitAsyncStorage",()=>N],49539);var M=e.i(49539);let F=null==(n=self.__RSC_MANIFEST)?void 0:n["/api/admin/abandoned-checkouts/send-email/route"],O=(t=self.__RSC_SERVER_MANIFEST)?JSON.parse(t):void 0;F&&O&&(0,a.setReferenceManifestsSingleton)({page:"/api/admin/abandoned-checkouts/send-email/route",clientReferenceManifest:F,serverActionsManifest:O,serverModuleMap:(0,r.createServerModuleMap)({serverActionsManifest:O})});let H=i.EdgeRouteModuleWrapper.wrap(M.routeModule,{nextConfig:{configFile:"/Users/mac/Documents/antigravity/CADLINK/next.config.mjs",configFileName:"next.config.mjs",cacheMaxMemorySize:0x3200000,cacheHandler:null,cacheHandlers:{},env:{},experimental:{allowedRevalidateHeaderKeys:null,clientRouterFilter:!0,clientRouterFilterAllowedRate:null,clientRouterFilterRedirects:!1,fetchCacheKeyPrefix:"",isrFlushToDisk:!0,mdxRs:null,strictNextHead:null,swcPlugins:null,externalMiddlewareRewritesResolve:null,scrollRestoration:!1,manualClientBasePath:!1,optimisticClientCache:!0,middlewarePrefetch:null,optimizeCss:!1,nextScriptWorkers:!1,webVitalsAttribution:null,serverActions:null,sri:null,cacheComponents:null,useCache:!1,rootParams:null,adjustFontFallbacks:null,adjustFontFallbacksWithSizeAdjust:null,after:null,appDocumentPreloading:null,cacheLife:null,caseSensitiveRoutes:!1,cpus:13,craCompat:!1,disableOptimizedLoading:!1,disablePostcssPresetEnv:null,esmExternals:!0,extensionAlias:null,externalDir:!1,fallbackNodePolyfills:null,forceSwcTransforms:!1,fullySpecified:!1,gzipSize:!0,inlineCss:!1,instrumentationHook:null,clientTraceMetadata:null,largePageDataBytes:128e3,logging:null,memoryBasedWorkersCount:!1,optimizeServerReact:!0,optimizePackageImports:["lucide-react","date-fns","lodash-es","ramda","antd","react-bootstrap","ahooks","@ant-design/icons","@headlessui/react","@headlessui-float/react","@heroicons/react/20/solid","@heroicons/react/24/solid","@heroicons/react/24/outline","@visx/visx","@tremor/react","rxjs","@mui/material","@mui/icons-material","recharts","react-use","effect","@effect/schema","@effect/platform","@effect/platform-node","@effect/platform-browser","@effect/platform-bun","@effect/sql","@effect/sql-mssql","@effect/sql-mysql2","@effect/sql-pg","@effect/sql-sqlite-node","@effect/sql-sqlite-bun","@effect/sql-sqlite-wasm","@effect/sql-sqlite-react-native","@effect/rpc","@effect/rpc-http","@effect/typeclass","@effect/experimental","@effect/opentelemetry","@material-ui/core","@material-ui/icons","@tabler/icons-react","mui-core","react-icons/ai","react-icons/bi","react-icons/bs","react-icons/cg","react-icons/ci","react-icons/di","react-icons/fa","react-icons/fa6","react-icons/fc","react-icons/fi","react-icons/gi","react-icons/go","react-icons/gr","react-icons/hi","react-icons/hi2","react-icons/im","react-icons/io","react-icons/io5","react-icons/lia","react-icons/lib","react-icons/lu","react-icons/md","react-icons/pi","react-icons/ri","react-icons/rx","react-icons/si","react-icons/sl","react-icons/tb","react-icons/tfi","react-icons/ti","react-icons/vsc","react-icons/wi"],taint:null,proxyTimeout:null,serverMinification:!0,serverSourceMaps:!1,swcTraceProfiling:!1,trustHostHeader:null,urlImports:null,webpackBuildWorker:null,workerThreads:!1,turbopackMinify:null,turbopackModuleIds:null,turbopackPersistentCaching:null,turbopackSourceMaps:null,turbopackTreeShaking:null,turbopackScopeHoisting:null,turbopackImportTypeBytes:null,turbopackUseSystemTlsCerts:null,turbopackUseBuiltinSass:null,turbopackUseBuiltinBabel:null,globalNotFound:!1,turbopackRemoveUnusedExports:null,devtoolSegmentExplorer:null},images:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:null,domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",remotePatterns:[],unoptimized:!0},pageExtensions:["tsx","ts","jsx","js"],reactCompiler:null,reactProductionProfiling:!1,reactStrictMode:null,transpilePackages:null,modularizeImports:{"@mui/icons-material":{transform:"@mui/icons-material/{{member}}",preventFullImport:!1,skipDefaultConversion:!1},lodash:{transform:"lodash/{{member}}",preventFullImport:!1,skipDefaultConversion:!1}},distDir:".next",distDirRoot:".next",deploymentId:null,sassOptions:{},trailingSlash:!1,assetPrefix:"",basePath:"",skipProxyUrlNormalize:null,skipTrailingSlashRedirect:null,i18n:null,crossOrigin:null,devIndicators:{buildActivityPosition:null,position:"bottom-left"},output:null,turbopack:{loaders:null,rules:null,resolveAlias:null,resolveExtensions:null,debugIds:null},productionBrowserSourceMaps:!1,outputFileTracingIncludes:null,outputFileTracingExcludes:null,outputFileTracingRoot:"/Users/mac/Documents/antigravity/CADLINK",bundlePagesRouterDependencies:!1,serverExternalPackages:null,_originalRedirects:null,compiler:{reactRemoveProperties:null,relay:null,emotion:null,removeConsole:null,styledComponents:null},optimizeFonts:null,cleanDistDir:!0,compress:!0,eslint:{dirs:null,ignoreDuringBuilds:null},excludeDefaultMomentLocales:!0,exportPathMap:{},generateBuildId:null,generateEtags:!0,httpAgentOptions:{keepAlive:!0},onDemandEntries:{maxInactiveAge:6e4,pagesBufferLength:5},poweredByHeader:!0,publicRuntimeConfig:{},serverRuntimeConfig:{},staticPageGenerationTimeout:60,target:null,typescript:{ignoreBuildErrors:!0,tsconfigPath:null},useFileSystemPublicRoutes:!0,cacheComponents:!1,webpack:null}});e.s(["ComponentMod",0,M,"default",0,H],39597)}]);

//# sourceMappingURL=275cd_next_dist_esm_build_templates_edge-app-route_329c2daa.js.map