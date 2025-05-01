import axios from "axios";

export async function clearCollections(secret: string): Promise<void> {
  try {
    const response = await axios.delete("/api/dev/clearDb", {
      params: { secret },
    });

    if (response.status !== 200) {
      throw new Error("Failed to clear collections.");
    }
    console.log("clear!");
  } catch (error: any) {
    console.log("clearCollections error:", error);

    throw new Error("Failed to clear collections. Please try again.");
  }
}
