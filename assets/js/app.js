
const cl = console.log;

const blogForm = document.getElementById("blogForm");
const title = document.getElementById("title");
const content = document.getElementById("content");
const userId = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const blogContainer = document.getElementById("blogContainer");
const spinner = document.getElementById("spinner");


const BaseURL = "https://post-task-xhr-default-rtdb.firebaseio.com/";

const PostUrl = "https://post-task-xhr-default-rtdb.firebaseio.com/blogs.json";

const Loader = (flag) =>{

    if(flag){

        spinner.classList.remove("d-none");
    }
    else{

        spinner.classList.add("d-none");
    }
}

const SnackBar = (icon,msg) =>{

    Swal.fire({

        title : msg,
        icon : icon,
        timer : 1500
    })
}

const Templating = (arr) => {

    let res = arr.map(b => {

        return `
           
                    <div class="card mb-4" id="${b.id}">
                        <div class="card-header">
                            <h5>${b.title}</h5>
                        </div>
                        <div class="card-body">
                            <p>${b.content}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                        </div>
                    </div>
          
        `;
    }).join("");

    blogContainer.innerHTML = res;

}

const CreateBlog = (obj, id) => {

    

    let card = document.createElement("div");

    card.id = id;

    card.className = "card mb-4";

    card.innerHTML = `
      
                        <div class="card-header">
                            <h5>${obj.title}</h5>
                        </div>
                        <div class="card-body">
                            <p>${obj.content}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                        </div>
    `;

    blogContainer.append(card);
}

const PatchData = (obj) => {

    title.value = obj.title;
    content.value = obj.content;
    userId.value = obj.userId;

    submitBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}

const UIUpdate = (obj) => {

    let card = document.getElementById(obj.id);

    card.innerHTML = `
      
                        <div class="card-header">
                            <h5>${obj.title}</h5>
                        </div>
                        <div class="card-body">
                            <p>${obj.content}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                        </div>
         
    `;

    submitBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
    blogForm.reset();
}

const CovertARR = (obj) => {

    let arr = [];

    for (const key in obj) {

        let data = { ...obj[key], id: key }

        arr.push(data);
    }

    return arr;
}


const FetchData = () => {

    Loader(true);

    let xhr = new XMLHttpRequest();

    xhr.open("GET", PostUrl);

    xhr.send(null);

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status < 300) {


            let data = CovertARR(JSON.parse(xhr.response));

            Templating(data);

            Loader(false);
        }
        else {

            console.error(xhr.status);
        }
    }

    xhr.onerror = function () {

        console.error("network error");
        Loader(false);
    }
}

FetchData();

const onEdit = (ele) => {

    Loader(true);

    let EDIT_ID = ele.closest(".card").id;

    let EDIT_URL = `${BaseURL}/blogs/${EDIT_ID}.json`;

    localStorage.setItem("EDIT_ID", EDIT_ID);

    let xhr = new XMLHttpRequest();

    xhr.open("GET", EDIT_URL);

    xhr.send(null);

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status <= 299) {

            PatchData(JSON.parse(xhr.response));

            Loader(false);
            
            let card = document.getElementById(EDIT_ID);

            let btn = card.querySelector(".btn-danger");

            if (btn) btn.classList.add("d-none");

            blogForm.scrollIntoView({ behavior: "smooth", block: "center" });

        }
        else {

            console.error(xhr.status);
        }
    }

    xhr.onerror = function () {

        console.error("netwrok error");

        Loader(false);
    }
}

const onUpdate = () => {

    Loader(true);

    let UPDATE_ID = localStorage.getItem("EDIT_ID");

    let UPDATE_URL = `${BaseURL}/blogs/${UPDATE_ID}.json`;

    let UPDATE_OBJ = {

        title: title.value,
        content: content.value,
        userId: userId.value,
        id: UPDATE_ID
    }

    let xhr = new XMLHttpRequest();

    xhr.open("PATCH", UPDATE_URL);

    xhr.send(JSON.stringify(UPDATE_OBJ));

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status < 300) {

            UIUpdate(UPDATE_OBJ);

            let card = document.getElementById(UPDATE_ID);

            card.scrollIntoView({ behavior: "smooth", block: "center" });
            card.classList.add("cardScrolle");
            setTimeout(() => card.classList.remove("cardScrolle"), 1600);

             SnackBar("success","card Updated successfully");

             Loader(false);
        }
        else {

            console.error(xhr.status);
        }
    }

    xhr.onerror = function () {

        console.error("network error");

        Loader(false);
    }
}

const onRemove = (ele) => {

    Loader(true);

    Swal.fire({
        title: "Do you want to Delete movie ?",
        showCancelButton: true,
        confirmButtonText: "DELETE",
    }).then((result) => {
        if (result.isConfirmed) {

            let REMOVE_ID = ele.closest(".card").id;

            let REMOVE_URL = `${BaseURL}/blogs/${REMOVE_ID}.json`;

            let xhr = new XMLHttpRequest();

            xhr.open("DELETE", REMOVE_URL);

            xhr.send(null);

            xhr.onload = function () {

                if (xhr.status >= 200 && xhr.status <= 299) {

                    ele.closest(".card").remove();

                    Loader(false);

                    SnackBar("success","card deleted successfully");
                }
                else {

                    console.error(xhr.status);
                   
                }
            }

            xhr.onerror = function () {

                console.error("netwrok error");
                Loader(false);
            }

        }
         else{

            Loader(false);
         }
         
    });
}

const onSubmit = (eve) => {

    Loader(true);

    eve.preventDefault();

    let blogObj = {

        title: title.value,
        content: content.value,
        userId: userId.value

    }

    let xhr = new XMLHttpRequest();

    xhr.open("POST", PostUrl);

    xhr.send(JSON.stringify(blogObj));

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status <= 299) {

            CreateBlog(blogObj, JSON.parse(xhr.response).id);
             SnackBar("success","card Added successfully");
             Loader(false);
        }
        else {

            console.error(xhr.status);
        }
    }

    xhr.onerror = function () {

        console.error("network error");
        Loader(false);
    }
}

blogForm.addEventListener("submit", onSubmit);
updateBtn.addEventListener("click", onUpdate);