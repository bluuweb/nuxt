# Vuex en Nuxt.js

Para utilizar vuex en Nuxt existen algunas diferencias con las aplicaciones de Vue.js, aquí explicaremos paso a paso como podrías utilizar la tienda en Nuxt.js

## Primeros pasos

Comenzamos creando el archivo `index.js` dentro de la carpeta store `(store/index.js)`:

``` js
export const state = () => ({
  counter: 0
})

export const mutations = {
  increment (state) {
    state.counter++
  }
}

export const actions = {
  acciones({commit}){
    // Acciónes en vuex
  }
}
```

La diferencia con Vue.js es que exportamos todas las constantes y state es igual a una función de flecha sin parámetros.

## fetch
Para poder llenar la tienda se utiliza generalmente el método `fetch`, este es similar a asyncData exepto que no establece datos al componente, veremos un ejemplo en la práctica con firebase.

``` js
<script>
export default {
  fetch ({ store, params }) {
    return axios.get('http://my-api/stars')
    .then((res) => {
      store.commit('setStars', res.data)
    })
  }
}
</script>
```

## Acción nuxtServerInit
Si la acción `nuxtServerInit` está definida en la tienda, Nuxt.js lo llamará con el contexto (solo desde el lado del servidor). Es útil cuando tenemos algunos datos en el servidor que queremos proporcionar directamente al lado del cliente. También veremos un ejemplo en la siguiente sección con firebase.

``` js
actions: {
  nuxtServerInit ({ commit }, { req }) {
    if (req.session.user) {
      commit('user', req.session.user)
    }
  }
}
```
