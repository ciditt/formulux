// script.js

document.addEventListener("DOMContentLoaded", () => {
  const quizForm = document.getElementById("hair-quiz-form");
  const productSection = document.getElementById("product-section");

  // Form fields
  const nameInput = document.getElementById("quiz-name");
  const hairTypeInputs = document.getElementsByName("hairType");
  const textureInputs = document.getElementsByName("texture");
  const scalpTypeInputs = document.getElementsByName("scalpType");
  const goalInputs = document.getElementsByName("goals");

  // Dynamic display elements in the product section
  const headlineHairType = document.getElementById("headline-hair-type");
  const headlineScalpType = document.getElementById("headline-scalp-type");
  const headlineGoals = document.getElementById("headline-goals");
  const ingredientList = document.getElementById("ingredient-list");
  const personalizationName = document.getElementById("personalization-name");
  const totalPriceEl = document.getElementById("total-price");
  const sizeOptions = document.getElementsByName("sizeOption");
  const addToCartBtn = document.getElementById("add-to-cart-btn");

  // When quiz form is submitted:
  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // 1) Read quiz inputs
    const userName = nameInput.value.trim() || "Friend";
    let hairType = "";
    let texture = "";
    let scalpType = "";
    let selectedGoals = [];

    hairTypeInputs.forEach((inp) => {
      if (inp.checked) hairType = inp.value;
    });
    textureInputs.forEach((inp) => {
      if (inp.checked) texture = inp.value;
    });
    scalpTypeInputs.forEach((inp) => {
      if (inp.checked) scalpType = inp.value;
    });
    goalInputs.forEach((inp) => {
      if (inp.checked) selectedGoals.push(inp.value);
    });

    // 2) Populate headline
    headlineHairType.textContent = `${hairType.toLowerCase()}, ${texture.toLowerCase()}`;
    headlineScalpType.textContent = scalpType.toLowerCase();
    headlineGoals.textContent = selectedGoals.length
      ? selectedGoals.map((g) => g.toLowerCase()).join(", ")
      : "general care";

    // 3) Determine 4 Key Ingredients based on logic
    const ingredients = computeIngredients(hairType, texture, scalpType, selectedGoals);

    // Clear any existing <li> items, then inject new ones
    ingredientList.innerHTML = "";
    ingredients.forEach((ing) => {
      const li = document.createElement("li");
      li.textContent = `${ing.name} — ${ing.benefit}`;
      ingredientList.appendChild(li);
    });

    // 4) Personalization
    personalizationName.textContent = userName;

    // 5) Show the product section (it was hidden by default)
    productSection.classList.remove("hidden");

    // 6) Reset price display (until user picks a size)
    totalPriceEl.textContent = "—";

    // 7) Make sure none of the size radios are pre‐checked
    sizeOptions.forEach((r) => (r.checked = false));
  });

  // Whenever a size option is selected, update Total Price
  sizeOptions.forEach((radio) => {
    radio.addEventListener("change", () => {
      const price = radio.getAttribute("data-price");
      totalPriceEl.textContent = `NPR ${price}`;
    });
  });

  // “Add to Cart” simply logs everything to the console for now
  addToCartBtn.addEventListener("click", () => {
    // Gather all data
    const chosenSizeRadio = Array.from(sizeOptions).find((r) => r.checked);
    if (!chosenSizeRadio) {
      alert("Please select a size before adding to cart.");
      return;
    }
    const sizeName = chosenSizeRadio.value;
    const sizePrice = chosenSizeRadio.getAttribute("data-price");

    const cartData = {
      name: personalizationName.textContent,
      hairType: headlineHairType.textContent,
      scalpType: headlineScalpType.textContent,
      goals: headlineGoals.textContent.split(", ").map((g) => g.trim()),
      ingredients: Array.from(ingredientList.children).map((li) => li.textContent),
      size: sizeName,
      priceNPR: sizePrice,
    };

    console.log("Add to Cart →", cartData);
    alert(
      `Added to cart:
Name: ${cartData.name}
Size: ${cartData.size} — NPR ${cartData.priceNPR}`
    );
    // You can replace the console.log / alert with real checkout logic here.
  });
});

/**
 * computeIngredients()
 * A simple “decision tree” that returns exactly four ingredients (with one‐line benefit)
 * based on the user’s hairType, texture, scalpType, and goals[].
 *
 * You can expand this to cover every possible combination. For brevity, we include a few examples:
 */
function computeIngredients(hairType, texture, scalpType, goals) {
  // Normalize everything to lowercase for comparison:
  const ht = hairType.toLowerCase();
  const tx = texture.toLowerCase();
  const st = scalpType.toLowerCase();
  const gl = goals.map((g) => g.toLowerCase());

  // If user wants Frizz control + Repair & Strengthen on medium/wavy/dry, etc.
  if (
    ht === "medium" &&
    tx === "wavy" &&
    st === "dry" &&
    gl.includes("frizz control") &&
    gl.includes("repair & strengthen")
  ) {
    return [
      { name: "Argan Oil", benefit: "Deep hydration" },
      { name: "Keratin Complex", benefit: "Repair & strengthen" },
      { name: "Hyaluronic Acid", benefit: "Moisture retention" },
      { name: "Lavender Essential Oil", benefit: "Calming scent" },
    ];
  }

  // If thin/straight/oily + Anti-dandruff + Volume:
  if (
    ht === "thin" &&
    tx === "straight" &&
    st === "oily" &&
    gl.includes("anti-dandruff") &&
    gl.includes("volume")
  ) {
    return [
      { name: "Tea Tree Oil", benefit: "Anti-dandruff, clarifying" },
      { name: "Biotin Complex", benefit: "Volume & strengthen" },
      { name: "Aloe Vera Extract", benefit: "Soothing, lightweight" },
      { name: "Peppermint Essential Oil", benefit: "Refreshing scalp circulation" },
    ];
  }

  # If thick/curly/balanced + Shine + Repair & Strengthen:
  if (
    ht === "thick" &&
    tx === "curly" &&
    st === "balanced" &&
    gl.includes("shine") &&
    gl.includes("repair & strengthen")
  ) {
    return [
      { name: "Coconut Oil", benefit: "Natural shine & conditioning" },
      { name: "Protein Blend", benefit: "(Keratin + wheat protein) repair" },
      { name: "Jojoba Oil", benefit: "Curl definition & scalp health" },
      { name: "Rosehip Oil", benefit: "Antioxidant & shine boost" },
    ];
  }

  # If coily/sensitive + Repair & Strengthen + Anti-dandruff:
  if (
    ht === "coily" &&
    st === "sensitive" &&
    gl.includes("repair & strengthen") &&
    gl.includes("anti-dandruff")
  ) {
    return [
      { name: "Shea Butter", benefit: "Intense moisture & repair" },
      { name: "Zinc Pyrithione", benefit: "Gentle anti-dandruff" },
      { name: "Avocado Oil", benefit: "Nourishing & repair" },
      { name: "Chamomile Extract", benefit: "Soothing for sensitive scalp" },
    ];
  }

  # Fallback if no specific combination matches:
  # 4 gentle all-purpose ingredients:
  return [
    { name: "Coconut Oil", benefit: "Natural hydration" },
    { name: "Aloe Vera Extract", benefit: "Soothing & nourishment" },
    { name: "Keratin Complex", benefit: "Repair & strengthen" },
    { name: "Lavender Essential Oil", benefit: "Calming scent" },
  ];
}
