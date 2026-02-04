import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limit: 5 requests per 10 minutes
const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, '10 m'),
})

export const config = {
    matcher: '/api/generate',
}

export default async function middleware(request: NextRequest) {
    // Only rate limit the generate endpoint
    if (request.nextUrl.pathname.startsWith('/api/generate')) {
        const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1'
        const { success, limit, reset, remaining } = await ratelimit.limit(ip)

        if (!success) {
            return new NextResponse(JSON.stringify({ error: 'Too Many Requests', retryAfter: reset }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': remaining.toString(),
                    'X-RateLimit-Reset': reset.toString(),
                },
            })
        }
    }

    return NextResponse.next()
}
