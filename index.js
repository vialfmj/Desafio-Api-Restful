const express= require('express')
const {Contenedor}= require('./Contenedor')
const app =express()
const port = 3000
const {Router}= express

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))

const contenedor= new Contenedor('./productos.txt')
const server =app.listen(port,()=>{
    console.log(`escuchando el puerto: ${port}`)
})
server.on('error',error=>console.log(`error en el servidor: ${error}`))

app.get('/',(req,res,next)=>{

    res.send('pagina de inicio')
})

const routerProductos = new Router()
app.use('/api/productos',routerProductos)
routerProductos.get(`/`,async(req,res,next)=>{
    respuesta= await contenedor.getAll()
    res.send(respuesta)
})
routerProductos.get('/:id',async(req,res,next)=>{
    const {id} = req.params
    respuesta= await contenedor.getElementById(Number(id))
    if(respuesta)
    res.json({respuesta: respuesta})
    else
    res.send(' no hay coincidencia')
})
routerProductos.post('/',async(req,res,next)=>{
    let producto= req.body
    respuesta= await contenedor.save(producto)
    res.json({respuesta})
})
routerProductos.delete('/:id',async(req,res,next)=>{
    let {id} = req.params
    respuesta = await contenedor.deleteById()
    res.send(`elemento ${id} ${respuesta}`)
})