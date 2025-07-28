
document.addEventListener("DOMContentLoaded", loadMeals);

function loadMeals() {
  const mealsGrid = document.getElementById("mealsGrid");
  mealsGrid.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then(res => res.json())
      .then(data => {
        const meal = data.meals[0];
        const col = document.createElement("div");
        col.className = "col-md-4 col-sm-6";

        col.innerHTML = `
          <div class="card h-100 shadow-sm" role="button">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
            <div class="card-body">
              <h5 class="card-title">${meal.strMeal}</h5>
            </div>
          </div>
        `;

        col.querySelector(".card").addEventListener("click", () => showMealModal(meal));
        mealsGrid.appendChild(col);
      });
  }
}

// ✅ إظهار تفاصيل الوصفة داخل Modal
function showMealModal(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${meas} ${ing}`);
  }

  document.getElementById("mealDetails").innerHTML = `
    <img src="${meal.strMealThumb}" class="img-fluid rounded mb-3" alt="${meal.strMeal}">
    <h4>${meal.strMeal}</h4>
    <h6 class="mt-3">المكونات:</h6>
    <ul>${ingredients.map(item => `<li>${item}</li>`).join("")}</ul>
    <h6 class="mt-3">طريقة التحضير:</h6>
    <p>${meal.strInstructions}</p>
    ${meal.strYoutube ? `<div class="ratio ratio-16x9 mt-3">
      <iframe src="https://www.youtube.com/embed/${meal.strYoutube.split("v=")[1]}" allowfullscreen></iframe>
    </div>` : ""}
  `;

  const modal = new bootstrap.Modal(document.getElementById("mealModal"));
  modal.show();
}

// ✅ البحث عن وصفة
function searchMeal(event) {
  event.preventDefault(); // منع تحديث الصفحة
  const query = document.getElementById("searchInput").value.trim();
  const mealsGrid = document.getElementById("mealsGrid");
  mealsGrid.innerHTML = "";

  if (query === "") {
    loadMeals(); // لو مفيش بحث، نعرض وصفات عشوائية
    return;
  }

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then(res => res.json())
    .then(data => {
      if (data.meals) {
        data.meals.forEach(meal => {
          const col = document.createElement("div");
          col.className = "col-md-4 col-sm-6";

          col.innerHTML = `
            <div class="card h-100 shadow-sm" role="button">
              <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
              <div class="card-body">
                <h5 class="card-title">${meal.strMeal}</h5>
              </div>
            </div>
          `;

          col.querySelector(".card").addEventListener("click", () => showMealModal(meal));
          mealsGrid.appendChild(col);
        });
      } else {
        mealsGrid.innerHTML = `<p class="text-danger text-center">😞 لم يتم العثور على وصفات بهذا الاسم.</p>`;
      }
    });
}
