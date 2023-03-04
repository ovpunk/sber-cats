const $wrapper = document.querySelector("[data-wrapper]");
const $addBtn = document.querySelector("[data-add_button]");
const $openBtn = document.querySelector("[data-open_button]");
const $modalAdd = document.querySelector("[data-modal-add]");
const $modalOpen = document.querySelector("[data-modal-open]");
const $modalCrossForDelete = document.querySelector("[data-cross-delete]");
const $modalCrossForOpen = document.querySelector("[data-cross-open]");
const $formErrorMsg = document.querySelector("[data-errmsg]");
const $addCatsForm = document.forms.add_cats_form;
const $modalOpenCard = document.querySelector("[data-open-card]"); //

const generateCatCard = (cat) => {
  return `<div data-card_id=${cat.id} class="card">
  <img src="${cat.image}" ${cat.img}" class="card-img">
  <div class="card-body">
    <h5 class="card-title">${cat.name}</h5>
    <div class="card-buttons">
      <button type="button" data-open_button data-action="open" href="#" class="btn btn-open">Open</button>
      <button type="button" data-action="edit" href="#" class="btn btn-edit">Edit</button>
      <button type="button" data-action="delete" href="#" class="btn btn-delete">Delete</button>
    </div>
  </div>
</div>`;
};

{
  /*<i class="fas fa-regular fa-heart"></i>*/
  //добавить для fabvorite
}
const generateOpenCard = (info) => {
  return ` <img class="open-modal__element open-img" src="${info.image}" alt="${info.image}">
  <div class="open-modal-info">
  <h5 class="open-modal__element open-name">Name: ${info.name}</h5>
  <div class="open-modal__element open-id">ID: ${info.id}</div>
  <div class="open-modal__element open-rate">Rate: ${info.rate}</div>
  <div class="open-modal__element open-age">Age: ${info.age}</div>
  <div class="open-modal__element open-description">Description: ${info.description}</div>
  <div class="open-modal__element open-favorite">Favorite: ${info.favorite}</div></div>`;
};

//открыть модалку добавления
$addBtn.addEventListener("click", () => {
  $modalAdd.classList.remove("hidden");
  $formErrorMsg.innerText = "";
});
//закрыть модалку добавления
$modalCrossForDelete.addEventListener("click", () => {
  $modalAdd.classList.add("hidden");
});

//закрыть модалку информации
$modalCrossForOpen.addEventListener("click", () => {
  $modalOpen.classList.add("hidden");
});

$wrapper.addEventListener("click", async (event) => {
  const action = event.target.dataset.action;
  switch (action) {
    case "delete":
      const $currentCat = event.target.closest("[data-card_id]"); //карточка
      const catId = $currentCat.dataset.card_id; //id карточки
      try {
        const res = await api.deleteCat(catId);
        const responce = await res.json(); //сообщение об удалении
        if (!res.ok) throw Error(responce.message);
        $currentCat.remove(); //удаление
      } catch (error) {
        alert(error);
      }
      break;
    case "open":
      $modalOpenCard.innerHTML = "";
      $modalOpen.classList.remove("hidden");
      const $openCurrentCat = event.target.closest("[data-card_id]");
      const $openCatId = $openCurrentCat.dataset.card_id;

      try {
        const res = await api.getCurrentCat($openCatId);
        const data = await res.json();

        $modalOpenCard.insertAdjacentHTML("beforeend", generateOpenCard(data));
      } catch (error) {
        2;
        alert(error);
      }
      break;
    case "edit":
      break;

    default:
      break;
  }
});

$addCatsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  data.id = Number(data.id);
  data.age = Number(data.age);
  data.rate = Number(data.rate);
  data.favorite = data.favorite === "on";

  const res = await api.addNewCat(data);

  if (res.ok) {
    $wrapper.replaceChildren();
    getCatsFunc();
    $modalAdd.classList.add("hidden");
    event.target.reset();
  } else {
    const responce = await res.json();
    $formErrorMsg.innerText = responce.message;
    return;
  }
});

const getCatsFunc = async () => {
  const res = await api.getAllCats();
  if (res.status !== 200) {
    const $notFoundMessage = document.createElement("p");
    $notFoundMessage.classList += "error-msg";
    $notFoundMessage.innerText = "Error, try again later.";

    return $wrapper.appendChild($notFoundMessage);
  }
  const data = await res.json();

  if (data.length === 0) {
    const $notFoundMessage = document.createElement("p");
    $notFoundMessage.classList += "not-found";
    $notFoundMessage.innerText = "Not found. Add a new cat.";

    return $wrapper.appendChild($notFoundMessage);
  }
  data.forEach((cat) => {
    $wrapper.insertAdjacentHTML("beforeend", generateCatCard(cat));
  });
};
getCatsFunc();
