import * as React from 'react';

// Core viewer
import { Viewer, Worker } from '@react-pdf-viewer/core';
// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Create new plugin instance

export interface IPdfViewerProps {
  fileUrl: string;
}

export default function PdfViewer({ fileUrl }: IPdfViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <Viewer
        fileUrl={fileUrl}
        plugins={[
          // Register plugins
          defaultLayoutPluginInstance,
        ]}
      />
    </Worker>
  );
}
