'use client';

import { toast } from '@/components/ui/use-toast';
import { ChevronDown, ChevronUp, Loader2, RotateCw, SearchIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { useResizeDetector } from 'react-resize-detector';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/cn';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import SimpleBar from 'simplebar-react';
import PdfFullscreen from './PdfFullScreen';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRenderProps {
    url: string;
}

const PdfRenderer = ({ url }: PdfRenderProps) => {
    const { width, ref } = useResizeDetector();

    const [numPages, setNumPages] = useState<number>();
    const [currPage, setCurrPage] = useState<number>(1);
    const [scale, setScale] = useState<number>(1);
    const [rotation, setRotation] = useState<number>(0);
    const [renderedScale, setRenderedScale] = useState<number | null>(null);

    const isLoading = renderedScale !== scale;

    const CustomPageValidator = z.object({
        page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!),
    });

    type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<TCustomPageValidator>({
        defaultValues: {
            page: '1',
        },
        resolver: zodResolver(CustomPageValidator),
    });

    const handlePageSubmit = ({ page }: TCustomPageValidator) => {
        setCurrPage(Number(page));
        setValue('page', String(page));
    };

    const handlePrevPage = () => {
        setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
        setValue('page', String(currPage));
    };

    const handleNextPage = () => {
        setCurrPage((prev) => (prev + 1 <= numPages! ? prev + 1 : numPages!));
        setValue('page', String(currPage));
    };

    return (
        <div className="flex w-full flex-col items-center rounded-md bg-white shadow">
            <div className="flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2">
                <div className="flex items-center gap-1.5">
                    <Button variant="ghost" aria-label="previous page" onClick={handlePrevPage} disabled={currPage <= 1}>
                        <ChevronDown className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1.5">
                        <Input
                            {...register('page')}
                            className={cn('h-8 w-12', errors.page && 'focus-visible:ring-red-500')}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit(handlePageSubmit)();
                                }
                            }}
                        />
                        <p className="space-x-1 text-sm text-zinc-700">
                            <span>/</span>
                            <span>{numPages ?? 'x'}</span>
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        aria-label="next page"
                        onClick={handleNextPage}
                        disabled={numPages === undefined || currPage === numPages}
                    >
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-label="zoom" variant="ghost" className="gap-1.5">
                                <SearchIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => setScale(0.5)}>50%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(0.75)}>75%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(1)}>100%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(1.5)}>150%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(2)}>200%</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setScale(2.5)}>250%</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button onClick={() => setRotation((prev) => prev + 90)} variant="ghost" aria-label="rotate 90 degrees">
                        <RotateCw className="h-4 w-4" />
                    </Button>

                    <PdfFullscreen fileUrl={url} />
                </div>
            </div>

            <div className="max-h-screen w-full flex-1">
                <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
                    <div ref={ref}>
                        <Document
                            loading={
                                <div className="flex justify-center">
                                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                                </div>
                            }
                            onLoadError={() => {
                                toast({
                                    title: 'Error loading PDF',
                                    description: 'Please try again later',
                                    variant: 'destructive',
                                });
                            }}
                            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                            file={url}
                            className="max-h-full"
                        >
                            {isLoading && renderedScale ? (
                                <Page
                                    width={width ? width : 1}
                                    pageNumber={currPage}
                                    scale={scale}
                                    rotate={rotation}
                                    key={'@' + renderedScale}
                                />
                            ) : null}

                            <Page
                                className={cn(isLoading ? 'hidden' : '')}
                                width={width ? width : 1}
                                pageNumber={currPage}
                                scale={scale}
                                rotate={rotation}
                                key={'@' + scale}
                                loading={
                                    <div className="flex justify-center">
                                        <Loader2 className="my-24 h-6 w-6 animate-spin" />
                                    </div>
                                }
                                onRenderSuccess={() => setRenderedScale(scale)}
                            />
                        </Document>
                    </div>
                </SimpleBar>
            </div>
        </div>
    );
};

export default PdfRenderer;
