let entries = JSON.parse(localStorage.getItem("entries")) || [];
let editId = null;

const form = document.getElementById("entryForm");
const list = document.getElementById("list");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const resetBtn = document.getElementById("resetBtn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const entry = {
    id: editId ? editId : Date.now(),
    description: descInput.value,
    amount: Number(amountInput.value),
    type: typeInput.value
  };

  if (editId) {
    entries = entries.map(item =>
      item.id === editId ? entry : item
    );
    editId = null;
  } else {
    entries.push(entry);
  }

  saveAndRender();
  form.reset();
});

resetBtn.addEventListener("click", function () {
  form.reset();
});

document.querySelectorAll("input[name='filter']").forEach(radio => {
  radio.addEventListener("change", render);
});

function saveAndRender() {
  localStorage.setItem("entries", JSON.stringify(entries));
  render();
}

function render() {
  const filter = document.querySelector(
    "input[name='filter']:checked"
  ).value;

  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  entries.forEach(item => {
    if (item.type === "income") {
      income += item.amount;
    } else {
      expense += item.amount;
    }

    if (filter !== "all" && filter !== item.type) return;

    const li = document.createElement("li");
    li.className = item.type + "-item";

    li.innerHTML = `
      <span>${item.description} - ₹${item.amount}</span>
      <div class="actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;

    li.querySelector(".edit").addEventListener("click", function () {
      descInput.value = item.description;
      amountInput.value = item.amount;
      typeInput.value = item.type;
      editId = item.id;
    });

    li.querySelector(".delete").addEventListener("click", function () {
      entries = entries.filter(e => e.id !== item.id);
      saveAndRender();
    });

    list.appendChild(li);
  });

  document.getElementById("totalIncome").textContent = income;
  document.getElementById("totalExpense").textContent = expense;
  document.getElementById("balance").textContent = income - expense;
}

render();
