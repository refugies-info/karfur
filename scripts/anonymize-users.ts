import { faker } from "@faker-js/faker";
import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb://localhost:27017";
const DATABASE_NAME = "heroku_dump_anonym";

const USERS_COLLECTION = "users";
const MAILS_COLLECTION = "mails";

//installation dirty with
// pnpm install mongodb @faker-js/faker
// pnpm add -D tsx -w
// lancer depuis la racine du projet pnpm tsx scripts/anonymize-users.ts
//clean le package.json avant push quoique ce soit

/**
 * Génère un email fictif stable à partir d'un identifiant
 */
function generateFakeEmail(seed: string): string {
  const numericSeed = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  faker.seed(numericSeed);

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return `${firstName}.${lastName}.${seed.slice(-5)}@example.com`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.@]/g, "");
}

async function run() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();

    console.log("MongoDB connecté");

    const db = client.db(DATABASE_NAME);

    const users = db.collection(USERS_COLLECTION);
    const mails = db.collection(MAILS_COLLECTION);

    /**
     * 1 - Création de la correspondance userId => fakeEmail
     */
    console.log("Création de la table de correspondance utilisateurs...");

    const emailMap = new Map<string, string>();

    const usersCursor = users.find({});

    let usersCount = 0;

    for await (const user of usersCursor) {
      const fakeEmail = generateFakeEmail(user._id.toString());

      emailMap.set(user._id.toString(), fakeEmail);

      usersCount++;
    }

    console.log(`${usersCount} utilisateurs indexés`);

    /**
     * 2 - Anonymisation des mails
     */

    console.log("Anonymisation des mails...");

    let total = 0;
    let withUserId = 0;
    let withoutUserId = 0;
    let unknownUser = 0;

    const mailsCursor = mails.find({});

    for await (const mail of mailsCursor) {
      let fakeEmail: string;

      // Cas 1 : mail lié à un utilisateur
      if (mail.userId) {
        withUserId++;

        fakeEmail = emailMap.get(mail.userId.toString()) ?? generateFakeEmail(mail._id.toString());

        if (!emailMap.has(mail.userId.toString())) {
          unknownUser++;
        }
      }

      // Cas 2 : ancien mail sans utilisateur
      else {
        withoutUserId++;

        fakeEmail = generateFakeEmail(mail._id.toString());
      }

      await mails.updateOne(
        {
          _id: mail._id,
        },
        {
          $set: {
            email: fakeEmail,
          },
        },
      );

      total++;

      if (total % 100 === 0) {
        console.log(`${total} mails traités`);
      }
    }

    console.log("\n===== Résultat =====");

    console.log({
      totalMails: total,
      mailsAvecUserId: withUserId,
      mailsSansUserId: withoutUserId,
      userIdInconnu: unknownUser,
    });

    console.log("✅ Anonymisation terminée");
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    await client.close();
  }
}

run();
