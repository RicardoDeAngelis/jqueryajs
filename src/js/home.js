// Esto es Ajax con Jquery sirve para traer datos externos de una API
// Esto es XMLHttpRequest
// el signo pesos significa variable globa
// $.ajax('https://randomuser.me/api/',{
//   // method indica que este metodo GET traera algun dato
// method:'GET',
// // esta funcion se llamara cuando todo  este ok
// success:function(data){
//   console.log(data)
//
// },
// // esata funcion se llama en caso de error
// error:function(error){
//   console.log(error)
// }
//
// })


// Funcion de js para traer datos se llama fetch(vainilla js)
// fetch devuelve una promesa

//fetch('https://swapi.co/api/people/2/')
// fetch('https://randomuser.me/api/')
// .then(function(response){
// // console.log(response)
// return response.json()
//
// })
// // promesas encadenadas
// .then(function(user){
// console.log('user',user.results[0].name.first)
//
// })
// .catch(function(){
//   console.log('algo falló')
// });
// este punto y coma sirve para ejecutar promesas separadas
// par especificar una funcion asincronas siempre utilizamos async
// y para hacer esperar las peticiones de una API utilizamos await

(async function load(){
  // generos:action,terror,animation.
// esta funcion devolvera una promesa
async function getData(url){
  const response=await fetch(url)
  const data=await response.json()
  if (data.data.movie_count>0){
      return data; //aca termina la funcion si hay pelis
  }
  // aca continua la funcion si no hay pelis
  throw new Error('No se encontro ningun resultado');
}
// la busqueda de la pelicula se hace antes de cargar todas las pelis para poder tener dnd buscar
const $form=document.getElementById('form');
const $home=document.getElementById('home');
const $featuringContainer=document.getElementById('featuring');
// usamos arrowfuntion()=>{}
function setAttributes($element,attributes){
  for(const attribute in attributes){
    $element.setAttribute(attribute,attributes[attribute]);
  }

}
const BASE_API='https://yts.lt/api/v2/';

function featureTemplate(peli){
  return(
    `  <div class="featuring">
      <div class="featuring-image">
        <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
      </div>
      <div class="featuring-content">
        <p class="featuring-title">Pelicula encontrada</p>
        <p class="featuring-album">${peli.title}</p>
      </div>
    </div>`
  )
}

$form.addEventListener('submit',async(event)=>{
//event.preventDefault(); este metodo evita recargar la pagina completamente
// si no ponemos esta funcion js nos recargara toda la pagina por defecto
event.preventDefault();
$home.classList.add('search-active')
const $loader=document.createElement('img');
setAttributes($loader,{
  src:'src/images/loader.gif',
  height:50,
  width:50,
})
$featuringContainer.append($loader);

const data =new FormData($form);
// desestructuracion de objetos
try{
  const {
    data:{
      movies:pelis
    }
  }=await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
  const HTMLString= featureTemplate(pelis[0]);
  $featuringContainer.innerHTML=HTMLString;

}catch(error){
  alert(error.message);
  $loader.remove();
  $home.classList.remove('search-active');
}

})

  // creacion de templetes,un templete nos trae datos del servidor
  // templetes literals (dinamicos) usan variables dinamiscas repesentadas por $
// funcion para templates unicamente
  function videoItemTemplate(movie,category){
    return(`<div class="primaryPlaylistItem" data-id="${movie.id}"data-category=${category}>
      <div class="primaryPlaylistItem-image">
        <img src="${movie.medium_cover_image}">
      </div>
      <h4 class="primaryPlaylistItem-title">
        ${movie.title}
      </h4>
    </div>`
  )
  }

  function createTemplate(HTMLString){

  const html= document.implementation.createHTMLDocument();
  // al inner se le pasan textos por ejemplo pasamos un template string
  html.body.innerHTML=HTMLString;
  return html.body.children[0];
  }
  //arrow funcion para escuchar un click
  function addEventClick($element){
    $element.addEventListener('click',()=>{
      // alert('click')
      showModal($element)
    })
  }
  // console.log(videoItemTemplate('src/images/covers/bitcoin.jpg','bitcoin'));
  // aca colocaremos las peliculas(imagenes nombres) en el navegador en el dom
// fucncion para imprimir los elementos en pantallas en el navegador
  function renderMovieList(list,$container,category){
    // actionList.data.movies.
    // el $container elimina el simbolo de carga una vez cargadas las pelis

      $container.children[0].remove();
      list.forEach((movie)=>{
      // esta cosnt me creara el templates de la peli
      const HTMLString=videoItemTemplate(movie,category);
      // funcion para crear el HTML
      const movieElement=createTemplate(HTMLString);
      // imprimir en el dom html, children nos devuelve un array
      $container.append(movieElement);
      //agregando efecto a las imagenes de las pelis aparicion suave
      const image=movieElement.querySelector('img');
      image.addEventListener('load',(event)=>{
        event.srcElement.classList.add('fadeIn');
      })

      addEventClick(movieElement);
      // console.log(HTMLString); mostrar en consola HTMLString
    })
  }



  // iteracion dentro de la lista de peliculas

  // de esta manera devovlera una promesa
//   let terrorList;
//   getData('https://yts.lt/api/v2/list_movies.json?genra=terror')
//     .then(function(data){
// terrorList=data;
//     })
  // console.log(actionList,dramaList,animationList);
  // Selectores en jQuery se identifica con un signo $ y es un elemnto del DOM
  // const $home=$('.home .list #item');


  // de esta manera con async await
  //selectores en js
  // funcion para ver si hay cache o no hay
  async function cacheExist(category){
    const listName=`${category}List`;//${}representa una variable dinamimca
    const cacheList=window.localStorage.getItem(listName);
    if(cacheList){
      return JSON.parse(cacheList);
    }
    const{data:{movies:data}}=await getData(`${BASE_API}list_movies.json?genre=${category}`)
    window.localStorage.setItem(listName,JSON.stringify(data))
    return data;

  }
  // const {data:{movies:actionList}}=await getData(`${BASE_API}list_movies.json?genre=action`)
  const actionList=await cacheExist('action');
  // creando cache con localStorage
  // window.localStorage.setItem('actionList',JSON.stringify(actionList))
  const $actionContainer=document.querySelector('#action');
  renderMovieList(actionList,$actionContainer,'action');

  // const {data:{movies:dramaList}}=await getData(`${BASE_API}list_movies.json?genre=drama`)
  // window.localStorage.setItem('dramaList',JSON.stringify(dramaList))
  const dramaList=await cacheExist('drama');
  const $dramaContainer=document.getElementById('drama');
  renderMovieList(dramaList,$dramaContainer,'drama');

  // const {data:{movies:animationList}}=await getData(`${BASE_API}list_movies.json?genre=animation`)
  // window.localStorage.setItem('animationList',JSON.stringify(animationList))
  const animationList=await cacheExist('animation');
  const $animationContainer=document.getElementById('animation');
  renderMovieList(animationList,$animationContainer,'animation');

  const $overlay=document.getElementById('overlay')
  const $modal=document.getElementById('modal');
  const $hideModal=document.getElementById('hide-modal');


  const $modalTitle=$modal.querySelector('h1')
  const $modalImage=$modal.querySelector('img')
  const $modalDescription=$modal.querySelector('p');

  // funcion para manipular la busqueda en la lista de las pelicular
  function findById(list,id){
  return  list.find (movie=> movie.id === parseInt(id,10))
  }

  function findMovie(id,category){
    switch(category){
      case 'action':{
      return  findById(actionList,id)

      }
      case'drama':{
      return  findById(dramaList,id)
      }
      default:{
      return  findById(animetionList,id)
      }
    }

    // filtrado cxon arrow function
      // el === compara que el tipo de dato sea el mismo
     // y el dato en si tambien lo sea,el == solo compara el valor del elemnto superficialemmte
    }

// funcion para manipular clases css y poner y quitar modal
  function showModal($element){
    $overlay.classList.add('active');
    $modal.style.animation='modalIn.8s forwards';
    const id=$element.dataset.id;
    const category=$element.dataset.category;
    const data= findMovie(id,category);
  // debugger

     $modalTitle.textContent=data.title;
     $modalImage.setAttribute('src',data.medium_cover_image);
     $modalDescription.textContent=data.description_full;
  }
  $hideModal.addEventListener('click',hideModal);
  function hideModal(){
    $overlay.classList.remove('active');
    $modal.style.animation='modalOut.8s forwards';
  }


})()
