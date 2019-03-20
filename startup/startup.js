const langues = require('../private/langues.json');
const roles = require('../private/roles.json');
const users = require('../private/users.json');

const run = async (db) => {
  let nb_documents=await db.collection('langues').countDocuments()
  if(nb_documents < langues.length){
    console.log(await db.collection('langues').insertMany(langues).insertedIds);
  }

  nb_documents=await db.collection('roles').countDocuments()
  if(nb_documents < roles.length){
    console.log(await db.collection('roles').insertMany(roles).insertedIds);
  }

  nb_documents=await db.collection('users').countDocuments()
  if(nb_documents < users.length){
    console.log(await db.collection('users').insertMany(users).insertedIds);
  }
}

exports.run = run;