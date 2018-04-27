var first = document.querySelector(".header-form__icon-search"),
	second = document.querySelector(".header-form__wrapper"),
	third = document.querySelector(".header-form__button"),
	forth = document.querySelector("input[type='text']");

second.addEventListener('mouseenter', function(){
	second.classList.toggle("wrapperForm-JS");
	third.classList.toggle("iconForm-JS");
	forth.focus();
});

second.addEventListener('mouseleave', function(){
	second.classList.toggle("wrapperForm-JS");
	third.classList.toggle("iconForm-JS");
	forth.focus();
});

