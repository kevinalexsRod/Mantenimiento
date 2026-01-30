/* Cart Logic */
export class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('techZoneCart')) || [];
        this.updateCount();
    }

    addItem(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.save();
        alert('Producto añadido al carrito');
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.save();
    }

    clear() {
        this.items = [];
        this.save();
    }

    save() {
        localStorage.setItem('techZoneCart', JSON.stringify(this.items));
        this.updateCount();
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (Number(item.price || item.unitaryPrice) * item.quantity), 0);
    }

    updateCount() {
        // Update a UI badge if it exists
        const badge = document.getElementById('cart-count');
        if (badge) {
            const count = this.items.reduce((acc, item) => acc + item.quantity, 0);
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    }
}

export const cart = new ShoppingCart();
