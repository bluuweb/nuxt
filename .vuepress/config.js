module.exports = {
  title: 'Nuxt',
  description: 'Aprende a utilizar Nuxt en tus proyectos web',
  base: '/nuxt/',
  locales:{
    '/':{
      lang: 'es-ES'
    }
  },
  themeConfig:{
    nav: [
      { text: 'Guía', link: '/' },
      // { text: 'Guia', link: '/docs/' },
      { text: 'Youtube', link: 'https://youtube.com/bluuweb' },
    ],
    sidebar:
      [
        '/',
        '/vuex/',
        '/practica-1/'
      ]
  }
 
}