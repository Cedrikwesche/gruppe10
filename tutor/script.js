const dropArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');

var uploaded_files = {};

document.querySelector('#download-form').setAttribute('action', 'Übung01.zip'); // TODO change file with other dropdown selection

// Utility function to prevent default browser behavior
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

//simulate a time consuming task
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// generate a typewriter effect
function typeWriter(txt, element, speed, i = 0) {
    if (i == 0)
        element.textContent = "";
    if (i < txt.length) {
        element.textContent += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed, txt, element, speed, i);
    }
}

/**
 * Convert course and assignment selection to one string uniquely representing them.
 * @returns {String} key
 */
function dropdownSelectionKey() {
    return `${document.getElementById("course-dropdown").getElementsByTagName("button")[0].value}-${document.getElementById("uebung-nr-dropdown").getElementsByTagName("button")[0].value}`
}


// Preventing default browser behavior when dragging a file over the container
dropArea.addEventListener('dragover', preventDefaults);
dropArea.addEventListener('dragenter', preventDefaults);
dropArea.addEventListener('dragleave', preventDefaults);

dropArea.addEventListener('dragover', () => {
    dropArea.classList.add('drag-over');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('drag-over');
});

// call ondrop
function handleDrop(e) {
    e.preventDefault();

    // Getting the list of dragged files
    const files = e.dataTransfer.files;
    handleFiles(files);
    dropArea.classList.remove('drag-over');
}

// non dnd upload
function handleFileSelect(input) {
    handleFiles(input.files);
}

// handle the upload
async function handleFiles(files) {
    // Checking if there are any files
    if (files.length) {
        fileInput.files = files;

        var upload_loader = document.getElementById("upload_loader");
        upload_loader.classList.remove("fade-out");
        upload_loader.classList.add("loader");
        upload_loader.classList.add("fade");

        // cache files locally
        for (const file of files)
            uploaded_files[dropdownSelectionKey()].push(file);

        // send files to server
        await uploadFilesToServer(files);

        upload_loader.classList.add("fade-out");

        update_uploaded_file_info();
    }
}

/**
 * Send the files to the db.
 * @param {object} list of files to upload
 */
async function uploadFilesToServer(files) {
    //simulate upload
    await sleep(2000);

    for (const file of files)
        console.log(`${file.name} uploaded`);
}

// update the content of the dialog that shows all uploaded files
function update_uploaded_file_info() {
    var upload_uploaded_text = document.getElementById("upload_uploaded_text");

    if (uploaded_files[dropdownSelectionKey()].length > 0) {
        upload_uploaded_text.innerHTML = `${uploaded_files[dropdownSelectionKey()].length} <b>files</b> uploaded`;
        document.getElementById("punkte-button").classList.remove("inactive");
        upload_uploaded_text.getElementsByTagName("b")[0].classList.add("clickable");
        upload_uploaded_text.getElementsByTagName("b")[0].addEventListener("click", e => {
            var t = "The uploaded files are ";
            uploaded_files[dropdownSelectionKey()].sort();
            for (var i = 0; i < uploaded_files[dropdownSelectionKey()].length; i++) {
                if (i != 0)
                    t += ", ";
                t += uploaded_files[dropdownSelectionKey()][i].name;
            }
            t += ".";
            document.getElementById("uploaded-files-dialog-content").innerHTML = t;
            document.getElementById('uploaded-files-dialog').showModal()
        });
    } else {
        upload_uploaded_text.textContent = "";
        document.getElementById("punkte-button").classList.add("inactive");
    }
}


// popup toggle
function showPopUp(e) {
    e.getElementsByClassName("popuptext")[0].classList.add("show");
}
function hidePopUp(e) {
    e.getElementsByClassName("popuptext")[0].classList.remove("show");
}

// drop down selection
for (dropdown of document.getElementsByClassName("dropdown")) {
    var dropdown_content = dropdown.getElementsByClassName("dropdown-content")[0];
    dropdown.getElementsByTagName("button")[0].textContent = dropdown_content.querySelectorAll("a,div")[0].textContent;
    dropdown.getElementsByTagName("button")[0].value = dropdown_content.querySelectorAll("a,div")[0].textContent;

    for (var a of dropdown_content.getElementsByTagName("a")) {
        a.addEventListener('click', async function (e) {
            const button = this.parentElement.parentElement.getElementsByTagName("button")[0];
            if (button.classList.contains("dropdown-select")) {
                const text = this.textContent;
                var width = button.offsetWidth;
                button.style.minWidth = `${width}px`;
                button.value = text;
                typeWriter(text, button, 25);
                if (this.parentElement.parentElement.id == "course-dropdown") { // course changed
                    localStorage.setItem("choosenCourse", text);
                }

                if (!(dropdownSelectionKey() in uploaded_files)) uploaded_files[dropdownSelectionKey()] = [];

                update_uploaded_file_info();
            }
        });
    }
}

// set the course the last time choosen
if (localStorage.getItem("choosenCourse") != null) {
    let btn = document.getElementById("course-dropdown").getElementsByTagName("button")[0];
    btn.textContent = localStorage.getItem("choosenCourse");
    btn.value = localStorage.getItem("choosenCourse");
}
// set the latest uebung
let dropdown_uebung = document.getElementById("uebung-nr-dropdown");
let btn = dropdown_uebung.getElementsByTagName("button")[0];
let latest_link = dropdown_uebung.querySelector('.dropdown-content a:last-child');
btn.textContent = latest_link.textContent;
btn.value = latest_link.textContent;

// if no files uploaded it is an empty list
if (!(dropdownSelectionKey() in uploaded_files)) uploaded_files[dropdownSelectionKey()] = [];
update_uploaded_file_info();

// close the punkte dialog when clicked
const dialog = document.getElementById("punkte-dialog");
dialog.addEventListener('click', (event) => {
    if (event.target.id !== 'punkte-dialog-content') {
        dialog.close();
    }
});

// change download button icon
function buttonDownload(element) {
    element.getElementsByClassName("button-download")[0].getElementsByClassName("download-arrow")[0].classList.add("hide");
    element.getElementsByClassName("button-download")[0].getElementsByClassName("download-check")[0].classList.remove("hide");
}

/**
 * set current time and date in footer
 */
function datetime_footer() {
    for (const element of document.getElementsByClassName("curr-time-date"))
        element.innerHTML = (new Date()).toLocaleString();
}
datetime_footer();
setInterval(datetime_footer, 1000);
