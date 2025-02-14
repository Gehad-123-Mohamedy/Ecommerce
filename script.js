
//#region  Navigation
document.querySelector("#search-icon").onclick = () => {
    document.querySelector(".search-box").classList.toggle("active");
    document.querySelector(".cart").classList.remove("active");
    document.querySelector(".user").classList.remove("active");
};

document.querySelector("#cart-icon").onclick = () => {
    document.querySelector(".cart").classList.toggle("active");
    document.querySelector(".search-box").classList.remove("active");
    document.querySelector(".user").classList.remove("active");
};

document.querySelector("#user-icon").onclick = () => {
    document.querySelector(".user").classList.toggle("active");
    document.querySelector(".search-box").classList.remove("active");
    document.querySelector(".cart").classList.remove("active");
};
//#endregion

//#region  Slider
let currentIndex = 0;

function moveSlide(direction) {
    const slides = document.querySelectorAll('.swiper-slide');
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = slides.length - 1; 
    } 
    else if (currentIndex >= slides.length) {
        currentIndex = 0; 
    }
    const offset = -currentIndex * 100;
    document.querySelector('.swiper-wrapper').style.transform = `translateX(${offset}%)`;
}
//#endregion

//#region Login Validation
document.getElementById('myForm').addEventListener('submit', function(event) {
    const nameInput = document.getElementById('Name');
    const passwordInput = document.getElementById('Password');
    const confirmPasswordInput = document.getElementById('ConfirmPassword');
    const passwordError = document.getElementById('passwordError');
    let valid = true;
    passwordError.textContent = ''; 
    if (nameInput.value.length < 3) {
      alert('Name must be at least 3 characters long.');
      valid = false;
      return;

    }
    if (passwordInput.value.length < 6) {
      alert('Password must be at least 6 characters long.');
      valid = false;
      return;

    }
    if (passwordInput.value !== confirmPasswordInput.value) {
      passwordError.textContent = 'Passwords do not match.';
      valid = false;
      return;

    }
    if (!valid) {
      event.preventDefault();
      event.stopPropagation()
    }
    if (valid){
        const name = document.getElementById('Name').value;
        const email = document.getElementById('Email').value;
        setUserData(name, email);
        alert('Login successful!'); 
        event.stopPropagation()
    }
  });

function isUserLoggedIn() {
    return document.cookie.split(';').some((item) => item.trim().startsWith('user='));
}

function setUserData(name, email) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 20);
    document.cookie = `user=${JSON.stringify({ name, email })}; expires=${expirationDate.toUTCString()}; path=/`;

}

//#endregion

//#region Product-Details
const productBoxes = document.querySelectorAll('.product-box');
productBoxes.forEach(box => {
    box.addEventListener('click', function() {
        const productImgSrc = box.querySelector("img").src;
        const productPrice = box.querySelector(".price").textContent;
        const productTitle = box.querySelector(".cart-product-detail").textContent;

        window.location.href = `product-details.html?name=${encodeURIComponent(productTitle)}&price=${encodeURIComponent(productPrice)}&image=${encodeURIComponent(productImgSrc)}`;
    });
});

//#endregion

//#region Add Products To cart
const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector("#cart-close");
cartIcon.addEventListener("click", () => cart.classList.add("active"));
cartClose.addEventListener("click", () => cart.classList.remove("active"));

const addCartButtons = document.querySelectorAll(".add-cart");
addCartButtons.forEach(button => {
    button.addEventListener("click", event => {
        event.stopPropagation();
        if (!isUserLoggedIn()) {
            alert("Please Login to be able to add products to Your Cart")
            return;
        }
        const productBox = event.target.closest(".product-box");
        addToCart(productBox);
    });
});

const cartContent = document.querySelector(".cart-content");
const addToCart = productBox => {
    const productImgSrc = productBox.querySelector("img").src;
    const productPrice = productBox.querySelector(".price").textContent;
    const productTitle = productBox.querySelector(".cart-product-detail").textContent;
    const cartItems = cartContent.querySelectorAll(".cart-title");

    for (let item of cartItems) {
        if (item.textContent == productTitle) {
            alert("This item is already in the cart");
            return;
        }
    }

    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `
        <img src="${productImgSrc}" alt="" class="cart-img">
        <div class="cart-detail">
            <h2 class="cart-title">${productTitle}</h2>
            <span class="cart-price">${productPrice}</span>
            <div class="cart-quantity">
                <button id="increment">+</button>
                <span class="number">1</span>
                <button id="decrement">-</button>
            </div>
        </div>
        <i class='bx bxs-trash cart-remove'></i>
    `;
    cartContent.appendChild(cartBox);
    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
        cartBox.remove();
        updateTotalPrice();
    });

    cartBox.querySelector(".cart-quantity").addEventListener("click", event => {
        const numberElement = cartBox.querySelector(".number");
        const decrementButton = cartBox.querySelector("#decrement");
        const incrementButton = cartBox.querySelector("#increment");
        
        let quantity = numberElement.textContent;
        if (event.target.id === "decrement" && quantity > 1) {
            quantity--;
            if (quantity === 1) {
                decrementButton.style.color = "#999";
                incrementButton.style.color = "#333";
            }
        } else if (event.target.id === "increment") {
            quantity++;
            incrementButton.style.color = "#999";
            decrementButton.style.color = "#333";
        }
        numberElement.textContent = quantity;
        updateTotalPrice();
    });
    updateTotalPrice();
};

const updateTotalPrice = () => {
    const totalPriceElement = document.querySelector(".total-price");
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    let total = 0;

    cartBoxes.forEach(cartbox => {
        const priceElement = cartbox.querySelector(".cart-price");
        const quantityElement = cartbox.querySelector(".number");
        const price = parseFloat(priceElement.textContent.replace("$", ""));
        const quantity = parseInt(quantityElement.textContent);
        total += price * quantity;
    });
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
};

document.querySelector(".btn-buy").addEventListener("click", () => {
    const cartBoxes = cartContent.querySelectorAll(".cart-box");
    if (cartBoxes.length === 0) {
        alert("Your Cart is Empty, please add items.");
        return;
    }
    cartBoxes.forEach(cartBox => cartBox.remove());
    updateTotalPrice();
    alert("Thank You for Your Purchase!");
});

//#endregion
