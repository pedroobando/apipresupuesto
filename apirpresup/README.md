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
  Entrega el causado
  http:localhost:4000/api/presupuesto/causado/:year
```

```bash
  Entrega el pagado
  http:localhost:4000/api/presupuesto/pagado/:year
```

## kill process active - otra informacion

```bash
# Primero, querrá saber qué proceso está utilizando el puerto 3000
$ sudo lsof -i :3000

# Esto enumerará todos los PID que escuchan en este puerto, una vez que tenga el PID puede terminarlo:
$ kill -9 {PID}
```

## License

Pedro Obando is [MIT licensed](LICENSE).
