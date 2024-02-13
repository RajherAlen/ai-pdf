import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft, XCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const FailedLoader = () => {
    return (
        <div className="relative flex min-h-full flex-col justify-between gap-2 divide-y divide-zinc-200 bg-zinc-50">
            <div className="mb-28 flex flex-1 flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <XCircle className="h-8 w-8 text-red-500" />
                    <h3 className="text-xl font-semibold">Too many pages in PDF</h3>
                    <p className="text-sm text-zinc-500"></p>
                    <Link
                        href="/dashboard"
                        className={buttonVariants({
                            variant: 'secondary',
                            className: 'mt-4',
                        })}
                    >
                        <ChevronLeft className="mr-1.5 h-3 w-3" />
                        Back
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FailedLoader;
