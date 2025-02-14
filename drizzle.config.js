import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: "postgresql://AI-Study-Material-Gen_owner:elDxdCzhEv62@ep-bold-haze-a59ku9vz.us-east-2.aws.neon.tech/AI-Study-Material-Gen?sslmode=require",
  }
});
