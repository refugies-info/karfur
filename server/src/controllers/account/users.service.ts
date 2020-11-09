import { RequestFromClient, Res } from "../../types/interface";
import User from "../../schema/schemaUser";

export const getFiguresOnUsers = async (req: RequestFromClient, res: Res) => {
  const users = await User.find({ status: "Actif" }, { roles: 1 }).populate(
    "roles"
  );
  const nbContributors = users.filter((x: any) =>
    (x.roles || []).some((y: any) => y && y.nom === "Contrib")
  ).length;
  const nbTraductors = users.filter((x: any) =>
    (x.roles || []).some((y: any) => y.nom === "Trad" || y.nom === "ExpertTrad")
  ).length;
  const nbExperts = users.filter((x: any) =>
    (x.roles || []).some((y: any) => y.nom === "ExpertTrad")
  ).length;

  res.status(200).json({
    data: {
      nbContributors,
      nbTraductors,
      nbExperts,
    },
  });
};
