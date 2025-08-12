import { ModelMessage } from "ai";
import { knowledgeBaseReferenceReport } from "./knowledgeBaseReferenceReport";

const getKnowbaseReportReferenceMessage = (): ModelMessage => {
  return {
    role: "user",
    content: `Here is an example knowledge base report for reference. Use this as a template for creating your own knowledge base reports:
            ${knowledgeBaseReferenceReport}`
  };
};

export default getKnowbaseReportReferenceMessage;
