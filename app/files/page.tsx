import UploadAndList from "@/components/Files/UploadAndList";

export default async function FilesPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Files</h1>
      <UploadAndList />
    </div>
  );
}
