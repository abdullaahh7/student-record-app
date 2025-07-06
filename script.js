let currentSortBy = "none";
let searchClassValue = "";
let searchNameValue = "";
let currentStudentIndex = null;

function openForm() {
  document.getElementById("overlay").style.display = "flex";
}

function closeForm() {
  document.getElementById("overlay").style.display = "none";
}

function addStudent(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const Fname = document.getElementById("Fname").value;
  const className = document.getElementById("className").value;
  const photo = document.getElementById("photoUpload").files[0];

  if (!name || !Fname || !className || !photo) {
    alert("Please fill in all fields and upload a photo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageData = e.target.result;
    const student = { name, Fname, className, imageData };

    let students = JSON.parse(localStorage.getItem("students")) || [];
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));

    alert("Student added!");
    closeForm();
    document.querySelector("form").reset();
    document.getElementById("fileName").textContent = "";
  };

  reader.readAsDataURL(photo);
}

document.getElementById("photoUpload").addEventListener("change", function () {
  const fileName = this.files[0]?.name || "No file chosen";
  document.getElementById("fileName").textContent = fileName;
});

document.getElementById("students").addEventListener("click", () => {
  document.getElementById("main").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  document.getElementById("h1").style.display = "none";
  document.getElementById("studentListPage").style.display = "block";
  displayStudents();
});

function displayStudents() {
  const container = document.getElementById("studentListPage");
  container.innerHTML = "";

  const headerHTML = `
    <div id="headDiv" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
      <h2 style="margin: 0;">Student List</h2>
      <div class="filter-group" style="display: flex; flex-wrap: wrap; gap: 10px;">
        <input type="text" id="searchName" placeholder="Search by name..." style="padding: 8px 12px; font-size: 14px; border-radius: 6px; border: none;" />
        <input type="text" id="searchClass" placeholder="Search by class..." style="padding: 8px 12px; font-size: 14px; border-radius: 6px; border: none;" />
        <div class="button-group" style="display: flex; gap: 10px; flex-wrap: wrap;">
          <select id="sortBy" style="padding: 8px 12px; font-size: 14px; background-color: #222; color: #fff; border: none; border-radius: 6px;">
            <option value="none">Sort by</option>
            <option value="name">Name</option>
            <option value="class">Class</option>
          </select>
          <button id="clearAllBtn" style="padding: 8px 12px; font-size: 14px; background-color: #222; color: white; border: none; border-radius: 6px;">Clear All</button>
        </div>
      </div>
    </div>`;
  container.innerHTML = headerHTML;

  let students = JSON.parse(localStorage.getItem("students")) || [];

  const nameValue = searchNameValue.trim();
  if (nameValue) {
    students = students.filter((s) =>
      s.name.toLowerCase().includes(nameValue.toLowerCase())
    );
  }

  const classValue = searchClassValue.trim();
  if (classValue) {
    students = students.filter((s) =>
      s.className.toLowerCase().includes(classValue.toLowerCase())
    );
  }

  if (currentSortBy === "name") {
    students.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSortBy === "class") {
    students.sort((a, b) => {
      const aNum = parseInt(a.className);
      const bNum = parseInt(b.className);
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      return a.className.localeCompare(b.className);
    });
  }

  if (students.length === 0) {
    container.innerHTML += "<p>No students found.</p>";
    return;
  }

  students.forEach((student, index) => {
    const studentCard = document.createElement("div");
    studentCard.style.background = "#6200ea";
    studentCard.style.padding = "15px";
    studentCard.style.margin = "10px 0";
    studentCard.style.borderRadius = "8px";
    studentCard.style.position = "relative";
    studentCard.style.minHeight = "160px";

    studentCard.innerHTML = `
      <img src="${student.imageData}" alt="Student Photo" style="width:100px; height:100px; object-fit:cover; border-radius:6px;"/>
      <p style="color: #fff;"><strong>Name:</strong> ${student.name}</p>
      <p style="color: #fff;"><strong>Father's Name:</strong> ${student.Fname}</p>
      <p style="color: #fff;"><strong>Class:</strong> ${student.className}</p>
      <span style="position:absolute; top:10px; right:10px; cursor:pointer; color:red; font-size:20px;" onclick="deleteStudent(${index})">&times;</span>
      <button class="show-more-btn" data-index="${index}" style="
        position:absolute;
        bottom:10px;
        right:10px;
        padding: 5px 10px;
        background-color: #fff;
        color: #6200ea;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;">Show more</button>`;

    container.appendChild(studentCard);
  });

  document.querySelectorAll(".show-more-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      showMore(index);
    });
  });

  document.getElementById("searchName").value = searchNameValue;
  document.getElementById("searchName").oninput = function () {
    searchNameValue = this.value;
    displayStudents();
  };

  document.getElementById("searchClass").value = searchClassValue;
  document.getElementById("searchClass").oninput = function () {
    searchClassValue = this.value;
    displayStudents();
  };

  document.getElementById("sortBy").value = currentSortBy;
  document.getElementById("sortBy").onchange = function () {
    currentSortBy = this.value;
    displayStudents();
  };

  document.getElementById("clearAllBtn").onclick = clearAllStudents;
}

function showMore(index) {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  const student = students[index];
  currentStudentIndex = index;

  document.getElementById("showMoreImage").src = student.imageData;
  document.getElementById("showMoreName").textContent = student.name;
  document.getElementById("showMoreFname").textContent = student.Fname;
  document.getElementById("showMoreClass").textContent = student.className;

  document.getElementById("showMoreBehaviour").value = student.behaviour || "";
  document.getElementById("showMoreAttendance").value =
    student.attendance || "";
  document.getElementById("showMoreParents").value = student.parents || "";
  document.getElementById("showMorePlus").value = student.plus || "";
  document.getElementById("showMoreNegative").value = student.negative || "";

  document.getElementById("showMoreOverlay").style.display = "flex";
}

function closeShowMore() {
  document.getElementById("showMoreOverlay").style.display = "none";
}

function saveMoreData() {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  if (currentStudentIndex === null) return;

  students[currentStudentIndex].behaviour =
    document.getElementById("showMoreBehaviour").value;
  students[currentStudentIndex].attendance =
    document.getElementById("showMoreAttendance").value;
  students[currentStudentIndex].parents =
    document.getElementById("showMoreParents").value;
  students[currentStudentIndex].plus =
    document.getElementById("showMorePlus").value;
  students[currentStudentIndex].negative =
    document.getElementById("showMoreNegative").value;

  localStorage.setItem("students", JSON.stringify(students));
  alert("Details saved!");
  closeShowMore();
  displayStudents();
}

function deleteStudent(index) {
  let students = JSON.parse(localStorage.getItem("students")) || [];
  students.splice(index, 1);
  localStorage.setItem("students", JSON.stringify(students));
  displayStudents();
}

function clearAllStudents() {
  if (confirm("Are you sure you want to delete all students?")) {
    localStorage.removeItem("students");
    displayStudents();
  }
}
