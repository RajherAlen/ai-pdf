export type UploadStatus = 'PENDING' | 'PROCESSING' | 'FAILED' | 'SUCCESS';

export interface FileCardProps {
    userId: string | null;
    id: string;
    name: string;
    uploadStatus: UploadStatus;
    url: string;
    key: string;
    createdAt: string;
    updatedAt: string;
}