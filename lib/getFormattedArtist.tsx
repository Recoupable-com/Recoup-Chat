import getSocialPlatformByLink from "./getSocialPlatformByLink";

// eslint-disable-next-line
const getFormattedArtist = (artist: any) => {
  const account_id = artist.id;
  const account_info = artist.account_info?.[0];
  const info = account_info || {
    image: "",
    knowledges: [],
    label: "",
    instruction: "",
  };
  const account_socials = artist.account_socials.map(
    // eslint-disable-next-line
    (social: any) => ({
      ...social.social,
      link: social.social.profile_url,
      type: getSocialPlatformByLink(social.social.profile_url),
    }),
  );
  return {
    name: artist.name,
    ...info,
    account_id,
    account_socials,
    pinned: artist.pinned || false,
  };
};

export default getFormattedArtist;
