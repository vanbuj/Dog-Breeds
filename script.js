$(document).ready(function () {
const API_URL = "http://localhost:3000/dogBreeds";



// Fetch and display dogs 
$(document).ready(function() {
  $.ajax({
    url: API_URL,
    method: "GET",
    success: function(dogs) {
      displayDogs(dogs);
    },
    error: function(err) {
      console.error("Error fetching dogs:", err);
    }
  });
});

// cards
function displayDogs(dogs) {
  const $container = $("#dogList");
  $container.empty();

  dogs.forEach(dog => {
    const card = `
      <div class="col-md-4 col-lg-3">
        <div class="card h-100">
          <img src="${dog.image}" alt="${dog.breed}" class="card-img-top">
          <div class="card-body text-center">
            <h5 class="card-title">${dog.breed}</h5>
            <p class="card-text"><strong>Origin:</strong> ${dog.origin}</p>
            <p class="card-text"><strong>Temperament:</strong> ${dog.temperament}</p>
          </div>
        </div>
      </div>
    `;
    $container.append(card);
 
});

}

})

const DOGS_API = "http://localhost:3000/dogs";
const FAVS_API = "http://localhost:3000/favorites";

$(document).ready(function () {
  // Load breeds into dropdown
  $.ajax({
    url: DOGS_API,
    method: "GET",
    success: function (dogs) {
      dogs.forEach((dog) => {
        $("#breedSelect").append(`<option value="${dog.breed}">${dog.breed}</option>`);
      });
    },
    error: function () {
      alert("Error loading dog breeds!");
    },
  });

  // Load saved favorites from json-server
  loadFavorites();

  // Add breed to favorites list (POST)
  $("#addBreedBtn").on("click", function () {
    const selectedBreed = $("#breedSelect").val();
    if (!selectedBreed) {
      alert("Please select a breed first!");
      return;
    }

    // Grab user info if saved
    const user = JSON.parse(localStorage.getItem("userInfo")) || {};
    const favorite = {
      userName: user.userName || "Guest",
      breed: selectedBreed
    };

    // POST favorite to json-server
    $.ajax({
      url: FAVS_API,
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(favorite),
      success: function () {
        loadFavorites(); // refresh list
      },
      error: function () {
        alert("Error saving favorite!");
      },
    });
  });

  // Save user info locally
  $("#userForm").on("submit", function (e) {
    e.preventDefault();
    const userName = $("#userName").val();
    const userEmail = $("#userEmail").val();
    localStorage.setItem("userInfo", JSON.stringify({ userName, userEmail }));
    alert(`Saved info for ${userName}!`);
  });

  // Load user info if available
  const savedUser = localStorage.getItem("userInfo");
  if (savedUser) {
    const { userName, userEmail } = JSON.parse(savedUser);
    $("#userName").val(userName);
    $("#userEmail").val(userEmail);
  }
});

// Function: Load and display favorites
function loadFavorites() {
  $.ajax({
    url: FAVS_API,
    method: "GET",
    success: function (favorites) {
      $("#breedList").empty();
      favorites.forEach((fav) => {
        const listItem = $(`
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${fav.breed} <span class="text-muted small">(${fav.userName})</span>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${fav.id}">❌</button>
          </li>
        `);
        $("#breedList").append(listItem);
      });

      // Delete button
      $(".delete-btn").on("click", function () {
        const id = $(this).data("id");
        deleteFavorite(id);
      });
    },
  });
}

// Function: Delete favorite from json-server
function deleteFavorite(id) {
  $.ajax({
    url: `${FAVS_API}/${id}`,
    method: "DELETE",
    success: function () {
      loadFavorites(); // refresh list
    },
    error: function () {
      alert("Error deleting favorite!");
    },
  });
}
