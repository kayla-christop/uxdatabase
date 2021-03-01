window.addEventListener("load", async function(event) {
    fetch("https://api.github.com/repos/kayla-christop/uxdatabase/branches/master").then(response=>response.json().then(data=> {
	let [year, month, day] = data.commit.commit.author.date.replace(/T.+/, "").match(/\d+(?:(?=-|$))/g);
	document.getElementById("update").innerText = "Last updated on: " + month + "/" + day + "/" + year;
}));
    setTimeout(function(){
        document.getElementById("bottomtext").click();
    },2500)
    let database = await (await fetch("/Database.json")).json();

    let body = document.getElementById("body");

    let toolDivList = {};
    let categoriesList = [];
    let featuresList = [];

    database.tools.forEach(function(tool) {
        tool.category.forEach(function(category) {
            if (!categoriesList.includes(category)) {
                categoriesList.push(category);
            }
        });

        tool.features.forEach(function(feature) {
            if (!featuresList.includes(feature)) {
                featuresList.push(feature);
            }
        });

        let toolDiv = document.createElement("div");
        toolDivList[tool.name] = toolDiv;
        body.appendChild(toolDiv);

        let slideButton = document.createElement("button");
        slideButton.className = "slideButton";
        slideButton.innerText = tool.name
        toolDiv.appendChild(slideButton);

        let product = document.createElement("div");
        product.className = "product";
        toolDiv.appendChild(product);

        let left = document.createElement("div");
        left.className = "left";
        product.appendChild(left);

        let img = document.createElement("img");
        img.src = tool.image;
        img.width = 225;
        left.appendChild(img);

        let buttonp = document.createElement("p");
        left.appendChild(buttonp);

        let button = document.createElement("button")
        button.className = "downloadButton";
        button.onclick = function(event) {
            window.open(tool.link);
        };
        button.innerText = "Go to Site";
        left.appendChild(button);

        let right = document.createElement("div");
        right.className = "right";
        product.appendChild(right);

        let infop = document.createElement("p");
        infop.className = "info";
        infop.innerText = "Tool Information";
        right.appendChild(infop);

        let table = document.createElement("table");
        right.appendChild(table);

        let tbody = document.createElement("tbody");
        table.appendChild(tbody);

        for (let quality in tool.info) {
            let tr = document.createElement("tr");
            tbody.appendChild(tr);

            let th = document.createElement("th");
            th.innerText = quality;
            tr.appendChild(th);

            let td = document.createElement("td");
            td.innerText = tool.info[quality];
            tr.appendChild(td);
        }

        let expandedHeight = product.clientHeight;
        product.style.height = "0px";

        slideButton.onclick = function(event) {
            if (product.style.height == "0px") {
                product.style.height = expandedHeight + "px";
            } else {
                product.style.height = "0px";
            }
        };

        toolDiv.style.display = "none";
    });

    // let categoryForm = document.getElementById("categoryForm");
    let categoryListDiv = document.getElementById("categoryList");

    categoriesList.forEach(function(category){
        let label = document.createElement("label");
        label.className = "customCheckbox";
        label.innerText = category;
        categoryListDiv.appendChild(label);
        
        let input = document.createElement("input");
        input.type = "checkbox";
        input.name = category;
        input.className = "categories";
        label.appendChild(input);

        let span = document.createElement("span");
        span.className = "checkmark";
        label.appendChild(span);
    })    
    
    // other category thing
    let featuresListDiv = document.getElementById("featuresList");

    featuresList.forEach(function(feature){
        let label = document.createElement("label");
        label.className = "customCheckbox";
        label.innerText = feature;
        featuresListDiv.appendChild(label);
        
        let input = document.createElement("input");
        input.type = "checkbox";
        input.name = feature;
        input.className = "features";
        label.appendChild(input);

        let span = document.createElement("span");
        span.className = "checkmark";
        label.appendChild(span);
        // featuresListDiv.appendChild(document.createElement("br"))
    });

    let Expanded = document.getElementById("Expanded");

    filterForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        Object.values(toolDivList).forEach(function(div){
            div.style.display = "none";
            div.getElementsByClassName("product")[0].style.height = "0px";
        });
        document.getElementById("homepage").style.display = "none";
        document.getElementById("noresults").style.display = "none";
        document.getElementById("filteragain").style.display = "none";
        document.getElementById("resultslist").style.display = "none";
        document.getElementById("loader").style.display = "block";
        await new Promise(function(resolve){
            setTimeout(function(){
                document.getElementById("loader").style.display = "none";
                resolve();
            },750);
        });

        let categories = document.getElementsByClassName("categories");        
        let checkedCategories = [];
        Array.from(categories).forEach(function(category) {
            if (category.checked) {
                checkedCategories.push(category.name);
            }
        });

        let features = document.getElementsByClassName("features");        
        let checkedFeatures = [];
        Array.from(features).forEach(function(feature) {
            if (feature.checked) {
                checkedFeatures.push(feature.name);
            }
        });
        
        let areresults=false;

        let resultsnumber = 0;
        database.tools.forEach(function(tool) {
            let isChecked = checkedCategories.every(function(categoryCheck) {
                return tool.category.includes(categoryCheck);
            }) && checkedFeatures.every(function(featureCheck) {
                return tool.features.includes(featureCheck);
            });

            if (!Expanded.checked && !checkedCategories.includes(tool.category[0])) {
                isChecked=false
            }

            if (isChecked) {
                resultsnumber++;
                toolDivList[tool.name].style.display = "block";
                areresults=true;
            };
        });

    let filterText = resultsnumber + " Results for:" + checkedCategories.concat(checkedFeatures).map(function(x){
        return " \"" + x + " \"";
    }) + (Expanded.checked ? ", Include Results that may not be Best Fit" : "");
    document.getElementById("resultslist").innerText = filterText;

        if (!areresults) {
            document.getElementById("noresults").style.display = "block";
        }
    });

    // document.getElementById("allButton").addEventListener("click",function(event){
    //     Object.values(toolDivList).forEach(function(tool){
    //         tool.style.display = "block"
    //     }); 
    
    //     document.getElementById("filteragain").style.display = "none";
    //     document.getElementById("homepage").style.display = "none";
    //     document.getElementById("noresults").style.display = "none"; 
    // });

    document.getElementById("clearButton").addEventListener("click",function(event){
        let checkboxes = document.querySelectorAll("input[type=checkbox]");
        Array.from(checkboxes).forEach(function(checkbox){
            checkbox.checked=false;
        });

        Object.values(toolDivList).forEach(function(tool){
            tool.style.display = "none"
        });

        document.getElementById("filteragain").style.display = "block";
        document.getElementById("homepage").style.display = "none";
        document.getElementById("noresults").style.display = "none";
        document.getElementById("resultslist").style.display = "none";
    });

    let isloaded = true;
    this.setTimeout(function(){isloaded = true},2500)

    document.getElementById("bottomtext").onclick = function(){
        if (isloaded) {
        document.getElementById("intro").style.opacity = 0;
        document.getElementById("bottomtext").style["border-color"] = 
        "white";
        document.getElementById("about").style.opacity = 1;
        document.getElementById("homepage").style.transform = "translateY(-160px)";
        };
      };
});

/*
// OLD CODE, NOT TOO USEFUL

// when the website finishes loading, do this...
window.addEventListener("load", (event) => {
    // get the body of the website
    let body = document.getElementById("body");

    // for each tool in the database's list of tools, pass it into this function
    database.tools.forEach(function(tool) {
        // get the division for the tool's category
        let category = document.getElementById(tool.category);

        // if there is no division already on the page, do this...
        if (!category) {
            // create a new division (its not added to the website yet!)
            category = document.createElement("div");
            // set it's id to the tool's category
            category.id = tool.category;
            // add a title (name of the category) to the top of the division
            category.innerHTML = `<b>${tool.category}:</b><br>`;
            // finally, add the new division to the website
            body.appendChild(category);
        }

        // add a link to the current tool to the category
        category.innerHTML += `<p><a href="${tool.link}">${tool.name}</a><br>${tool.description}</p>`;
    });
});

*/