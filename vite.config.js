//Importamos el plugin de vue que queremos registrar
import vue from '@vitejs/plugin-vue';


// Como todo archivo de cofniguracion tenemos que exportar un objeto
// de configuracion
export default {
    //Ahora registramos el plugin.
    plugins: [vue()],
}

