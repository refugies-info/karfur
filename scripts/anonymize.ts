import { faker } from "@faker-js/faker";
import { MongoClient } from "mongodb";

// ==============================
// CONFIGURATION
// ==============================

const MONGO_URI = "mongodb://localhost:27017";
const DATABASE_NAME = "heroku_dump_anonym";

const USERS_COLLECTION = "users";
const MAILS_COLLECTION = "mails";

//installation dirty with
// pnpm install mongodb @faker-js/faker tsx -w
// lancer depuis la racine du projet
// pnpm tsx scripts/anonymize.ts
// passer DRY_RUN à true pour faire vraiment le clean
//clean le package.json avant push quoique ce soit

// Active uniquement pour tester sans modifier MongoDB
const DRY_RUN = false;

// ==============================
// UTILITAIRES
// ==============================

/**
 * Génère un seed numérique stable depuis un Mongo ObjectId
 */
function seedFromId(id: string): number {
  return id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

/**
 * Nettoyage d'une chaîne pour username/email
 */
function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Génération d'une identité fictive stable
 */
function generateFakeIdentity(id: string) {
  faker.seed(seedFromId(id));

  const firstName = faker.person.firstName();

  const lastName = faker.person.lastName();

  const username = `${slugify(firstName)}.${slugify(lastName)}.${id.slice(-5)}`;

  return {
    firstName: `${firstName} ${lastName}`,

    username,

    email: `${username}@example.com`,
  };
}

/**
 * Génération email uniquement
 * utilisé pour les mails sans userId
 */
function generateFakeEmail(id: string): string {
  return generateFakeIdentity(id).email;
}

// ==============================
// ANONYMISATION USERS
// ==============================

async function anonymizeUsers(db: any): Promise<Map<string, string>> {
  const users = db.collection(USERS_COLLECTION);

  const emailMap = new Map<string, string>();

  console.log("\n👤 Anonymisation des utilisateurs...");

  const cursor = users.find({});

  let count = 0;

  for await (const user of cursor) {
    const fakeIdentity = generateFakeIdentity(user._id.toString());

    emailMap.set(user._id.toString(), fakeIdentity.email);

    const update = {
      $set: {
        // Identité
        firstName: fakeIdentity.firstName,

        username: fakeIdentity.username,

        email: fakeIdentity.email,

        // Sécurité
        password: "sha1$anonymous$1$0000000000000000000000000000000000000000",

        mfaCode: null,

        authy_id: null,

        // Contact
        phone: null,

        // Profil
        description: user.description ? "Profil utilisateur anonymisé" : undefined,

        // Image
        picture: user.picture
          ? {
              imgId: "anonymous",
              public_id: "anonymous",
              secure_url: "https://example.com/avatar.png",
            }
          : undefined,

        updatedAt: new Date(),
      },
    };

    if (DRY_RUN) {
      console.log(`[DRY] ${user.email} => ${fakeIdentity.email}`);
    } else {
      await users.updateOne(
        {
          _id: user._id,
        },
        update,
      );
    }

    count++;

    if (count % 100 === 0) {
      console.log(`${count} utilisateurs traités`);
    }
  }

  console.log(`✅ ${count} utilisateurs anonymisés`);

  return emailMap;
}

// ==============================
// ANONYMISATION MAILS
// ==============================

async function anonymizeMails(db: any, emailMap: Map<string, string>) {
  const mails = db.collection(MAILS_COLLECTION);

  console.log("\n📧 Anonymisation des mails...");

  const cursor = mails.find({});

  let total = 0;
  let withUser = 0;
  let withoutUser = 0;
  let unknownUser = 0;

  for await (const mail of cursor) {
    let fakeEmail: string;

    /**
     * Mail lié à un utilisateur
     */
    if (mail.userId) {
      withUser++;

      fakeEmail = emailMap.get(mail.userId.toString()) ?? generateFakeEmail(mail._id.toString());

      if (!emailMap.has(mail.userId.toString())) {
        unknownUser++;
      }
    } else {
      /**
       * Mail historique sans userId
       */
      withoutUser++;

      fakeEmail = generateFakeEmail(mail._id.toString());
    }

    if (DRY_RUN) {
      console.log(`[DRY] ${mail.email} => ${fakeEmail}`);
    } else {
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
    }

    total++;

    if (total % 100 === 0) {
      console.log(`${total} mails traités`);
    }
  }

  console.log("\n📊 Résultat mails");

  console.table({
    total,

    avecUserId: withUser,

    sansUserId: withoutUser,

    userIdInconnu: unknownUser,
  });
}

// ==============================
// MAIN
// ==============================

async function main() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();

    console.log("✅ MongoDB connecté");

    const db = client.db(DATABASE_NAME);

    /**
     * IMPORTANT :
     * On anonymise users en premier
     * pour construire la correspondance email
     */
    const emailMap = await anonymizeUsers(db);

    await anonymizeMails(db, emailMap);

    console.log("\n🎉 Anonymisation terminée");
  } catch (error) {
    console.error("❌ Erreur", error);

    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
