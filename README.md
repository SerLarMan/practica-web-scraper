# Web Scrapper

Proyecto Web Scrapper para centrars en el scrapeo de los productos de una web.
Se conecta a una base de datos MongoDB y sube los producto a la base de datos.
Tambien se ha desarrollado un CRUD sobre el modelo Product de manera opcional.

## Instalación

Este proyecto requiere [Node.js](https://nodejs.org/) v10+ para funcionar.

Instala las dependencias y las dependencias de desarrollo.

```sh
cd practica-web-scraper
npm i
```

Para lanzar el scrapper

```sh
npm run scrape
```

Para arrancar el servidor en localhost en el puerto 3000.

```sh
npm run start
```

## Endpoints

Como esta indicado antes, esta api trabaja con el modelo Product.
A continuación se listaran las rutas y los endpoints para poder interactuar con el.

### Product

```sh
127.0.0.1:3000/products
```

| Método | Ruta | Cuerpo | Descripción |
| ------ | ------ | ------ | ------ |
| GET | / | | Obtiene todos los products |
| GET | /:id | | Obtiene el product seleccionado por la id |
| POST | / | Objeto Product | Crea un product nuevo |
| PUT | /:id | Objeto Product | Actualiza un product por su id |
| DELETE | /:id | | Borra un product por su id |

## Licencia

MIT