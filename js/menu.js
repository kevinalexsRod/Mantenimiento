//Importar objs que van a ser ingresados dentro del dataset
import { productInfo, customerInfo, brandInfo, customerTypeInfo, categoryInfo, statusInfo, salesInfo, movInfo, phoneInfo } from './dataForm.js';
import { getData } from './api.js';

/**Opciones del menu */
const menuData = [
    { title: "Productos Tecnológicos", idDrop: "menu-products", icon: "bx bxs-package", infoForm: JSON.stringify(productInfo), url: "products" },
    { title: "Categorías", idDrop: "menu-categories", icon: "bx bx-category", infoForm: JSON.stringify(categoryInfo), url: "categories" },
    { title: "Marcas / Fabricantes", idDrop: "menu-brands", icon: "bx bxs-badge-check", infoForm: JSON.stringify(brandInfo), url: "brands" },
    { title: "Clientes", idDrop: "menu-customers", icon: "bx bxs-user", infoForm: JSON.stringify(customerInfo), url: "customers" },
    { title: "Tipos de Cliente", idDrop: "menu-customer-types", icon: "bx bxs-id-card", infoForm: JSON.stringify(customerTypeInfo), url: "typesCustomer" },
    { title: "Teléfonos", idDrop: "menu-telephones", icon: "bx bxs-phone", infoForm: JSON.stringify(phoneInfo), url: "telephones" },
    { title: "Ventas", idDrop: "menu-sales", icon: "bx bxs-cart", infoForm: [JSON.stringify(salesInfo), JSON.stringify(movInfo)], url: "sales" },
]
/*--- ceracion dinamica de la cabecera ---*/
/*---- creacion de contenedores----*/
const mainContainer = document.querySelector('body'); //trae a main desde el html

// Crear el checkbox que va a usar css para implementar la logica del drop
const checkboxMain = document.createElement('input');
checkboxMain.type = 'checkbox';
checkboxMain.id = 'drop-sidebar';
mainContainer.append(checkboxMain);

//Creacion del nav y el ul general que contendrá todas las opciones
const nav = document.createElement('nav');
nav.setAttribute('id', 'sidebar');
mainContainer.appendChild(nav);
const ul = document.createElement('ul');
ul.setAttribute('class', 'side-menu');
nav.appendChild(ul);

const userRole = localStorage.getItem('userRole') || 'admin';

// Filter Menu for Buyer
let filteredMenu = menuData;
if (userRole === 'buyer') {
    filteredMenu = menuData.filter(item => item.url === 'products');
}

// ASYNC Function to build menu
async function buildMenu() {
    for (const element of filteredMenu) {
        const menuOption = document.createElement('li');
        // Dropdown Header
        menuOption.innerHTML = `
            <input type="checkbox" id="${element.idDrop}">
            <label class="side-menu__subtitle" for="${element.idDrop}">
                <i class="${element.icon}" ></i> 
                <p>${element.title}</p>
                <i class='bx bx-chevron-right icon-right side-menu__arrow' ></i>
            </label>`;

        // Dropdown Content
        let dropdownContent = '';

        if (userRole === 'buyer') {
            // Buyer sees Categories
            try {
                const categories = await getData('categories');
                let catList = '';
                if (categories && categories.length > 0) {
                    categories.forEach(cat => {
                        catList += `<li class="dropdown__option" data-type="category-filter" data-id="${cat.id}" data-name="${cat.name}">${cat.name}</li>`;
                    });
                } else {
                    catList = `<li class="dropdown__option" data-type="search">Ver Todo</li>`;
                }

                dropdownContent = `
                <ul class="side-menu__dropdown" data-url="${element.url}" data-item="${element.title}" data-ref='${element.infoForm}' id="testing">
                    <li class="dropdown__option" data-type="search" style="font-weight:bold; border-bottom:1px solid #eee;">Ver Todo</li>
                    ${catList}
                </ul>`;
            } catch (e) {
                console.error("Error fetching categories for menu", e);
                dropdownContent = `
                <ul class="side-menu__dropdown" data-url="${element.url}">
                    <li class="dropdown__option" data-type="search">Ver Catálogo</li>
                </ul>`;
            }

        } else {
            // Admin sees all options
            if (element.title === 'Ventas') {
                dropdownContent = `
                <ul class="side-menu__dropdown" data-url= "${element.url}" data-item="${element.title}" data-ref='${element.infoForm[0]}' data-refmov ='${element.infoForm[1]}' id="testing">
                    <li class="dropdown__option"  data-type="add">Nueva Venta</li>
                    <li class="dropdown__option"  data-type="search">Historial Ventas</li>
                </ul>`;
            } else {
                dropdownContent = `
                <ul class="side-menu__dropdown" data-url= "${element.url}" data-item="${element.title}" data-ref='${element.infoForm}' id="testing">
                    <li class="dropdown__option"  data-type="add">Agregar</li>
                    <li class="dropdown__option" data-type="search">Buscar/Gestionar</li>
                </ul>`;
            }
        }

        menuOption.innerHTML += dropdownContent;
        ul.appendChild(menuOption);
    }

    // Accordion Logic (Once elements are added)
    const menuCheckboxes = document.querySelectorAll('.side-menu input[type="checkbox"]');
    menuCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                menuCheckboxes.forEach(other => {
                    if (other !== this) other.checked = false;
                });
            }
        });
    });
}

buildMenu();
mainContainer.append(nav);

