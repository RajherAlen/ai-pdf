import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { OpenAIEmbeddings } from '@langchain/openai';

import { qdrantClient } from '@/lib/qdrantClient';

const f = createUploadthing();

export const ourFileRouter = {
    pdfUploader: f({ pdf: { maxFileSize: '32MB' } })
        .middleware(async () => {
            const { getUser } = getKindeServerSession();
            const user = getUser();

            if (!user || !user.id) throw new Error('Unauthorized');

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const createdFile = await db.file.create({
                data: {
                    key: file.key,
                    name: file.name,
                    userId: metadata.userId,
                    url: file.url,
                    uploadStatus: 'PROCESSING',
                },
            });

            try {
                const response = await fetch(file.url);
                const blob = await response.blob();
                const loader = new PDFLoader(blob);
                const pageLevelDocs = await loader.load();
                const pagesAmt = pageLevelDocs.length;

                ///////////////////////////////////////////////////////////////////////////////////////////////////// vectorize and index entire document

                const embeddings = new OpenAIEmbeddings({
                    openAIApiKey: process.env.OPENAI_API_KEY,
                });
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                const vectorStore = await QdrantVectorStore.fromTexts(
                    [pageLevelDocs[0].pageContent],
                    [{ id: 2 }, { id: 1 }, { id: 3 }, { id: 4 }, { id: 5 }],
                    new OpenAIEmbeddings(),
                    {
                        client: qdrantClient,
                        apiKey: process.env.QDRANT_API_KEY,
                        url: process.env.QDRANT_URL,
                        collectionName: 'test_collection',
                    }
                );

                console.log(vectorStore)
                // const similarSearch = await vectorStore.similaritySearch('Where philosophy begins?', 1);
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                await db.file.update({
                    data: {
                        uploadStatus: 'SUCCESS',
                    },
                    where: {
                        id: createdFile.id,
                    },
                });
            } catch (err) {
                await db.file.update({
                    data: {
                        uploadStatus: 'FAILED',
                    },
                    where: {
                        id: createdFile.id,
                    },
                });
            }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
