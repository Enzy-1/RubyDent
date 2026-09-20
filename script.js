const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const siteHeader = document.querySelector('.site-header');
const backToTop = document.querySelector('.back-to-top');
const appointmentForm = document.querySelector('#appointment-form');
const appointmentDate = document.querySelector('#appointment-date');
const calendarPicker = document.querySelector('.calendar-picker');

if (appointmentDate) {
  const today = new Date();
  const formatDate = (date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  const minimumDate = formatDate(today);
  const monthFormatter = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' });
  const selectedFormatter = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  const calendarMonth = calendarPicker?.querySelector('[data-calendar-month]');
  const calendarDays = calendarPicker?.querySelector('[data-calendar-days]');
  const calendarSelected = calendarPicker?.querySelector('[data-calendar-selected]');
  const previousMonth = calendarPicker?.querySelector('[data-calendar-prev]');
  const nextMonth = calendarPicker?.querySelector('[data-calendar-next]');
  let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const renderCalendar = () => {
    if (!calendarPicker || !calendarDays) return;
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingOffset = firstDay === 0 ? 6 : firstDay - 1;
    const minimumMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    calendarMonth.textContent = monthFormatter.format(visibleMonth);
    previousMonth.disabled = visibleMonth <= minimumMonth;
    calendarDays.innerHTML = '';

    for (let index = 0; index < startingOffset; index += 1) {
      calendarDays.append(document.createElement('span'));
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      const dateValue = formatDate(date);
      const dayButton = document.createElement('button');
      dayButton.type = 'button';
      dayButton.className = 'calendar-day';
      dayButton.textContent = day;
      dayButton.setAttribute('role', 'gridcell');
      dayButton.setAttribute('aria-label', selectedFormatter.format(date));
      dayButton.disabled = dateValue < minimumDate;
      if (dateValue === minimumDate) dayButton.classList.add('is-today');
      if (dateValue === appointmentDate.value) {
        dayButton.classList.add('is-selected');
        dayButton.setAttribute('aria-selected', 'true');
      }
      dayButton.addEventListener('click', () => {
        appointmentDate.value = dateValue;
        calendarSelected.textContent = `Fecha elegida: ${selectedFormatter.format(date)}`;
        renderCalendar();
      });
      calendarDays.append(dayButton);
    }
  };

  previousMonth?.addEventListener('click', () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  nextMonth?.addEventListener('click', () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    renderCalendar();
  });

  appointmentDate.min = minimumDate;
  renderCalendar();
}

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelectorAll('img').forEach((image) => {
  image.setAttribute('draggable', 'false');
  image.addEventListener('contextmenu', (event) => event.preventDefault());
  image.addEventListener('dragstart', (event) => event.preventDefault());
});

window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 36);
  backToTop?.classList.toggle('is-visible', window.scrollY > 500);
}, { passive: true });

backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

appointmentForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(appointmentForm);
  const message = [
    'Hola RubyDent, quiero solicitar una cita.',
    `Nombre: ${formData.get('name')}`,
    `Celular: ${formData.get('phone')}`,
    `Servicio: ${formData.get('service')}`,
    `Sede: ${formData.get('location')}`,
    `Fecha preferida: ${formData.get('date')}`,
    `Horario preferido: ${formData.get('time')}`
  ].join('\n');
  window.open(`https://wa.me/573137534340?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});

const scrollItems = document.querySelectorAll('.reveal-on-scroll, .service-item, .location-card');
const revealOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14 });

scrollItems.forEach((item) => revealOnScroll.observe(item));