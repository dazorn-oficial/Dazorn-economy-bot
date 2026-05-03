<div align="center">
  <h1>💸 Dazorn Economy Bot</h1>
  <p>Un bot de economía completo y modular construido con <a href="https://discord.js.org/">Discord.js v14</a>.</p>
  
  [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
  [![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue.svg)](https://discord.js.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16.9.0-green.svg)](https://nodejs.org/)
  
  <p>
    <a href="#-características">Características</a> •
    <a href="#-instalación">Instalación</a> •
    <a href="#-uso-y-configuración">Configuración</a> •
    <a href="#-comandos">Comandos</a> •
    <a href="#-estructura-del-proyecto">Estructura</a> •
    <a href="#-contribución">Contribución</a>
  </p>
</div>

---

## ✨ Características

* **Sistema de Economía Base:** Comandos de balance, trabajo (`work`), recompensa diaria (`daily`) y transferencias (`pay`).
* **Tienda y Objetos:** Los usuarios pueden ver la tienda, comprar objetos y revisar su inventario.
* **Top Global:** Sistema de tabla de posiciones (Leaderboard) para fomentar la competencia sana.
* **Administración Sencilla:** Comandos protegidos para gestionar la economía y añadir objetos a la tienda (`addmoney`, `removemoney`, `setmoney`, `additem`).
* **Soporte Dual de Comandos:** Soporta tanto comandos Slash (`/`) como comandos de prefijo clásicos (`!`).
* **Datos en JSON Local:** No requiere instalar bases de datos externas como MongoDB o MySQL. Todos los datos se almacenan y son fácilmente editables desde archivos JSON.

## 🚀 Instalación

Sigue estos pasos para instalar y ejecutar el bot en tu propio entorno:

1. **Clona el repositorio**
   ```bash
   gh repo clone dazorn-oficial/Dazorn-economy-bot
   cd Dazorn-economy-bot
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura el entorno**
   Crea un archivo `.env` en la raíz del proyecto y añade la siguiente información:
   ```env
   TOKEN=TU_TOKEN_DEL_BOT
   CLIENT_ID=ID_DE_LA_APLICACION_DEL_BOT
   GUILD_ID=ID_DE_TU_SERVIDOR
   PREFIX=!
   USE_SLASH=true
   USE_PREFIX=true
   ```

4. **Inicia el bot**
   ```bash
   npm start
   ```

## ⚙️ Uso y Configuración

* **Comandos Slash o Prefix:** Puedes decidir qué tipo de comandos deseas utilizar modificando las variables `USE_SLASH` y `USE_PREFIX` dentro del archivo `.env`.
* **Datos de la Economía:** Todos los datos se guardan en la carpeta `src/data/` en los archivos `users.json` y `shop.json`. Si deseas modificar la economía manualmente o crear copias de seguridad, esos son los archivos a revisar.

## 📝 Comandos

### 👤 Usuarios Normales
* `/balance` o `!balance` - Muestra tu dinero actual o el de otro usuario.
* `/daily` o `!daily` - Reclama tu recompensa diaria.
* `/work` o `!work` - Trabaja para ganar dinero extra (con tiempo de espera).
* `/pay <usuario> <cantidad>` o `!pay ...` - Transfiere dinero a otro usuario de forma segura.
* `/shop` o `!shop` - Muestra los objetos disponibles en la tienda.
* `/buy <objeto>` o `!buy ...` - Compra un objeto específico de la tienda.
* `/inventory` o `!inventory` - Muestra tu inventario de objetos.
* `/leaderboard` o `!leaderboard` - Muestra la clasificación de los usuarios más ricos.
* `/profile` o `!profile` - Muestra un resumen de tu perfil y progreso.

### 🛡️ Administradores
> **Nota:** Todos los comandos de administrador requieren que tengas permisos nativos de `Administrador` en el servidor de Discord.

* `/addmoney <usuario> <cantidad>` o `!addmoney ...` - Añade dinero al balance de un usuario.
* `/removemoney <usuario> <cantidad>` o `!removemoney ...` - Quita dinero al balance de un usuario.
* `/setmoney <usuario> <cantidad>` o `!setmoney ...` - Establece la cantidad exacta de dinero en la cuenta de un usuario.
* `/additem <nombre> <precio> <descripción>` o `!additem ...` - Añade un nuevo objeto a la tienda global.

## 📂 Estructura del Proyecto

```text
/
├── package.json
├── index.js              # Entry point del bot
├── README.md
└── src/
    ├── data/             # Almacenamiento local JSON
    │   ├── users.json
    │   └── shop.json
    ├── utils/            # Utilidades generales
    │   └── db.js         # Handler de los JSON
    └── commands/         # Módulos de comandos
        ├── slash/        # Lógica de Slash Commands (/)
        └── prefix/       # Lógica de Message Commands (!)
```

## 🤝 Contribución

¡Las contribuciones y peticiones de funcionalidades son muy bienvenidas! 
Siéntete libre de clonar el código y enviar tus Pull Requests.

## 🐛 Bugs & Sugerencias

Si encuentras errores o quieres sugerir mejoras, hemos preparado plantillas estructuradas (Issue Templates) para que sea súper fácil y organizado.

Puedes abrir un issue seleccionando la opción adecuada a continuación:
* 🐛 **[Reportar un Error (Bug)](https://github.com/dazorn-oficial/Dazorn-economy-bot/issues/new?template=bug_report.md)** — ¿Algo no funciona bien? ¡Cuéntanos!
* 💡 **[Sugerir una Funcionalidad](https://github.com/dazorn-oficial/Dazorn-economy-bot/issues/new?template=feature_request.md)** — ¿Tienes una idea increíble? Nos encantaría leerla.

👉 **[Ver todos los Issues Activos](https://github.com/dazorn-oficial/Dazorn-economy-bot/issues)**

## 💬 Contacto

Si tienes alguna duda más específica, necesitas ayuda para configurarlo, o simplemente quieres contactar conmigo para un bot personalizado, puedes hablarme por mensaje directo en Discord:

* **Discord:** `dazorn_oficial`

## ☕ Apoyo al Proyecto

Este bot se ha desarrollado con mucha dedicación y tiempo para garantizar la mejor experiencia de usuario posible y ofrecer un recurso de código abierto limpio y estructurado. Si este proyecto te ha resultado útil y deseas apoyar las horas invertidas en su creación, puedes considerar hacer una donación. 

No es obligatorio en absoluto, pero cualquier gesto es inmensamente apreciado y ayuda a mantener la motivación para futuras actualizaciones. ❤️

[<img src="https://img.shields.io/badge/Ko--fi-Apoyar_el_proyecto-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Ko-Fi" />](https://ko-fi.com/dazorn) 
[<img src="https://img.shields.io/badge/PayPal-Donar-00457C?style=for-the-badge&logo=paypal&logoColor=white" alt="PayPal" />](https://paypal.me/Danielzp24)

---
<div align="center">
  <i>"Si se puede pensar, se puede construir."</i><br>
  <b>Developed by Dazorn</b>
</div>

