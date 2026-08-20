document.addEventListener('DOMContentLoaded', () => {
    
    // ================= 1. Single Page Application Navigation =================
    const tabs = document.querySelectorAll('.nav-tab');
    const views = document.querySelectorAll('.page-view');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetViewId = tab.getAttribute('data-target');

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            views.forEach(view => {
                if (view.id === targetViewId) {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });
        });
    });

    // Initialize Experience Timeline Data & Controls
    initExperienceSystem();
});

// ================= 2. Project Gallery Image Switcher =================
function switchProjectImage(titleText, iconClass) {
    const mainContainer = document.getElementById('mainImageContainer');
    const projectTitle = document.getElementById('projectTitle');

    if (mainContainer) {
        mainContainer.innerHTML = `
            <i class="fa-solid ${iconClass}"></i>
            <span>${titleText}</span>
        `;
    }

    if (projectTitle) {
        projectTitle.innerText = titleText;
    }

    const thumbnails = document.querySelectorAll('.thumb-box');
    thumbnails.forEach(thumb => {
        if (thumb.innerText.includes(titleText.split(' ')[0])) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// ================= 3. Experience Page Dataset & Timeline Calendar =================
let EXPERIENCE_DATA = [
    {
        id: "exp-1",
        title: "Asia Pacific University (APU)",
        subtitle: "B.Sc (Hons) in Artificial Intelligence",
        type: "university",
        startMonth: "2025-01", 
        endMonth: "2028-12",   
        dateStr: "JAN 2025 – DEC 2028",
        image: "fa-graduation-cap",
        skills: ["AI Engineering", "Machine Learning", "Data Analysis", "Python", "Java"],
        description: "Pursuing Bachelor's degree focused on AI model deployment, robotics vision, software design, and data structures.",
        highlights: [
            "Consistent top performer in software development and AI logic",
            "Active representative in campus technology exhibitions and workshops"
        ]
    },
    {
        id: "exp-2",
        title: "Handplus Robotics — AI Developer",
        subtitle: "AI & WebXR Engineering Intern",
        type: "intern",
        startMonth: "2026-07",
        endMonth: "2026-12",
        dateStr: "JUL 2026 – DEC 2026",
        image: "fa-robot",
        skills: ["WebXR", "ROS2", "Python", "3D Vision", "Robot Kinematics"],
        description: "Developed browser-based 3D control interfaces for 6-DOF industrial robotic arms and integrated spatial image processing with ROS2.",
        highlights: [
            "Implemented 6-DOF WebXR controller in web browsers",
            "Accelerated 3D spatial point cloud processing pipelines"
        ]
    },
    {
        id: "exp-3",
        title: "CCAI 2026 Conference Research Paper",
        subtitle: "Co-Author (EI / IEEE Index)",
        type: "project",
        startMonth: "2025-12",
        endMonth: "2026-05",
        dateStr: "DEC 2025 – MAY 2026",
        image: "fa-file-lines",
        skills: ["R Language", "Data Cleaning", "LLM Evaluation", "Statistical Analysis"],
        description: "Evaluated locally deployed LLM prototypes, conducted quantitative benchmark testing and dataset processing using R.",
        highlights: [
            "Co-authored research paper accepted for IEEE/EI indexing",
            "Built data cleaning scripts for large benchmark evaluations"
        ]
    },
    {
        id: "exp-4",
        title: "3D-Printing Mars-Rover Prototype",
        subtitle: "Lead Designer & Demonstrator",
        type: "activity",
        startMonth: "2025-05",
        endMonth: "2025-08",
        dateStr: "MAY 2025 – AUG 2025",
        image: "fa-rocket",
        skills: ["SolidWorks", "3D Printing", "Hardware Assembly", "Public Speaking"],
        description: "Engineered a functional 3D-printed remote vehicle and led live demonstrations during freshmen orientation & international expos.",
        highlights: [
            "Constructed complete modular chassis with SolidWorks",
            "Demonstrated live control for 200+ visiting students"
        ]
    },
    {
        id: "exp-5",
        title: "Java Lecturer & Media Operations",
        subtitle: "Offline Education Expo Lead",
        type: "working",
        startMonth: "2025-03",
        endMonth: "2025-05",
        dateStr: "MAR 2025 – MAY 2025",
        image: "fa-chalkboard-user",
        skills: ["Vue.js", "EJS", "Java", "WeChat/Xiaohongshu", "Content Ops"],
        description: "Created online Java courseware, operated social media promotion accounts, and presented education UI at international exhibitions.",
        highlights: [
            "Constructed Vue/EJS web frontend for course registration",
            "Grew social media follower base by delivering clear tutorials"
        ]
    },
    {
        id: "exp-6",
        title: "APU Robotics & Tech Club",
        subtitle: "Workshop Organizer & Technical Mentor",
        type: "club",
        startMonth: "2025-09",
        endMonth: "2026-04",
        dateStr: "SEP 2025 – APR 2026",
        image: "fa-users-gear",
        skills: ["Club Leadership", "Workshop Facilitation", "Arduino", "Team Management"],
        description: "Organized hands-on robotics workshops, mentored junior students in basic microcontrollers and programming logic.",
        highlights: [
            "Hosted 4 hands-on workshops with 50+ participants",
            "Coordinated inter-club tech competitions"
        ]
    }
];

// Start Months range: 2025-01 (Month 0) to 2028-12 (Month 47) = 48 Months total
const TOTAL_MONTHS = 48;
const START_YEAR = 2025;

function monthDifference(yearMonthStr) {
    const [y, m] = yearMonthStr.split('-').map(Number);
    return (y - START_YEAR) * 12 + (m - 1);
}

function formatDateString(startM, endM) {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const [sY, sM] = startM.split('-');
    const [eY, eM] = endM.split('-');
    return `${months[parseInt(sM)-1]} ${sY} – ${months[parseInt(eM)-1]} ${eY}`;
}

function initExperienceSystem() {
    renderCalendarHeaderMonths();
    renderTimelineAndGrid(EXPERIENCE_DATA);
    setupFilters();
    setupModalEvents();
    setupAddExperienceForm();
}

function renderCalendarHeaderMonths() {
    const monthsFlex = document.querySelector('.months-flex');
    if (!monthsFlex) return;

    monthsFlex.innerHTML = '';
    for (let i = 0; i < TOTAL_MONTHS; i++) {
        const m = (i % 12) + 1;
        const cell = document.createElement('div');
        cell.className = 'month-cell';
        cell.innerText = m === 1 ? 'Jan' : (m === 7 ? 'Jul' : '');
        monthsFlex.appendChild(cell);
    }
}

function renderTimelineAndGrid(items) {
    const tracksContainer = document.getElementById('timelineTracks');
    const cardsGrid = document.getElementById('experienceGrid');

    if (!tracksContainer || !cardsGrid) return;

    tracksContainer.innerHTML = '';
    cardsGrid.innerHTML = '';

    if (items.length === 0) {
        tracksContainer.innerHTML = '<div class="no-data">No experience items match your filter.</div>';
        cardsGrid.innerHTML = '<div class="no-data">No experience cards match your filter.</div>';
        return;
    }

    items.forEach(item => {
        // --- 1. Render Timeline Single Block ---
        const startIdx = Math.max(0, monthDifference(item.startMonth));
        const endIdx = Math.min(TOTAL_MONTHS - 1, monthDifference(item.endMonth));
        const duration = Math.max(1, endIdx - startIdx + 1);

        const leftPercent = (startIdx / TOTAL_MONTHS) * 100;
        const widthPercent = (duration / TOTAL_MONTHS) * 100;

        const trackRow = document.createElement('div');
        trackRow.className = 'track-row';
        trackRow.onclick = () => openDetailModal(item);

        const imgHTML = item.image.startsWith('http') || item.image.startsWith('data:') 
            ? `<img src="${item.image}" alt="icon" class="bar-img">` 
            : `<i class="fa-solid ${item.image || 'fa-briefcase'} bar-icon"></i>`;

        trackRow.innerHTML = `
            <div class="track-area">
                <div class="time-bar type-${item.type}" style="left: ${leftPercent}%; width: ${widthPercent}%;">
                    <div class="bar-thumbnail">${imgHTML}</div>
                    
                    <!-- Hover Popup Tooltip displaying Title & Skills ONLY (No Description) -->
                    <div class="bar-hover-tooltip">
                        <div class="tooltip-title">${item.title}</div>
                        <div class="tooltip-skills">
                            ${item.skills.map(skill => `<span class="neo-badge mini">${skill}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        tracksContainer.appendChild(trackRow);

        // --- 2. Render Large Card Grid Below (No Description Word, picture space) ---
        const card = document.createElement('article');
        card.className = `comic-card exp-card border-${item.type} large-card`;
        card.onclick = () => openDetailModal(item);

        const cardImgHTML = item.image.startsWith('http') || item.image.startsWith('data:')
            ? `<img src="${item.image}" alt="cover" class="card-hero-img">`
            : `<div class="card-icon-frame"><i class="fa-solid ${item.image || 'fa-briefcase'}"></i></div>`;

        card.innerHTML = `
            <div class="card-header-bar">
                <span class="pill-tag tag-${item.type}">${item.type.toUpperCase()}</span>
                <span class="date-str">${item.dateStr}</span>
            </div>

            <div class="card-picture-space">
                ${cardImgHTML}
            </div>

            <h3 class="card-title">${item.title}</h3>
            <p class="role-sub">${item.subtitle}</p>
            
            <div class="tech-stack-row margin-top-10">
                ${item.skills.map(skill => `<span class="neo-badge mini">${skill}</span>`).join('')}
            </div>
            
            <div class="click-hint"><i class="fa-solid fa-hand-pointer"></i> Click card for full description</div>
        `;
        cardsGrid.appendChild(card);
    });
}

function setupFilters() {
    const typeFilter = document.getElementById('typeFilter');
    const skillSearch = document.getElementById('skillSearch');

    function applyFilters() {
        const typeValue = typeFilter.value;
        const searchValue = skillSearch.value.toLowerCase().trim();

        const filtered = EXPERIENCE_DATA.filter(item => {
            const matchesType = (typeValue === 'all') || (item.type === typeValue);
            const matchesSearch = searchValue === '' || 
                item.title.toLowerCase().includes(searchValue) ||
                item.subtitle.toLowerCase().includes(searchValue) ||
                item.description.toLowerCase().includes(searchValue) ||
                item.skills.some(s => s.toLowerCase().includes(searchValue));

            return matchesType && matchesSearch;
        });

        renderTimelineAndGrid(filtered);
    }

    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
    if (skillSearch) skillSearch.addEventListener('input', applyFilters);
}

// Modal Popup Control
function openDetailModal(item) {
    const modal = document.getElementById('detailModal');
    if (!modal) return;

    document.getElementById('modalTypeBadge').className = `pill-tag tag-${item.type}`;
    document.getElementById('modalTypeBadge').innerText = item.type.toUpperCase();
    document.getElementById('modalDateStr').innerText = item.dateStr;
    document.getElementById('modalTitle').innerText = item.title;
    document.getElementById('modalSubtitle').innerText = item.subtitle;
    document.getElementById('modalDescription').innerText = item.description;

    const modalImgBox = document.getElementById('modalImgContainer');
    if (item.image.startsWith('http') || item.image.startsWith('data:')) {
        modalImgBox.innerHTML = `<img src="${item.image}" class="modal-hero-img">`;
    } else {
        modalImgBox.innerHTML = `<div class="modal-icon-placeholder"><i class="fa-solid ${item.image || 'fa-briefcase'}"></i></div>`;
    }

    const skillsContainer = document.getElementById('modalSkills');
    skillsContainer.innerHTML = item.skills.map(s => `<span class="neo-badge">${s}</span>`).join('');

    const highlightsContainer = document.getElementById('modalHighlights');
    if (item.highlights && item.highlights.length > 0) {
        highlightsContainer.style.display = 'flex';
        highlightsContainer.innerHTML = item.highlights.map(h => `<div><i class="fa-solid fa-star"></i> ${h}</div>`).join('');
    } else {
        highlightsContainer.style.display = 'none';
    }

    modal.classList.add('active');
}

function setupModalEvents() {
    const modal = document.getElementById('detailModal');
    const closeBtn = document.getElementById('closeModal');

    if (closeBtn) {
        closeBtn.onclick = () => modal.classList.remove('active');
    }

    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('active');
        };
    }
}

// Add New Experience Handler
function setupAddExperienceForm() {
    const openBtn = document.getElementById('openAddModalBtn');
    const addModal = document.getElementById('addExperienceModal');
    const closeBtn = document.getElementById('closeAddModal');
    const form = document.getElementById('addExperienceForm');

    if (openBtn && addModal) {
        openBtn.onclick = () => addModal.classList.add('active');
    }

    if (closeBtn && addModal) {
        closeBtn.onclick = () => addModal.classList.remove('active');
    }

    if (addModal) {
        addModal.onclick = (e) => {
            if (e.target === addModal) addModal.classList.remove('active');
        };
    }

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();

            const title = document.getElementById('expTitle').value.trim();
            const subtitle = document.getElementById('expSubtitle').value.trim();
            const type = document.getElementById('expType').value;
            const image = document.getElementById('expImage').value.trim() || 'fa-briefcase';
            const startMonth = document.getElementById('expStartMonth').value;
            const endMonth = document.getElementById('expEndMonth').value;
            const skillsRaw = document.getElementById('expSkills').value;
            const description = document.getElementById('expDescription').value.trim();

            const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);

            const newExp = {
                id: 'exp-' + Date.now(),
                title,
                subtitle,
                type,
                startMonth,
                endMonth,
                dateStr: formatDateString(startMonth, endMonth),
                image,
                skills: skills.length > 0 ? skills : ["General"],
                description,
                highlights: []
            };

            EXPERIENCE_DATA.unshift(newExp);
            renderTimelineAndGrid(EXPERIENCE_DATA);

            form.reset();
            addModal.classList.remove('active');
        };
    }
}