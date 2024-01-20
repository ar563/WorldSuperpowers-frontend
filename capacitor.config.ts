import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "cc.worldsuperpowers",
  appName: "WorldSuperpowers",
  webDir: "build",
  server: {
    androidScheme: "https",
    hostname: "goldenhead.club",
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com"],
    },
  },
};

export default config;
