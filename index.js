
import JobLookup from "./helper.js";
import dotenv from 'dotenv';

dotenv.config();

const userDataDir = process.env.USER_DATA_DIR
let targetUrl = process.env.TARGET_URL
const searchText = process.env.SEARCH_TEXT

// Run the function
JobLookup(userDataDir,targetUrl,searchText);








