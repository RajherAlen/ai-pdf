import { Loader2 } from 'lucide-react';
import React from 'react';

const BaseLoader = () => {
    return (
        <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
            <div className="mb-28 flex flex-1 flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <h3 className="text-xl font-semibold">Loading...</h3>
                    <p className="text-sm text-zinc-500">We&apos;re preparing your PDF.</p>
                </div>
            </div>
        </div>
    );
};

export default BaseLoader;
