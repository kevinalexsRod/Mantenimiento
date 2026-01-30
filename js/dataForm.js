/*
En este archivo se definen objetos exportados los cuales son recorridos para renderizar los inputs y los labels de cada tipo de formulario
*/
const productInfo = [
    {
        value: ["product-code", "Código SKU", "code"], //Id que relaciona al input con el label y el texto
        typeInput: "number",
    },
    {
        value: ["product-name", "Nombre del Producto", "name"], //Id que relaciona al input con el label y el texto
        typeInput: "text",
    },
    {
        value: ["product-serial", "Número de Serial", "serialNumber"], //Id que relaciona al input con el label y el texto
        typeInput: "text",
    },
    {
        value: ["product-value", "Precio de Venta", "price"], //Id que relaciona al input con el label y el texto
        typeInput: "number",
    },
    {
        value: ["product-stock", "Cantidad en Stock", "stock"],
        typeInput: "number",
    },
    {
        value: ["provider-product", "Proveedor", "productProvider"],
        typeInput: "select",
    },
    {
        value: ["category-product", "Categoría", "productCategory"],
        typeInput: "select",
    },
    {
        value: ["product-brand", "Marca", "productBrand"],
        typeInput: "select",
    },
    {
        value: ["add-product-id", "Registrar Producto", "products"],
        typeInput: "submit",
    }
];

/*--- informacion de cliente ---*/
const customerInfo = [
    {
        value: ["customer-identification", "Identificación (DNI/NIT)", "identificationNumber"],
        typeInput: "number"
    },
    {
        value: ["customer-name", "Nombre Completo", "name"],
        typeInput: "text"
    },
    {
        value: ["customer-email", "Correo Electrónico", "email"],
        typeInput: 'email'
    },
    {
        value: ["customer-type", "Tipo de Cliente", "customerType"],
        typeInput: 'select'
    },
    { value: ["add-customer", "Registrar Cliente", "customers"], typeInput: 'submit' }
];

const brandInfo = [
    { value: ["brand", "Nombre de Marca", "name"], typeInput: 'text' },
    { value: ["add-brand", "Nueva Marca", "brands"], typeInput: 'submit' }
];

const customerTypeInfo = [
    { value: ["customer-type", "Descripción del Tipo", "name"], typeInput: 'text' },
    { value: ["add-customer-type", "Nuevo Tipo de Cliente", "typesCustomer"], typeInput: 'submit' }
];

const categoryInfo = [
    { value: ["category-name", "Nombre Categoría", "name"], typeInput: 'text' },
    { value: ["add-category", "Nueva Categoría", "categories"], typeInput: 'submit' }
];

const statusInfo = [
    { value: ["status", "Estado", "name"], typeInput: 'text' },
    { value: ["add-status", "Nuevo Estado", "states"], typeInput: 'submit' }
];

const phoneInfo = [
    { value: ["phone-number", "Número Telefónico", "number"], typeInput: 'number' },
    { value: ["phone-location", "Ubicación / Ciudad", "location"], typeInput: 'text' },
    { value: ["phone-owner", "Cliente / Dueño", "phoneOwner"], typeInput: 'select' },
    { value: ["add-phone", "Registrar Teléfono", "telephones"], typeInput: 'submit' }
];

// Movimientos de inventario (Entradas/Salidas)
const movInfo = [
    { value: ["date-mov", "Fecha Movimiento"], typeInput: 'date' },
    { value: ["mov-product", "Producto"], typeInput: 'select' },
    { value: ["mov-type", "Tipo de Movimiento"], typeInput: 'select' },
    { value: ["mov-comment", "Observaciones"], typeInput: 'textarea' },
    { value: ["add-mov", "Registrar Movimiento"], typeInput: 'submit' }
];

const salesInfo = [
    { value: ["sale-date", "Fecha de Venta", "saleDate"], typeInput: 'date' },
    { value: ["sale-customer", "Cliente", "saleCustomer"], typeInput: 'select' },
    { value: ["sale-product", "Producto", "saleProduct"], typeInput: 'select' },
    { value: ["add-sale", "Realizar Venta"], typeInput: 'submit' }
];

export {
    productInfo,
    customerInfo,
    brandInfo,
    customerTypeInfo,
    categoryInfo,
    statusInfo,
    phoneInfo,
    movInfo,
    salesInfo
}