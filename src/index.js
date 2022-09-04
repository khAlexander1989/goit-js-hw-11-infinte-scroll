import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import OnlyScroll from 'only-scrollbar';
import { FetchPhotoAPI } from './js/fetchPhotoAPI.js';
import galleryMarkup from './js/galleryMarkup.js';

import 'notiflix/dist/notiflix-3.2.5.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

//-------------------------INITIALIZATION-------------------------

const refs = {
  gallery: document.querySelector('.gallery'),
  searchForm: document.querySelector('.search-form'),
  header: document.querySelector('.page-header'),
  spinner: document.querySelector('.spinner'),
};

const fetchPhotoAPI = new FetchPhotoAPI();
const lightbox = new SimpleLightbox('.gallery a');
const scroll = new OnlyScroll(window, {
  damping: 0.7,
});

const observer = createObserver();

//-------------------------FUCTIONOS-------------------------

//--------------render gallery function--------------

function render(photos) {
  const photosSetMarkup = galleryMarkup.createPhotoSetMarkup(photos);
  refs.gallery.insertAdjacentHTML('beforeend', photosSetMarkup);
  lightbox.refresh();
}

//--------------remove gallery markup function--------------

function removePhotoSetMarkup(node) {
  node.innerHTML = '';
}

//--------------show total hits function--------------

function showTotalHits(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

//--------------get element height function--------------

function getElementHeight(element) {
  return element.getBoundingClientRect().height;
}

//--------------show/hide spinner functions--------------

function showSpinner() {
  refs.spinner.classList.remove('is-hidden');
}

function hideSpinner() {
  refs.spinner.classList.add('is-hidden');
}

//--------------auto scrolling function--------------

function autoScroll() {
  const scrollValue =
    scroll.y +
    getElementHeight(refs.gallery.firstElementChild) * 2 +
    parseInt(window.getComputedStyle(refs.gallery).getPropertyValue('gap')) * 2;
  scroll.scrollTo(scrollValue);
}

//--------------error handler --------------

function errorHandler(error) {
  if (error.name === 'notFoundError') {
    Notify.failure(error.message);
  } else if (error.name === 'dataLimitError') {
    Notify.warning(error.message);
  } else {
    throw error;
  }
}

//--------------create intersection observer function --------------

function createObserver() {
  const options = {
    root: null,
    threshold: 1,
  };

  return new IntersectionObserver(viewportIntersectHandler, options);
}

//-------------------------EVENT LISTENERS-------------------------

refs.searchForm.addEventListener('submit', onSearchFormSubmit);

//-------------------------EVENT HANDLERS-------------------------

//--------------search form submit handler--------------

async function onSearchFormSubmit(event) {
  event.preventDefault();

  const searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  event.currentTarget.reset();

  if (searchQuery === fetchPhotoAPI._query) {
    return;
  }

  removePhotoSetMarkup(refs.gallery);
  showSpinner();

  try {
    const { hits } = await fetchPhotoAPI.fetchPhoto(searchQuery);
    showTotalHits(fetchPhotoAPI._totalPhotoNumber);
    render(hits);

    if (hits.length >= fetchPhotoAPI._photo_per_page) {
      observer.observe(refs.gallery.lastElementChild);
    }
  } catch (err) {
    errorHandler(err);
  }
  hideSpinner();
}

//--------------viewport intersect handler--------------

async function viewportIntersectHandler([entry], observer) {
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);
    showSpinner();
    try {
      const { hits } = await fetchPhotoAPI.fetchPhoto();
      render(hits);
      if (hits.length >= fetchPhotoAPI._photo_per_page) {
        observer.observe(refs.gallery.lastElementChild);
      }
    } catch (err) {
      errorHandler(err);
    }
    hideSpinner();
  }
}
