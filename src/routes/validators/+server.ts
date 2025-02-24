import { env } from '$env/dynamic/public';

export async function GET() {
	return new Response(null, {
		status: 302,
		headers: {
			Location: `https://${env.PUBLIC_NODE_ENV !== 'development' ? `${env.PUBLIC_APP_NAME}.` : ''}${env.PUBLIC_BASE_URL}/validators`
		}
	});
}
