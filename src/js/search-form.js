const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('[name=searchQuery]'),
  searchBtn: document.querySelector('[type=submit]'),
};

//---------------------EVENT LISTENERS---------------------

refs.searchInput.addEventListener('focus', onSearchInputFocus);
refs.searchInput.addEventListener('blur', onSearchInputBlur);
refs.searchBtn.addEventListener('mousedown', onSearchInputMouseDown);
refs.searchBtn.addEventListener('mouseup', onSearchInputMouseUp);

//---------------------EVENT HANDLERS---------------------

function onSearchInputFocus(event) {
  refs.searchForm.style.outline = '2px solid rgb(14, 175, 255)';
}

function onSearchInputBlur(event) {
  refs.searchForm.style.outline = 'none';
  refs.searchForm.style.transition = 'outline 1000ms easy-out';
}

function onSearchInputMouseDown({ target }) {
  target.style.backgroundColor = '#d2d2d2';
}

function onSearchInputMouseUp({ target }) {
  target.style.backgroundColor = '#eeeeee';
}
