/** Core routes for the simplified site */

export const ROUTE_HOME = "/";
export const ROUTE_RACE_ENTRIES = "/race-entries";
export const ROUTE_PRACTICE = "/practice";
export const ROUTE_CALENDAR = "/calendar";
export const ROUTE_RESULTS = "/results";
export const ROUTE_DOCUMENTS = "/documents";

export const ROUTE_START_KARTING = "/start-karting";
export const ROUTE_PATHWAY_TO_KARTING = "/start-karting/pathway-to-karting";
export const ROUTE_COSTS = "/start-karting/costs";
export const ROUTE_LICENCES = "/start-karting/licences";
export const ROUTE_BUYING_A_KART = "/start-karting/buying-a-kart";
export const ROUTE_PARENTS = "/start-karting/parents";

export const ROUTE_VENUE = "/venue";
export const ROUTE_VISITING_RACERS = "/visiting-racers";

export const ROUTE_CONTACT = "/contact";
export const ROUTE_SPONSORS = "/sponsors";
export const ROUTE_VOLUNTEERS = "/volunteers";
export const ROUTE_NEWS = "/news";
export const ROUTE_FAQ = "/faq";

export function newsArticleRoute(slug: string): string {
  return `/news/${slug}`;
}

export const ROUTES = {
  home: ROUTE_HOME,
  raceEntries: ROUTE_RACE_ENTRIES,
  practice: ROUTE_PRACTICE,
  calendar: ROUTE_CALENDAR,
  results: ROUTE_RESULTS,
  documents: ROUTE_DOCUMENTS,
  startKarting: ROUTE_START_KARTING,
  pathwayToKarting: ROUTE_PATHWAY_TO_KARTING,
  costs: ROUTE_COSTS,
  licences: ROUTE_LICENCES,
  buyingAKart: ROUTE_BUYING_A_KART,
  parents: ROUTE_PARENTS,
  venue: ROUTE_VENUE,
  visitingRacers: ROUTE_VISITING_RACERS,
  contact: ROUTE_CONTACT,
  sponsors: ROUTE_SPONSORS,
  volunteers: ROUTE_VOLUNTEERS,
  news: ROUTE_NEWS,
  faq: ROUTE_FAQ,
} as const;
