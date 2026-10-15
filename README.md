# Al Día · tu kanban como app

Esta carpeta trae Al Día lista para instalar en el celular y en el computador, con tus tareas sincronizadas entre ambos.

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app |
| `config.js` | Donde pegas los datos de tu proyecto de Supabase |
| `manifest.webmanifest` | Nombre, ícono, colores y atajos de la app instalada |
| `sw.js` | Hace que abra al instante y funcione sin conexión |
| `supabase.sql` | Crea la tabla de tareas en Supabase |
| `icons/` | Íconos de la app y de los atajos |

Son unos 20 minutos en total, todo gratis.

---

## 1. Crear el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) → **New project**. Nombre: `al-dia`. Región: **South America (São Paulo)**, la más cercana a Santiago. Guarda la contraseña de la base de datos en un lugar seguro.
2. Cuando termine de crearse, abre **SQL Editor** → **New query**, pega todo el contenido de `supabase.sql` y presiona **Run**.
   Si pegarlo todo junto falla (pasa a veces desde el celular), corre los 4 bloques del archivo por separado, en orden.

## 2. Crear tu usuario y cerrar el registro

1. **Authentication → Users → Add user → Create new user**: tu correo y una contraseña. Marca **Auto Confirm User**.
2. En **Authentication → Sign In / Providers** (o **Providers → Email**, según la versión), desactiva **Allow new users to sign up**. Así nadie más puede crearse una cuenta en tu app.

## 3. Conectar la app

1. En **Project Settings → API Keys** (o **Data API**) copia la **Project URL** y la clave pública: **anon public** o **publishable**.
2. Abre `config.js` con cualquier editor de texto y pégalas entre las comillas:

```js
window.AL_DIA_CONFIG = {
  supabaseUrl: 'https://tu-proyecto.supabase.co',
  supabaseAnonKey: 'tu-clave-publica',
};
```

La clave pública puede quedar a la vista: tus tareas las protegen las reglas que creó `supabase.sql`, que solo dejan ver y cambiar las filas de tu usuario. **Nunca** pegues la clave `service_role` o `secret`.

## 4. Publicarla gratis en GitHub Pages

1. En [github.com](https://github.com) → **New repository** → nombre `al-dia` → **Public** → **Create repository**.
2. Toca **uploading an existing file** y arrastra todo el contenido de esta carpeta, incluida la carpeta `icons`. Luego **Commit changes**.
3. **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main** y **/(root)** → **Save**.
4. En uno o dos minutos queda en `https://TU-USUARIO.github.io/al-dia/`.

El repositorio gratis de GitHub Pages es público: se ve el código de la app, pero no tus tareas.

## 5. Instalarla

- **Android (Chrome):** abre el enlace y toca **Instalar app** (el botón amarillo de la app o el aviso de Chrome; también está en el menú ⋮). Queda en el cajón de apps con su ícono.
- **iPhone (Safari):** abre el enlace → **Compartir** → **Agregar a inicio**.
- **Computador (Chrome o Edge):** el ícono de instalar en la barra de direcciones, o el botón **Instalar app**.

La primera vez inicia sesión con el usuario del paso 2 y permite la ubicación para ver el clima de donde estés.

---

## En el día a día

- **Atajos del ícono (Android):** mantén presionado el ícono para ir directo a *Nueva tarea*, *Personal*, *Profesional* u *Ocio*.
- **Compartir hacia Al Día (Android, con la app instalada):** desde WhatsApp, el correo o el navegador toca **Compartir → Al Día** y el texto llega listo para anotar.
- **Sin conexión:** puedes seguir trabajando. Arriba verás "Sin conexión · N por subir", y los cambios se suben solos cuando vuelve la señal.
- **Clima:** toca la franja del clima para actualizarla. En **Ajustes** eliges entre tu ubicación o una ciudad fija.
- **Tu nombre en el saludo:** Ajustes → Tu nombre. Se sincroniza entre tus dispositivos.

## Actualizar la app

Si cambias algún archivo, súbelo de nuevo al repositorio y además cambia en `sw.js` la línea `const CACHE = 'al-dia-v1'` a `v2`, `v3`, etc. La app toma la versión nueva la próxima vez que la abras (a veces hay que cerrarla y abrirla otra vez).

## Bueno saber

- **Probar sin Supabase:** si `config.js` queda vacío, la app funciona en "modo local" y las tareas se guardan solo en ese dispositivo.
- **Pausa por inactividad:** el plan gratis de Supabase pausa proyectos que pasan una semana sin uso. Si te pasa, entra a supabase.com y toca **Restore project**; tus datos siguen ahí.
- **Clima:** viene de [Open-Meteo](https://open-meteo.com), gratis y sin clave. El nombre de tu ciudad lo entrega BigDataCloud a partir de tu ubicación.
- **App de Android más adelante:** este mismo código se puede empaquetar como APK con Capacitor o PWABuilder, sin rehacer nada.
