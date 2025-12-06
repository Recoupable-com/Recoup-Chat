import JoiBase from "joi";

export const validation = JoiBase.object({
  name: JoiBase.string().messages({
    "string.empty": `Please fill out this field.`,
  }),
  spotifyUrl: JoiBase.allow(),
  instruction: JoiBase.allow(),
  label: JoiBase.allow(),
  appleUrl: JoiBase.allow(),
  tiktok: JoiBase.allow(),
  instagram: JoiBase.allow(),
  youtube: JoiBase.allow(),
  twitter: JoiBase.allow(),
  facebook: JoiBase.allow(),
  threads: JoiBase.allow(),
});

export const accountValidation = JoiBase.object({
  name: JoiBase.string().allow(),
  instruction: JoiBase.allow(),
  organization: JoiBase.allow(),
});

export const orgValidation = JoiBase.object({
  orgName: JoiBase.string().allow(),
  orgInstruction: JoiBase.allow(),
});
