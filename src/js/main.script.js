'use strict';

import filterUnique from "./components/unique";
import photos_db from "./components/photos_db";
import Gallery from "./components/gallery";
import Blazy from "./utils/blazy";

window.onload = function () {

    // images lazy load
    new Blazy({});

    // cities list generating
    let citiesList = [];
    for (let item of photos_db) {
        citiesList.push(item.city);
        let gallery = new Gallery(item.name, item.src, item.city, item.id, '');
        gallery.createItem();
    }

    citiesList = filterUnique(citiesList);

    // cities list rendering
    let citiesSelect = document.querySelector('.js-cities-select');
    for (let city of citiesList) {
        let option = document.createElement('option');
        option.setAttribute('value', city);
        option.innerText = city;
        citiesSelect.appendChild(option);
    }

    // items filtering
    function wipeGallery() {
        let gallery = document.querySelector('.gallery');
        gallery.innerHTML = '';
    }

    function initLightboxes() {
        let thumbnails = document.querySelectorAll('.js-photo-thumbnail');
        for (let thumbnail of thumbnails) {
            thumbnail.addEventListener('click', () => {
                let lightbox = new Gallery('', thumbnail.id, '', '', '');
                lightbox.showLightbox();
            });
        }
    }
    initLightboxes();

    let inputs = [
        document.querySelector('.js-cities-select'),
        document.querySelector('.js-name-input')
    ];
    for (let input of inputs) {
        input.addEventListener('input', () => {
            let enteredFilter = input.value,
                dynamicHeading = document.querySelector('.dynamic-heading');

            wipeGallery();

            if (input.classList.contains('js-name-input')) {
                inputs[0].value = 'Выбрать город';

                // exclude names intersection for short inputs
                if (enteredFilter.length < 3) {
                    enteredFilter = '';
                }

                for (let item of photos_db) {
                    if (!inputs[1].value.indexOf(item.name) > -1) {
                        dynamicHeading.innerHTML = 'Совпадений не найдено ¯\\_(ツ)_/¯';
                    }
                }

            } else {
                inputs[1].value = '';
            }

            for (let item of photos_db) {
                let gallery = new Gallery(item.name, item.src, item.city, item.id, enteredFilter);
                gallery.createItem();
            }

            // images lazy load
            new Blazy({});
            initLightboxes();


        });
    }

};
