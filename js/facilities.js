function loadFacilities() {

    const facilities =
        JSON.parse(localStorage.getItem("facilitiesData")) || [];

    const container =
        document.getElementById("facilitiesContainer");

    container.innerHTML = "";

    facilities.forEach(item => {

        container.innerHTML += `
            <div class="facility-card">

                <img src="${item.image}" alt="${item.name}">

                <div class="facility-info">

                    <h3>${item.name}</h3>

                    <p>${item.description}</p>

                </div>

            </div>
        `;
    });
}

loadFacilities();