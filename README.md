# Todo App — DevOps CI/CD

Aplicacion web de lista de tareas. El proyecto cubre el ciclo completo de DevOps: desarrollo local, pruebas unitarias, contenedorizacion con Docker y despliegue automatico en produccion mediante GitHub Actions.

---

## Objetivo

Este proyecto cumple con:

1. Crear una aplicación web To Do List
2. Implementar pruebas unitarias
3. Crear un Dockerfile para ejecutar la aplicación
4. Configurar CI/CD que:

   * Instala dependencias
   * Ejecuta pruebas
   * Publica imagen en Docker Hub
   * Despliega en producción (Render)

---

## Requisitos

* Node.js 18+
* Docker
* Git
* Cuentas en GitHub, Docker Hub y Render

---

## Ejecución local

```bash
npm install
npm run dev
```

Abrir en: http://localhost:3000

---

## Pruebas

```bash
npm test
```

Valida los endpoints CRUD de la aplicación.

---

## Docker

```bash
docker build -t todo-devops .
docker run -p 3000:3000 todo-devops
```

---

## CI/CD (GitHub Actions)

Se ejecuta automáticamente al hacer push.

### Pipeline:

1. Instala dependencias
2. Ejecuta pruebas
3. Construye imagen Docker
4. Publica en Docker Hub
5. Despliega en Render

---

## Variables de entorno (Secrets)

Configurar en GitHub:

```
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
RENDER_DEPLOY_HOOK
```

---

## API

Base URL: http://localhost:3000

| Método | Ruta           |
| ------ | -------------- |
| GET    | /health        |
| GET    | /api/tasks     |
| POST   | /api/tasks     |
| PUT    | /api/tasks/:id |
| DELETE | /api/tasks/:id |

---

## Despliegue

* Docker Hub: almacenamiento de imagen
* Render: publicación de la aplicación

---

## Comandos útiles

```bash
npm run dev
npm test

docker build -t todo-devops .
docker run -p 3000:3000 todo-devops

git add .
git commit -m "update"
git push
```

---

## Resultado

En cada push:

* Se ejecutan pruebas
* Se construye la imagen Docker
* Se publica en Docker Hub
* Se despliega automáticamente en producción
