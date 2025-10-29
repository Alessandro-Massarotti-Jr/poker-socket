This Repository is for a scrum poker aplication Using webSockets for communication

My goal here is to create a distributed application that allow users to do a scrum poker with realtime states for better voting sessions

# backend

Node.js project using [socket.io](https://socket.io/) to create and manage websockets connections

## Develop

Run inside a container with docker:

```bash
docker compose up
```

```bash
docker compose exec backend sh
```

```sh
npm run start-dev
```


## TO DO

- [] Transform into a distributed app (Redis for database and Rabbit to send Messages to other sockets?)
- [] Add error trancing (Maybe Sentry?)
- [] Add a data mapper for Room entity to Json (This is to return correct data to to diferent clients from the same base entity returned by usecases)
- [] Add Otel (Open telemetry) and export the data to some place (Jaegger, Grafana, ...)
- [] improve DDD, add base entities, work more with event domains and agregattes, use more value objects

# frontend

A interface created using [Angular](https://angular.dev/) with [tailwindcss](https://tailwindcss.com/)

Using [socket.io](https://socket.io/) to connect with the websocket server

Used icons is from the [phosphoricons](https://phosphoricons.com/) library

## Develop

Run inside a container with docker:

```bash
docker compose up
```


```bash
docker compose exec frontend sh
```

```sh
npm run start
```


## TO DO

- [] add unit tests
- [] improve system architecture



<br>

---

Developed by [Alessandro Massarotti Jr](https://github.com/alessandro-massarotti-jr) 🤖
