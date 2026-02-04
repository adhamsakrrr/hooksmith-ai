import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { topic, platform } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const platformPrompts: Record<string, string> = {
            twitter: "short, punchy, controversial, curiosity-inducing threads (under 280 chars)",
            linkedin: "professional, storytelling, value-driven, 'broetry' style",
            tiktok: "visual descriptions, caption hooks, 'stop scrolling' commands",
            generic: "attention-grabbing headlines",
        };

        const style = platformPrompts[platform as string] || platformPrompts.generic;

        const systemPrompt = `You are a viral content expert. 
    Your goal is to generate 10 highly engaging hooks about the given topic.
    Style: ${style}.
    
    Rules:
    1. Output strictly a JSON array of strings. 
    2. No preamble or conversational filler.
    3. Make them punchy.
    4. Use psychological triggers (fear of missing out, contrarian views, strong statements).
    
    Topic: ${topic}`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Generate hooks for: ${topic}` }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.8,
            max_tokens: 1024,
            stream: true,
        });

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content || '';
                    controller.enqueue(encoder.encode(content));
                }
                controller.close();
            },
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
            },
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to generate hooks' }, { status: 500 });
    }
}
