
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
                            <button class="btn btn-sm btn-success">Edit</button>
                            <button class="btn btn-sm btn-danger">Remove</button>
                        </div>
                    </div>
          
        `;
    }).join("");

    blogContainer.innerHTML = res;

}

const CreateBlog = (obj,id) =>{

    let card = document.createElement("div");

    card.id = id ; 

    card.className = "card mb-4";

    card.innerHTML = `
      
                        <div class="card-header">
                            <h5>${obj.title}</h5>
                        </div>
                        <div class="card-body">
                            <p>${obj.content}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success">Edit</button>
                            <button class="btn btn-sm btn-danger">Remove</button>
                        </div>
    `;

    blogContainer.append(card);
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

    let xhr = new XMLHttpRequest();

    xhr.open("GET", PostUrl);

    xhr.send(null);

    xhr.onload = function () {

        if (xhr.status >= 200 && xhr.status < 300) {


            let data = CovertARR(JSON.parse(xhr.response));

            Templating(data);
        }
        else {

            console.error(xhr.status);
        }
    }

    xhr.onerror = function () {

        console.error("network error");
    }
}

FetchData();

const onSubmit = (eve) => {

    eve.preventDefault();

    let blogObj = {

        title: title.value,
        content : content.value,
        userId : userId.value

    }

    let xhr = new XMLHttpRequest();

    xhr.open("POST",PostUrl);

    xhr.send(JSON.stringify(blogObj));

    xhr.onload = function(){

        if(xhr.status >= 200 && xhr.status <= 299){

            CreateBlog(blogObj,JSON.parse(xhr.response).id); 
        }
        else{

            console.error(xhr.status);
        }
    }

    xhr.onerror = function(){

        console.error("network error");
    }
}

blogForm.addEventListener("submit", onSubmit);