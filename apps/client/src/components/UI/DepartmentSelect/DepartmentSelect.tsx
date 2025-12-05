import { Select } from "@codegouvfr/react-dsfr/Select";
import { operatorsPerDepartment } from "data/agirOperators";
import type React from "react";
import { useContext, useMemo } from "react";
import { MapContext } from "~/components/UI/MapFrance/MapContext";
import { getDepartmentFromNumber } from "~/lib/departments";

const DepartmentSelect: React.FC<{ className?: string }> = ({ className }) => {
  const { selectedDepartment, setSelectedDepartment } = useContext(MapContext);

  const departmentOptions = useMemo(() => {
    const departments = Object.keys(operatorsPerDepartment).sort((a, b) => {
      const numA = Number.parseInt(a, 10);
      const numB = Number.parseInt(b, 10);
      return numA - numB;
    });

    return [
      {
        label: "Sélectionnez votre département",
        value: "",
        disabled: true as const,
      },
      ...departments.map((depNumber) => ({
        label: getDepartmentFromNumber(depNumber),
        value: depNumber,
        disabled: false as const,
      })),
    ];
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value && setSelectedDepartment) {
      setSelectedDepartment(value);
    }
  };

  return (
    <div className={className}>
      <Select
        label="Sélectionner un département"
        hint="Choisissez votre département pour voir les coordonnées de l'opérateur AGIR"
        nativeSelectProps={{
          value: selectedDepartment || "",
          onChange: handleChange,
          "aria-label": "Sélectionner un département pour afficher l'opérateur AGIR",
        }}
      >
        {departmentOptions.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default DepartmentSelect;
