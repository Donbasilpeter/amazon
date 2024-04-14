import JobLookup from "./helper.js";
import fs from 'fs';

// Read the configuration from config.json
const configData = fs.readFileSync('./config.json');
const config = JSON.parse(configData);

const userDataDir = config.USER_DATA_DIR;
let targetUrl = config.TARGET_URL;
const searchText = config.SEARCH_TEXT;

// Run the function
JobLookup(userDataDir, targetUrl, searchText);
