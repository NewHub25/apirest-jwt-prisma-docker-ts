import app from "./app";

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("El servidor está corriendo en el puerto: " + PORT));
