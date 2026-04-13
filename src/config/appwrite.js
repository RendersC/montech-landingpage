import { Client, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);

export const DATABASE_ID = process.env.REACT_APP_APPWRITE_DATABASE_ID;
export const CONTACT_COLLECTION_ID = process.env.REACT_APP_APPWRITE_COLLECTION_ID;
export const REVIEWS_COLLECTION_ID = process.env.REACT_APP_APPWRITE_REVIEWS_COLLECTION_ID;
export const CASES_COLLECTION_ID = process.env.REACT_APP_APPWRITE_CASES_COLLECTION_ID;
