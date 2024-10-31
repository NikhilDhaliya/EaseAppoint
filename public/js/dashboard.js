document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = '/login';
        return;
    }

    // Set user greeting
    document.getElementById('userGreeting').textContent = `Welcome, ${user.name}!`;

    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    });

    // Handle sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    const sections = document.querySelectorAll('.dashboard-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active states
            sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Load appointments
    loadAppointments();

    // Handle booking form
    const bookingForm = document.querySelector('.booking-form');
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        bookAppointment();
    });

    // Handle profile form
    const profileForm = document.getElementById('profileForm');
    loadProfile();
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateProfile();
    });

    // Add event listeners
    document.getElementById('serviceType').addEventListener('change', loadServiceProviders);
    document.getElementById('location').addEventListener('change', loadServiceProviders);
    document.getElementById('date').addEventListener('change', loadTimeSlots);

    // Add to the DOMContentLoaded event handler
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const preSelectedService = urlParams.get('service');
    if (preSelectedService) {
        // Switch to booking section
        document.querySelector('a[href="#book"]').click();
        
        // Set the service type
        const serviceSelect = document.getElementById('serviceType');
        serviceSelect.value = preSelectedService;
        serviceSelect.dispatchEvent(new Event('change'));
    }
});

async function loadAppointments() {
    try {
        const response = await fetch('/api/appointments', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const appointments = await response.json();
        
        const appointmentsGrid = document.querySelector('.appointments-grid');
        appointmentsGrid.innerHTML = appointments.map(appointment => `
            <div class="appointment-card">
                <h3>${appointment.serviceType}</h3>
                <p>Date: ${new Date(appointment.date).toLocaleDateString()}</p>
                <p>Time: ${appointment.time}</p>
                <p>Location: ${appointment.location}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

async function bookAppointment() {
    const formData = {
        serviceType: document.getElementById('serviceType').value,
        location: document.getElementById('location').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value
    };

    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Appointment booked successfully!');
            loadAppointments();
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Failed to book appointment. Please try again.');
    }
}

function loadProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('profileName').value = user.name;
    document.getElementById('profileEmail').value = user.email;
}

async function updateProfile() {
    const formData = {
        name: document.getElementById('profileName').value
    };

    try {
        const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert('Profile updated successfully!');
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
    }
}

async function loadServiceProviders() {
    const serviceType = document.getElementById('serviceType').value;
    const location = document.getElementById('location').value;

    if (!serviceType || !location) return;

    try {
        const response = await fetch(`/api/providers?serviceType=${serviceType}&location=${location}`);
        const providers = await response.json();
        
        const providerSelect = document.createElement('select');
        providerSelect.id = 'provider';
        providerSelect.required = true;
        providerSelect.innerHTML = `
            <option value="">Select a provider</option>
            ${providers.map(provider => `
                <option value="${provider._id}">
                    ${provider.name} (Rating: ${provider.rating.toFixed(1)})
                </option>
            `).join('')}
        `;

        const providerGroup = document.createElement('div');
        providerGroup.className = 'form-group';
        providerGroup.innerHTML = '<label for="provider">Select Provider</label>';
        providerGroup.appendChild(providerSelect);

        const timeGroup = document.querySelector('#time').parentElement;
        timeGroup.parentElement.insertBefore(providerGroup, timeGroup);

        providerSelect.addEventListener('change', loadTimeSlots);
    } catch (error) {
        console.error('Error loading providers:', error);
    }
}

async function loadTimeSlots() {
    const providerId = document.getElementById('provider').value;
    const date = document.getElementById('date').value;

    if (!providerId || !date) return;

    try {
        const response = await fetch(`/api/providers/time-slots?providerId=${providerId}&date=${date}`);
        const { timeSlots } = await response.json();
        
        const timeSelect = document.getElementById('time');
        timeSelect.innerHTML = `
            <option value="">Select a time</option>
            ${timeSlots.map(time => `
                <option value="${time}">${time}</option>
            `).join('')}
        `;
    } catch (error) {
        console.error('Error loading time slots:', error);
    }
}
