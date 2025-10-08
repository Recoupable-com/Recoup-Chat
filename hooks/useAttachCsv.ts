import { useVercelChatContext } from "@/providers/VercelChatProvider";

export function useAttachCsv() {
  const { input, setInput } = useVercelChatContext();

  const attachCsvToInput = async (file: File): Promise<void> => {
    try {
      const text = await file.text();
      const csvContent = `\n\n--- CSV File: ${file.name} ---\n${text}\n--- End of CSV ---\n`;
      setInput(input + csvContent);
    } catch (error) {
      console.error("Error reading CSV file:", error);
      throw error;
    }
  };

  return { attachCsvToInput };
}
