// PRELOADED INVENTORY
let inventory = [
    { name: "Bread", qty: 2 },
    { name: "Cheese", qty: 1 },
    { name: "Butter", qty: 1 },
    { name: "Milk", qty: 1 },
    { name: "Cereal", qty: 1 }
];

let shopping = [];

// PRELOADED RECIPES
let recipes = [
    {
        name: "Grilled Cheese",
        ingredients: ["Bread", "Cheese", "Butter"]
    },
    {
        name: "Cereal Bowl",
        ingredients: ["Milk", "Cereal"]
    },
    {
        name: "Simple Pasta",
        ingredients: ["Pasta", "Tomato Sauce"]
    }
];

function switchTab(id) {
    document.querySelectorAll(".screen").forEach(screen =>
        screen.classList.remove("active")
    );
    document.getElementById(id).classList.add("active");
}

function openModal() {
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function addItem() {
    const name = document.getElementById("itemName").value;
    const qty = document.getElementById("itemQty").value;

    if (!name || !qty) return;

    inventory.push({ name, qty });
    renderInventory();
    closeModal();
}

function renderInventory() {
    const list = document.getElementById("inventoryList");
    list.innerHTML = "";

    inventory.forEach((item, index) => {
        list.innerHTML += `
            <li>
                ${item.name} (Qty: ${item.qty})
                <button onclick="deleteItem(${index})">Delete</button>
            </li>
        `;
    });

    renderRecipes();
}

function deleteItem(index) {
    inventory.splice(index, 1);
    renderInventory();
}

function addShopping() {
    const name = document.getElementById("shopInput").value;
    if (!name) return;

    shopping.push(name);
    renderShopping();
}

function renderShopping() {
    const list = document.getElementById("shoppingList");
    list.innerHTML = "";

    shopping.forEach((item, index) => {
        list.innerHTML += `
            <li>
                ${item}
                <button onclick="removeShopping(${index})">Remove</button>
            </li>
        `;
    });
}

function removeShopping(index) {
    shopping.splice(index, 1);
    renderShopping();
}

// SMART RECIPE RENDERING
function renderRecipes() {
    const list = document.getElementById("recipeList");
    list.innerHTML = "";

    recipes.forEach(recipe => {

        const missing = recipe.ingredients.filter(ingredient =>
            !inventory.some(item =>
                item.name.toLowerCase() === ingredient.toLowerCase()
            )
        );

        const canMake = missing.length === 0;

        list.innerHTML += `
            <li>
                <div>
                    <strong>${recipe.name}</strong><br>
                    Requires: ${recipe.ingredients.join(", ")}<br>
                    ${canMake 
                        ? "<span style='color: green;'>✔ Can Make</span>" 
                        : "<span style='color: red;'>Missing: " + missing.join(", ") + "</span>"
                    }
                </div>
            </li>
        `;
    });
}

// INITIAL RENDER
renderInventory();
renderShopping();
renderRecipes();