import type React from "react";
import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import Input from "~/components/Pages/dispositif/Input";
import Button from "~/components/UI/Button";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { cn } from "~/lib/classname";
import styles from "./Header.module.scss";

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
  };
}

interface Props {
  onSelectPlace: (place: NominatimResult | null) => void;
  onDelete: () => void;
  className?: string;
}

const Header = (props: Props) => {
  const [search, setSearch] = useState("");
  const [hidePredictions, setHidePredictions] = useState(false);
  const [placePredictions, setPlacePredictions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchOpenStreetMap = async (query: string) => {
    if (!query) {
      setPlacePredictions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Using Nominatim API with France as the country code
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=fr&limit=5`,
        {
          headers: {
            "Accept-Language": "fr", // Get results in French
            "User-Agent": "refugies.info", // Required by Nominatim usage policy
          },
        },
      );

      if (response.ok) {
        const data: NominatimResult[] = await response.json();
        setPlacePredictions(data);
      } else {
        // Handle error silently
        setPlacePredictions([]);
      }
    } catch (error) {
      // Handle error silently
      setPlacePredictions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaceSelected = (place: NominatimResult) => {
    props.onSelectPlace(place);
    setHidePredictions(true);
    setSearch("");
  };

  useEffect(() => {
    if (search) {
      const debounceTimer = setTimeout(() => {
        searchOpenStreetMap(search);
        if (hidePredictions) setHidePredictions(false);
      }, 300); // Debounce to avoid too many requests

      return () => clearTimeout(debounceTimer);
    }

    setPlacePredictions([]);
    return undefined;
  }, [search, hidePredictions]);

  return (
    <Row className={cn(styles.container, "gx-0", props.className)}>
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
            {isLoading ? (
              <div className="p-2 text-center">Recherche en cours...</div>
            ) : (
              placePredictions.map((p) => (
                <button
                  key={p.place_id}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    onPlaceSelected(p);
                  }}
                  className={styles.btn}
                >
                  <EVAIcon name="pin-outline" fill="black" size={20} className="me-2" />
                  {p.display_name}
                </button>
              ))
            )}
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
