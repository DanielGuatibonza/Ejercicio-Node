const axios = require('axios');
const http = require('http');
const fs = require('fs');

const urlProveedores = 'https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json'
let jsonProveedores;
let promesaProveedores = axios.get(urlProveedores)
                            .then(response => jsonProveedores = response)
                            .catch(error => console.log(error));

const urlClientes = 'https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json'
let jsonClientes;
let promesaClientes = axios.get(urlClientes)
                        .then(response => jsonClientes = response)
                        .catch(error => console.log(error));

function agregarDatos(jsonData, header){
    let html = fs.readFileSync('./index.html', "utf-8");
    let htmlData = "";
    for(let i=0; i<jsonData.data.length; i++)
    {
        let id = jsonData.data[i].idproveedor ? jsonData.data[i].idproveedor : jsonData.data[i].idCliente;
        let nombreCompania = jsonData.data[i].nombrecompania ? jsonData.data[i].nombrecompania : jsonData.data[i].NombreCompania; 
        let nombreContacto = jsonData.data[i].nombrecontacto ? jsonData.data[i].nombrecontacto : jsonData.data[i].NombreContacto; 
        htmlData += "<tr><td>" + id + "</td><td>" + nombreCompania + "</td><td>" + nombreContacto + "</td></tr>";
    }
    return html.replace("<tbody></tbody>", "<tbody>" + htmlData + "</tbody>").replace("Listado de ", "Listado de " + header);
}

Promise.all([promesaProveedores, promesaClientes]).then(() => {
http.createServer((request, response) => {
    if(request.url === "/api/clientes"){
        let html = agregarDatos(jsonClientes, "clientes");
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html); 
        response.end();
    }
    if(request.url === "/api/proveedores")
    {
        let html = agregarDatos(jsonProveedores, "proveedores");
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html); 
        response.end();
    }
}).listen(8081)});
