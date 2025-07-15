import nodemailer from "nodemailer";


async function emailRegistro(datos) {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    const { email, nombre, token } = datos;
    //Enviar email
    await transport.sendMail({
    from: "Kaiser-Market.com",
    to: email,
    subject: "Confirma tu cuenta en Kaiser-Market",
    text: "Confirma tu cuenta ahora y únete a Kaiser-Market",
    html: `
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #ececec;
            margin: 0;
            padding: 0;
        }
        .card {
            background-color: #ffffff;
            max-width: 580px;
            margin: 30px auto;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }
        .card h2 {
            color: #333333;
            font-size: 22px;
            margin-bottom: 20px;
        }
        .card a {
            background-color: #ff6600;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            display: inline-block;
            font-weight: bold;
        }
        .card p {
            color: #666666;
            font-size: 14px;
            margin-top: 15px;
        }
    </style>
    <div class="card">
        <h2>Hola ${nombre}, estás a un paso de completar tu registro.</h2>
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/confirmar/${token}">Confirmar mi cuenta</a>
        <p>Si no solicitaste este correo, simplemente ignóralo.</p>
    </div>
    `
});
}



async function emailResetPassword(datos) {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })
    const { email, nombre, token } = datos;
    // Enviar email
    await transport.sendMail({
        from: "MascotasOCosas.com",
        to: email,
        subject: "Restablece tu password en cositas",
        text: "Restablece tu password en cositas",
        html: `
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #ececec;
            margin: 0;
            padding: 0;
        }
        .card {
            background-color: #ffffff;
            max-width: 580px;
            margin: 30px auto;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
            text-align: center;
        }
        .card h2 {
            color: #333333;
            font-size: 22px;
            margin-bottom: 20px;
        }
        .card p {
            color: #666666;
            font-size: 14px;
            margin: 10px 0;
        }
        .card a {
            background-color: #ff6600;
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            display: inline-block;
            font-weight: bold;
            margin-top: 15px;
        }
        </style>
        <div class="card">
        <h2>Hola ${nombre}, has solicitado restablecer tu password en MascotasOCosas</h2>
        <p>Sigue el siguiente enlace para hacerlo:</p>
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/olvide-password/${token}">Restablecer password</a>
        <p>Si no fuiste tú, simplemente ignora este mensaje.</p>
        </div>
    `
    });

}

export {
    emailRegistro,
    emailResetPassword
}