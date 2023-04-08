import React, {useState, useEffect, useRef} from 'react';
import {getDocument, GlobalWorkerOptions} from 'pdfjs-dist/legacy/build/pdf';
import type {PDFDocumentProxy} from 'pdfjs-dist';

interface Props {
  /** See `GlobalWorkerOptionsType`. */
  workerSrc?: string;

  url: string;
  beforeLoad: JSX.Element;
  errorMessage?: JSX.Element;
  children: (pdfDocument: PDFDocumentProxy) => JSX.Element;
  onError?: (error: Error) => void;
  cMapUrl?: string;
  cMapPacked?: boolean;
}

const PdfLoader: React.FC<Props> = ({
  workerSrc = './lib/pdf.worker.min.js',
  url,
  beforeLoad,
  errorMessage,
  children,
  onError,
  cMapUrl,
  cMapPacked,
}) => {
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const documentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const {ownerDocument = document} = documentRef.current || {};

    const load = async () => {
      let discardedDocument = pdfDocument;

      try {
        if (discardedDocument) {
          discardedDocument.destroy();
        }

        if (!url) {
          return;
        }

        if (typeof workerSrc === 'string') {
          GlobalWorkerOptions.workerSrc = workerSrc;
        }

        const pdfDocument = await getDocument({
          url,
          ownerDocument,
          cMapUrl,
          cMapPacked,
        }).promise;

        setPdfDocument(pdfDocument);
        setError(null);
      } catch (e: any) {
        if (onError) {
          onError(e);
        }

        setPdfDocument(null);
        setError(e);
      }
    };

    load();

    return () => {
      if (pdfDocument) {
        pdfDocument.destroy();
      }
    };
  }, [url, cMapUrl, cMapPacked, workerSrc, onError]);

  const renderError = () => {
    if (errorMessage) {
      return React.cloneElement(errorMessage, {error});
    }

    return null;
  };

  return (
    <>
      <span ref={documentRef} />
      {error ? renderError() : !pdfDocument || !children ? beforeLoad : children(pdfDocument)}
    </>
  );
};

export {PdfLoader};

export default PdfLoader;
