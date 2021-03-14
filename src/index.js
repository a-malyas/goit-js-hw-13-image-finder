import './styles.css';
import PixabayApi from './js/api.js'
import 'lodash.debounce';
import imagesListTpl from './gallery.hbs';
import debounce from 'lodash.debounce';
// import LoadMoreBtn from './js/spinner';
import * as basicLightbox from 'basiclightbox'
import 'basiclightbox/dist/basicLightbox.min.css';

import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const searchForm = document.querySelector('#search-form');
const imagesListRef = document.querySelector('.js-gallery');
const pixabayApi = new PixabayApi();
// const loadMoreBtn = new LoadMoreBtn({
//     selector: '.load-button',
//     hidden: true,
// });
const target = document.querySelector('.last-item');

searchForm.addEventListener('input', debounce(onSearch, 500));
// loadMoreBtn.refs.button.addEventListener('click', fetchImages);
// loadMoreBtn.refs.button.addEventListener('click', scrollToNewElements);
imagesListRef.addEventListener('click', onclick);

function onSearch(e) {
    e.preventDefault();
    clearImagesList();
    
    pixabayApi.query = e.target.value;
    if (pixabayApi.query === '') {
        // loadMoreBtn.disable();
        return noResults();
    }

    // loadMoreBtn.show();
    pixabayApi.resetPage();
    clearImagesList();
    fetchImages();
}

function renderImagesMarkup(images) {
    if (images.length === 0) {
      // loadMoreBtn.hide();
      noMatchesFound();
    }
    const markup = imagesListTpl(images);
    imagesListRef.insertAdjacentHTML('beforeend', markup);
}

function clearImagesList() {
  imagesListRef.innerHTML = '';
}

function fetchImages() {
    // loadMoreBtn.disable();
    pixabayApi.fetchImages().then(renderImagesMarkup);
    // scrollToNewElements();
    // loadMoreBtn.enable();
}

// function scrollToNewElements() {
//   setTimeout(() => {
//     window.scrollTo({
//         top: document.body.scrollHeight,
//         left: 0,
//         behavior: 'smooth',
//     });
//   }, 800);
// }

imagesListRef.onclick = (e) => {
    if (e.target.nodeName !== 'IMG') {
    return;
  }
    basicLightbox.create(`
		<img src=${e.target.dataset.source} alt="icon" />
	`).show();
}

function noResults() {
  error({
    text: 'Please enter something!',
    delay: 2000,
  });
}

function noMatchesFound() {
  error({
    text: 'No matches found. Please enter another query!',
    delay: 2500,
  });
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && pixabayApi.query !== '') {
      pixabayApi.fetchImages().then(renderImagesMarkup);
      pixabayApi.page += 1;
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});

observer.observe(target);


