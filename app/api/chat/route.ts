import { NextResponse } from 'next/server';
import { env } from 'process';

export async function POST(req: Request) {
    try {
        // Parse the incoming request
        const { messages } = await req.json();

        // Basic validation
        if (!messages?.length) {
            return NextResponse.json({
                id: Date.now(),
                role: 'assistant',
                parts: [{ type: 'text', text: 'No messages provided.' }],
            });
        }

        // Convert to OpenAI-style chat messages
        // Ensure strict alternation: system (optional), user → assistant → user → ...
        const chatMessages: { role: string; content: string }[] = [];

        // Optional system message
        const systemMessage = { role: 'system', content: 'You are a helpful assistant.' };
        chatMessages.push(systemMessage);

        let lastRole: string | null = 'system';

        for (const m of messages) {
            const text = m.parts?.[0]?.text;
            if (!text) continue;

            // Skip consecutive messages from the same role (except system at start)
            if (lastRole && m.role === lastRole && m.role !== 'system') continue;

            chatMessages.push({ role: m.role, content: text });
            lastRole = m.role;
        }

        console.log('Forwarding messages to local LLM:', chatMessages);

        const res = await fetch(
            'http://localhost:12434/engines/llama.cpp/v1/chat/completions',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "ai/gemma3",
                    messages: chatMessages,
                    stream: false,
                }),
            }
        );

        // Safely parse the response
        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            console.error('Failed to parse JSON from LLM:', text);
            data = { choices: [{ message: { content: 'Error parsing LLM response' } }] };
        }

        const output = data.choices?.[0]?.message?.content;

        console.log('LLM response:', output);

        return NextResponse.json({
            id: Date.now(),
            role: 'assistant',
            parts: [{ type: 'text', text: output }],
        });
    } catch (err) {
        console.error('Error in /api/chat:', err);
        return NextResponse.json({
            id: Date.now(),
            role: 'assistant',
            parts: [{ type: 'text', text: 'Error generating response.' }],
        });
    }
}
