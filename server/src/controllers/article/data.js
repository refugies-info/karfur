const sanitizeOptions = {
  allowedTags: [
    "div",
    "p",
    "strong",
    "em",
    "u",
    "span",
    "b",
    "ul",
    "li",
    "figure",
    "a", //Les principaux qui sont effectivement utilisés
    "i",
    "br",
    "blockquote",
    "ol",
    "img",
  ], //des secondaires qu'on peut autoriser sans trop de risque
  allowedAttributes: {
    a: ["href", "name", "target", "class"],
    "*": ["class"],
    img: ["src"],
  },
};

exports.sanitizeOptions = sanitizeOptions;
