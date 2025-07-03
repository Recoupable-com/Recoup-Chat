import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TxtFileGenerationResult } from "@/lib/tools/createTxtFile";
import { Download } from "lucide-react";

interface TxtFileResultProps {
  result: TxtFileGenerationResult;
}

export function TxtFileResult({ result }: TxtFileResultProps) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (result.arweaveUrl && !fileContent) {
      setLoading(true);
      setFetchError(null);
      fetch(result.arweaveUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch file from Arweave");
          return res.text();
        })
        .then((text) => {
          setFileContent(text);
          setLoading(false);
        })
        .catch((err) => {
          setFetchError(err.message || "Error fetching file");
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.arweaveUrl]);

  if (!result.success) {
    return (
      <Card className="w-full bg-destructive/10 border-destructive/30">
        <CardContent className="pt-6">
          <p className="text-destructive font-medium">
            Error generating TXT file
          </p>
          <p className="text-sm text-destructive/80">
            {result.error || "Unknown error occurred"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleDownload = () => {
    if (result.arweaveUrl) {
      window.open(result.arweaveUrl, "_blank");
    }
  };

  let displayText: string | JSX.Element = "TXT file generated.";
  if (result.arweaveUrl) {
    if (loading) {
      displayText = "Loading file contents...";
    } else if (fetchError) {
      displayText = fetchError;
    } else if (fileContent) {
      displayText = fileContent;
    }
  } else if (result.message) {
    displayText = result.message;
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-4 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 w-full">
            <h3 className="text-lg font-medium">Text File Generated</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={!result.arweaveUrl}
              className="h-8 px-3 text-xs rounded-xl ml-auto"
            >
              <Download className="w-4 h-4" /> <span className="hidden sm:block">Download</span>
            </Button>
          </div>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none relative">
          <div 
            className={cn("mb-4 whitespace-pre-wrap font-mono text-sm p-3 bg-muted/50 rounded-md overflow-hidden")}
            style={{transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",}}
          >
            {loading ? (<p className="text-muted-foreground">Loading file contents...</p>) : 
             fetchError ? (<p className="text-destructive">{fetchError}</p>) 
             : (displayText)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TxtFileResult;
