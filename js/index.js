document.addEventListener("DOMContentLoaded", function () {
    const listPanel = document.getElementById("list-panel");
    const showPanel = document.getElementById("show-panel");

    // Fetch and display books
    fetchBooks();

    // Event listener for the list panel to handle book title clicks
    listPanel.addEventListener("click", function (event) {
        if (event.target.tagName === "LI") {
            const bookId = event.target.dataset.id;
            displayBookDetails(bookId);
        }
    });

    // Event listener for the show panel to handle like button clicks
    showPanel.addEventListener("click", function (event) {
        if (event.target.id === "like-btn") {
            const bookId = event.target.dataset.id;
            likeBook(bookId);
        }
    });
});

function fetchBooks() {
    fetch("http://localhost:3000/books")
        .then(response => response.json())
        .then(books => displayBooks(books))
        .catch(error => console.error("Error fetching books:", error));
}

function displayBooks(books) {
    const list = document.getElementById("list");

    books.forEach(book => {
        const li = document.createElement("li");
        li.textContent = book.title;
        li.dataset.id = book.id;
        list.appendChild(li);
    });
}

function displayBookDetails(bookId) {
    const showPanel = document.getElementById("show-panel");

    // Fetch book details using bookId
    fetch(`http://localhost:3000/books/${bookId}`)
        .then(response => response.json())
        .then(book => {
            // Display book details in the show panel
            const html = `
                <h2>${book.title}</h2>
                <img src="${book.img_url}" alt="${book.title}">
                <p>${book.description}</p>
                <button id="like-btn" data-id="${book.id}">Like</button>
                <ul>${getUsersList(book.users)}</ul>
            `;
            showPanel.innerHTML = html;
        })
        .catch(error => console.error("Error fetching book details:", error));
}

function getUsersList(users) {
    return users.map(user => `<li>${user.username}</li>`).join("");
}

function likeBook(bookId) {
    const currentUser = {
        id: 1,
        username: "pouros"
    };

    // Fetch book details
    fetch(`http://localhost:3000/books/${bookId}`)
        .then(response => response.json())
        .then(book => {
            // Check if the user has already liked the book
            const hasLiked = book.users.some(user => user.id === currentUser.id);

            // If not liked, add the user to the list
            if (!hasLiked) {
                book.users.push(currentUser);

                // Send PATCH request to update the users array
                fetch(`http://localhost:3000/books/${bookId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ users: book.users })
                })
                    .then(response => response.json())
                    .then(updatedBook => {
                        displayBookDetails(bookId);
                    })
                    .catch(error => console.error("Error updating book:", error));
            } else {
            }
        })
        .catch(error => console.error("Error fetching book details:", error));
}