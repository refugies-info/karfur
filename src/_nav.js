export default {
  items: [
    {
      name: 'Forms',
      url: '/base/forms',
      icon: 'icon-puzzle',
    },
    {
      name: 'Pages',
      url: '/pages',
      icon: 'icon-star',
      children: [
        {
          name: 'Login',
          url: '/login',
          icon: 'icon-star',
        },
        {
          name: 'Register',
          url: '/register',
          icon: 'icon-star',
        },
        {
          name: 'Error 404',
          url: '/404',
          icon: 'icon-star',
        },
        {
          name: 'Error 500',
          url: '/500',
          icon: 'icon-star',
        },
      ],
    },
    {
      name: 'Site de la DiAiR',
      url: 'https://accueil-integration-refugies.fr',
      icon: 'icon-layers',
      variant: 'danger',
      attributes: { target: '_blank', rel: "noopener" },
    },
  ],
};
