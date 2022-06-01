import { Widget } from "types/interface";

export const generateIframe = (widget: Widget) => {
  return "<!-- Début de widget Réfugiés.info --><link href=\"https://assets.calendly.com/assets/external/widget.css\" rel=\"stylesheet\"><script src=\"https://assets.calendly.com/assets/external/widget.js\" type=\"text/javascript\" async></script><script type=\"text/javascript\">window.onload = function() { Calendly.initBadgeWidget({ url: 'https://calendly.com/diableetdetails/orsay-re-visite', color: '#0069ff', textColor: '#ffffff', branding: false }); }</script><!-- Fin de widget Réfugiés.info -->";
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
}
