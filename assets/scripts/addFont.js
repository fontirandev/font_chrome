$(document).ready(function () {
    chrome.storage.local.get(["names"], function (result) { //declared heare to have access to variable names every where
        names = result.names;
        fontNameList_load(names);
        $("#add-font").click(function () {
            chrome.storage.local.get(["names"], function (result) { //declared heare to have access to variable names every where
                names = result.names;
                filePath = document.getElementById('inputfile').value;
                if (filePath) {
                    if (filePath.split(".")[filePath.split(".").length - 1]) {
                        filetype = filePath.split(".")[filePath.split(".").length - 1];
                        types = [
                            "woff",
                            "otf",
                            "ttf",
                            "woff2"
                        ];

                        if (types.indexOf(filetype) > -1) //if file type was valid
                        {
                            file = document.getElementById('inputfile').files[0];
                            let reader = new FileReader();
                            reader.readAsDataURL(file, 'UTF-8');
                            reader.onloadend = function () {
                                fileData = this.result;
                                let fontName = document.getElementById('add_font_page_fontName').value;

                                if (fontName == "") { //getting files name as font name
                                    fileFullName = filePath.split('\\').pop().split('/').pop(); //removing directories
                                    filen = fileFullName.split('.'); // removing file type
                                    fileName = "";
                                    for (let a = 0; a < filen.length - 1; a++) fileName += filen[a];
                                    fontName = fileName;
                                }

                                if (!names) names = [];
                                names.push(fontName);

                                chrome.storage.local.set({ 'names': names }, function () { }); //adding new font name to names

                                chrome.storage.local.get('fontCode', function (data) {
                                    if (data.fontCode == undefined) data['fontCode'] = [];
                                    data_modified = 'data:';
                                    if (filetype == 'woff') data_modified += 'font/woff';
                                    else if (filetype == 'otf') data_modified += 'font/opentype';
                                    else data_modified += 'font/truetype';
                                    data_modified += ';base64,' + fileData.replace(/data:.*?;base64,/, '');
                                    data.fontCode.push(data_modified);
                                    chrome.storage.local.set({ 'fontCode': data.fontCode }, function () { });
                                });
                                document.getElementById('add_font_page_fontName').value = "";
                                document.getElementById('inputfile').value = "";
                                fontNameList_load(names);
                            };
                        }
                        else alert("پسوند فایل نامعتبر می باشد. ");
                    }
                    else alert("پسوند فایل نامعتبر می باشد. ");
                }
                else alert("لطفا یک فایل را انتخاب کنید");
            });
        });
        $('#inputfile').change(function () {
            filePath = document.getElementById('inputfile').value;
            fileFullName = filePath.split('\\').pop().split('/').pop(); //removing directories
            filen = fileFullName.split('.'); // removing file type
            fileName = "";
            for (let a = 0; a < filen.length - 1; a++) {
                fileName += filen[a];
                if (a < filen.length - 2) fileName += '.';
            }
            fontName = fileName;
            document.getElementById('add_font_page_fontName').value = fontName;

        });
        $('#chose_file').click(function () {
            document.getElementById('inputfile').click()
        });
    });

});
function remove_font(index) {
    chrome.storage.local.get(['fontCode', 'names'], function (font_data) {
        font_data['names'].splice(index, 1); //removing the name
        font_data['fontCode'].splice(index, 1);
        chrome.storage.local.set({ 'names': font_data['names'] }, function () { });
        chrome.storage.local.set({ 'fontCode': font_data['fontCode'] }, function () { });
        fontNameList_load(font_data['names']);

    });
}

function fontNameList_load(rec_names) {
    if (rec_names) {
        if (rec_names.length != 0) {
            let fontNameList2 = document.getElementById("add_font_page_fontNameList");
            fontNameList2.innerHTML = ""; //clearing font name list <select>
            lp = 0;
            rec_names.forEach(function (name) { // adding names as <option> to <select>
                fontName = document.createElement('a');
                fontName.textContent = name;
                line = document.createElement('hr');
                a = document.createElement('a');
                a.addEventListener("click", remove_font.bind(null, lp));
                a.href = '#';
                a.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="body_1" width="15" height="15" viewBox="0 0 24 24" style="background-size: 15px 15px;margin: 4px;margin-bottom: 10px;"><defs xmlns="http://www.w3.org/2000/svg"><style>.cls-1 {fill: #7f7f7f;fill-rule: evenodd;filter: url(#filter);}</style><filter id="filter" x="44.188" y="44.688" width="249.625" height="249.625" filterUnits="userSpaceOnUse"><feFlood result="flood" flood-color="#ff4b42"/><feComposite result="composite" operator="in" in2="SourceGraphic"/><feBlend result="blend" in2="SourceGraphic"/></filter></defs><g transform="matrix(0.07058825 0 0 0.07058825 0 0)"><g transform="matrix(1 0 0 1 0 0)"></g><path class="cls-1" transform="matrix(1 0 0 1 0 0)" d="M272.591 44.7L293.8 65.909L65.409 294.3L44.2 273.091L272.591 44.7z" stroke="none" fill="#7F7F7F" fill-rule="nonzero"/><g transform="matrix(1 0 0 1 0 0)"></g><path class="cls-1" transform="matrix(1 0 0 1 0 0)" d="M65.409 44.7L293.809 273.1L272.591 294.3L44.2 65.909L65.409 44.7z" stroke="none" fill="#7F7F7F" fill-rule="nonzero"/></g></svg>';
                fontNameList2.appendChild(a);
                fontNameList2.appendChild(fontName);
                lp += 1;
                if (lp != rec_names.length) fontNameList2.appendChild(line);
            });
            document.getElementById('saved_fonts').style.display = 'block';
        }
        else {
            document.getElementById('saved_fonts').style.display = 'none';
        }
    }
    else {
        document.getElementById('saved_fonts').style.display = 'none';
    }

}