(function () {
  "use strict";

  var STORAGE_KEY = "todos";

  var form = document.getElementById("todo-form");
  var input = document.getElementById("todo-input");
  var listEl = document.getElementById("todo-list");
  var emptyEl = document.getElementById("empty-state");
  var counterEl = document.getElementById("task-counter");

  /** @type {{ id: string, text: string, done: boolean }[]} */
  var tasks = [];

  function newId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "t-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  function isValidTask(item) {
    return (
      item &&
      typeof item === "object" &&
      typeof item.id === "string" &&
      typeof item.text === "string" &&
      typeof item.done === "boolean"
    );
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;
      var next = [];
      for (var i = 0; i < parsed.length; i++) {
        if (isValidTask(parsed[i])) next.push(parsed[i]);
      }
      tasks = next;
    } catch (_) {
      tasks = [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (_) {
      /* ignore quota / private mode */
    }
  }

  function updateCounter() {
    var total = tasks.length;
    var done = 0;
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].done) done++;
    }
    var active = total - done;
    var taskWord = total === 1 ? "task" : "tasks";
    if (total === 0) {
      counterEl.textContent = "0 tasks";
    } else {
      counterEl.textContent =
        total + " " + taskWord + " · " + done + " done · " + active + " active";
    }
  }

  function render() {
    listEl.innerHTML = "";
    var hasTasks = tasks.length > 0;
    emptyEl.hidden = hasTasks;
    updateCounter();

    for (var i = 0; i < tasks.length; i++) {
      var task = tasks[i];
      var li = document.createElement("li");
      li.className = "list__item" + (task.done ? " list__item--done" : "");
      li.dataset.id = task.id;

      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "list__check";
      cb.checked = task.done;
      cb.setAttribute("aria-label", "Mark complete: " + task.text);
      cb.dataset.action = "toggle";
      cb.dataset.id = task.id;

      var span = document.createElement("span");
      span.className = "list__text";
      span.textContent = task.text;

      var del = document.createElement("button");
      del.type = "button";
      del.className = "list__delete";
      del.textContent = "Delete";
      del.setAttribute("aria-label", "Delete task: " + task.text);
      del.dataset.action = "delete";
      del.dataset.id = task.id;

      li.appendChild(cb);
      li.appendChild(span);
      li.appendChild(del);
      listEl.appendChild(li);
    }
  }

  function addTask(text) {
    var trimmed = text.trim();
    if (!trimmed) return;
    tasks.push({ id: newId(), text: trimmed, done: false });
    save();
    render();
  }

  function toggleTask(id) {
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) {
        tasks[i].done = !tasks[i].done;
        break;
      }
    }
    save();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (t) {
      return t.id !== id;
    });
    save();
    render();
  }

  listEl.addEventListener("change", function (e) {
    var t = e.target;
    if (t && t.dataset && t.dataset.action === "toggle" && t.dataset.id) {
      toggleTask(t.dataset.id);
    }
  });

  listEl.addEventListener("click", function (e) {
    var t = e.target;
    if (t && t.dataset && t.dataset.action === "delete" && t.dataset.id) {
      deleteTask(t.dataset.id);
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addTask(input.value);
    input.value = "";
    input.focus();
  });

  load();
  render();
})();
