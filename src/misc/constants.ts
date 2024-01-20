export const constants = {
  DAMAGE_BONUS_CHANGE_DEADLINE: new Date(1696355829000),
  CITIZENSHIP_CHANGE_DEADLINE: new Date(1693763829000),
  HCAPTCHA_SITE_KEY:
    process.env.NODE_ENV === "production"
      ? "your-hcaptcha-production-site-key"
      : "10000000-ffff-ffff-ffff-000000000001",
  BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://worldsuperpowers.cc/api"
      : "http://localhost:5000/api",
  SOCKET_URL:
    process.env.NODE_ENV === "production"
      ? "https://worldsuperpowers.cc"
      : "http://localhost:44225",
  CRAFT_COST: {
    riffles: 1000,
    ammo: 1,
    grenades: 10,
  },
  BUILD_COST: {
    gold_mines: 100,
    oil_fields: 80,
    gas_plants: 50,
    iron_mines: 40,
  },
  MILLISECONDS_PER_SECOND: 1000,
  SERVER_LAG: 2,
  MINUTES_SECONDS_SUBSTRING_START: 14,
  MINUTES_SECONDS_SUBSTRING_END: 19,
  HOURS_MINUTES_SECONDS_SUBSTRING_START: 11,
  HOURS_MINUTES_SECONDS_SUBSTRING_END: 19,
  MAX_EDUCATION_LEVEL: 100,
  MAX_WAGE: 100,
  MIN_WAGE: 0,
  USERNAME: localStorage.getItem("username"),
  AUTH: localStorage.getItem("auth"),
  AMMO_FIGHT_COST: 40,
  GRENADES_FIGHT_COST: 2,
  ASSAULT_RIFFLES_FIGHT_MINIMUM: 1,
  TRAVEL_OIL_COST: 100,
  DATE_SUBSTRING_START: 0,
  DATE_SUBSTRING_END: 10,
  MAX_NATURAL_RESOURCES: 10,
  FIELD_OF_STUDIES: [
    "political_education",
    "economic_education",
    "military_education",
  ],
  MAX_USERNAME_LENGTH: 20,
  MAX_MINE_NAME_LENGTH: 20,
  MAX_PARTY_NAME_LENGTH: 20,
  MAX_STATE_NAME_LENGTH: 20,
  FORBIDDEN_ERROR_CODE: 403,
  LANGUAGE: navigator.language.split("-")[0],
  COUNTRY_CODES: [
    "STP",
    "GAB",
    "GNQ",
    "COD",
    "DJI",
    "EGY",
    "ERI",
    "ETH",
    "GMB",
    "GHA",
    "GIN",
    "GNB",
    "CIV",
    "KEN",
    "LSO",
    "LBR",
    "LBY",
    "MWI",
    "MLI",
    "MRT",
    "MAR",
    "MOZ",
    "NAM",
    "NER",
    "NGA",
    "RWA",
    "SEN",
    "SLE",
    "SOM",
    "ZAF",
    "SSD",
    "SDN",
    "TZA",
    "TGO",
    "TUN",
    "UGA",
    "ZMB",
    "ZWE",
    "AGO",
    "BEN",
    "BFA",
    "CAF",
    "CMR",
    "COG",
    "DZA",
    "TCD",
    "BWA",
  ],
};