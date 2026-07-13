const members = [];

const table = document.getElementById("membersTable");
const memberCount = document.getElementById("memberCount");

const popup = document.getElementById("popup");
const addBtn = document.getElementById("addMemberBtn");
const closeBtn = document.getElementById("closePopup");
const saveBtn = document.getElementById("saveMember");

const searchInput = document.getElementById("searchInput");

let editIndex = -1;

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

saveBtn.onclick = () => {

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
        name: name,
        rank: rank,
        balance: balance
    };

    if (editIndex === -1) {

        members.push(memberData);

    } else {

        members[editIndex] = memberData;

    }

    popup.style.display = "none";

    renderTable();

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

function deleteMember(index) {

    if(confirm("هل تريد حذف العضو؟")){

        members.splice(index,1);

        renderTable();

    }

}

searchInput.addEventListener("keyup",function(){

    const value=this.value.toLowerCase();

    const rows=table.querySelectorAll("tr");

    rows.forEach(row=>{

        if(row.innerText.toLowerCase().includes(value)){

            row.style.display="";

        }else{

            row.style.display="none";

        }

    });

});