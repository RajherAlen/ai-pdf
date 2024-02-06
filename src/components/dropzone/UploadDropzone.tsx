import Dropzone from 'react-dropzone';
import { CloudIcon, File } from 'lucide-react';
import { Progress } from '../ui/progress';
import { useState } from 'react';
import useSimulatedUploadProgress from '@/hooks/useSimulatedUploadProgress';
import { useUploadThing } from '@/lib/uploadthing';
import { useToast } from '../ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';

export const UploadDropzone = () => {
    const { uploadProgress, setUploadProgress, startSimulatedProgress } = useSimulatedUploadProgress();
    const { startUpload } = useUploadThing('pdfUploader');

    const router = useRouter();
    const { toast } = useToast();

    const [isUploading, setIsUploading] = useState<boolean>(false);

    const { mutate: startPolling } = trpc.getFile.useMutation({
        onSuccess: (file) => {
            router.push(`/dashboard/${file.id}`);
        },
        retry: true,
        retryDelay: 500,
    });

    const handleAcceptFile = async (acceptedFile: File[]) => {
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();

        const res = await startUpload(acceptedFile);

        if (!res) {
            return toast({
                title: 'Something went wrong',
                description: 'Please try again later',
                variant: 'destructive',
            });
        }

        const [fileResponse] = res;

        const key = fileResponse?.key;

        if (!key) {
            return toast({
                title: 'Something went wrong',
                description: 'Please try again later',
                variant: 'destructive',
            });
        }

        clearInterval(progressInterval);
        setUploadProgress(100);

        startPolling({ key });
    };

    return (
        <Dropzone multiple={false} onDrop={handleAcceptFile}>
            {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div {...getRootProps()} className="m-4 h-64 rounded-lg border border-dashed border-gray-300">
                    <div className="w-ful flex h-full items-center justify-center">
                        <label
                            htmlFor="dropzone-file"
                            className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100"
                        >
                            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                <CloudIcon className="mb-2 h-6 w-6 text-zinc-500" />
                                <p className="mb-2 text-sm text-zinc-700">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
                            </div>

                            {acceptedFiles && acceptedFiles[0] ? (
                                <div className="flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200">
                                    <div className="grid h-full place-items-center px-3 py-2">
                                        <File className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <div className="h-full truncate px-3 py-2 text-sm">{acceptedFiles[0].name}</div>
                                </div>
                            ) : null}

                            {isUploading ? (
                                <div className="mx-auto mt-4 w-full max-w-xs">
                                    <Progress value={uploadProgress} className="h-1 w-full bg-zinc-200" />
                                </div>
                            ) : null}

                            <input {...getInputProps()} type="file" id="dropzone-file" className="hidden" />
                        </label>
                    </div>
                </div>
            )}
        </Dropzone>
    );
};

export default UploadDropzone;
