const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content 
const templateCarrito = document.getElementById('template-carrito').content
const templateFooter = document.getElementById ('template-footer').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () =>{
    fetchData()
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        printCarrito()
    }
})
cards.addEventListener('click', e => {
    addCarrito(e)
})
items.addEventListener('click', e => {
    btnAction(e)
})
// Filtra Busqueda
document.addEventListener("keyup", e =>{
    if(e.target.matches("#buscador")){
        document.querySelectorAll(".col-12").forEach(pro =>{
            pro.textContent.toLowerCase().includes(e.target.value.toLowerCase())
             ?pro.classList.remove("filtro"):pro.classList.add("filtro")
        })
    }
})

//navBar
const navbar = document.querySelector(".navMain");
const logo = document.querySelector(".logo");
window.onscroll = () => {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100){
        navbar.style.height = "80px";
        navbar.style.fontSize = "10px";
        logo.classList.remove("logo-small");
    }else{
        navbar.style.height = "120px";
        navbar.style.fontSize = "14px";
        logo.classList.remove("logo-small");
    }
}

const fetchData = async ()=> {
    try {
        const res = await fetch('api.json') 
        const data = await res.json()
        printCard (data)
    } catch (error){
        console.log(error);
    }
}

//imprime en Card
const printCard = data => {
    data.forEach (producto  => {
      templateCard.querySelector('h4').textContent = producto.name
    //   templateCard.querySelector ('h7').textContent = producto.amount
      templateCard.querySelector('p').textContent = producto.price
      templateCard.querySelector('img').setAttribute("src", producto.img)
      templateCard.querySelector('.btn-dark').dataset.id = producto.id
    
      const clone = templateCard.cloneNode(true)
      fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    } 
    e.stopPropagation()
} 
const setCarrito = objeto => {
    const producto = {
        id:objeto.querySelector('.btn-dark').dataset.id,
        name: objeto.querySelector('h4').textContent,
        price: objeto.querySelector('p').textContent,
        amount: 1
    }
    // aumenta la cantidad de Carrito, si el producto ya existe aumenta la cantidad
    // console.log(producto)
    if (carrito.hasOwnProperty(producto.id)){
        producto.amount = carrito[producto.id].amount + 1
    }
   
    // Pull a Carrito
    carrito[producto.id] = { ...producto}
    printCarrito()
}

const printCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.name
        templateCarrito.querySelectorAll('td')[1].textContent = producto.amount
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.amount * producto.price
        //botones
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
       
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    printFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const printFooter = () => {
    footer.innerHTML = ''    
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'  
        compraFinal.style.display = "none"
        return
    }

    compraFinal.style.display = "block"

    moreAmount = Object.values(carrito).reduce((acc,{amount}) => acc + amount,0)
    morePrice = Object.values(carrito).reduce((acc,{amount, price}) => acc + amount * price,0)
    
    templateFooter.querySelectorAll('td')[0].textContent = moreAmount
    templateFooter.querySelector('span').textContent = morePrice
    
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const btnVaciar = document.querySelector('#vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        printCarrito()
    })
}

const btnAction = e => {
     if (e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id]
        producto.amount++
      carrito[e.target.dataset.id] = {...producto}
    printCarrito()
    }
    if (e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.amount--
        if(producto.amount === 0){
            delete carrito[e.target.dataset.id]
        }
      printCarrito()
    }
   e.stopPropagation()
}
//Cerrar compra
const closee = document.getElementById('close');
closee.addEventListener('click', () =>{
   popupCompra.style.display = "none";
   carrito = {}
   printCarrito()
},)
//Boton Comprar
const compraFinal = document.getElementById('compraFinal');
compraFinal.addEventListener('click', () =>{
    popupCompra.style.display = "block";
},)

//Menu Responsive Vertical
const botMenu = document.querySelector(".botMenu")
const nav2vert = document.querySelector(".nav2vertical")
botMenu.addEventListener('click', () =>{
    nav2vert.classList.toggle("nav-menu-visible")
})
