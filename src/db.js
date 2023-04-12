import Dexie from 'dexie';
const db = new Dexie('messages_database');
db.version(1).stores({
messages: '++id, username, prompt, response'
});



export async function insertMessage(username, prompt, response) {
 db.messages.add({ username, prompt, response }).then(() => {
console.log('Message added');
}).catch(error => {
console.error(error.stack || error);
});
}


export async function getLastMessage(username) {
const row = await db.messages.where('username').equals(username).last();
console.log('Last message retrieved:', row);
return row;
}