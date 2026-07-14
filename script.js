import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let members = [];

const table = document.getElementById("membersTable");
const memberCount = document.getElementById("memberCount");

const popup = document.getElementById("popup");
const addBtn = document.getElementById("addMemberBtn");
const closeBtn = document.getElementById("closePopup");
const saveBtn = document.getElementById("saveMember");

const searchInput = document.getElementById("searchInput");

let editIndex = -1;

async function loadMembers() {

    members = [];

    const querySnapshot = await getDocs(collection(db, "members"));

    querySnapshot.forEach((memberDoc) => {

        members.push({
            id: memberDoc.id,
            ...memberDoc.data()
        });

    });

    renderTable();

}

addBtn.onclick = () => {

    editIndex = -1;

    document.getElementById("memberName").value = "";
    document.getElementById("memberBalance").value = "";
    document.getElementById("memberRank").selectedIndex = 0;

    popup.style.display = "flex";

};

closeBtn.onclick = () => {

    popup.style.display = "none";

};

saveBtn.onclick = async () => {

    const name = document.getElementById("memberName").value.trim();
    const rank = document.getElementById("memberRank").value;
    const balance = document.getElementById("memberBalance").value;

    if (name === "") {
        alert("اكتب اسم العضو");
        return;
    }

    const emperor = members.find((m, i) =>
        m.rank === "الإمبراطور" && i !== editIndex
    );

    if (rank === "الإمبراطور" && emperor) {
        alert("يوجد إمبراطور بالفعل");
        return;
    }

    const memberData = {
        name,
        rank,
        balance
    };
        if (editIndex === -1) {

        await addDoc(collection(db, "members"), memberData);

    } else {

        const memberId = members[editIndex].id;

        await updateDoc(
            doc(db, "members", memberId),
            memberData
        );

    }

    popup.style.display = "none";

    await loadMembers();

};

function renderTable() {

    table.innerHTML = "";

    members.forEach((member, index) => {

        table.innerHTML += `
        <tr>

            <td>${index + 1}</td>
            <td>${member.name}</td>
            <td>${member.rank}</td>
            <td>${member.balance}</td>

            <td>

                <button onclick="editMember(${index})">
                    ✏️
                </button>

                <button onclick="deleteMember(${index})">
                    🗑️
                </button>

            </td>

        </tr>
        `;

    });

    memberCount.textContent = members.length;

}
function editMember(index) {

    editIndex = index;

    document.getElementById("memberName").value =
        members[index].name;

    document.getElementById("memberRank").value =
        members[index].rank;

    document.getElementById("memberBalance").value =
        members[index].balance;

    popup.style.display = "flex";

}

async function deleteMember(index) {

    if (confirm("هل تريد حذف العضو؟")) {

        await deleteDoc(
            doc(db, "members", members[index].id)
        );

        await loadMembers();

    }

}

window.editMember = editMember;
window.deleteMember = deleteMember;

searchInput.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const rows = table.querySelectorAll("tr");

    rows.forEach(row => {

        if (row.innerText.toLowerCase().includes(value)) {

            row.style.display = "";

        } else {

            row.style.display = "none";

        }

    });

});
loadMembers();