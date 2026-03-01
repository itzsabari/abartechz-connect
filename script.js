const cards = document.querySelectorAll('.stat-card');
let current = 0;
let isAnimating = false;

function showCard(index) {
  if (isAnimating) return;
  isAnimating = true;
  const currentCard = cards[current];
  const nextCard = cards[index];
  currentCard.classList.remove('entering');
  currentCard.classList.add('leaving');

  setTimeout(() => {
    currentCard.classList.remove('leaving');
    currentCard.style.opacity = '0';
    currentCard.style.transform = 'translateY(30px) scale(0.95)';

    nextCard.classList.add('entering');
    current = index;

    setTimeout(() => {
      nextCard.classList.remove('entering');
      nextCard.style.opacity = '1';
      nextCard.style.transform = 'none';
      isAnimating = false;
    }, 600);
  }, 500);
}

cards[0].classList.add('entering');
setTimeout(() => {
  cards[0].classList.remove('entering');
  cards[0].style.opacity = '1';
  cards[0].style.transform = 'none';
}, 600);

setInterval(() => {
  const next = (current + 1) % cards.length;
  showCard(next);
}, 3000);

const backdrop = document.getElementById('modalBackdrop');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');

openBtn.addEventListener('click', () => {
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
});


function closeModal() {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}
closeBtn.addEventListener('click', closeModal);

backdrop.addEventListener('click', (e) => {
  if (e.target === backdrop) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

document.querySelectorAll('.service-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    tag.classList.toggle('selected');
  });
});

const form = document.getElementById('bookingForm');
const toast = document.getElementById('confirmToast');
const toastBody = document.getElementById('toastBody');

let toastTimeout;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const date = document.getElementById('dateInput').value;
  const time = document.getElementById('timeInput').value;
  const platform = document.getElementById('platformSelect').value;
  if (!date || !time || !platform) return;
  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const formattedTime = `${hour12}:${m} ${ampm}`;

  toastBody.innerHTML = `Your Meeting was scheduled on <strong>${formattedDate}</strong> at <strong>${formattedTime} (IST)</strong> through <strong>${platform}</strong>.`;

  closeModal();
  clearTimeout(toastTimeout);
  const progress = document.getElementById('toastProgress');
  progress.style.animation = 'none';
  void progress.offsetWidth;
  progress.style.animation = 'toastProgress 5s linear forwards';
  toast.classList.add('show');
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => fullReset(), 450);
  }, 5000);
});

function fullReset() {
  form.reset();
  document.querySelectorAll('.service-tag').forEach(t => t.classList.remove('selected'));
  const platformEl = document.getElementById('platformSelect');
  platformEl.selectedIndex = 0;
  document.getElementById('dateInput').value = '';
  document.getElementById('timeInput').value = '';
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

const today = new Date().toISOString().split('T')[0];
document.getElementById('dateInput').min = today;

const fullName = document.querySelector('input[type="text"]').value;
const email = document.querySelector('input[type="email"]').value;
const countryCode = document.getElementById('countryCode').value;
const phone = document.getElementById('phoneInput').value;
const company = document.querySelectorAll('input[type="text"]')[1].value;
const role = document.querySelectorAll('input[type="text"]')[2].value;


let selectedServices = [];
document.querySelectorAll('.service-tag.selected').forEach(tag => {
  selectedServices.push(tag.dataset.service);
});

const templateParams = {
  full_name: fullName,
  email: email,
  country_code: countryCode,
  phone: phone,
  company: company,
  role: role,
  services: selectedServices.join(', '),
  date: formattedDate,
  time: formattedTime,
  platform: platform
};

emailjs.send("service_kswavk8", "template_rrtrbxx", templateParams)
  .then(function (response) {
    console.log("SUCCESS!", response.status, response.text);
  }, function (error) {
    console.log("FAILED...", error);
  });


