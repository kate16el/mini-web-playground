const $ = (id) => document.getElementById(id);

const initial = [
  { id: 1, title: "Set up repo", done: true, tag: "github" },
  { id: 2, title: "Create web files", done: true, tag: "github" },
  { id: 3, title: "Practise branches & PRs", done: false, tag: "github" },
];

const storeKey = "kat_tasks_v1";
let tasks = load();

function load() {
  try {
    const raw = localStorage.getItem(storeKey);
    return raw ? JSON.parse(raw) : initial;
  } catch {
    return initial;
  }
}
function save() { localStorage.setItem(storeKey, JSON.stringify(tasks)); }

function stats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  return { total, done, open: total - done };
}

function render() {
  const filt = $("filter").value;
  const list = $("list");
  list.innerHTML = "";

  let view = tasks;
  if (filt === "open") view = tasks.filter(t => !t.done);
  if (filt === "done") view = tasks.filter(t => t.done);

  view.forEach(t => {
    const li = document.createElement("li");
    li.className = "item";
    li.innerHTML = `
      <input type="checkbox" ${t.done ? "checked" : ""} aria-label="mark done" />
      <div class="grow">
        <div>${t.title} <span class="meta">• ${t.tag} • id:${t.id}</span></div>
      </div>
      <button class="remove">Remove</button>
    `;
    const cb = li.querySelector("input");
    cb.addEventListener("change", () => toggle(t.id));
    li.querySelector(".remove").addEventListener("click", () => removeTask(t.id));
    list.appendChild(li);
  });

  const s = stats();
  $("total").textContent = `Total: ${s.total}`;
  $("done").textContent  = `Done: ${s.done}`;
  $("open").textContent  = `Open: ${s.open}`;
}

function addTask(title, tag) {
  if (!title.trim()) return;
  tasks = [...tasks, { id: Date.now(), title: title.trim(), done: false, tag }];
  save(); render();
}
function toggle(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  save(); render();
}
function removeTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save(); render();
}

$("taskForm").addEventListener("submit", (e) => {
  e.preventDefault();
  addTask($("title").value, $("tag").value);
  $("title").value = "";
  $("title").focus();
});

$("filter").addEventListener("change", render);

$("suggest").addEventListener("click", async () => {
  $("suggest").disabled = true;
  $("suggest").textContent = "Adding…";
  await new Promise(r => setTimeout(r, 700));
  [
    "Build mini data-cleaner in Python",
    "Deploy with GitHub Pages",
    "Add dark mode toggle",
  ].forEach((x, i) => addTask(x, ["python","github","github"][i]));
  $("suggest").disabled = false;
  $("suggest").textContent = "Suggest starter ideas";
});

render();
document.getElementById("toggleDark").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("kat_dark", document.body.classList.contains("dark") ? "1" : "0");
});
if (localStorage.getItem("kat_dark")==="1") document.body.classList.add("dark");
