import { Button } from "@dataesr/react-dsfr";
import { useUser } from "hooks";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { useAsyncFn, useNumber } from "react-use";
import API from "utils/API";

export interface TranslationInputProps {
  initialText: string;
  locale: string;
  next: any;
  prev: any;
  section: string;
  suggestions: { text: string; username: string; author: string }[];
  validate: (value: string) => void;
}

const TranslationInput = ({
  initialText,
  locale,
  next,
  prev,
  section,
  suggestions,
  validate,
}: TranslationInputProps) => {
  const { user } = useUser();
  // Index pour parcourir les suggestions de traductions
  const max = Math.max(suggestions.length - 1, 0);
  const [index, { inc, dec }] = useNumber(0, max, 0);

  // on met la valeur de la traduction suggérée dans la valeur
  // si il n'y en a pas, on met une chaine vide
  const [value, setValue] = useState<string>(get(suggestions, `${index}.text`, "") as string);

  const [{ loading }, translate] = useAsyncFn((initialText, language) =>
    API.get_translation({ q: initialText, language })
      .then((data) => data.data.data)
      .then((_) => {
        setValue(_);
        return _;
      }),
  );

  useEffect(() => {
    setValue(get(suggestions, `${index}.text`, "") as string);
  }, [index, section, setValue, suggestions]);

  // Si il n'y a pas de valeur, on utilise la traduction
  // automatique pour en proposer une à l'utilisateur
  useEffect(() => {
    if (!value) translate(initialText, locale);
  }, [initialText, locale, translate, value]);

  // console.log("render", index, value, loading, section, initialText, suggestions);

  return (
    <div style={{ display: "grid" }}>
      <p>Section : {section}</p>
      <p>Nombre de suggestions : {suggestions.length}</p>
      <b>Texte initial</b>
      <p dangerouslySetInnerHTML={{ __html: initialText }}></p>
      <b>Translate part</b>
      <textarea
        style={{ margin: "1rem", border: "1px solid black" }}
        disabled={loading}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      ></textarea>
      {user.expertTrad ? (
        <div>
          <p>Par : {user.userId === suggestions[index].author ? " vous" : suggestions[index].username}</p>
          {suggestions.length > 1 ? (
            <p>
              <Button disabled={index === 0} onClick={() => dec()}>
                Prev
              </Button>{" "}
              <Button disabled={index === max} onClick={() => inc()}>
                Next
              </Button>
            </p>
          ) : null}
        </div>
      ) : (
        <p>Pas expert trad</p>
      )}

      <p>
        <Button disabled={!prev} onClick={prev}>
          Prev
        </Button>{" "}
        <Button disabled={!next} onClick={next}>
          Next
        </Button>{" "}
        <Button
          disabled={loading && !value}
          onClick={() => {
            // console.log("Validate translation", section, value);
            validate(value);
          }}
        >
          Valider
        </Button>
      </p>
    </div>
  );
};

export default TranslationInput;
