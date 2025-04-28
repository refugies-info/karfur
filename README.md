# Refugies.info

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Refugies.info is a project to offer a better experience to refugees in France as per their integration and their administrative process. Refugies.info is a project financed by the DIAIR (Direction Interministérielle pour l'Accueil et l'Intégration des Réfugiés), a service of the French Ministry of Interior (Ministère de l'Intérieur).

## Table of Contents

- [Demo](#demo)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Team](#team)
- [Community](#community)
- [License](#license)
- [Maintenance](#maintenance)
- [DSFR](#dsfr)

## Demo

The website is live and available at [https://refugies.info](https://refugies.info)

## Documentation

Please find the documentation [here](documentation/README.md).

You can also visit more specifically the [frontend documentation](documentation/apps/client/README.md) or the [backend documentation](documentation/apps/server/README.md).

## Contributing

If you want to contribute, contact us to define how you can help and to set up the project.

Please read through our [contributing guidelines](https://github.com/entrepreneur-interet-general/karfur/blob/master/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and notes on development.

Editor preferences are available in the [editor config](https://github.com/entrepreneur-interet-general/karfur/blob/master/.editorconfig) for easy use in common text editors. Read more and download plugins at <http://editorconfig.org>.

## Current Team

### Nour Allazkani
**Project Manager**  
🔗 [LinkedIn](https://www.linkedin.com/in/luc-nour-allazkani/)

### Luis Arias
**CTO**  
🔗 [LinkedIn](https://www.linkedin.com/in/luisarias/)

### Margot Gillette
**Designer**  
🔗 [LinkedIn](https://www.linkedin.com/in/margot-gillette-349a028a/)

### Alice Mugnier
**Editorial Manager**  
🔗 [LinkedIn](https://www.linkedin.com/in/alice-mugnier-8a7717130/)

### Andressa Bittencourt
**Communication and Deployment Manager**  
🔗 [LinkedIn](https://www.linkedin.com/in/andressa-bittencourt-09030098/)

### Claudia Meleghi
**Content Writer**  
🔗 [LinkedIn](https://www.linkedin.com/in/claudia-meleghi/)

### Fatma Bouhejba
**Partnership Manager**  
🔗 [LinkedIn](https://www.linkedin.com/in/fatma-bouhejba-046165142/)

### Jérémie Gisserot
**Developer**  
🔗 [LinkedIn](https://www.linkedin.com/in/jeremiegisserot/)
🔗 [Website](https://jeremie-gisserot.net)

### Élise Prévot
**Product Manager**  
🔗 [LinkedIn](https://www.linkedin.com/in/eliseprevot/)

### Matthieu Fesselier
**Developer**  
🔗 [LinkedIn](https://www.linkedin.com/in/matthieu-fesselier/)

### Xavier Dumas
**Support Manager & Content Writer**  
🔗 [LinkedIn](https://www.linkedin.com/in/xavier-dumas/)




## Previous team

**Marianne Georges**
**Product Manager**  
🔗 [LinkedIn](https://www.linkedin.com/in/mariannegeorges/)

**Hugo Stephan**, Designer
🔗 [Website](https://hugostephan.com)

**Agathe Kieny** developper

**Soufiane Lamrissi**, web developer

- <https://github.com/Tony4469>
- <https://www.linkedin.com/in/soufiane-lamrissi-15b79261/>
- <https://x.com/Wriri>

**Emily Reese**, content designer

- <https://www.linkedin.com/in/eclairereese>
- <https://github.com/emilyreese>
- <https://x.com/eclairereese>

**Luca Mazzi** developper

**Chloé Vermeulin**, computer graphics designer

- <https://www.linkedin.com/in/chlo%C3%A9-vermeulin-a3773069>

## Community

Get updates on Refugies.info's development and chat with the project maintainers and community members.

- Join us and subscribe to our [Mighty Network](https://refugies-info.mn.co).
- Checkout our [help center](https://help.refugies.info/fr/).

## License

Copyright 2019 DIAIR. Code released under [the MIT license](https://github.com/entrepreneur-interet-general/karfur/blob/master/LICENSE.md).

All the [Streamline Icons](https://streamlineicons.com/) are copyrighted and the property of Webalys LLC and can be used only in the context of this particuliar open source project. We - [Délégétation interministérielle à l’accueil et l’intégration des réfugiés](https://accueil-integration-refugies.fr/) own a premium license authorizing us to use up to 100 icons on our websites. More information can be found [here](https://www.notion.so/Premium-License-19ab1e1b9ebb4244b4a4e5c0062d4443).

## Maintenance

The project is actively maintained at least until the end of 2022 by the DIAIR, in the French Ministry of Interior.

## Support Refugies.info's Development

Refugies.info is an MIT licensed open source project and completely free to use. However, we are a small team . You can support development by offering :

- data science services
- translation services
- design services (UX/UI)
- contacts of associations working with refugees, or contact of refugees directly with their agreement

## DSFR
This project uses the React DSFR packagage alongside the tailwind library.

### Patch layer for DSFR and tailwind compatibility
By default the DSFR don't support layered css declarations and puts the whole css at the root of css workspace.
To tackle this issue we use a pnpm patch methodology to fix and enclose the whole DSFR css inside a DSFR css layer.
It allows tailwind to do it's magic wouthout any trouble.

Sometimes the react DSFR lib is updated, when it happens you need to update the patch.

When you know how to do it's actually quite easy to do, just follow this guide :
- on your terminal execute : **pnpm patch @codegouvfr/react-dsfr@[current-dsfr-version-number]** (don't forget to change the version number)
- got to node_modules/.pnpm_patches/@codegouvfr/react-dsfr@[current-dsfr-version-number]/dsfr/dsfr.min.css
- add **@layer dsfr {** before the first css selector
- add a **}** at the end of the file
- execute pnpm patch-commit ‘./node_modules/.pnpm_patches/@codegouvfr/react-dsfr@[current-dsfr-version-number]'
- if you got wierd issues (ex: overidden tailwind classes) it means something when wrong, all the dsfr classes must be enclosed inside a dsfr layer, delete your patch and retry

### DSFR tokens and tailwind
To allow the usage of the design system tokens inside tailwind you can take a look at the packages/ui readme, there is a specific script to sync all the colors definitions to tailwind V4 @utility classes.

## Extras

# If you liked this project, please give it a ⭐ in [**GitHub**](https://github.com/entrepreneur-interet-general/karfur).
