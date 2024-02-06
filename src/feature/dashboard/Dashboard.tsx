'use client';

import { trpc } from '@/app/_trpc/client';
import UploadButton from '@/components/buttons/UploadButton';
import { Ghost } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import FileCard from './components/FileCard';

const Dashboard = () => {
    const { data: files, isLoading } = trpc.getUserFiles.useQuery();

    return (
        <main className="mx-auto max-w-7xl px-5 md:p-10">
            <div className="border-grey-200 mt-8 flex flex-col items-center justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="text-grey-900 mb-3 text-5xl font-bold">My Files</h1>

                <UploadButton />
            </div>

            {/* display all user files */}
            {files && files?.length > 0 ? (
                <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
                    {files
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((file) => {
                            return <FileCard file={file} key={file.id} />;
                        })}
                </ul>
            ) : isLoading ? (
                <Skeleton height={100} className="my-2" count={3} />
            ) : (
                <div className="mt-16 flex flex-col items-center gap-2">
                    <Ghost className="h-8 w-8 text-zinc-800" />
                    <h3 className="text-xl font-semibold">Pretty empty around here</h3>
                    <p>Let&apos;s upload your first PDF.</p>
                </div>
            )}
        </main>
    );
};

export default Dashboard;
