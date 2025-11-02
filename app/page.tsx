'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import { Action, Actions } from '@/components/ai-elements/actions';
import { Fragment, useState } from 'react';
import { CopyIcon, GlobeIcon, RefreshCcwIcon } from 'lucide-react';
import { Loader } from '@/components/ai-elements/loader';
import { Response } from '@/components/ai-elements/response';

interface MessageType {
  id: string;
  role: 'user' | 'assistant';
  parts: { type: 'text'; text: string }[];
}

const ChatBotLocal = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text && !message.files?.length) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      parts: [{ type: 'text', text: message.text || 'Sent with attachments' }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', { // match the API route you just created
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await res.json();

      const assistantMessage: MessageType = {
        id: Date.now().toString(),
        role: 'assistant',
        parts: [{ type: 'text', text: data.parts[0].text }],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const regenerate = () => {
    if (!messages.length) return;
    const lastUserMessage = messages.filter((m) => m.role === 'user').at(-1);
    if (!lastUserMessage) return;
    handleSubmit({ text: lastUserMessage.parts[0].text });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative h-screen flex flex-col">
      <Conversation className="h-full">
        <ConversationContent>
          {messages.map((message) => (
            <div key={message.id}>
              {message.parts.map((part, i) => (
                <Fragment key={`${message.id}-${i}`}>
                  <Message from={message.role}>
                    <MessageContent>
                      <Response>{part.text}</Response>
                    </MessageContent>
                  </Message>
                  {message.role === 'assistant' && i === message.parts.length - 1 && (
                    <Actions className="mt-2">
                      <Action onClick={regenerate} label="Retry">
                        <RefreshCcwIcon className="size-3" />
                      </Action>
                      <Action
                        onClick={() => navigator.clipboard.writeText(part.text)}
                        label="Copy"
                      >
                        <CopyIcon className="size-3" />
                      </Action>
                    </Actions>
                  )}
                </Fragment>
              ))}
            </div>
          ))}
          {loading && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInput onSubmit={handleSubmit} className="mt-4" globalDrop multiple>
        <PromptInputHeader>
          <PromptInputAttachments>
            {(attachment) => <PromptInputAttachment data={attachment} />}
          </PromptInputAttachments>
        </PromptInputHeader>
        <PromptInputBody>
          <PromptInputTextarea value={input} onChange={(e) => setInput(e.target.value)} />
        </PromptInputBody>
        <PromptInputFooter className="relative">
          <PromptInputSubmit
            className="absolute bottom-2 right-2"
            disabled={!input && !loading}
            status={loading ? 'submitted' : 'idle'}
          />
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
};

export default ChatBotLocal;
