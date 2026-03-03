const modalBackdrop = document.getElementById('modalBackdrop');
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');

if (openModalBtn && modalBackdrop) {
    openModalBtn.addEventListener('click', () => {
        modalBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
}

if (closeModalBtn && modalBackdrop) {
    closeModalBtn.addEventListener('click', () => {
        modalBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    });
}

if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            modalBackdrop.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

document.querySelectorAll('.service-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        tag.classList.toggle('selected');
    });
});

const bookingForm = document.getElementById('bookingForm');
const confirmToast = document.getElementById('confirmToast');
const toastBody = document.getElementById('toastBody');

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = bookingForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerText;

        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;
       
        const selectedServices = Array.from(
            document.querySelectorAll('.service-tag.selected')
        )
        .map(tag => tag.dataset.service)
        .join(', ') || 'None selected';
       
        const rawDate = document.getElementById('dateInput').value;
        const rawTime = document.getElementById('timeInput').value;

        const dateObj = new Date(rawDate + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const [h, m] = rawTime.split(':');
        const hour = parseInt(h);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        const formattedTime = `${hour12}:${m} ${ampm}`;

        const templateParams = {
            user_name: document.getElementById('fullName').value,
            user_email: document.getElementById('email').value,
            contact_number:
                document.getElementById('countryCode').value + ' ' +
                document.getElementById('phoneInput').value,
            company_name:
                document.getElementById('companyName').value || 'Not provided',
            your_role:
                document.getElementById('yourRole').value || 'Not provided',
            services: selectedServices,
            pref_date: formattedDate,
            pref_time: formattedTime,
            platform: document.getElementById('platformSelect').value,
        };

        const serviceID = 'Book-a-meeting'; 
        const templateID = 'template_6kljic5';

        emailjs.send(serviceID, templateID, templateParams)
            .then(() => {
             
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                
                modalBackdrop.classList.remove('open');
                document.body.style.overflow = '';
                
                bookingForm.reset();
                document.querySelectorAll('.service-tag.selected')
                    .forEach(tag => tag.classList.remove('selected'));
                
                toastBody.innerHTML = `
                    Your meeting has been scheduled for 
                    <strong>${formattedDate}</strong> at 
                    <strong>${formattedTime} (IST)</strong>.
                `;
                confirmToast.classList.add('show');

                setTimeout(() => {
                    confirmToast.classList.remove('show');
                }, 5000);
            })
            .catch((error) => {
                console.error('EmailJS Error:', error);

                submitBtn.innerText = 'Failed';
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            });
    });
}
