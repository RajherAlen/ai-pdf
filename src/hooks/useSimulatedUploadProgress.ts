import { useState } from 'react';

const useSimulatedUploadProgress = () => {
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const startSimulatedProgress = () => {
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress((prevProgress) => {
                if (prevProgress >= 95) {
                    clearInterval(interval);
                    return prevProgress;
                }

                return prevProgress + 5;
            });
        }, 500);

        return interval;
    };

    return { uploadProgress, setUploadProgress, startSimulatedProgress };
};

export default useSimulatedUploadProgress;
