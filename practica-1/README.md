# Práctica Tareas Firestore

En está práctica utilizaremos los conceptos aprendidos en la sección anterior para comprender de mejor forma como funciona vuex en Nuxt.js

## Intalación de Firebase
1. Como utilizaremos firebase para nuestra base de datos, es necesario instalar su dependencia. Para ello ejecutamos en la terminar `npm i firebase` 

::: warning Ojo piojo aquí
Recuerda instalar dentro de tu proyecto viajando con el comando `cd` a la carpeta raíz de tu proyecto de Nuxt.js
:::

2. Luego dentro de la carpeta `plugins` creamos el archivo con el nombre que desees, en este caso lo nombraremos como: `plugins/firebase.js`
**Antes de comenzar a configurar el archivo tenemos que registrarlo en `nuxt.config.js`**

``` js
  plugins: [
    '~/plugins/firebase.js'
  ],
```

3. Ahora si coloquemos nuestras credenciales dentro de `firebase.js`, de forma opcional puedes configurar Auth, y Storage.

``` js
import firebase from "firebase/app";
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");


const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  databaseURL: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {firebase, db, auth, storage}
```

## Configuración tienda (vuex)
En la carpeta `store` creamos el archivo `store/index.js` con el siguiente código:

``` js
import { db } from "@/plugins/firebase.js";

export const state = () => ({
  tareas: '',
  tarea: ''
})

export const mutations = {
  setTareas(state, payload){
    state.tareas = payload;
  },
  agregaTarea(state, payload){
    state.tareas.push(payload);
  },
  actualizarTareas(state, payload){
    const index = state.tareas.findIndex(item => item.id === payload.id);
    state.tareas[index] = payload;
  },
  eliminarTarea(state, payload){
    const index = state.tareas.findIndex(item => item.id === payload.id);
    state.tareas.splice(index, 1);
  },
  setTarea(state, payload){
    state.tarea = payload
  },
  setNombreTarea(state, payload){
    state.tarea.tarea = payload
  }
}

export const actions = {
  nuxtServerInit({commit}){  
    return db.collection("tareas").get().then(function(querySnapshot) {
      const tareas = [];
      querySnapshot.forEach(function(doc) {
          let dato = doc.data();
          dato.id = doc.id;
          tareas.push(dato)
      })
      return commit('setTareas', tareas)
    })    
  },
  async agregarTarea({commit, dispatch},payload){
    try {
      const doc = await db.collection('tareas').add({
        tarea: payload,
        fecha: new Date()
      })
      commit('agregaTarea', {tarea: payload, id: doc.id})
    } catch (error) {
      console.log(error);
    }
  },
  editarItem({commit, dispatch}, payload){
    db.collection('tareas').doc(payload.id).update({
      tarea: payload.tarea
    }).then(()=>{
      commit('actualizarTareas', payload)
      this.app.router.push('/firestore-app');
    })
  },
  borrarTarea({commit}, payload){
    db.collection("tareas").doc(payload.id).delete().then(function() {
      commit('eliminarTarea', payload)
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }
}
```

## Configuración de páginas (rutas)
Crearemos la siguiente carpeta en `pages`, `pages/firestore-app` y dentro sus correspondientes archivos para trabajar con parámetros: `pages/firestore-app/index.vue` y `pages/firestore-app/_id.vue`

### index.vue
Aquí mostraremos la lista de tareas con sus correspondientes acciones de editar y eliminar.

``` html
<template>
  <div class="container mt-5">
    <h2 class="mb-2">Agregar Tareas</h2>
    <form class="mb-5" @submit.prevent="agregarTarea(tarea); tarea = ''">
      <input type="text" placeholder="Descripcion de Tarea" class="form-control mb-2" v-model="tarea">
      <b-button type="submit">Agregar</b-button>
    </form>
    <ul>
      <li v-for="(item, index) in tareas" :key="index">
        {{item.id}} - {{item.tarea}}
        <b-button class="btn-sm btn-warning" :to='`tareas-firebase/${item.id}`'>Editar</b-button>
        <b-button class="btn-sm btn-danger" @click="borrarTarea(item)">Eliminar</b-button>
        <hr>
      </li>
    </ul>
  </div>
</template>
```

``` js
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      tarea: ''
    }
  },
  computed: {
    ...mapState(['tareas'])
  },
  methods:{
    ...mapActions(['agregarTarea', 'borrarTarea'])
  }
}
```

### _id.vue
Aquí trabajaremos directamente en el archivo que editará cada una de nuestras tareas

``` html
<template>
  <div class="container mt-5">
    <h2>Editar Tarea</h2>
    <form @submit.prevent="editarItem(tarea)">
      <input type="text" class="form-control mb-2" v-model="tarea.tarea">
      <b-button class="btn-warning" type="submit">Editar</b-button>
    </form>
  </div>
</template>
```

``` js
import { db } from "@/plugins/firebase-config.js";
import {mapActions} from 'vuex';
export default {
  fetch({params, store}){
    return db.collection('tareas').doc(params.id).get()
      .then(doc => {
        if(doc.exists){
          let tarea = doc.data();
          tarea.id = doc.id;
          return store.commit('setTarea', tarea)
        }else{
          return console.log('no se encuentra el documento...');
        }
      })
  },
  computed:{
    tarea:{
      get(){
        return {
          tarea: this.$store.state.tarea.tarea,
          id: this.$store.state.tarea.id,
          fecha: this.$store.state.tarea.fecha
        }
      },
      set(valor){
        return this.$store.commit('setNombreTarea', valor)
      }
    }
  },
  methods:{
    ...mapActions(['editarItem'])
  }
}
```

