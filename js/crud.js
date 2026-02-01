import { getData, postData, getDataId, deleteData, updateData } from "./api.js";

const mainContainer = document.querySelector('main');
/* -----------------------------------MANEJO DEL CRUD--------------------------------------- */
// Use Event Delegation for dynamic menu items
document.addEventListener('click', async (e) => {
    // Traverse up to find .dropdown__option in case user clicked an icon inside it
    const element = e.target.closest('.dropdown__option');
    if (!element) return;

    mainContainer.innerHTML = ``;
    const crudType = element.dataset.type; // opcion del crud

    // Check if it's a category filter (Buyer)
    if (crudType === 'category-filter') {
        const categoryId = element.dataset.id;
        const categoryName = element.dataset.name;

        const initialSettings = ['main', 'section', 'container-crud', 'register__form', `Catálogo: ${categoryName}`];
        const container = newContainer(initialSettings, 'searchContainer');

        // Custom Search/Render for Category
        // We can reuse search() or call showAllData with filter
        // Let's use showAllData but modify the URL to filter
        showAllData(`products?productCategory=${categoryId}`, container, null, 'Productos');
        return;
    }

    const parentNode = element.closest('.side-menu__dropdown') || element.parentNode;
    // fallback for safety, though structure implies ul parent

    // Standard CRUD logic
    const crudItem = parentNode.dataset.item; // opcion del menu
    const crudRef = parentNode.dataset.ref; // objeto de dataForm.js
    const crudUrl = parentNode.dataset.url; // endpoint al cual se debe acceder

    if (!crudUrl) return; // Guard clause

    let initialSettings;
    let container;

    switch (crudType) {
        case 'add':
            initialSettings = ['main', 'section', 'container-form', 'register__form', `Registro de ${crudItem}`];
            container = newContainer(initialSettings, 'form');
            addForm(JSON.parse(crudRef), crudType, container, "required=true", crudUrl);
            postInfo(crudUrl);
            break;

        default:
            initialSettings = ['main', 'section', 'container-crud', 'register__form', `Gestión de ${crudItem}`];
            container = newContainer(initialSettings, 'searchContainer');
            search(crudUrl, crudType, crudRef, crudItem, container);
            break;
    }
});

/* ------------------------------------CONTAINERS--------------------------------------------- */
function newContainer(settings, action) {
    const [tagGlobalContainer, tagContainer, classContainer, classForm, title] = settings;
    const container = document.createElement(tagContainer);
    container.classList.add(classContainer);
    document.querySelector(tagGlobalContainer).appendChild(container);

    switch (action) {
        case 'form':
            container.innerHTML = `<form class="${classForm}" id="myForm" autocomplete="off"><h2>${title}</h2></form>`;
            break;
        case 'searchContainer':
            container.innerHTML = `
            <div class="crud__search-bar">
                <input class="crud__search__input" type="text" name="search" placeholder="Buscar por ID o Nombre...">
                <button><i class='bx bx-search'></i></button>
            </div>`;
            break;
    }
    return container;
}

/* ------------------------------------FORMULARIOS-------------------------------------------- */
async function addForm(newForm, action, container, aditionalAtributte, endpoint, id) {
    if (!newForm) return;

    // PERFORMANCE OPTIMIZATION: Fetch data once if editing
    let editData = null;
    if ((action === 'edit' || action === 'search') && id) {
        try {
            editData = await getData(`${endpoint}/${id}`);
        } catch (e) {
            console.error("Error fetching edit data:", e);
        }
    }

    // Process inputs sequentially to ensure order, but fetch dependencies efficiently
    // Using for...of instead of forEach to wait for async operations properly if needed,
    // though rendering order usually matches DOM append order.
    for (const input of newForm) {
        const form = container.querySelector('form');

        switch (input.typeInput) {
            case 'select': {
                const div = document.createElement('div');
                div.innerHTML = `
                    <label for="${input.value[0]}">${input.value[1]} </label>
                    <select id="${input.value[0]}" name="${input.value[2]}" ${aditionalAtributte}></select>`;
                form.appendChild(div);

                let endpointForm;
                /* Mapeo de IDs de selects a Endpoints */
                switch (input.value[0]) {
                    case "category-product": endpointForm = "categories"; break;
                    case "product-brand": endpointForm = "brands"; break;
                    case "customer-type": endpointForm = "typesCustomer"; break;
                    case "provider-product": endpointForm = "providers"; break;
                    case "phone-owner": endpointForm = "customers"; break;
                    case "sale-customer": endpointForm = "customers"; break;
                    case "sale-product": endpointForm = "products"; break;
                    case "mov-product": endpointForm = "products"; break;
                }

                if (endpointForm) {
                    // Ideally we should cache this too, but for now we optimize editData
                    const collection = await getData(endpointForm);
                    const select = div.querySelector('select'); // Select specific to this div
                    select.innerHTML = `<option value="0">Seleccione una opción...</option>`;

                    if (collection && collection.length > 0) {
                        for (let item of collection) {
                            select.innerHTML += `<option value="${item.id}">${item.name || item.id}</option>`;
                        }
                    }

                    // Set value if editing
                    if (editData && editData[input.value[2]]) {
                        select.value = editData[input.value[2]];
                    }
                }
            } break;

            case 'submit': {
                const div = document.createElement('div');
                div.innerHTML = `<button for="myForm" class="register__form--submit ${action}" id=${input.value[0]} name=${input.value[2]}></button>`;
                const btnSubmit = div.querySelector('button');
                action === 'edit' ? btnSubmit.textContent = 'Actualizar' : btnSubmit.textContent = input.value[1];
                form.appendChild(div);
            } break;

            default: {
                const div = document.createElement('div');
                div.innerHTML = `
                    <label for="${input.value[0]}">${input.value[1]}: </label>
                    <input class="input__form" type="${input.typeInput}" id="${input.value[0]}" name="${input.value[2]}" min="0" ${aditionalAtributte}>`;
                if (input.typeInput === 'textarea') div.querySelector('.input__form').style.resize = 'none';
                form.appendChild(div);

                // Set value if editing - NOW INSTANT
                if (editData && editData[input.value[2]]) {
                    div.querySelector(`input[name="${input.value[2]}"]`).value = editData[input.value[2]];
                }
            } break;
        }
    }
}

/* ------------------------------------SEARCH-------------------------------------------- */
function search(URL, action, ref, item, container) {
    const containerBody = document.createElement('section');
    containerBody.classList.add('container-crud__body');
    document.querySelector('.container-crud').appendChild(containerBody);

    // Mostrar todos los datos al inicio
    showAllData(URL, containerBody, ref, item);

    container.querySelector('button').addEventListener('click', async (event) => {
        containerBody.innerHTML = '';
        event.preventDefault();
        let inputUser = container.querySelector('input').value;

        if (inputUser == "") {
            showAllData(URL, containerBody, ref, item);
        } else {
            // Eliminamos la restricción de ID para "edit". Usamos búsqueda unificada.
            showResults(URL, inputUser, containerBody, ref, item);
        }
    });
}

/* ------------------------------------MOSTRAR TODOS LOS DATOS----------------------------------- */
/* ------------------------------------MOSTRAR TODOS LOS DATOS----------------------------------- */
export async function showAllData(URL, containerBody, ref, item) {
    // Show Loading Spinner
    containerBody.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 200px; width: 100%;">
            <div class="loader" style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
        </div>
        <style>@keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}</style>
    `;

    console.log(`Fetching data for: ${URL}`);
    const data = await getData(URL);
    console.log('Data received:', data);

    if (!data || data.length === 0) {
        containerBody.innerHTML = `<p style="text-align: center; color: var(--dark-grey); margin-top: 2rem;">No existen registros en esta sección.</p>`;
        return;
    }
    renderGrid(data, containerBody, ref, URL, item);
}

/* ------------------------------------DASHBOARD-------------------------------------------- */
export async function renderDashboard(container) {
    container.innerHTML = `
        <h2 style="margin-bottom: 2rem; color: var(--dark);">Panel General</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
            <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                <h3 style="color: var(--dark-grey); font-size: 0.9rem; margin-bottom: 0.5rem;">Productos Totales</h3>
                <p id="total-products" style="font-size: 2rem; font-weight: 700; color: var(--blue);">...</p>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                <h3 style="color: var(--dark-grey); font-size: 0.9rem; margin-bottom: 0.5rem;">Alertas de Stock</h3>
                <p id="low-stock" style="font-size: 2rem; font-weight: 700; color: var(--red);">...</p>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                <h3 style="color: var(--dark-grey); font-size: 0.9rem; margin-bottom: 0.5rem;">Ventas Hoy</h3>
                <p id="sales-today" style="font-size: 2rem; font-weight: 700; color: var(--green);">...</p>
            </div>
        </div>
        <div style="margin-top: 2rem; background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h3>Bienvenido a TechZone Store</h3>
            <p style="color: var(--dark-grey); margin-top: 0.5rem;">Seleccione una opción del menú lateral para comenzar a gestionar su inventario.</p>
        </div>
    `;

    // Fetch Stats
    try {
        const products = await getData('products');
        const sales = await getData('sales');

        const totalProducts = products.length;
        const lowStock = products.filter(p => p.stock !== undefined && parseInt(p.stock) < 5).length; // Alert < 5
        const today = new Date().toISOString().split('T')[0];
        const salesToday = sales.filter(s => s.date === today).length;

        container.querySelector('#total-products').textContent = totalProducts;
        container.querySelector('#low-stock').textContent = lowStock;
        container.querySelector('#sales-today').textContent = salesToday;
    } catch (e) {
        console.error("Dashboard Error", e);
    }
}

async function showResults(URL, searchQuery, containerBody, ref, item) {
    const data = await getData(URL);
    const filtered = data.filter(dataItem =>
        dataItem.id.toString().includes(searchQuery) ||
        (dataItem.name && dataItem.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (filtered.length === 0) {
        containerBody.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    renderGrid(filtered, containerBody, ref, URL, item);
}

// Import cart 
import { cart } from "./cart.js";

function renderGrid(data, container, formRefStr, baseUrl, itemName) {
    container.innerHTML = '';
    const userRole = localStorage.getItem('userRole');

    // Special Rendering for Sales History (Table View)
    if (baseUrl === 'sales') {
        const table = document.createElement('table');
        table.className = 'sales-table';
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.innerHTML = `
            <thead>
                <tr style="background-color: #f4f4f4; text-align: left;">
                    <th style="padding: 10px; border: 1px solid #ddd;">ID Venta</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Fecha</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Cliente</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
                    <th style="padding: 10px; border: 1px solid #ddd;">Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');

        data.forEach(sale => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 10px; border: 1px solid #ddd;">${sale.id}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${sale.date}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${sale.customer || 'Desconocido'}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">$${Number(sale.total).toLocaleString()}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                    <div style="display: flex; gap: 8px;">
                        <button class="view-invoice-btn" data-id="${sale.id}" title="Ver Factura" style="background-color: var(--blue); color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">
                            <i class='bx bxs-file-pdf'></i>
                        </button>
                        <button class="delete-btn" data-id="${sale.id}" title="Eliminar" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">
                            <i class='bx bxs-trash'></i>
                        </button>
                    </div>
                </td>
            `;
            // Delete Action for Sales
            // View Invoice Action
            tr.querySelector('.view-invoice-btn').addEventListener('click', () => {
                showInvoceDetail(sale);
            });

            // Delete Action for Sales
            tr.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm(`¿Eliminar venta ID ${sale.id}?`)) {
                    deleteData(baseUrl, sale.id).then(() => {
                        alert('Venta eliminada');
                        location.reload();
                    });
                }
            });
            tbody.appendChild(tr);
        });
        container.appendChild(table);
        return; // Exit function for Sales
    }

    // Default Grid for Products and other items
    const grid = document.createElement('div');
    grid.className = 'cards-grid';

    data.forEach(item => {
        const card = document.createElement('article');
        card.className = 'product-card';

        const imgUrl = item.imgUrl || 'storage/img/logo.jpg';

        // Safety check for price
        const hasPrice = item.price || item.unitaryPrice;
        const priceDisplay = hasPrice ? Number(item.price || item.unitaryPrice).toLocaleString() : null;

        const stockDisplay = (item.stock !== undefined && item.stock !== null) ? item.stock : 'N/A';
        const isOutOfStock = parseInt(item.stock) <= 0;

        let cardContent = `
            <div class="card__image">
                <img src="${imgUrl}" alt="${item.name || 'Item'}" onerror="this.src='storage/img/logo.jpg'">
            </div>
            <div class="card__content">
                <h3 class="card__title">${item.name || 'Sin Nombre'}</h3>
                ${priceDisplay ? `<p class="card__price">$${priceDisplay}</p>` : ''}
                <div class="card__details">
                    <p><strong>ID:</strong> ${item.id}</p>
                    ${hasPrice ? `<p><strong>Stock:</strong> ${isOutOfStock ? '<span style="color:red; font-weight:bold;">Agotado</span>' : stockDisplay}</p>` : ''}
                    ${item.code ? `<p><strong>SKU:</strong> ${item.code}</p>` : ''}
                </div>
        `;

        // Actions
        if (userRole === 'buyer') {
            // Only show add to cart for products (items with price/unitaryPrice)
            if (item.price || item.unitaryPrice) {
                if (isOutOfStock) {
                    cardContent += `<button class="card__btn" disabled style="background-color: #cccccc; cursor: not-allowed;">Agotado</button>`;
                } else {
                    cardContent += `<button class="card__btn add-to-cart" data-id="${item.id}">Añadir al Carrito</button>`;
                }
            }
        } else {
            cardContent += `
                <div class="card__actions" style="display: flex; gap: 10px; margin-top: 10px;">
                    <button class="card__btn edit-btn" style="background-color: #ffc107; color: #000;" data-id="${item.id}"><i class='bx bxs-edit'></i> Editar</button>
                    <button class="card__btn delete-btn" style="background-color: #dc3545;" data-id="${item.id}"><i class='bx bxs-trash'></i> Eliminar</button>
                </div>
            `;
        }

        cardContent += `</div>`;
        card.innerHTML = cardContent;

        // Listeners
        if (userRole === 'buyer') {
            const btn = card.querySelector('.add-to-cart');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    cart.addItem(item);
                });
            }
        } else {
            const editBtn = card.querySelector('.edit-btn');
            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Setup Edit
                    const main = document.querySelector('main');
                    main.innerHTML = '';
                    const initialSettings = ['main', 'section', 'container-form', 'register__form', `Actualizar ${itemName}`];
                    const containerForm = newContainer(initialSettings, 'form');

                    try {
                        let schema = formRefStr;
                        // Handle array if passed
                        if (Array.isArray(schema)) schema = schema[0];
                        addForm(JSON.parse(schema), 'edit', containerForm, "required=true", baseUrl, item.id);
                        putInfo(baseUrl, item.id); // Re-use putInfo which attaches listener to #myForm
                    } catch (err) { console.error(err); }
                });
            }

            const deleteBtn = card.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm(`¿Eliminar ID ${item.id}?`)) {
                        deleteData(baseUrl, item.id).then(() => {
                            alert('Eliminado');
                            location.reload();
                        });
                    }
                });
            }
        }
        grid.appendChild(card);
    });
    container.appendChild(grid);
}


/* ------------------------------------FUNCIONES CRUD--------------------------------------- */
function postInfo(URL) {
    // Usamos delegación de eventos o aseguramos que el listener se agregue al botón correcto
    // Como el formulario se crea dinámicamente, esperamos un momento o usamos un observer.
    // En este diseño simple, asumimos que el usuario llena y da click.

    // NOTA: El selector '.add' no existe en el botón creado dinámicamente en addForm.
    // El botón tiene clases: register__form--submit y "add" (pasado por parametro action)
    // Vamos a adjuntar el listener al documento para capturar el evento submit del formulario

    const form = document.querySelector('#myForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const datos = Object.fromEntries(formData.entries());

            if (!checkForm(datos)) {
                alert('Debe llenar todos los campos requeridos');
                return;
            }

            postData(datos, URL).then(() => {
                alert('Registro exitoso');
                location.reload(); // Recargar para ver cambios
            });
        });
    }
}

async function putInfo(url, inputUser) {
    const form = document.querySelector('#myForm'); // El formulario creado en search->edit
    if (form) {
        const btn = form.querySelector('button'); // El botón de "Actualizar"
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Recopilar datos del formulario actual
            // Nota: Al ser 'edit', el formulario ya está en el DOM
            const inputs = form.querySelectorAll('input, select, textarea');
            let datos = {};
            inputs.forEach(input => {
                if (input.name) datos[input.name] = input.value;
            });

            if (!checkForm(datos)) alert('Debe llenar todos los campos');
            else {
                updateData(url, inputUser, datos).then(() => {
                    alert('Actualización exitosa');
                    location.reload();
                });
            }
        });
    }
}

function checkForm(data) {
    return Object.values(data).every(value => value && value.toString().trim() !== '' && value != "0");
}

/* ------------------------------------DETALLE DE FACTURA-------------------------------------------- */
function showInvoceDetail(sale) {
    // Crear el overlay del modal si no existe
    let modalOverlay = document.getElementById('invoice-modal');
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'invoice-modal';
        modalOverlay.className = 'modal-overlay';
        document.body.appendChild(modalOverlay);
    }

    const itemsHTML = sale.items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0;">
                <div style="font-weight: 600;">${item.name}</div>
                <div style="font-size: 0.8rem; color: #667085;">SKU: ${item.code || 'N/A'}</div>
            </td>
            <td style="padding: 12px 0; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px 0; text-align: right;">$${Number(item.price || item.unitaryPrice).toLocaleString()}</td>
            <td style="padding: 12px 0; text-align: right; font-weight: 600;">$${(Number(item.price || item.unitaryPrice) * item.quantity).toLocaleString()}</td>
        </tr>
    `).join('');

    modalOverlay.innerHTML = `
        <div class="modal-content" style="max-width: 600px; padding: 40px; text-align: left;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px;">
                <div>
                    <h2 style="margin: 0; color: var(--dark); font-size: 1.8rem;">FACTURA</h2>
                    <p style="margin: 5px 0 0 0; color: var(--blue); font-weight: 700; letter-spacing: 1px;"># ${sale.id}</p>
                </div>
                <div style="text-align: right;">
                    <img src="storage/img/logo.jpg" alt="Logo" style="height: 50px; margin-bottom: 10px;">
                    <div style="font-size: 0.85rem; color: var(--dark-grey);">TechZone Store S.A.</div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; padding: 20px; background: #f8fafc; border-radius: 12px;">
                <div>
                    <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--dark-grey); font-weight: 700; margin-bottom: 5px;">Facturar a:</div>
                    <div style="font-weight: 700; font-size: 1.1rem; color: var(--dark);">${sale.customer}</div>
                    <div style="font-size: 0.9rem; color: var(--dark-grey); margin-top: 2px;">Tel: ${sale.phone || 'N/A'}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.75rem; text-transform: uppercase; color: var(--dark-grey); font-weight: 700; margin-bottom: 5px;">Fecha:</div>
                    <div style="font-weight: 700; font-size: 1.1rem; color: var(--dark);">${sale.date}</div>
                </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="border-bottom: 2px solid var(--dark); text-align: left; font-size: 0.8rem; text-transform: uppercase; color: var(--dark-grey);">
                        <th style="padding-bottom: 10px;">Producto</th>
                        <th style="padding-bottom: 10px; text-align: center;">Cant.</th>
                        <th style="padding-bottom: 10px; text-align: right;">Precio</th>
                        <th style="padding-bottom: 10px; text-align: right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>

            <div style="display: flex; justify-content: flex-end; margin-top: 30px;">
                <div style="width: 250px;">
                    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid var(--dark);">
                        <span style="font-weight: 800; font-size: 1.2rem;">TOTAL</span>
                        <span style="font-weight: 800; font-size: 1.5rem; color: var(--blue);">$${Number(sale.total).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div style="margin-top: 40px; text-align: center;">
                <button id="close-invoice" class="register__form--submit" style="width: 100%; padding: 15px; font-weight: 700;">CERAR DETALLE</button>
            </div>
        </div>
    `;

    modalOverlay.classList.remove('hidden');
    modalOverlay.style.display = 'flex';

    document.getElementById('close-invoice').addEventListener('click', () => {
        modalOverlay.style.display = 'none';
        modalOverlay.classList.add('hidden');
    });
}

