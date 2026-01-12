import Button from "@codegouvfr/react-dsfr/Button";
import { useState } from "react";

const DEFAULT_JSON = {
  dispositif: {
    typeContenu: "dispositif",
    theme: "sante",
    titreInformatif: "Titre prévisualisé",
    translations: {
      fr: {
        content: {
          markdown: "Contenu markdown",
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

export const getServerSideProps = async () => {
  return {
    props: {
      webhookSecret: process.env.WEBHOOK_SECRET || "",
    },
  };
};

export default TestPreviewPage;
