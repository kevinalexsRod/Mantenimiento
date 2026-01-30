import "./menu.js";
import "./crud.js";
import { initCheckout } from "./checkout.js";
import { getData } from "./api.js";

// Role Logic
window.setRole = function (role) {
    localStorage.setItem('userRole', role);
    document.getElementById('role-modal').classList.add('hidden');
    location.reload(); // Reload to apply changes in menu.js
}

// Import dashboard and view functions
import { renderDashboard, showAllData } from "./crud.js";
import { productInfo } from "./dataForm.js"; // Needed for ref

document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('userRole');
    const modal = document.getElementById('role-modal');

    if (!role) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
        document.body.classList.add(`role-${role}`);

        // Hide cart for admin
        if (role === 'admin') {
            const cartBtn = document.getElementById('cart-btn');
            if (cartBtn) cartBtn.style.display = 'none';

            // Render Dashboard for Admin
            const main = document.querySelector('main');
            const container = document.createElement('section');
            container.className = 'container-crud'; // Reusing container style
            container.style.overflowY = 'auto'; // Ensure scroll
            main.appendChild(container);
            renderDashboard(container);

        } else {
            // Render Products for Buyer (Default View)
            const main = document.querySelector('main');
            const containerBody = document.createElement('section');
            containerBody.className = 'container-crud__body';
            // Wrapper container logic from crud.js is usually: main -> section.container-crud -> section.container-crud__body
            // Let's mimic newContainer structure manually or create a helper
            const wrapper = document.createElement('section');
            wrapper.className = 'container-crud';
            wrapper.appendChild(containerBody);
            main.appendChild(wrapper);

            // Assuming 'products' endpoint and productInfo ref
            showAllData('products', containerBody, JSON.stringify(productInfo), 'Productos');
        }
    }

    // Logout Logic
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userRole');
            location.reload();
        });
    }

    // Login Form Logic
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;
            const errorMsg = document.querySelector('.login-error');

            try {
                // Fetch users from DB
                const users = await getData('users');
                const validUser = users.find(u => u.username === usernameInput && u.password === passwordInput);

                if (validUser) {
                    localStorage.setItem('currentUsername', validUser.username);
                    setRole(validUser.role);
                } else {
                    errorMsg.classList.remove('hidden');
                    errorMsg.textContent = "Usuario o contraseña incorrectos";
                }
            } catch (error) {
                console.error("Login Error:", error);
                errorMsg.classList.remove('hidden');
                errorMsg.textContent = "Error de conexión con el servidor";
            }
        });
    }

    initCheckout();
});
