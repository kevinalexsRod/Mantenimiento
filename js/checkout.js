/* Checkout Logic */
import { cart } from './cart.js';
import { postData } from './api.js';

export function initCheckout() {
    // Inject Checkout Modal HTML
    const modalHTML = `
    <div id="cart-modal" class="modal-overlay hidden">
        <div class="modal-content cart-modal">
            <div class="cart-header">
                <h2>Tu Carrito</h2>
                <button id="close-cart"><i class='bx bx-x'></i></button>
            </div>
            <div id="cart-items" class="cart-items">
                <!-- Items injected here -->
            </div>
            <div class="cart-footer">
                <h3>Total: $<span id="cart-total">0</span></h3>
                <button id="checkout-btn" class="register__form--submit">Pagar Ahora</button>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Event Listeners
    const cartBtn = document.getElementById('cart-btn');
    const closeBtn = document.getElementById('close-cart');
    const modal = document.getElementById('cart-modal');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            renderCartItems();
            modal.classList.remove('hidden');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            if (cart.items.length === 0) return alert('El carrito está vacío');

            // Identify User
            // Since we don't have a robust session storage, we can fetch the user by role or store the username on login.
            // For now, let's look up the user who has the 'userRole' if possible, or defaulting.
            // A better way is to store 'currentUser' in localStorage on login.

            // Assuming we added logic to store 'username' in localStorage or we just fetch 'users' and match 'userRole'?
            // Matching 'userRole' is ambiguous if multiple users have same role.
            // Let's assume 'Invitado' if no explicit login, or the role name for now, but ideally we want the Name.
            // Let's fetch the users to find the name if we had the username.

            // To fix this properly, let's check if there is a way to know WHO is logged in.
            // I'll grab the username from a new localStorage item 'currentUsername' if it exists.

            let customerName = 'Invitado';
            const currentUsername = localStorage.getItem('currentUsername');

            if (currentUsername) {
                try {
                    // Import getData dynamic fix or assume it is available? 
                    // It is better to use the imported postData... we need getData.
                    // checkout.js imports postData. Let's add getData import.
                    const { getData } = await import('./api.js');
                    const users = await getData('users');
                    const user = users.find(u => u.username === currentUsername);
                    if (user) customerName = user.name;
                } catch (e) {
                    console.error("Error fetching user info", e);
                }
            }

            // Simular pago y guardar venta
            const saleData = {
                date: new Date().toISOString().split('T')[0],
                total: cart.getTotal(),
                items: cart.items,
                customer: customerName
            };

            // Process Stock Updates using imported api functions
            const { getData, postData, updateData } = await import('./api.js');

            try {
                // Verify Stock Availability First
                let stockError = null;
                for (const item of cart.items) {
                    // Check current stock from DB to be safe
                    const product = await getData(`products/${item.id}`);
                    const currentStock = parseInt(product.stock || 0);
                    if (currentStock < item.quantity) {
                        stockError = `Stock insuficiente para ${item.name}. Disponible: ${currentStock}`;
                        break;
                    }
                }

                if (stockError) {
                    alert(stockError);
                    return;
                }

                // Billing Name Prompt
                const billingName = prompt("Ingrese el nombre para la factura:", customerName);
                if (billingName === null) return; // User cancelled

                // Use the entered name (or default if they just hit enter, prompt returns string)
                const finalCustomerName = billingName.trim() || customerName;

                // Auto-save Customer if not exists and valid name
                if (finalCustomerName !== 'Invitado' && finalCustomerName !== 'Cliente Registrado') {
                    const currentPhone = localStorage.getItem('currentUserPhone') || 'N/A';
                    try {
                        const customers = await getData('customers');
                        const exists = customers.find(c => c.name && c.name.toLowerCase() === finalCustomerName.toLowerCase());

                        if (!exists) {
                            const newCustomer = {
                                name: finalCustomerName,
                                identificationNumber: "N/A",
                                email: "no-email@registered.com",
                                phone: currentPhone,
                                customerType: "1"
                            };
                            await postData(newCustomer, 'customers');
                        }
                    } catch (err) {
                        console.error("Error auto-saving customer:", err);
                    }
                }

                const saleData = {
                    date: new Date().toISOString().split('T')[0],
                    total: cart.getTotal(),
                    items: cart.items,
                    customer: finalCustomerName,
                    phone: localStorage.getItem('currentUserPhone') || 'N/A'
                };

                // Proceed to checkout
                await postData(saleData, 'sales');

                // Update Stock
                for (const item of cart.items) {
                    const product = await getData(`products/${item.id}`);
                    const newStock = parseInt(product.stock || 0) - item.quantity;
                    // Update only specific field if possible, or object merging. 
                    // To be safe with PUT, we generally send the specific object or use Patch if available. 
                    // json-server PATCH updates. updateData uses PUT which replaces. 
                    // SO we need to merge.
                    await updateData('products', item.id, { ...product, stock: newStock });
                }

                alert('¡Compra realizada con éxito! Gracias por tu preferencia.');
                cart.clear();
                modal.classList.add('hidden');
                location.reload();

            } catch (error) {
                console.error("Transaction Error:", error);
                alert("Hubo un error al procesar la compra. Intente nuevamente.");
            }
        });
    }
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    container.innerHTML = '';
    if (cart.items.length === 0) {
        container.innerHTML = '<p>Tu carrito está vacío.</p>';
    } else {
        cart.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="item-info">
                   <h4>${item.name}</h4>
                   <p>$${item.price || item.unitaryPrice} x ${item.quantity}</p>
                </div>
                <button class="remove-item" data-id="${item.id}"><i class='bx bx-trash'></i></button>
            `;
            container.appendChild(div);

            div.querySelector('.remove-item').addEventListener('click', () => {
                cart.removeItem(item.id);
                renderCartItems(); // Re-render
            });
        });
    }

    totalEl.textContent = cart.getTotal().toLocaleString();
}
