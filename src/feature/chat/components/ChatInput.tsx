import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import React from 'react';

interface ChatInputProps {
    isDisabled?: boolean;
}

const ChatInput = ({ isDisabled }: ChatInputProps) => {
    return (
        <div className="absolute bottom-0 left-0 w-full">
            <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
                <div className="relative flex h-full flex-1 items-stretch md:flex-col">
                    <div className="relative flex w-full flex-grow flex-col p-4">
                        <div className="relative">
                            <Textarea
                                rows={1}
                                maxRows={4}
                                autoFocus
                                placeholder="Enter your question..."
                                className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch resize-none py-3 pr-12 text-base"
                            />

                            <Button className="absolute bottom-1.5 right-[8px]" aria-label="send message">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
