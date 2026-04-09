import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Service Role Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('id')
    .limit(1);

  if (error) {
    if (error.message.includes("relation \"public.site_settings\" does not exist")) {
      console.log("TABLES_MISSING");
    } else {
      console.error("Error checking tables:", error.message);
    }
  } else {
    console.log("TABLES_EXIST");
  }
}

checkTables();
