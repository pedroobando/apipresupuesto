# apisalidas

## Description

Aplicacion backend de creacion de tickes de salida de materiales o equipos, lleva el control de las personas, transporte y tiempo que permanecen los equipos afuera.

## La base de datos

```bash
  # mongo local
  con solo este comando creeamos la base de datos en un contenedor.
  $ docker run --name mongodb -it -d --restart always -p 27017:27017 mongo:4.2-bionic

  # mongo
  base de datos es Mongo, la cual se ejecuta desde un contenidor Docker.
  mediante el comando,
  $ docker-compose up

  # docker-compose.yml
  Contiene la configuracion del contenedor docker y mongo,
  instala de una ves la base de datos y la aplicacion mongo-express,
  permitiendo administrar de forma grafica el servidor de base de datos.
```

## Mongodb-compass

[Mongodb-Compass](https://www.mongodb.com/products/compass) esta aplicacion nos permite conectarnos a la base de datos.

## rutas

```bash
  Usuarios
```

```bash
  Conductores
```

## Objetos Json

## kill process active

```bash
# Primero, querrá saber qué proceso está utilizando el puerto 3000
$ sudo lsof -i :3000

# Esto enumerará todos los PID que escuchan en este puerto, una vez que tenga el PID puede terminarlo:
$ kill -9 {PID}
```

## Guias Varias

[Guia Conexion serial ttl](https://ubuntuperonista.blogspot.com/2017/09/como-me-conecto-traves-de-conexion-serial-ttl-ubuntu.html), [Guia de serialport](https://github.com/node-serialport/node-serialport#readme)

## Guia de SerialPort

```bash
# Muestra los puertos USB
  $ dmesg | grep tty

# Activa los permisos para lectura puerto
  $ sudo chmod a+rw /dev/ttyACM0
```

## Guia Docker

```bash
# Crear la imagen
  $ docker build -t backendsalidaimg .

# Crear el contenedor
# puerto_expuesto: puerto_interno
# -it: modo interactivo
# -d: modo deployment
  $ docker run --name backendsalida -it -d --restart always -p 4001:4000 backendsalidaimg

# Guida de node Docker
  https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

# Entrar a un contenedor
  $ docker exec -i -t contenedorId /bin/bash #
  $ docker exec -i -t contenedorId /bin/sh # <= alpine

# Extraer la base datos del contenedor
  $ docker cp contenedorId:/app/logisticadb.sqlite  .

# Copiar archivo al contenedor
  $ docker cp nombredelarchivo  contenedorId:/rutadestino
```

## License

Pedro Obando is [MIT licensed](LICENSE).
