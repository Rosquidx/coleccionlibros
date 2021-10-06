class Libro{
    constructor(titulo, autor, isbn){
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
    }
}

class IU{
    static mostrarLibros(){
        const libros = Datos.traerLibros();
        libros.forEach((libro) => IU.agregarLibroLista(libro));
    }

    static agregarLibroLista(libro){
        const lista = document.querySelector('#libro-list');
        const fila = document.createElement('tr');
        fila.innerHTML = `
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.isbn}</td>
        <td><a href=#" class="btn btn-danger btn-sm delete">X</a></td>
        `;  
        lista.appendChild(fila); 
    }

    static eliminarLibro(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
        
    }

    static mostrarAlerta(mensaje, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(mensaje));

        const container = document.querySelector('.container');
        const form = document.querySelector('#libro-form');
        container.insertBefore(div, form);

        setTimeout(()=>document.querySelector('.alert').remove(), 1000);
    }

    static limpiarCampos(){
        document.querySelector('#titulo').value = '';
        document.querySelector('#autor').value = '';
        document.querySelector('#isbn').value = '';
    }
}

class Datos{
    static traerLibros(){
        let libros;
        if(localStorage.getItem('libros') === null){
            libros = [];
        }else{
            libros = JSON.parse(localStorage.getItem('libros'));
        }
        return libros;
    }

    static agregarLibro(libro){
        const libros = Datos.traerLibros();
        libros.push(libro);
        localStorage.setItem('libros', JSON.stringify(libros));
    }

    static removerLibro(isbn){
        const libros = Datos.traerLibros();
        console.log(isbn);

        libros.forEach((libro, index) =>{
            if(libro.isbn === isbn){
                libros.splice(index, 1);
            }
        });
        localStorage.setItem('libros', JSON.stringify(libros));
    }
}

//Carga de la pagina
document.addEventListener('DOMContetLoaded', IU.mostrarLibros());


//Controlar el evento Submit
document.querySelector('#libro-form').addEventListener('submit', (e) => {
    e.preventDefault();

    //Obtener valores de los campos.
    const titulo = document.querySelector('#titulo').value;
    const autor = document.querySelector('#autor').value;
    const isbn = document.querySelector('#isbn').value;


    //Validar que esten llenos
    if(titulo === '' || autor === '' || isbn === ''){
        IU.mostrarAlerta('Por favor ingrese todos los datos', 'danger')
    }else{
        const libro = new Libro(titulo, autor, isbn);
        Datos.agregarLibro(libro);
        IU.agregarLibroLista(libro);
        IU.mostrarAlerta('Libro agregado a la colección', 'success')
        IU.limpiarCampos();
    }
});

document.querySelector('#libro-list').addEventListener('click', (e) => {
    IU.eliminarLibro(e.target);
    Datos.removerLibro(e.target.parentElement.previousElementSibling.textContent);
    IU.mostrarAlerta('Libro eliminado', 'info')
});
