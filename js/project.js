// =====================================================
// RILCO PROJECT MANAGEMENT
// =====================================================

const supabase = window.supabaseClient;

const projectName = document.getElementById("projectName");
const client = document.getElementById("client");
const category = document.getElementById("category");
const locationInput = document.getElementById("location");
const startDate = document.getElementById("startDate");
const finishDate = document.getElementById("finishDate");
const status = document.getElementById("status");

const saveProject = document.getElementById("saveProject");

const projectsContainer = document.getElementById("projectsContainer");

const projectTemplate =
document.getElementById("projectCardTemplate");

const searchProject =
document.getElementById("searchProject");

// =====================================
// LOAD CATEGORY
// =====================================

async function loadCategories(){

const {data,error} = await supabase

.from("project_categories")

.select("*")

.order("id");

if(error){

console.log(error);

return;

}

category.innerHTML =

'<option value="">Select Category</option>';

data.forEach(cat=>{

category.innerHTML += `

<option value="${cat.id}">

${cat.category_name}

</option>

`;

});

}

loadCategories();

// =====================================
// SAVE PROJECT
// =====================================

saveProject.addEventListener("click",async()=>{

if(projectName.value==""){

alert("Project Name Required");

return;

}

const {error} = await supabase

.from("projects")

.insert({

project_name:projectName.value,

category_id:category.value,

client:client.value,

location:locationInput.value,

start_date:startDate.value,

expected_finish:finishDate.value,

status:status.value

});

if(error){

alert(error.message);

return;

}

alert("Project Saved");

projectName.value="";
client.value="";
locationInput.value="";
startDate.value="";
finishDate.value="";

loadProjects();

});
