import Button from "@codegouvfr/react-dsfr/Button";
import type { GetServerSideProps } from "next";
import { useState } from "react";

const DEFAULT_JSON = {
  dispositif: {
    typeContenu: "dispositif",
    theme: "63286a015d31b2c0cad99615",
    titreInformatif: "Certificat de capacité à l'enseignement du français langue étrangère - FLE",
    origin: "RCO",
    translations: {
      fr: {
        content: {
          markdown: `
## Objectifs

Acquérir et développer les compétences et savoir-faire pédagogiques nécessaires à l'enseignement du français langue étrangère.

## Contenu

Gérer la classe et maîtriser les outils de la classe : 
- Maîtriser les techniques d'animation et de gestion de classe - Favoriser les interactions authentiques en langue cible - Savoir utiliser des outils numériques simples pour la classe - Utiliser des supports et documents complémentaires (documents télévisuels, presse écrite, radio) - Connaître les ressources pédagogiques disponibles pour l'enseignant et l'apprenant. 
Construire un cours : 
- Planifier un cours et une progression - Cibler les activités sur des compétences visées - Enrichir le manuel avec des documents authentiques. Évaluer les apprenants par compétences : - Connaître les différentes formes d'évaluation - Utiliser l'évaluation comme outil de motivation - Identifier les erreurs et proposer des pistes de correction - Évaluer les apprenants sur la base du Cadre européen commun de référence (CECR).

`,
        },
      },
    },
  },
};

interface Props {
  webhookSecret: string;
}

const TestPreviewPage = (props: Props) => {
  const [json, setJson] = useState(JSON.stringify(DEFAULT_JSON, null, 2));

  return (
    <div className="container py-8">
      <h1>Test Preview</h1>
      <p>Copiez le JSON ci-dessous et cliquez sur "Prévisualiser" pour tester la page de rendu.</p>

      <form action="/dispositif/preview" method="POST" target="_blank" rel="noopener">
        <div className="fr-input-group">
          <label className="fr-label" htmlFor="json-input">
            Charge utile JSON (doit contenir "dispositif")
          </label>
          <textarea
            className="fr-input mb-4"
            id="json-input"
            name="json"
            rows={20}
            value={json}
            onChange={(e) => setJson(e.target.value)}
            style={{ fontFamily: "monospace" }}
          />
        </div>
      </form>

      <Button
        onClick={async () => {
          try {
            const response = await fetch("/dispositif/preview", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "webhook-secret": props.webhookSecret,
              },
              body: json,
            });
            const html = await response.text();

            // Open in new window
            const win = window.open("", "_blank");
            if (win) {
              win.document.write(html);
              win.document.close();
            } else {
              alert("Please allow popups for this site");
            }
          } catch (e) {
            alert("Error: " + e);
          }
        }}
      >
        Prévisualiser (Fetch + New Tab)
      </Button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Block access in production
  if (process.env.NODE_ENV === "production") {
    return { notFound: true };
  }

  const token = req.cookies.authorization;
  if (!token) {
    return { notFound: true };
  }

  return {
    props: {
      webhookSecret: process.env.WEBHOOK_SECRET || "",
    },
  };
};

export default TestPreviewPage;
