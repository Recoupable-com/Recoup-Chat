import supabase from "./serverClient";

interface MemoryInput {
  room_id: string;
  content: unknown;
  id: string;
}

const createMemories = async (memory: MemoryInput) => {
  try {
    await supabase
      .from("memories")
      .upsert(memory, { onConflict: "id" })
      .select("*");
  } catch (error) {
    console.error(error);
  }
};

export default createMemories;
