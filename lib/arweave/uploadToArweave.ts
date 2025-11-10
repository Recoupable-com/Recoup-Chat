import Arweave from "arweave";

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
});

const uploadToArweave = async (
  imageData: { base64Data: string; mimeType: string },
  getProgress: (progress: number) => void = () => {}
): Promise<string> => {
  const ARWEAVE_KEY = JSON.parse(
    Buffer.from(process.env.ARWEAVE_KEY as string, "base64").toString()
  );
  const buffer = Buffer.from(imageData.base64Data, "base64");

  const transaction = await arweave.createTransaction(
    {
      data: buffer,
    },
    ARWEAVE_KEY
  );
  transaction.addTag("Content-Type", imageData.mimeType);
  await arweave.transactions.sign(transaction, ARWEAVE_KEY);
  const uploader = await arweave.transactions.getUploader(transaction);

  while (!uploader.isComplete) {
    console.log(
      `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
    );
    getProgress(uploader.pctComplete);
    await uploader.uploadChunk();
  }

  return `ar://${transaction.id}`;
};

export default uploadToArweave;
