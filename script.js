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


/* ===========================
   صلاحية التعديل بالرابط
=========================== */

const params = new URLSearchParams(
    window.location.search
);

// غير الكلمة دي لأي كلمة تعجبك

const SECRET_KEY = "anas2026";

const isEditor =
params.get("edit") === SECRET_KEY;


/* ===========================
   عناصر الصفحة
=========================== */


const table =
document.getElementById(
    "membersTable"
);


const memberCount =
document.getElementById(
    "memberCount"
);


const popup =
document.getElementById(
    "popup"
);


const addBtn =
document.getElementById(
    "addMemberBtn"
);


const closeBtn =
document.getElementById(
    "closePopup"
);


const saveBtn =
document.getElementById(
    "saveMember"
);


const searchInput =
document.getElementById(
    "searchInput"
);


let editIndex = -1;


/* ===========================
      ترتيب الرتب
=========================== */

const rankOrder = {

    "الإمبراطور":1,
    "نواب الإمبراطور":2,
    "اللورد":3,
    "الجنرال":4,
    "نواب الجنرال":5,
    "الملك":6,
    "نواب الملك":7,
    "الوزير":8,
    "الدوق":9,
    "نواب الدوق":10,
    "الأدميرال":11,
    "نواب الأدميرال":12,
    "العميد":13,
    "تشيبوكاي":14,
    "الفارس":15,
    "الملازم":16,
    "حامل البريق":17,
    "حامل الراية":18,
    "العضو":19

};



/* ===========================
     إخفاء زر الإضافة
=========================== */


if(!isEditor){

    addBtn.style.display = "none";

}



/* ===========================
      تحميل البيانات
=========================== */


async function loadMembers(){


    members = [];


    const querySnapshot =
    await getDocs(

        collection(
            db,
            "members"
        )

    );


    querySnapshot.forEach((memberDoc)=>{


        members.push({

            id:memberDoc.id,

            ...memberDoc.data()

        });


    });


    renderTable();


}

/* ===========================
      فتح وإغلاق النافذة
=========================== */


addBtn.onclick = ()=>{


    editIndex = -1;


    document.getElementById(
        "memberName"
    ).value = "";


    document.getElementById(
        "memberBalance"
    ).value = "";


    document.getElementById(
        "memberRank"
    ).selectedIndex = 0;


    popup.style.display = "flex";


};



closeBtn.onclick = ()=>{

    popup.style.display = "none";

};



/* ===========================
         حفظ العضو
=========================== */


saveBtn.onclick = async ()=>{


    const name =
    document.getElementById(
        "memberName"
    ).value.trim();



    const rank =
    document.getElementById(
        "memberRank"
    ).value;



    let balance =
    document.getElementById(
        "memberBalance"
    ).value.trim();



    if(name === ""){

        alert("اكتب اسم العضو");

        return;

    }



    /* ===================
      تنسيق الرصيد تلقائياً
    =================== */


    if(balance.toLowerCase() === "inf"){

        balance = "♾️";

    }


    if(balance.toLowerCase() === "infinity"){

        balance = "♾️";

    }


    if(balance.toLowerCase() === "max"){

        balance = "MAX";

    }


    if(balance.toLowerCase().endsWith("k")){

        balance = balance.toUpperCase();

    }


    if(balance.toLowerCase().endsWith("m")){

        balance = balance.toUpperCase();

    }



    const emperor = members.find(

        (m,i)=>

        m.rank === "الإمبراطور"

        && i !== editIndex

    );



    if(

        rank === "الإمبراطور"

        && emperor

    ){


        alert("يوجد إمبراطور بالفعل");

        return;

    }



    const memberData = {

        name,
        rank,
        balance

    };

        /* ===========================
          إضافة أو تعديل العضو
    =========================== */


    if(editIndex === -1){


        await addDoc(

            collection(
                db,
                "members"
            ),

            memberData

        );


    }else{


        await updateDoc(

            doc(

                db,

                "members",

                members[
                    editIndex
                ].id

            ),

            memberData

        );


    }



    popup.style.display = "none";


    await loadMembers();


};



/* ===========================
          عرض الجدول
=========================== */


function renderTable(){



    table.innerHTML = "";



    members.sort((a,b)=>{


        return (

            rankOrder[a.rank] || 999

        ) - (

            rankOrder[b.rank] || 999

        );


    });



    members.forEach((member,index)=>{


        table.innerHTML += `

        <tr>

        <td>${index+1}</td>

        <td>${member.name}</td>

        <td>${member.rank}</td>

        <td>${member.balance}</td>

        <td>

        ${
            isEditor

            ?

            `

            <button
            onclick="editMember(${index})">

            ✏️

            </button>

            <button
            onclick="deleteMember(${index})">

            🗑️

            </button>

            `

            :

            ""

        }

        </td>

        </tr>

        `;


    });



    memberCount.textContent =
    members.length;



}

/* ===========================
          تعديل عضو
=========================== */


function editMember(index){


    if(!isEditor) return;


    editIndex = index;


    document.getElementById(
        "memberName"
    ).value =

    members[index].name;



    document.getElementById(
        "memberRank"
    ).value =

    members[index].rank;



    document.getElementById(
        "memberBalance"
    ).value =

    members[index].balance;



    popup.style.display = "flex";


}




/* ===========================
            حذف عضو
=========================== */


async function deleteMember(index){


    if(!isEditor) return;


    if(

        confirm(
            "هل تريد حذف العضو ؟"
        )

    ){


        await deleteDoc(

            doc(

                db,

                "members",

                members[index].id

            )

        );


        await loadMembers();


    }


}



/* ===========================
      لأن الملف Module
=========================== */


window.editMember =
editMember;


window.deleteMember =
deleteMember;

/* ===========================
            البحث
=========================== */


searchInput.addEventListener(

    "keyup",

    function(){


        const value =

        this.value.toLowerCase();



        const rows =

        table.querySelectorAll(
            "tr"
        );



        rows.forEach((row)=>{


            if(

                row.innerText
                .toLowerCase()
                .includes(value)

            ){


                row.style.display = "";


            }else{


                row.style.display =
                "none";


            }


        });


    }

);

/* ===========================
      تحميل البيانات
=========================== */


loadMembers();



/* ===========================
        نهاية الملف
=========================== */