document.addEventListener('DOMContentLoaded', () => {
    const signUpForm = document.getElementById('signUpForm');
    const signInForm = document.getElementById('signInForm');
    const editButton = document.getElementById('editButton');
    const editModal = document.getElementById('editModal');
    const closeModal = document.querySelector('.close');
    const editForm = document.getElementById('editForm');
    const openStoreFormBtn = document.getElementById("openStoreForm");
    const storeRegistrationModal = document.getElementById("storeRegistrationModal");
    const closeStoreFormBtn = document.getElementById("closeStoreForm");
    const storeRegistrationForm = document.getElementById("storeRegistrationForm");

    // Navigation
    const navLinks = document.querySelectorAll("nav ul li a");
    const contentSections = document.querySelectorAll(".content");

    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            contentSections.forEach(section => {
                section.classList.remove("active");
                if (section.id === targetId) {
                    section.classList.add("active");
                }
            });
        });
    });

    // Open store registration modal
    if (openStoreFormBtn) {
        openStoreFormBtn.addEventListener("click", function() {
            storeRegistrationModal.style.display = "block";
        });
    }

    if (closeStoreFormBtn) {
        closeStoreFormBtn.addEventListener("click", function() {
            storeRegistrationModal.style.display = "none";
        });
    }

    window.addEventListener("click", function(event) {
        if (event.target === storeRegistrationModal) {
            storeRegistrationModal.style.display = "none";
        }
    });

    if (signUpForm) {
        signUpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('signUpUsername').value.toLowerCase();
            const email = document.getElementById('signUpEmail').value.toLowerCase();
            const password = document.getElementById('signUpPassword').value;

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                signUpForm.reset();  // Clear the form fields after successful sign-up
            } else {
                alert(data.message);
            }
        });
    }

    if (signInForm) {
        signInForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('signInEmail').value.toLowerCase();
            const password = document.getElementById('signInPassword').value;

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('token', data.token);  // Store token in local storage
                window.location.href = '/dashboard.html';   // Redirect to the dashboard
            } else {
                alert(data.message);
            }
        });
    }

    // Function to fetch and display user information on the dashboard
    async function fetchUserInfo() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No token found, please log in.');
            window.location.href = '/';
            return;
        }

        const response = await fetch('/api/user/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('User data fetched from server:', data);  // Debugging line
            document.getElementById('username').innerText = `Username: ${data.user.username}`;
            document.getElementById('email').innerText = `Email: ${data.user.email}`;
            const profileImage = document.getElementById('profileImage');
            profileImage.src = data.user.profile_image ? `/api/user/profile-image/${data.user.id}` : 'images/default-profile.png';
            document.getElementById('editUsername').value = data.user.username;
            document.getElementById('editEmail').value = data.user.email;
        } else {
            alert('Error fetching user info, please log in again.');
            localStorage.removeItem('token');
            window.location.href = '/';
        }
    }

    // Show the modal when the edit button is clicked
    if (editButton) {
        editButton.addEventListener('click', () => {
            editModal.style.display = 'block';
        });
    }

    // Close the modal when the close button is clicked
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            editModal.style.display = 'none';
        });
    }

    // Close the modal when clicking outside of the modal content
    window.onclick = (event) => {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    }

    // Handle the form submission for editing user information
    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('editUsername').value.toLowerCase();
            const email = document.getElementById('editEmail').value.toLowerCase();
            const profileImage = document.getElementById('editProfileImage').files[0];
            const token = localStorage.getItem('token');

            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            if (profileImage) {
                formData.append('profileImage', profileImage);
            }

            const response = await fetch('/api/user/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                alert('User information updated successfully');

                // Update the user information on the dashboard without a page refresh
                document.getElementById('username').innerText = `Username: ${data.user.username}`;
                document.getElementById('email').innerText = `Email: ${data.user.email}`;
                document.getElementById('profileImage').src = `/api/user/profile-image/${data.user.id}`;

                editModal.style.display = 'none';  // Close the modal
            } else {
                alert('Error updating user information');
            }
        });
    }

    // Handle the form submission for registering a store
    if (storeRegistrationForm) {
        storeRegistrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const storeName = document.getElementById('storeName').value;
            const storeOwner = document.getElementById('storeOwner').value;
            const storeEmail = document.getElementById('storeEmail').value.toLowerCase();
            const storeAddress = document.getElementById('storeAddress').value;

            const response = await fetch('/api/store/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ storeName, storeOwner, storeEmail, storeAddress })
            });
            const data = await response.json();
            if (response.ok) {
                alert('Store registered successfully');
                storeRegistrationForm.reset();
                storeRegistrationModal.style.display = 'none';  // Close the modal
            } else {
                alert('Error registering store');
            }
        });
    }

    // Call fetchUserInfo when the dashboard page loads
    if (window.location.pathname === '/dashboard.html') {
        fetchUserInfo();
    }
});