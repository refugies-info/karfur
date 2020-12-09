import { IDispositif } from "../../types/interface";
import { ObjectId } from "mongoose";
import { departmentRegionCorrespondency } from "./data";
import _ from "lodash";

export const removeUselessContent = (dispositifArray: IDispositif[]) =>
  dispositifArray.map((dispositif) => {
    const selectZoneAction = dispositif.contenu[1].children.map(
      (child: any) => {
        if (child.title === "Zone d'action") {
          return child;
        }
        return {};
      }
    );

    const simplifiedContent = [{}, { children: selectZoneAction }];
    return { ...dispositif, contenu: simplifiedContent };
  });

export const adaptDispositifMainSponsorAndCreatorId = (
  dispositifs: IDispositif[]
) =>
  dispositifs.map((dispositif) => {
    const jsonDispositif = dispositif.toJSON();

    return {
      ...jsonDispositif,
      mainSponsor: jsonDispositif.mainSponsor
        ? {
            _id: jsonDispositif.mainSponsor._id,
            nom: jsonDispositif.mainSponsor.nom,
            status: jsonDispositif.mainSponsor.status,
            picture: jsonDispositif.mainSponsor.picture,
          }
        : "",
      creatorId: jsonDispositif.creatorId
        ? {
            username: jsonDispositif.creatorId.username,
            picture: jsonDispositif.creatorId.picture,
            _id: jsonDispositif.creatorId._id,
          }
        : null,
    };
  });

interface Result {
  _id: ObjectId;
  departement: string;
  region: string;
}
interface CorrespondingData {
  departement: string;
  region: string;
}
const getRegion = (
  correspondingData: CorrespondingData[],
  departement: string
) => {
  if (departement === "All") return "France";
  return correspondingData.length > 0
    ? correspondingData[0].region
    : "No geoloc";
};

export const adaptDispositifDepartement = (dispositifs: IDispositif[]) => {
  const result: Result[] = [];

  dispositifs.map((dispositif) => {
    const selectZoneAction = dispositif.contenu[1].children.filter(
      (child: any) => child.title === "Zone d'action"
    );

    const departements =
      selectZoneAction.length > 0
        ? selectZoneAction[0].departments
        : ["No geoloc"];

    departements.map((departement: string) => {
      const correspondingData = departmentRegionCorrespondency.filter(
        (data) => data.departement === departement
      );

      const region = getRegion(correspondingData, departement);

      return result.push({
        _id: dispositif._id,
        departement,
        region,
      });
    });

    return;
  });

  return result;
};

export const getRegionFigures = (dispositifs: Result[]) => {
  const groupedDataByRegion = _.groupBy(dispositifs, "region");
  const groupedDataByDepartment = _.groupBy(dispositifs, "departement");

  const regionArray = Object.keys(groupedDataByRegion);
  return regionArray.map((region) => {
    const correspondingData = departmentRegionCorrespondency.filter(
      (data) => data.region === region
    );
    let nbDepartmentsWithDispo = 0;
    correspondingData.map((data) => {
      if (Object.keys(groupedDataByDepartment).includes(data.departement)) {
        nbDepartmentsWithDispo++;
      }
      return;
    });
    return {
      region,
      nbDispositifs: groupedDataByRegion[region].length,
      nbDepartements: correspondingData.length,
      nbDepartmentsWithDispo,
    };
  });
};
