/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */
//import fetch from 'node-fetch'
const path = require("path");
const fetch = require("node-fetch");
const FormData = require("form-data");
const Path = require('path');
// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});
const fastifyEnv = require('@fastify/env')
const schema = {
  type: 'object',
  required: [ 'PORT' ],
  properties: {
    PORT: {
      type: 'string',
      default: 3000
    }
  }
}

const options = {
  confKey: 'config', // optional, default: 'config'
  schema: schema,
  dotenv: true
}

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});
const viewsPath = Path.resolve(__dirname, 'src', 'pages');
// fastify-formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
  options: {
    partials:{
      navbar: "\\src\\pages\\partials\\navbar.hbs"
    }
  }
 
  
});


fastify.register(fastifyEnv, options)

const seo = require("./src/seo.json");
if (seo.url === "localhost") {
  seo.url = `http://localhost:8000`;
}
async function sensor(){
  try {
      /*let data = {"nombreProducto":'ensalada de palta',
                  "precio":null,
                  "imagenProducto":null,
                  "tipoProducto":1};*/
      const response = await fetch(
        "http://192.168.1.13:8000/regador/sensor/",
        {
        method: "GET",
        headers: { "Content-Type": "application/json" }/*,
        body: JSON.stringify(data)*/
        }
      );
  
      const respuesta = await response.json();
      //console.log(respuesta);
      return respuesta;
  } catch (error) {
      console.log(error);
  }
}
async function obtenerFoto(){
  try {
      /*let data = {"nombreProducto":'ensalada de palta',
                  "precio":null,
                  "imagenProducto":null,
                  "tipoProducto":1};*/
      const response = await fetch(
        "http://192.168.1.13:8000/regador/capturarFoto/",
        {
        method: "GET",
        headers: { "Content-Type": "application/json" }/*,
        body: JSON.stringify(data)*/
        }
      );
  
      const respuesta = await response.json();
      //console.log(respuesta);
      return respuesta;
  } catch (error) {
      console.log(error);
  }
}

async function regar(){
  try {
      /*let data = {"nombreProducto":'ensalada de palta',
                  "precio":null,
                  "imagenProducto":null,
                  "tipoProducto":1};*/
      const response = await fetch(
        "http://192.168.1.13:8000/regador/activar/",
        {
        method: "GET",
        headers: { "Content-Type": "application/json" }/*,
        body: JSON.stringify(data)*/
        }
      );
  
      const respuesta = await response.json();
      //console.log(respuesta);
      return respuesta;
  } catch (error) {
      console.log(error);
  }
}
fastify.get("/activar", async function (request, reply) {
  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Methods", "GET");
  
  data = await regar();
  //console.log(data);
  reply
    .code(200)
    .headers({'Content-Type': 'application/json',"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods":"GET"})
    .send(data)
});
fastify.get("/dataSensor", async function (request, reply) {
  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Methods", "GET");
  
  data = await sensor();
  //console.log(data);
  reply
    .code(200)
    .headers({'Content-Type': 'application/json',"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods":"GET"})
    .send(data)
});
fastify.get("/getFoto", async function (request, reply) {
  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Methods", "GET");
  
  data = await obtenerFoto();
  //console.log(data);
  reply
    .code(200)
    .headers({'Content-Type': 'application/json',"Access-Control-Allow-Origin": "*","Access-Control-Allow-Methods":"GET"})
    .send(data)
});

fastify.get("/", async function (request, reply) {
  return reply.view("/src/pages/index.hbs");
});

fastify.get("/foto", async function (request, reply) {
  return reply.view("/src/pages/foto.hbs");
});
/*fastify.get("/generarCarta", async function (request, reply) {
  let params = { seo: seo,data :data};
  return reply.view("/src/pages/generadorCarta.hbs",params);
});*/
fastify.listen({port:8001,host:"0.0.0.0"}, function (err,address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
  fastify.log.info(`server listening on ${address}`);
});
