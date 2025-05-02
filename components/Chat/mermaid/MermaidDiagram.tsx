'use client';

import React, { useEffect, useRef, useState } from 'react';
import MermaidErrorFallback from './MermaidErrorFallback'; // Import the fallback component
import styles from '../markdown.module.css'; // Import the CSS module

// Define a type for the global mermaid object, or use any if types aren't installed
declare global {
  interface Window {
    mermaid?: {
      run: (options: { nodes: HTMLElement[] }) => void;
      initialize: (config: Record<string, unknown>) => void;
      // Add other methods you might use
    };
  }
}

// Define Mermaid type structure (or import from @types/mermaid if installed)
type MermaidApi = {
  run: (options: { nodes: HTMLElement[] }) => void;
  initialize: (config: Record<string, unknown>) => void;
  // Add other methods as needed
};

interface MermaidDiagramProps {
  /** The Mermaid diagram definition string. */
  chart: string;
  /** Optional unique ID for the diagram wrapper. */
  id?: string;
}

/**
 * Renders a Mermaid diagram from a definition string.
 * Dynamically imports the Mermaid library on mount.
 */
const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, id }) => {
  const containerRef = useRef<HTMLPreElement>(null);
  const generatedId = `mermaid-diagram-${React.useId()}`;
  const uniqueId = id || generatedId;
  // Use a ref to hold the dynamically imported mermaid instance
  const mermaidRef = useRef<MermaidApi | null>(null);
  // State to trigger re-render after import completes
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [hasError, setHasError] = useState(false); // State to track rendering errors

  useEffect(() => {
    // Flag to prevent import if already loaded or component unmounted
    let didCancel = false;

    const loadMermaid = async () => {
      try {
        // Use the specific ESM build path
        // @ts-expect-error - TypeScript cannot analyze remote modules (Replaced ts-ignore)
        const mermaidModule = await import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs');
        // The actual API might be on the default export
        const mermaid = mermaidModule.default || mermaidModule;

        if (!didCancel) {
          // Initialize Mermaid (optional, can be done once globally if preferred)
          // mermaid.initialize({ startOnLoad: false });
          mermaidRef.current = mermaid;
          setIsLibraryLoaded(true);
          setHasError(false); // Reset error state on successful load
        }
      } catch (error) {
        if (!didCancel) {
          console.error('Failed to dynamically import Mermaid:', error, uniqueId);
          // Optionally set error state here too if library load fails critically
          // setHasError(true);
        }
      }
    };

    // Only attempt import if not already loaded
    if (!mermaidRef.current) {
      loadMermaid();
    }

    // Cleanup function to set flag if component unmounts during import
    return () => {
      didCancel = true;
    };
  }, [uniqueId]); // Run only once on mount

  useEffect(() => {
    // Render/re-render the chart when the library is loaded and the chart changes
    if (isLibraryLoaded && mermaidRef.current && containerRef.current) {
      const mermaid = mermaidRef.current;
      const element = containerRef.current;

      // Reset error state before attempting to render
      setHasError(false);

      // Ensure the container is clean before rendering
      element.innerHTML = chart; // Set content for mermaid to process
      element.removeAttribute('data-processed');

      try {
        mermaid.run({ nodes: [element] });
        // Ensure visibility is set correctly after successful render
        element.style.visibility = 'visible';
      } catch (error) {
        console.error('Mermaid rendering failed:', error, uniqueId);
        // Set error state to true on failure
        setHasError(true);
        // Clear the container content on error to prevent showing raw code or old diagrams
        element.innerHTML = '';
        // Hide the container to avoid empty space if needed, or let fallback handle layout
        element.style.visibility = 'hidden';
      }
    } else if (isLibraryLoaded && !containerRef.current) {
      // Handle case where ref might be null unexpectedly after load
      console.warn('Mermaid container ref not available after library load:', uniqueId);
      setHasError(true); // Indicate an error state
    }
  }, [isLibraryLoaded, chart, uniqueId]); // Depend on load state and chart content

  useEffect(() => {
    const parent = containerRef.current?.parentElement as HTMLElement | null;
    const grandparent = parent?.parentElement as HTMLElement | null;

    if (parent) {
      parent.classList.add(styles.mermaidParentOverride);
    }
    if (grandparent) {
      grandparent.classList.add(styles.mermaidGrandparentOverride);
    }

    // Cleanup function to remove classes when component unmounts or dependencies change
    return () => {
      if (parent) {
        parent.classList.remove(styles.mermaidParentOverride);
      }
      if (grandparent) {
        grandparent.classList.remove(styles.mermaidGrandparentOverride);
      }
    };
  }, [isLibraryLoaded, hasError, chart]); // Keep dependencies as they are working

  // Conditional rendering: Show fallback on error, otherwise the diagram container
  if (hasError) {
    return <MermaidErrorFallback />;
  }

  // Render the container pre element (initially hidden, made visible on success)
  return (
    <pre
      ref={containerRef}
      id={uniqueId}
      className="mermaid" // Ensure mermaid class is present for mermaid.run()
      // Hide until library loaded and rendered successfully
      style={{ visibility: (isLibraryLoaded && !hasError) ? 'visible' : 'hidden', backgroundColor: 'white', border: 'none', padding: '0' }}
    >
      {/* Keep chart content here only initially for mermaid.run() to process,
          It gets replaced by the SVG during mermaid.run */}
      {chart}
    </pre>
    // Optional: Show loading indicator
    // { !isLibraryLoaded && !hasError && <div className="text-center p-4">Loading Diagram...</div> }
  );
};

export default MermaidDiagram; 