export const languages = [
  {
    name: 'Anglais',
    code: 'gb',
    avancement: .8,
    nbParticipants:4,
    premiere_image: Math.floor(Math.random() * Math.floor(15))
  },
  {
    name: 'Espagnol',
    code: 'es',
    avancement: .7,
    nbParticipants:3,
    premiere_image: Math.floor(Math.random() * Math.floor(15))
  },
  {
    name: 'Arabe',
    code: 'ma',
    avancement: .55,
    nbParticipants:1,
    premiere_image: Math.floor(Math.random() * Math.floor(15))
  }
]

export const past_translation = [
  {
    name: 'Anglais',
    code: 'gb',
    titre: 'Les 3 petits cochons',
    statut: 'Validée'
  },
  {
    name: 'Anglais',
    code: 'gb',
    titre: 'Blanche neige et les 7 nains',
    statut: 'En attente'
  },
  {
    name: 'Espagnol',
    code: 'es',
    titre: 'Les 3 petits cochons',
    statut: 'En cours'
  },
  {
    name: 'Espagnol',
    code: 'es',
    titre: 'Les chiens aboient quand la caravane passe',
    statut: 'Annulée'
  }
]

export const steps = [
  {
    content: 'Commençons ensemble la visite !',
    placement: 'center',
    locale: { 
      skip: 'Passer',
      next: 'Suivant'
    },
    target: 'body',
  },
  {
    title: 'Ma photo',
    content: 'Ici je peux éditer ma photo de profil et changer l\'image que reçoivent de moi les autres traducteurs',
    placement: 'bottom',
    target: '.profile-header-container',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédant'
    },
  },
  {
    title: 'Ma progression',
    content: 'Je peux me définir mes propres objectifs que j\'essaie de tenir tous les jour',
    placement: 'left',
    target: '.my-target-widget',
    locale: { 
      skip: 'Passer',
      next: 'Suivant',
      back : 'Précédant',
      last : 'Terminer'
    },
  }
]