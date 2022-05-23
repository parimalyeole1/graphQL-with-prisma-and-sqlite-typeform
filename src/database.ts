import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from 'path';

export const initDatabase = () => {
  console.log('db initilise.......');
  return open({
    filename: path.resolve(__dirname, '../database.db'),
    driver: sqlite3.Database
  });
};


// initDatabase().then(async (_db) => {
//   console.log("Database initialized");
// //  const dbdd =  await _db.all("select name from sqlite_master where type='table'");
// try {
//   const aaa = await _db.all('SELECT * FROM artists');
//   console.log('result ====>', JSON.stringify(aaa,null,2));
// } catch (error) {
//   console.log('error ====>', error);
// }
  
// });