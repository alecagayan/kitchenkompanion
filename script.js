let inventory = [
    { name: "Bread", amount: 2, unit: "loaf" },
    { name: "Cheese", amount: 8, unit: "oz" },
    { name: "Butter", amount: 1, unit: "box" },
    { name: "Milk", amount: 1, unit: "carton" },
    { name: "Cereal", amount: 1, unit: "box" },
    { name: "Potatoes", amount: 6, unit: "count" }
];

let shopping = [
    { name: "Eggs", checked: false, editing: false, draft: "" },
    { name: "Pasta", checked: false, editing: false, draft: "" }
];

let recipes = [
    {
        name: "Grilled Cheese",
        time: "10 min",
        servings: 1,
        ingredients: [
            { name: "Bread", amount: 2, unit: "slices" },
            { name: "Cheese", amount: 2, unit: "oz" },
            { name: "Butter", amount: 1, unit: "tbsp" }
        ],
        steps: [
            "Butter the bread on the outside.",
            "Layer cheese between the slices.",
            "Cook in a skillet until golden on both sides."
        ]
    },
    {
        name: "Cereal Bowl",
        time: "5 min",
        servings: 1,
        ingredients: [
            { name: "Milk", amount: 1, unit: "cup" },
            { name: "Cereal", amount: 1, unit: "cup" }
        ],
        steps: [
            "Pour cereal into a bowl.",
            "Add milk and serve immediately."
        ]
    },
    {
        name: "Roasted Potatoes",
        time: "35 min",
        servings: 2,
        ingredients: [
            { name: "Potatoes", amount: 4, unit: "count" },
            { name: "Oil", amount: 1, unit: "tbsp" },
            { name: "Salt", amount: 1, unit: "tsp" }
        ],
        steps: [
            "Cut the potatoes into bite-size pieces.",
            "Toss with oil and salt.",
            "Roast until browned and tender."
        ]
    }
];

function switchTab(id) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });
    document.getElementById(id).classList.add("active");

    document.querySelectorAll(".tabButton").forEach(button => {
        button.classList.toggle("active", button.dataset.target === id);
    });
}

function openProfilePage() {
    renderProfilePage();
    document.getElementById("profilePage").classList.add("open");
}

function closeProfilePage() {
    document.getElementById("profilePage").classList.remove("open");
}

function openModal() {
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function addItem() {
    const name = document.getElementById("itemName").value.trim();
    const amount = Number(document.getElementById("itemQty").value);
    const unit = document.getElementById("itemUnit").value;

    if (!name || !amount || amount <= 0) {
        return;
    }

    inventory.push({ name, amount, unit });
    renderInventory();

    document.getElementById("itemName").value = "";
    document.getElementById("itemQty").value = "";
    document.getElementById("itemUnit").value = "count";
    closeModal();
}

function deleteItem(index) {
    inventory.splice(index, 1);
    renderInventory();
}

function adjustInventory(index, delta) {
    const item = inventory[index];
    if (!item) {
        return;
    }

    item.amount = Math.max(0, roundAmount(item.amount + delta));

    if (item.amount === 0) {
        inventory.splice(index, 1);
    }

    renderInventory();
}

function renderInventory() {
    const list = document.getElementById("inventoryList");
    list.innerHTML = "";

    if (inventory.length === 0) {
        list.appendChild(buildEmptyState("No inventory yet. Add a few staples to start tracking what you have."));
        renderRecipes();
        return;
    }

    inventory.forEach((item, index) => {
        const li = document.createElement("li");

        const info = document.createElement("div");
        info.className = "listText";

        const line = document.createElement("div");
        line.className = "itemLine";

        const name = document.createElement("span");
        name.className = "itemName";
        name.textContent = item.name;

        const meta = document.createElement("span");
        meta.className = "itemMeta";
        meta.textContent = formatInventoryAmount(item.amount, item.unit);

        line.appendChild(name);
        line.appendChild(meta);
        info.appendChild(line);

        const actions = document.createElement("div");
        actions.className = "actionRow";

        const adjusters = document.createElement("div");
        adjusters.className = "adjusterGroup";

        const decrease = document.createElement("button");
        decrease.className = "utilityButton";
        decrease.textContent = `-${getAdjustmentStep(item.unit)}`;
        decrease.onclick = () => adjustInventory(index, -getAdjustmentStep(item.unit));

        const increase = document.createElement("button");
        increase.className = "utilityButton";
        increase.textContent = `+${getAdjustmentStep(item.unit)}`;
        increase.onclick = () => adjustInventory(index, getAdjustmentStep(item.unit));

        const remove = document.createElement("button");
        remove.className = "dangerButton";
        remove.textContent = "Delete";
        remove.onclick = () => deleteItem(index);

        adjusters.appendChild(decrease);
        adjusters.appendChild(increase);
        actions.appendChild(adjusters);
        actions.appendChild(remove);

        li.appendChild(info);
        li.appendChild(actions);
        list.appendChild(li);
    });

    renderRecipes();
    renderProfilePage();
}

function addShopping() {
    const name = document.getElementById("shopInput").value.trim();
    if (!name) {
        return;
    }

    const existing = shopping.find(item => item.name.toLowerCase() === name.toLowerCase());
    if (!existing) {
        shopping.push({ name, checked: false, editing: false, draft: "" });
    } else {
        existing.checked = false;
    }

    document.getElementById("shopInput").value = "";
    renderShopping();
    renderRecipes();
}

function removeShopping(index) {
    shopping.splice(index, 1);
    renderShopping();
    renderRecipes();
}

function toggleShopping(index) {
    shopping[index].checked = !shopping[index].checked;
    renderShopping();
}

function startEditShopping(index) {
    shopping[index].editing = true;
    shopping[index].draft = shopping[index].name;
    renderShopping();
}

function updateShoppingDraft(index, value) {
    shopping[index].draft = value;
}

function saveShoppingEdit(index) {
    const item = shopping[index];
    const nextName = item.draft.trim();

    if (!nextName) {
        removeShopping(index);
        return;
    }

    item.name = nextName;
    item.editing = false;
    item.draft = "";
    renderShopping();
    renderRecipes();
}

function cancelShoppingEdit(index) {
    shopping[index].editing = false;
    shopping[index].draft = "";
    renderShopping();
}

function renderShopping() {
    const list = document.getElementById("shoppingList");
    list.innerHTML = "";

    if (shopping.length === 0) {
        list.appendChild(buildEmptyState("Nothing on the list right now."));
        return;
    }

    shopping.forEach((item, index) => {
        const li = document.createElement("li");
        if (item.checked) {
            li.classList.add("shoppingDone");
        }

        const info = document.createElement("div");
        info.className = "listText";

        if (item.editing) {
            const input = document.createElement("input");
            input.value = item.draft;
            input.oninput = event => updateShoppingDraft(index, event.target.value);
            info.appendChild(input);
        } else {
            const line = document.createElement("div");
            line.className = "itemLine";

            const name = document.createElement("span");
            name.className = "itemName";
            name.textContent = item.name;

            const meta = document.createElement("span");
            meta.className = "itemMeta";
            meta.textContent = item.checked ? "Picked up" : "Need to buy";

            line.appendChild(name);
            line.appendChild(meta);
            info.appendChild(line);
        }

        const actions = document.createElement("div");
        actions.className = "actionRow";

        if (item.editing) {
            const save = document.createElement("button");
            save.className = "primaryButton";
            save.textContent = "Save";
            save.onclick = () => saveShoppingEdit(index);

            const cancel = document.createElement("button");
            cancel.className = "secondaryButton";
            cancel.textContent = "Cancel";
            cancel.onclick = () => cancelShoppingEdit(index);

            actions.appendChild(save);
            actions.appendChild(cancel);
        } else {
            const crossOff = document.createElement("button");
            crossOff.className = "utilityButton";
            crossOff.textContent = item.checked ? "Undo" : "Cross Off";
            crossOff.onclick = () => toggleShopping(index);

            const edit = document.createElement("button");
            edit.className = "utilityButton";
            edit.textContent = "Edit";
            edit.onclick = () => startEditShopping(index);

            const remove = document.createElement("button");
            remove.className = "dangerButton";
            remove.textContent = "Delete";
            remove.onclick = () => removeShopping(index);

            actions.appendChild(crossOff);
            actions.appendChild(edit);
            actions.appendChild(remove);
        }

        li.appendChild(info);
        li.appendChild(actions);
        list.appendChild(li);
    });

    renderProfilePage();
}

function addMissingToShopping(missingItems) {
    let addedAny = false;

    missingItems.forEach(itemName => {
        const existing = shopping.find(item => item.name.toLowerCase() === itemName.toLowerCase());
        if (!existing) {
            shopping.push({ name: itemName, checked: false, editing: false, draft: "" });
            addedAny = true;
        } else if (existing.checked) {
            existing.checked = false;
        }
    });

    renderShopping();
    renderRecipes();

    if (addedAny) {
        alert("Missing ingredients added to shopping list.");
    } else {
        alert("Those ingredients are already in the shopping list.");
    }
}

function renderRecipes() {
    const list = document.getElementById("recipeList");
    list.innerHTML = "";

    if (recipes.length === 0) {
        list.appendChild(buildEmptyState("No recipes are available."));
        return;
    }

    recipes.forEach((recipe, index) => {
        const missing = getMissingIngredients(recipe);
        const canMake = missing.length === 0;
        const allMissingAlreadyInShopping = missing.length > 0 && missing.every(itemName =>
            shopping.some(item => item.name.toLowerCase() === itemName.toLowerCase())
        );

        const li = document.createElement("li");
        li.className = "recipeRow";

        const content = document.createElement("div");
        content.className = "recipeContent";

        let statusHtml = "";
        if (canMake) {
            statusHtml = '<span class="statusGood">Ready to cook with what you have.</span>';
        } else {
            statusHtml = `<span class="statusBad">Missing: ${missing.join(", ")}</span>`;
            if (allMissingAlreadyInShopping) {
                statusHtml += '<br><span class="statusQueued">Already on your shopping list.</span>';
            }
        }

        content.innerHTML = `
            <div class="recipeTitle">
                <strong>${recipe.name}</strong>
                <span class="itemMeta">${recipe.time} | Serves ${recipe.servings}</span>
            </div>
            <div class="recipeIngredients">Ingredients: ${recipe.ingredients.map(formatRecipeIngredient).join(", ")}</div>
            <div class="recipeStatus">${statusHtml}</div>
        `;

        const actions = document.createElement("div");
        actions.className = "recipeActions";

        const viewCard = document.createElement("button");
        viewCard.className = "primaryButton";
        viewCard.textContent = "View Card";
        viewCard.onclick = () => openRecipeModal(index);
        actions.appendChild(viewCard);

        if (!canMake) {
            const addMissing = document.createElement("button");
            addMissing.className = "secondaryButton";
            addMissing.textContent = "Add Missing to Shopping List";
            addMissing.onclick = () => addMissingToShopping(missing);
            actions.appendChild(addMissing);
        }

        content.appendChild(actions);
        li.appendChild(content);
        list.appendChild(li);
    });

    renderProfilePage();
}

function openRecipeModal(index) {
    const recipe = recipes[index];
    const missing = getMissingIngredients(recipe);
    const canMake = missing.length === 0;
    const card = document.getElementById("recipeCard");

    card.innerHTML = `
        <h3>${recipe.name}</h3>
        <div class="itemMeta">${recipe.time} | Serves ${recipe.servings}</div>
        <div class="cardBadge">${canMake ? "Ready with current inventory" : `Need ${missing.join(", ")}`}</div>
        <div class="cardSection">
            <h4>Ingredients</h4>
            <ul class="cardList">
                ${recipe.ingredients.map(ingredient => {
                    const inStock = inventory.some(item =>
                        item.name.toLowerCase() === ingredient.name.toLowerCase()
                    );
                    return `<li>${formatRecipeIngredient(ingredient)} ${inStock ? "(in stock)" : "(missing)"}</li>`;
                }).join("")}
            </ul>
        </div>
        <div class="cardSection">
            <h4>Steps</h4>
            <ol class="stepList">
                ${recipe.steps.map(step => `<li>${step}</li>`).join("")}
            </ol>
        </div>
    `;

    const modalButtons = document.getElementById("recipeModalButtons");
    modalButtons.innerHTML = "";

    if (!canMake) {
        const addMissing = document.createElement("button");
        addMissing.className = "primaryButton";
        addMissing.textContent = "Add Missing to Shopping List";
        addMissing.onclick = () => addMissingToShopping(missing);
        modalButtons.appendChild(addMissing);
    }

    const close = document.createElement("button");
    close.className = "secondaryButton";
    close.textContent = "Close";
    close.onclick = closeRecipeModal;
    modalButtons.appendChild(close);

    document.getElementById("recipeModal").style.display = "flex";
}

function closeRecipeModal() {
    document.getElementById("recipeModal").style.display = "none";
}

function openAddRecipeModal() {
    document.getElementById("addRecipeModal").style.display = "flex";
}

function closeAddRecipeModal() {
    document.getElementById("addRecipeModal").style.display = "none";
}

function addRecipe() {
    const name = document.getElementById("recipeNameInput").value.trim();
    const time = document.getElementById("recipeTimeInput").value.trim() || "Time not set";
    const servings = Number(document.getElementById("recipeServingsInput").value);
    const ingredientLines = document.getElementById("recipeIngredientsInput").value
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);
    const stepLines = document.getElementById("recipeStepsInput").value
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);

    if (!name || !servings || servings < 1 || ingredientLines.length === 0 || stepLines.length === 0) {
        alert("Add a name, servings, at least one ingredient, and at least one step.");
        return;
    }

    const ingredients = [];

    for (const line of ingredientLines) {
        const parsed = parseRecipeIngredientLine(line);
        if (!parsed) {
            alert('Use "amount | unit | ingredient" or "amount | ingredient" for each ingredient line.');
            return;
        }
        ingredients.push(parsed);
    }

    recipes.unshift({
        name,
        time,
        servings,
        ingredients,
        steps: stepLines
    });

    clearAddRecipeForm();
    closeAddRecipeModal();
    switchTab("tab3");
    renderRecipes();
}

function getMissingIngredients(recipe) {
    return recipe.ingredients
        .filter(ingredient =>
            !inventory.some(item => item.name.toLowerCase() === ingredient.name.toLowerCase())
        )
        .map(ingredient => ingredient.name);
}

function formatInventoryAmount(amount, unit) {
    const value = roundAmount(amount);

    if (unit === "count") {
        return `${value} ${value === 1 ? "item" : "items"}`;
    }

    if (unit === "loaf") {
        return `${value} ${value === 1 ? "loaf" : "loaves"}`;
    }

    if (unit === "box") {
        return `${value} ${value === 1 ? "box" : "boxes"}`;
    }

    if (value === 1) {
        return `1 ${unit}`;
    }

    return `${value} ${unit}s`;
}

function formatRecipeIngredient(ingredient) {
    if (ingredient.unit === "count") {
        return `${ingredient.amount} ${ingredient.name.toLowerCase()}`;
    }

    return `${ingredient.amount} ${ingredient.unit} ${ingredient.name.toLowerCase()}`;
}

function parseRecipeIngredientLine(line) {
    const parts = line.split("|").map(part => part.trim()).filter(Boolean);

    if (parts.length < 2 || parts.length > 3) {
        return null;
    }

    const amount = Number(parts[0]);
    if (!amount || amount <= 0) {
        return null;
    }

    if (parts.length === 2) {
        return {
            amount,
            unit: "count",
            name: parts[1]
        };
    }

    return {
        amount,
        unit: parts[1].toLowerCase(),
        name: parts[2]
    };
}

function getAdjustmentStep(unit) {
    if (unit === "lb" || unit === "oz" || unit === "cup") {
        return 0.5;
    }

    return 1;
}

function roundAmount(value) {
    return Math.round(value * 100) / 100;
}

function buildEmptyState(message) {
    const li = document.createElement("li");
    li.className = "emptyState";
    li.textContent = message;
    return li;
}

function clearAddRecipeForm() {
    document.getElementById("recipeNameInput").value = "";
    document.getElementById("recipeTimeInput").value = "";
    document.getElementById("recipeServingsInput").value = "";
    document.getElementById("recipeIngredientsInput").value = "";
    document.getElementById("recipeStepsInput").value = "";
}

function renderProfilePage() {
    const stats = document.getElementById("profileStats");
    const summary = document.getElementById("profileSummaryCard");

    if (!stats || !summary) {
        return;
    }

    const shoppingLeft = shopping.filter(item => !item.checked).length;
    const readyRecipes = recipes.filter(recipe => getMissingIngredients(recipe).length === 0).length;
    const inventoryTotal = inventory.length;
    const nextRecipe = recipes[0] ? recipes[0].name : "No recipes saved";

    stats.innerHTML = `
        <div class="profileStat">
            <span class="profileStatLabel">Inventory Items</span>
            <span class="profileStatValue">${inventoryTotal}</span>
        </div>
        <div class="profileStat">
            <span class="profileStatLabel">Shopping Left</span>
            <span class="profileStatValue">${shoppingLeft}</span>
        </div>
        <div class="profileStat">
            <span class="profileStatLabel">Ready Recipes</span>
            <span class="profileStatValue">${readyRecipes}</span>
        </div>
    `;

    summary.innerHTML = `
        <h3>Kitchen Summary</h3>
        <p>Saved recipes: ${recipes.length}</p>
        <p>Next recipe on deck: ${nextRecipe}</p>
        <p>${shoppingLeft === 0 ? "Shopping list is clear." : `${shoppingLeft} shopping item${shoppingLeft === 1 ? "" : "s"} still need attention.`}</p>
    `;
}

renderInventory();
renderShopping();
renderRecipes();
