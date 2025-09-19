import { addAgentTemplateFavorite } from "./addAgentTemplateFavorite";
import { removeAgentTemplateFavorite } from "./removeAgentTemplateFavorite";

export async function toggleAgentTemplateFavorite(
  templateId: string,
  userId: string,
  isFavourite: boolean
) {
  if (isFavourite) {
    return await addAgentTemplateFavorite(templateId, userId);
  } else {
    return await removeAgentTemplateFavorite(templateId, userId);
  }
}
