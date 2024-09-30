const burgerBtn = document.querySelector('.burger-btn');
const navMenu = document.querySelector('.nav__menu');
const menuLink = document.querySelectorAll('.nav__menu a');
const copyrightDateSpan = document.querySelector('.copyright-date');

const showMobileMenu = () => {
	navMenu.classList.add('nav__mobile-menu');
};

const hideMobileMenu = () => {
	navMenu.classList.remove('nav__mobile-menu');
};

const setCurrentYear = () => {
	const year = new Date().getFullYear();
	copyrightDateSpan.textContent = year;
};

menuLink.forEach((element) => {
	element.addEventListener('click', hideMobileMenu);
});

burgerBtn.addEventListener('click', showMobileMenu);

setCurrentYear();
