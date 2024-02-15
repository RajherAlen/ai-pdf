'use client';

import React from 'react';
import Messages from './Messages';
import ChatInput from './ChatInput';
import { trpc } from '@/app/_trpc/client';
import ProcessingLoader from './loaders/ProcessingLoader';
import BaseLoader from './loaders/BaseLoader';
import FailedLoader from './loaders/FailedLoader';
import { UploadStatus } from '@prisma/client';

interface ChatWrapperProps {
    fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
    const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
        {
            fileId,
        },
        {
            refetchInterval: (data) => {
                return data?.status === 'SUCCESS' || data?.status === 'FAILED' ? false : 500;
            },
        }
    );

    if (isLoading) return <BaseLoader />;

    if (data?.status === 'PROCESSING') return <ProcessingLoader />;

    if (data?.status === 'FAILED') return <FailedLoader />;

    return (
        <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
            <div className="mb-28 flex flex-1 flex-col justify-between">
                <Messages />
            </div>

            <ChatInput />
        </div>
    );
};

export default ChatWrapper;
