import Input from "@/components/Pages/dispositif/Input";
import Button from "@/components/UI/Button";
import EVAIcon from "@/components/UI/EVAIcon/EVAIcon";
import { cls } from "@/lib/classname";
import { useEffect, useState } from "react";
import usePlacesAutocompleteService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { Col, Row } from "reactstrap";
import styles from "./Header.module.scss";

interface Props {
  onSelectPlace: (place: google.maps.places.PlaceResult | null) => void;
  onDelete: () => void;
}

const Header = (props: Props) => {
  const [search, setSearch] = useState("");
  const [hidePredictions, setHidePredictions] = useState(false);

  const { placesService, placePredictions, getPlacePredictions } = usePlacesAutocompleteService({
    apiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY,
    //@ts-ignore
    options: {
      componentRestrictions: { country: "fr" },
    },
  });

  const onPlaceSelected = (id: string) => {
    placesService?.getDetails({ placeId: id }, (placeDetails) => {
      if (placeDetails) {
        props.onSelectPlace(placeDetails);
        setHidePredictions(true);
        setSearch("");
      }
    });
  };

  useEffect(() => {
    if (search) {
      getPlacePredictions({ input: search });
      if (hidePredictions) setHidePredictions(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <Row className={cls(styles.container, "gx-0")}>
      <Col xs="8">
        <Input
          id="search-location-input"
          placeholder="Écrire l'adresse du lieu à ajouter"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          icon="search-outline"
          className={styles.input}
        />
        {!!(!hidePredictions && placePredictions?.length) && (
          <div className={styles.suggestions}>
            {placePredictions.slice(0, 5).map((p, i) => (
              <button
                key={i}
                onClick={(e: any) => {
                  e.preventDefault();
                  onPlaceSelected(p.place_id);
                }}
                className={styles.btn}
              >
                <EVAIcon name="pin-outline" fill="black" size={20} className="me-2" />
                {p.description}
              </button>
            ))}
          </div>
        )}
      </Col>

      <Col className="text-end">
        <Button
          priority="tertiary"
          evaIcon="trash-2-outline"
          onClick={(e: any) => {
            e.preventDefault();
            props.onDelete();
          }}
          className={styles.btn}
        />
      </Col>
    </Row>
  );
};

export default Header;
