(async () => {
  const fetchUsers = async () => {
    const response = await fetch('https://dummyjson.com/users')
    const data = await response.json()
    return data.users
  }

  let initialUsers = await fetchUsers();
  let users = initialUsers.map((el) => {
    return {
      id: el.id,
      firstName: el.firstName,
      lastName: el.lastName,
      city: el.address.city,
      company: el.company.name,
      phone: el.phone,
      email: el.email
    }
  }).slice(0, 30)
  isActive = (id) => id % 3 !== 0;

  // Рендерим данные с сервера и создаем пагинацию
  let currentPage = 1;
  const ROWS = 7;
  const startCountElement = document.querySelector('.info__text-start');
  const endCountElement = document.querySelector('.info__text-end');
  const countElement = document.querySelector('.info__text-count');
  const prevBtnElement = document.querySelector('.pagination__btn-left');
  const nextBtnElement = document.querySelector('.pagination__btn-right');
  countElement.textContent = users.length;

  prevBtnElement.addEventListener('click', function () {
    const paginationBtns = document.querySelectorAll('.pagination__btn-item');
    const currentPageElement = document.querySelector('.pagination__btn--active');
    const currentPageBtnIndex = currentPageElement.getAttribute('data-index');
    const prevPageNumber = paginationBtns[currentPageBtnIndex].textContent - 1;
    const end = ROWS * prevPageNumber;
    const start = end - ROWS;
    const filteredArr = users.slice(start, end);
    if (currentPageBtnIndex - 1 >= 0) {
      currentPageElement.classList.remove('pagination__btn--active');
      paginationBtns[currentPageBtnIndex - 1].classList.add('pagination__btn--active');
      renderList(filteredArr);
      startCountElement.textContent = start + 1;
      endCountElement.textContent = users.length < end ? users.length : end;
    }
  });

  nextBtnElement.addEventListener('click', function () {
    const paginationBtns = document.querySelectorAll('.pagination__btn-item');
    const currentPageElement = document.querySelector('.pagination__btn--active');
    const currentPageBtnIndex = currentPageElement.getAttribute('data-index');
    const nextPageNumber = Number(paginationBtns[currentPageBtnIndex].textContent) + 1;
    const end = ROWS * nextPageNumber + 1;
    const start = end - ROWS;
    const filteredArr = users.slice(start, end);
    if (Number(currentPageBtnIndex) < paginationBtns.length - 1) {
      currentPageElement.classList.remove('pagination__btn--active');
      paginationBtns[Number(currentPageBtnIndex) + 1].classList.add('pagination__btn--active');
      renderList(filteredArr);
      startCountElement.textContent = start + 1;
      endCountElement.textContent = filteredArr.length < end ? filteredArr.length : end;
    }
  });

  function renderList(arrData) {
    const tableBody = document.querySelector('.table__body');
    tableBody.innerHTML = "";

    arrData.map((user) => {
      const tableRow = document.createElement('tr');
      tableRow.classList.add('table__row', 'table__body-row');
      const nameElement = document.createElement('td')
      nameElement.textContent = user.firstName + ' ' + user.lastName;
      tableRow.append(nameElement);
      const companyElement = document.createElement('td')
      companyElement.textContent = user.company;
      tableRow.append(companyElement);
      const phoneElement = document.createElement('td')
      phoneElement.textContent = user.phone;
      tableRow.append(phoneElement);
      const emailElement = document.createElement('td')
      emailElement.textContent = user.email;
      tableRow.append(emailElement);
      const cityElement = document.createElement('td')
      cityElement.textContent = user.city;
      tableRow.append(cityElement);
      const statusElement = document.createElement('td');
      const innerStatusElement = document.createElement('span');
      innerStatusElement.classList.add(isActive(user.id) ? 'table__block--active' : 'table__block--inactive')
      innerStatusElement.textContent = isActive(user.id) ? 'Active' : 'Inactive';
      statusElement.append(innerStatusElement);
      tableRow.append(statusElement);

      tableBody.append(tableRow);
    })
  }

  function displayUsersSlice(arrData, rowsPerPage, page) {
    const end = rowsPerPage * page;
    const start = end - rowsPerPage;
    const paginatedData = arrData.slice(start, end);
    page--;

    renderList(paginatedData);
    startCountElement.textContent = start + 1;
    endCountElement.textContent = arrData.length < end ? arrData.length : end;
  }

  function createPagination(arrData, rowsPerPage) {
    const paginationElement = document.querySelector('.pagination__inner');
    paginationElement.textContent = '';
    const pagesCount = Math.ceil(arrData.length / rowsPerPage);

    for (i = 0; i < pagesCount; i++) {
      const buttonElement = createPaginationBtn(i + 1, arrData);
      buttonElement.dataset.index = i;
      paginationElement.append(buttonElement)
    }
  }

  function createPaginationBtn(page, arrData) {
    const buttonElement = document.createElement('button');
    buttonElement.classList.add('pagination__btn', 'pagination__btn-item');
    buttonElement.textContent = page;

    if (currentPage === page) {
      buttonElement.classList.add('pagination__btn--active');
    }

    buttonElement.addEventListener('click', () => {
      let currentButton = document.querySelector('.pagination__btn--active');
      currentPage = page;

      displayUsersSlice(arrData, ROWS, currentPage);
      currentButton.classList.remove('pagination__btn--active');
      buttonElement.classList.add('pagination__btn--active');
    })
    return buttonElement;
  }

  displayUsersSlice(users, ROWS, currentPage);
  createPagination(users, ROWS);

  // Поиск
  document.querySelector('.header__search-input').oninput = function () {
    const filteredArr = users.filter((el) => JSON.stringify(el).toLowerCase().includes(this.value.toLowerCase(), 0));
    displayUsersSlice(filteredArr, ROWS, currentPage);
    createPagination(filteredArr, ROWS);
  }

  // Фильтрация
  const selectElement = document.querySelector('select');
  let copyUsers = [...users];
  selectElement.addEventListener('change', (evt) => {
    if (evt.target.value === 'name') {
      const usersByName = copyUsers.sort((a, b) => a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase()));
      displayUsersSlice(usersByName, ROWS, currentPage);
      createPagination(usersByName, ROWS);
    } else if (evt.target.value === 'company') {
      const usersByCompany = copyUsers.sort((a, b) => a.company.toLowerCase().localeCompare(b.company.toLowerCase()));
      displayUsersSlice(usersByCompany, ROWS, currentPage);
      createPagination(usersByCompany, ROWS);
    } else if (evt.target.value === 'country') {
      const usersByCity = copyUsers.sort((a, b) => a.city.toLowerCase().localeCompare(b.city.toLowerCase()));
      displayUsersSlice(usersByCity, ROWS, currentPage);
      createPagination(usersByCity, ROWS);
    } else if (evt.target.value === 'status') {
      const usersActive = users.filter((el) => el.id % 3 !== 0);
      const usersInactive = users.filter((el) => el.id % 3 === 0);
      console.log(usersActive)
      const usersByActive = usersActive.concat(usersInactive);
      displayUsersSlice(usersByActive, ROWS, currentPage);
      createPagination(usersByActive, ROWS);
    }
  })

})();
