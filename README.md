# 📝 KMarket

Una aplicación web para publicar, visualizar y filtrar publicaciones de usuarios registrados. Los visitantes pueden navegar por las publicaciones pero no podrán interactuar hasta que verifiquen su cuenta por correo electrónico. El curso está basado en un proyecto del curso de Node.js del profesor Juan Pablo de la Torre.

## 🚀 Características

- ✅ Registro y autenticación de usuarios
- 📧 Verificación de cuenta vía email (con tokens y SMTP)
- 📝 Publicación y visualización de posts
- 🔍 Filtros por contenido, autor y fecha
- 🎨 Estilos CSS personalizados y diseño responsivo
- 🛡️ Protección CSRF y validación de formularios
- 📦 Carga de archivos con Multer

>### Nota: Este proyecto requiere variables de entorno y ciertas dependencias adicionales para funcionar correctamente. No se publica como paquete, ya que está pensado principalmente para quienes revisen el código fuente. 

## 🛠️ Tecnologías utilizadas

| Tecnología         | Versión   | Uso principal                          |
|--------------------|-----------|----------------------------------------|
| bcrypt             | ^6.0.0    | Encriptación de contraseñas            |
| cookie-parser      | ^1.4.7    | Manejo de cookies                      |
| csurf              | ^1.11.0   | Protección contra CSRF                 |
| dotenv             | ^16.5.0   | Variables de entorno                   |
| dropzone           | ^5.9.3    | Carga de archivos en frontend          |
| express            | ^5.1.0    | Framework backend                      |
| express-validator  | ^7.2.1    | Validación de formularios              |
| jsonwebtoken       | ^9.0.2    | Tokens de autenticación y verificación|
| multer             | ^2.0.1    | Middleware para subir archivos         |
| mysql2             | ^3.14.1   | Conector MySQL                         |
| nodemailer         | ^7.0.3    | Envío de correos electrónicos          |
| pug                | ^3.0.3    | Motor de plantillas                    |
| sequelize          | ^6.37.7   | ORM para MySQL                         |

## 💻 Ver el codigo

- Visita el repositorio:
   ```bash
   git clone https://github.com/yniel3/KMarket


## Vista previa del proyecto

Aquí puedes ver cómo se ve la aplicación en funcionamiento:

![Captura de pantalla 1](public\img\img-capture1.png)
![Captura de pantalla 2](public\img\img-capture2.png)
![Captura de pantalla 3](public\img\img-capture3.png)
![Captura de pantalla 4](public\img\img-capture4.png)
