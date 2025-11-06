import supabase from "./serverClient";

interface MemoryInput {
  room_id: string;
  content: unknown;
  id: string;
}

const createMemories = async (memory: MemoryInput) => {
  const { data, error } = await supabase
    .from("memories")
    .upsert(memory, { onConflict: "id" })
    .select("*");

  if (error) {
    console.error("❌ Failed to save memory:", {
      memoryId: memory.id,
      roomId: memory.room_id,
      error: error,
      errorMessage: error.message,
      errorCode: error.code,
      errorDetails: error.details,
    });
    throw error;
  }

  console.log("✅ Memory saved successfully:", {
    memoryId: memory.id,
    roomId: memory.room_id,
  });

  return data;
};

export default createMemories;
