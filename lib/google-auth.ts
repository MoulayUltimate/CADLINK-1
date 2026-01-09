
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function base64UrlEncode(text: string): string {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    return arrayBufferToBase64Url(data.buffer as ArrayBuffer);
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
    // Remove headers and newlines
    const b64 = pem
        .replace(/-----[^-]+-----/g, '')
        .replace(/\s+/g, '');

    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

export async function getGoogleAccessToken(
    clientEmail: string,
    privateKey: string,
    scopes: string[] = ['https://www.googleapis.com/auth/analytics.readonly']
): Promise<string> {
    try {
        // 1. Import Private Key
        const binaryKey = pemToArrayBuffer(privateKey);
        const key = await crypto.subtle.importKey(
            'pkcs8',
            binaryKey,
            {
                name: 'RSASSA-PKCS1-v1_5',
                hash: 'SHA-256',
            },
            false,
            ['sign']
        );

        // 2. Create JWT Header and Payload
        const header = {
            alg: 'RS256',
            typ: 'JWT'
        };

        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iss: clientEmail,
            scope: scopes.join(' '),
            aud: GOOGLE_TOKEN_URL,
            exp: now + 3600,
            iat: now
        };

        const encodedHeader = base64UrlEncode(JSON.stringify(header));
        const encodedPayload = base64UrlEncode(JSON.stringify(payload));
        const unsignedToken = `${encodedHeader}.${encodedPayload}`;

        // 3. Sign the Token
        const signature = await crypto.subtle.sign(
            'RSASSA-PKCS1-v1_5',
            key,
            new TextEncoder().encode(unsignedToken)
        );

        const encodedSignature = arrayBufferToBase64Url(signature);
        const jwt = `${unsignedToken}.${encodedSignature}`;

        // 4. Exchange JWT for Access Token
        const response = await fetch(GOOGLE_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                assertion: jwt
            })
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error_description || data.error);
        }
        return data.access_token;
    } catch (error) {
        console.error('Failed to get Google Access Token:', error);
        throw error;
    }
}
