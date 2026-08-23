export const CATALOG = [
  {
    slug: "his-girl-friday",
    title: "His Girl Friday",
    year: 1940,
    archiveId: "HisGirlFriday",
    file: "MoviePowderPresentsHisGirlFriday.mp4",
  },
  {
    slug: "meet-john-doe",
    title: "Meet John Doe",
    year: 1941,
    archiveId: "meet_john_doe",
    file: "meet_john_doe.mp4",
  },
  {
    slug: "detour",
    title: "Detour",
    year: 1945,
    archiveId: "detour_1945",
    file: "detour_4k.ia.mp4",
  },
  {
    slug: "house-on-haunted-hill",
    title: "House on Haunted Hill",
    year: 1959,
    archiveId: "house_on_haunted_hill",
    file: "house_on_haunted_hill.mp4",
  },
  {
    slug: "the-little-shop-of-horrors",
    title: "The Little Shop of Horrors",
    year: 1960,
    archiveId: "TheLittleShopOfHorrors",
    file: "The Little Shop of Horrors.mp4",
  },
  {
    slug: "carnival-of-souls",
    title: "Carnival of Souls",
    year: 1962,
    archiveId: "carnival_of_souls",
    file: "carnival_of_souls.mp4",
  },
  {
    slug: "nosferatu",
    title: "Nosferatu",
    year: 1922,
    archiveId: "Nosferatu1922",
    file: "Nosferatu-smaller2.m4v",
  },
  {
    slug: "the-general",
    title: "The General",
    year: 1926,
    archiveId: "the_general_1926",
    file: "The_General_1926_720p.mp4",
  },
  {
    slug: "big-buck-bunny",
    title: "Big Buck Bunny",
    year: 2008,
    magnet:
      "magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big%20Buck%20Bunny&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&wss=ws%3A%2F%2Flocalhost%3A8999",
    p2pOnly: true,
  },
  {
    slug: "sintel",
    title: "Sintel",
    year: 2010,
    magnet:
      "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
    p2pOnly: true,
  },
];

function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^the /, "");
}

function matchCatalog(title, year) {
  const t = normalize(title);
  const y = Number.parseInt(year, 10) || null;
  if (!t) return null;
  return (
    CATALOG.find((e) => {
      if (normalize(e.title) !== t) return false;
      if (y && e.year && Math.abs(e.year - y) > 1) return false;
      return true;
    }) || null
  );
}

export { matchCatalog };
