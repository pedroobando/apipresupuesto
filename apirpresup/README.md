# apipresupuesto

## Description

Lee una base de datos de Microsoft Access 2007 -

## La base de datos

```bash
  # Microsoft Access 2007

  Las tablas que se encuentran en la base de datos.

  - Cuenta: Contiene las cuentas del presupuesto
  - Modificaciones: Modificaciones, reformulaciones y traslados de partida
  - Comprometido: Son la planificiacion del presupuesto a cancelar
  - Causado: El comprometido, ya fue asignado a un ente o individuo, esperando por pago.
  - Pagado: Es la cancelacion del causado, mediante un instrumento de pago.
  - Usuario: Usuario como lo indica.

  Nombre: PresupuestoData2013.accdb
```

## rutas

```bash
  Entrega el presupuesto
  http:localhost:4000/api/presupuesto/cuenta/:year
```

```bash
  Entrega las modificaciones
  http:localhost:4000/api/presupuesto/modificado/:year
```

```bash
  Entrega el comprometido
  http:localhost:4000/api/presupuesto/compromiso/:year
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
