export interface TextAttachment {
  filename: string;
  content: string;
  lineCount: number;
  type: "md" | "csv";
}
