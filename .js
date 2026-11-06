// ===================================
// إعدادات عامة
// ===================================

const STORAGE_KEY = "students";

const COLLEGES = {
    computer: "علوم الحاسوب",
    science: "العلوم",
    economics: "الاقتصاد",
    engineering: "الهندسة",
    medicine: "الطب"
};

const LEVELS = {
    1: "الأول",
    2: "الثاني",
    3: "الثالث",
    4: "الرابع",
    5: "الخامس"
};


// ===================================
// دوال مساعدة
// ===================================

function loadStudents() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveStudents(list) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        return true;
    } catch (error) {
        return false;
    }
}

function showMessage(text, type) {
    const box = document.getElementById("message");
    if (!box) return;

    box.textContent = text;
    box.className = "message " + type;
    box.hidden = false;
      box.scrollIntoView({ behavior: "smooth", block: "center" });
}

function hideMessage() {
    const box = document.getElementById("message");
    if (box) box.hidden = true;
}


// ===================================
// تمييز رابط الصفحة الحالية في القائمة
// ===================================

function markActiveLink() {
    const page = location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("nav a").forEach(function (link) {
        if (link.getAttribute("href") === page) {
            link.classList.add("active");
        }
    });
}


// ===================================
// صفحة تسجيل طالب
// ===================================

function setupRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const data = new FormData(form);

        const student = {
            id: data.get("student_id").trim(),
            name: data.get("fullname").trim(),
            email: data.get("email").trim(),
            phone: data.get("phone").trim(),
            gender: data.get("gender") || "",
            college: data.get("college"),
            specialization: data.get("specialization").trim(),
            level: data.get("level"),
            birthdate: data.get("birthdate")
        };

        const students = loadStudents();

        if (students.some(function (s) { return s.id === student.id; })) {
            showMessage("هذا الرقم الجامعي مسجل مسبقاً.", "error");
            return;
        }

        students.push(student);

        if (!saveStudents(students)) {
            showMessage("تعذر حفظ البيانات في المتصفح.", "error");
            return;
        }

        form.reset();
                showMessage("تم تسجيل الطالب بنجاح ✔ جاري الانتقال إلى بيانات الطلاب...", "success");
        setTimeout(function () {
            window.location.href = "students.html";
        }, 1500);
    });

    form.addEventListener("reset", hideMessage);
}


// ===================================
// صفحة بيانات الطلاب
// ===================================

function createCell(text) {
    const td = document.createElement("td");
    td.textContent = text;
    return td;
}

function setupStudentsTable() {
    const body = document.getElementById("studentsBody");
    if (!body) return;

    const search = document.getElementById("searchInput");
    const count = document.getElementById("studentsCount");

    function render() {
        const term = search.value.trim().toLowerCase();
        const all = loadStudents();

        const list = all.filter(function (s) {
            return s.name.toLowerCase().includes(term) || s.id.includes(term);
        });

        body.textContent = "";

        if (list.length === 0) {
            const tr = document.createElement("tr");
            const td = createCell(
                all.length === 0
                    ? "لا توجد بيانات طلاب مسجلة حتى الآن."
                    : "لا توجد نتائج مطابقة للبحث."
            );
            td.colSpan = 6;
            tr.appendChild(td);
            body.appendChild(tr);
        } else {
            list.forEach(function (s) {
                const tr = document.createElement("tr");

                tr.appendChild(createCell(s.id));
                tr.appendChild(createCell(s.name));
                tr.appendChild(createCell(COLLEGES[s.college] || s.college));
                tr.appendChild(createCell(s.specialization));
                tr.appendChild(createCell(LEVELS[s.level] || "—"));

                const actionCell = document.createElement("td");
                const deleteBtn = document.createElement("button");
                deleteBtn.type = "button";
                deleteBtn.className = "delete-btn";
                deleteBtn.textContent = "حذف";

                deleteBtn.addEventListener("click", function () {
                    if (confirm("هل تريد حذف الطالب " + s.name + "؟")) {
                        saveStudents(loadStudents().filter(function (x) {
                            return x.id !== s.id;
                        }));
                        render();
                    }
                });

                actionCell.appendChild(deleteBtn);
                tr.appendChild(actionCell);

                body.appendChild(tr);
            });
        }

        count.textContent = "عدد الطلاب: " + all.length;
    }

    search.addEventListener("input", render);
    render();
}


// ===================================
// صفحة اتصل بنا
// ===================================

function setupContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        form.reset();
        showMessage("شكراً لتواصلكم معنا، تم استلام رسالتكم.", "success");
    });

    form.addEventListener("reset", hideMessage);
}


// ===================================
// تشغيل كل شيء
// ===================================

markActiveLink();
setupRegisterForm();
setupStudentsTable();
setupContactForm();
