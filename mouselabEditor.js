
    /* global variable declaration */
    var jsonVal = null; // copy of the current json file for editing
    var names = []; // stores the names that are already in use
    var dropdownStyleHtml;
    var undoStack = [];
    var redoStack = [];
    var allowedRedo = false;
    var controlPressed = false;
    var fileName = "virus";
    var colorTable;
    var swapFirstColumn = null;
    var swapFirstRow = null;
    var selectedElements = [];
    var dragMouseX = null;
    var dragMouseY = null;

    /** all things that need to be done at the start*/
    function initializeEdit()
    {
        /* loads the current json file into jsonVal*/
        // var val = $('#json').val();
        // if (val) {
        //     try { jsonVal = JSON.parse(val);}
        //     catch (e) { alert('Error in parsing json. ' + e); }
        // } else {
        //     jsonVal = {};
        // }

        loadJson("json_files/1box.json");

        /* adds the add button for collumns*/
        addAddButton();
        addAttriButton();

        /* html table with w3-css colors, for the user to pick*/
        colorTable = '<table class="w3-table"><tr><td class="w3-red colorEl w3-panel" style="width:25%"></td>' +
        '<td class="w3-pink colorEl w3-panel" style="width:25%"></td><td class="w3-khaki colorEl w3-panel" style="width:25%"></td>' +
        '<td class="w3-yellow w3-panel colorEl" style="width:25%"></td></tr><tr>' +
        '<td class="w3-purple w3-panel colorEl" style="width:25%"></td><td class="w3-deep-purple w3-panel colorEl" style="width:25%"></td>' +
        '<td class="w3-amber w3-panel colorEl" style="width:25%"></td><td class="w3-orange w3-panel colorEl" style="width:25%"></td>' +
        '</tr><tr><td class="w3-indigo w3-panel colorEl" style="width:25%"></td>' +
        '<td class="w3-blue w3-panel colorEl" style="width:25%"></td><td class="w3-deep-orange w3-panel colorEl" style="width:25%"></td>' +
        '<td class="w3-blue-gray w3-panel colorEl" style="width:25%"></td></tr><tr>' +
        '<td class="w3-light-blue w3-panel colorEl" style="width:25%"></td><td class="w3-cyan w3-panel colorEl" style="width:25%"></td>' +
        '<td class="w3-brown w3-panel colorEl" style="width:25%"></td><td class="w3-light-gray w3-panel colorEl" style="width:25%"></td>' +
        '</tr><tr></tr><td class="w3-aqua w3-panel colorEl" style="width:25%"></td>' +
        '<td class="w3-teal w3-panel colorEl" style="width:25%"></td><td class="w3-gray w3-panel colorEl" style="width:25%"></td>' +
        '<td class="w3-dark-gray w3-panel colorEl" style="width:25%"></td></tr><tr>' +
        '<td class="w3-green w3-panel colorEl" style="width:25%"></td><td class="w3-light-green w3-panel colorEl" style="width:25%"></td>' +
        '<td class="w3-pale-red w3-panel colorEl" style="width:25%"></td>' +
        '<td class="w3-pale-yellow w3-panel colorEl" style="width:25%"></td></tr><tr>' +
        '<td class="w3-lime w3-panel colorEl" style="width:25%"></td><td class="w3-sand w3-panel colorEl" style="width:25%"></td>' +
        '<td class="w3-pale-green w3-panel colorEl" style="width:25%"></td>' +
        '<td class="w3-pale-blue w3-panel colorEl" style="width:25%"></td></tr></table>';

        /* sets the buttons that are added to the menu of opt/attri based on styling*/
        // dropdownStyleHtml = '<li><a class="dropdown-item" id="blurButton">Blur</a></li>' +
        //     '<li class="dropright"><a class="dropdown-toggle dropdown-item" id="background">background</a>' +
        //     '<ul class="dropdown-menu">' + colorTable;

    /** functions for tha add and delete column/row buttons*/
    $(document).on('click', '[id="addButton"]', function()
    {
        addSameColumn();
    });

    $(document).on('click', '[id="delButton"]', function()
    {
        /* note: only works with label ids lower than 10*/
        var delSelEl = false;
        var parEl = this.parentElement.parentElement.parentElement.parentElement;
        if(selectedElements.length === 0 || selectedElements[0].id.slice(0, -1) === "sideLabel")
        {
            selectedElements = [parEl];
            delSelEl = true;
        }
        var copySelected = selectedElements.slice();
        for(var i = 0; i < copySelected.length; i++)
        {
            selectedElements.splice(0, 1);
            delTargetColumn(copySelected[i].getAttribute("id").substr(-1) - 1);
        }
        if(delSelEl)
        {
            selectedElements = [];
        }
    });

    $(document).on('click', '[id="attriButton"]', function()
    {
        addSameAttribute();
    });

    $(document).on('click', '[id="attriDelButton"]', function()
    {
        /* note: only works with div ids lower than 10*/
        var delSelEl = false;
        var parEl = this.parentElement.parentElement.parentElement.parentElement;
        if(selectedElements.length === 0 || selectedElements[0].id.slice(0, -1) === "headerLabel")
        {
            selectedElements = [parEl];
            delSelEl = true;
        }
        var copySelected = selectedElements.slice();
        for(var i = 0; i < selectedElements.length; i++)
        {
            selectedElements.splice(0, 1);
            var index = copySelected[i].getAttribute("id").substr(-1) - 1;
            delTargetAttri(index);
        }
        if(delSelEl)
        {
            selectedElements = [];
        }
    });

    /** functions for the buttons in dropdownStyleHtml*/
    $(document).on('change', '[id="columnWidthInput"]', function()
    {
        var delSelEl = false;
        var parEl = this.parentElement.parentElement.parentElement.parentElement;
		console.log(parEl)
        if(selectedElements.length === 0 ||selectedElements[0].id.slice(0, -1) === "sideLabel")
        {
            selectedElements = [parEl];
            delSelEl = true;
        }
        for(var i = 0; i < selectedElements.length; i++)
        {
            var optNumber = selectedElements[i].id.substr(-1) - 1;
			//console.log(dropdownStyleHtml)
			//dropdownStyleHtml = dropdownStyleHtml.replace('id="cellWidthInput" value="' + jsonVal["opt"][optNumber]["width"].slice(0, -1) + '"',
             //   'id="cellWidthInput" value="' + this.value + '"');
            changeColumnValues(selectedElements[i].id, undefined, undefined, this.value);
        }
        if(delSelEl)
        {
            selectedElements = [];
        }
    });

    $(document).on('change', '[id="attriHeightInput"]', function()
    {
        var delSelEl = false;
        var parEl = this.parentElement.parentElement.parentElement.parentElement;
        if(selectedElements.length === 0 || selectedElements[0].id.slice(0, -1) === "headerLabel")
        {
            selectedElements = [parEl];
            delSelEl = true;
        }
        for(var i = 0; i < selectedElements.length; i++)
        {
            var cellNumber;
            cellNumber = selectedElements[i].id.substr(-1) - 1;
            dropdownStyleHtml = dropdownStyleHtml.replace('id="cellHeightInput" value="' + jsonVal["attr"][cellNumber]["height"]
                .slice(0, -1) + '"', 'id="cellHeightInput" value="' + this.value + '"');
            changeAttriValues(selectedElements[i].id, undefined, undefined, this.value);
        }
        if(delSelEl)
        {
            selectedElements = [];
        }
    });

    $(document).on('click', '[id="blurButton"]', function()
    {
        var delSelEl = false;
        var parEl = this.parentElement.parentElement.parentElement.parentElement;
        if(selectedElements.length === 0 || (jsonVal["sets"][0]["styling"] === "byOpt" && selectedElements[0].id.slice(0, -1) ===
            "sideLabel") || (jsonVal["sets"][0]["styling"] === "byAtt" && selectedElements[0].id.slice(0, -1) === "headerLabel"))
        {
            selectedElements = [parEl];
            delSelEl = true;
        }
        for(var i = 0; i < selectedElements.length; i++)
        {
            if(selectedElements[0].id.slice(0, -1) === "headerLabel")
            {
                ChangeStyle(undefined, undefined, undefined, true,
                    selectedElements[i].getAttribute("id").substr(-1) - 1, undefined);
            }
            else
            {
                ChangeStyle(undefined, undefined, undefined, true,
                    undefined, selectedElements[i].getAttribute("id").substr(-1) - 1);
            }

        }
        if(delSelEl)
        {
            selectedElements = [];
        }
    });

    /** permanent dropdown menu buttons*/
    $(document).on('click', '[id="swapColumnButton"]', function()
    {
        swapFirstColumn = this.parentElement.parentElement.parentElement.parentElement;
        swapFirstColumn.style.border = "solid";
    });

    $(document).on('click', '[id="swapRowButton"]', function()
    {
        swapFirstRow = this.parentElement.parentElement.parentElement.parentElement;
        swapFirstRow.style.border = "solid";
    });

    $(document).on('change', '[id="labelColumnInput"]', function()
    {
        var delSelEl = false;
        var parEl = this.parentElement.parentElement.parentElement;
        if(selectedElements.length === 0 || selectedElements[0].id.slice(0, -1) === "sideLabel")
        {
            selectedElements = [parEl];
            delSelEl = true;
        }
        for(var i = 0; i < selectedElements.length; i++)
        {
            changeColumnValues(selectedElements[i].id, this.value, undefined, undefined);
        }
        if(delSelEl)
        {
            selectedElements = [];
        }
    });

    $(document).on('click', '[class*="styleButton"]', function()
    {
        var newStyle = this.id;
        var parEl = this.parentElement.parentElement.parentElement.parentElement.parentElement;
        if(parEl.id.slice(0, -1) === "headerLabel")
        {
            console.log(parEl.id);
            changeStyle(newStyle, parEl.id, undefined, undefined);
        }
        else if(parEl.id.slice(0, -1) === "sideLabel")
        {
            changeStyle(newStyle, undefined, parEl.id, undefined);
        }
        else
        {
            parEl = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            changeStyle(newStyle, undefined, undefined, parEl.id);
        }
    });

    $(document).on('change', '[id="nameColumnInput"]', function()
    {
        if(!checkNameInUse(this.value))
        {
            changeColumnValues(this.parentElement.parentElement.parentElement.id, undefined,  this.value,undefined);
        }
    });

    $(document).on('change', '[id="labelAttriInput"]', function()
    {
        var delSelEl = false;
        var parEl = this.parentElement.parentElement.parentElement;
        if(selectedElements.length === 0 || selectedElements[0].id.slice(0, -1) === "headerLabel")
        {
            selectedElements = [parEl];
            delSelEl = true;
        }
        for(var i = 0; i < selectedElements.length; i++)
        {
            changeAttriValues(selectedElements[0].id, this.value, undefined);
        }
        if(delSelEl)
        {
            selectedElements = [];
        }
    });

    $(document).on('change', '[id="varAttriInput"]', function()
    {
        changeAttriValues(this.parentElement.parentElement.parentElement.id, undefined, this.value);
    });

    // /** function for color options*/
    // $(document).on('click', '[class*="colorEl"]', function()
    // {
    //     var styleNumber = this.parentElement.parentElement.parentElement.parentElement.parentElement
    //         .parentElement.parentElement.parentElement.id.substr(-1) - 1;
    //     console.log(styleNumber);
    //     var styleElement = this.parentElement.parentElement.parentElement.parentElement.previousSibling.id;
    //     if(styleElement === "background")
    //     {
    //         ChangeStyle([this.classList[0], "w3-center", "w3-padding-4", "w3-margin-left"], undefined,
    //             undefined, false, styleNumber);
    //     }
    // });

    /** functions for box editing*/
    $(document).on('mouseenter', '[class^="w3-display-container"]', function()
    {
        boxDropDown(this, true);
    });

    $(document).on('mouseleave', '[class^="w3-display-container"]', function()
    {
        boxDropDown(this, false);
    });

    $(document).on('change', '[id="innerTextInput"]', function()
    {
        setBoxText(this.parentElement.parentElement.parentElement.parentElement.id, this.value, undefined);
    });

    $(document).on('change', '[id="outerTextInput"]', function()
    {
        setBoxText(this.parentElement.parentElement.parentElement.parentElement.id, undefined, this.value);
    });

    $(document).on('change', '[id="varNameInput"]', function()
    {
        if(!checkVarInUse(this.value))
        {
            changeVarName(this.parentElement.parentElement.parentElement.parentElement.id, this.value);
        }
    });

    /** functions for the dropdown menu*/
    $(document).on('mouseenter', '[class^="headerElement"]', function()
    {
        labelDropdown(this, true);
    });

    $(document).on('mouseleave', '[class^="headerElement"]', function()
    {
        labelDropdown(this, false);
    });

    $(document).on('mouseenter', '[class^="sideElement"]', function()
    {
        attributeDropdown(this, true);
    });

    $(document).on('mouseleave', '[class^="sideElement"]', function()
    {
        attributeDropdown(this, false);
    });

    /** main menu buttons*/
    $(document).on('click', '[id="nameButton"]', function()
    {
        document.getElementById("fileNameInput").value = fileName;
    });

    $(document).on('change', '[id="fileNameInput"]', function()
    {
        fileName = this.value;
    });

    /** functions for the default styles*/
    $(document).on('change', '[class="changeStyleInput"]', function()
    {
        var position = -1;
        for(var i = 1; i < jsonVal["styles"].length - 2; i++)
        {
            if(jsonVal["styles"][i]["name"] === this.id.substr(3))
            {
                position = i;
            }
            if(JSON.parse(this.value)["name"] === jsonVal["styles"][i]["name"] && JSON.parse(this.value)["name"] !== this.id.substr(3))
            {
                var textValue = JSON.parse(this.value);
                textValue["name"] = this.id.substr(3);
                this.value = JSON.stringify(textValue);
                position = -1;
				break;
            }
        }
        if(position >= 0)
        {
            jsonVal["styles"][position] = JSON.parse(this.value);
            this.id = "st_"+JSON.parse(this.value)["name"];
			
			updateScreenJson(jsonVal);
			var listEl = document.getElementsByClassName("dropright styleClass");
            console.log(listEl)
			for(j = 0; j < listEl.length; j++)
            {
                if(listEl[j].innerText.substr(6) !== jsonVal["styles"][j + 1]["name"])
                {
                    listEl[j].lastChild.firstChild.innerHTML = JSON.stringify(jsonVal["styles"][j + 1]);
                    listEl[j].innerHTML = listEl[j].innerHTML.replace(listEl[j].innerText.substr(6),
                        jsonVal["styles"][j + 1]["name"]);
                }
            }
        }
    });

    $(document).on('click', '[id="newStyleButton"]', function()
    {
        addNewStyle();
    });

    /** functions for undo and redo*/
    $(document).on('click', '[id="undoButton"]', function()
    {
        undo();
    });

    $(document).on('click', '[id="redoButton"]', function()
    {
        redo();
    });

    /** functions for key shortcuts*/
    $(document).keydown(function(event)
    {
        /*control*/
        if(event.which === 17)
        {
            controlPressed = true;
        }
        /* control + z*/
        else if(event.which === 90)
        {
            if(controlPressed)
            {
                undo();
            }
        }
        /* control + y*/
        else if(event.which === 89)
        {
            if(controlPressed)
            {
                redo();
            }
        }
    });

    $(document).keyup(function(event)
    {
        if(event.which === 17)
        {
            controlPressed = false;
        }
    });

    /** functions for downloading json file*/
    $(document).on('click', '[id="downloadButton"]', function()
    {
        var jsonString = JSON.stringify(jsonVal, null, '\t');
        // jsonString = jsonString.replace(/testtest/g, "\r\n");
        download(fileName + ".json", jsonString);
    });

    /* NOTE: only works in browsers that support html5*/
    /* reference: https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server*/
    function download(filename, text)
    {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    /** uploads a json file to use in the editor*/
    $(document).on('change', '[id="fileInput"]', function(event)
    {
        var input = event.target;
        var reader = new FileReader();
        reader.onload = function()
        {
            loadJson(undefined, JSON.parse(reader.result));
            updateScreenJson(jsonVal);
        };
        reader.readAsText(input.files[0]);
    });

    /** opens dropdowns within dropdowns*/
    $(document).on('click', '[class="dropdown-toggle dropdown-item"]', function()
    {
        /* reference: https://bootsnipp.com/snippets/35p8X*/
        if (!$(this).next().hasClass('show')) {
            $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        var $subMenu = $(this).next(".dropdown-menu");
        $subMenu.toggleClass('show');

        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function () {
            $('.dropdown-submenu .show').removeClass("show");
        });

        return false;
    });

    /** regulates the onclick cases where the dropdown menu should not expand, i.e. swapping or selecting*/
    $(document).on('click', '[class="btn btn-primary dropdown-toggle"]', function()
    {
        var index1;
        var index2;
        /*if the users is swapping columns*/
        if(swapFirstColumn !== null)
        {
            index1 = swapFirstColumn.id.substr(-1) - 1;
            index2 = this.parentElement.parentElement.id.substr(-1) - 1;
            swapColumns(index1, index2);
            swapFirstColumn = null;
        }
        /*if the users is swapping rows*/
        else if(swapFirstRow !== null)
        {
            index1 = swapFirstRow.id.substr(-1) - 1;
            index2 = this.parentElement.parentElement.id.substr(-1) - 1;
            swapRows(index1, index2);
            swapFirstRow = null;
        }
        else if(controlPressed === true)
        {
            var parEl = this.parentElement.parentElement;

            if(!checkElementInSelected(parEl))
            {
                if(selectedElements.length >0 && parEl.id.slice(0, -1) !== selectedElements[0].id.slice(0, -1))
                {
                    changeColorSelected("none");
                    selectedElements = [];
                }
                selectedElements.push(parEl);
                changeColorSelected("dashed");
            }
            else
            {
                selectedElements.splice(selectedElements.indexOf(parEl), 1);
                parEl.style.border = "none";
            }
            // console.log(selectedElements);
        }
    });

    /** manages the preview window*/
    $(document).on('mouseenter', '[class^="colElement"]', function()
    {
        var hoverData = document.getElementById("processData").value;
        var preview = "";
        hoverData = hoverData.slice(0, hoverData.lastIndexOf("\n"));
        for(i = 0; i < 4; i++)
        {
            preview = hoverData.substr(hoverData.lastIndexOf("\n")) + "<br>" + preview;
            hoverData = hoverData.slice(0, hoverData.lastIndexOf("\n"));
        }
        document.getElementById("preview").innerHTML = preview;
    });

    /** functions for box dragging*/
    $(document).on('mousedown', '[id="boxHandle"]', function(e)
    {
        dragMouseX = e.clientX;
        dragMouseY = e.clientY;
        this.parentElement.innerHTML = this.parentElement.innerHTML + '<div id="dragBox"></div>';
        $("#dragBox").css({"position": "absolute", "top": "0px", "left": "0px", "background-color":"green"});

    });

    $(document).on('mouseup', '[id="container"]', function()
    {
        dragMouseX = null;
        dragMouseY = null;
    });

    $(document).on('mousemove', '[id="container"]', function(e)
    {
        if(dragMouseX !== null && dragMouseY !== null)
        {
            var xSize = e.clientX - dragMouseX;
            var ySize = e.clientY - dragMouseY;
            //var cellNumber = this.parentElement.parentElement.parentElement.id.substr(-1);
            // $("#dragBox").css({"width":xSize.toString(), "height":ySize.toString()});
            ChangeCellWidth(xSize + 25, ySize + 80, 0);
        }
    });

	}
	
    /** creates and deletes the dropdown menu for the labels*/
    function labelDropdown(element, dropdownOff)
    {
        /* if the hover is on the attribute label column, do nothing*/
        if(element.getAttribute("id") === "headerLabel0")
        {

        }
        /* check if the dropdown button needs to be added or removed*/
        else if(dropdownOff && element.textContent === jsonVal["opt"][element.id.substr(-1) - 1]["label"])
        {
            // var optionalButtons = dropdownStyleHtml;

            var oldLabel = element.textContent;
            var optNumber = element.id.substr(-1) - 1;
            var oldName = jsonVal["opt"][optNumber]["name"];
            var columnWidth = jsonVal["opt"][optNumber]["width"].slice(0, -1);

            var styleButtons = getStyleButtons();

            /* add the html dropdown  to the label */
            element.innerHTML = '<div class="dropdown">' +
            '<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">' + oldLabel +
            '<span class="caret"></span></button><ul class="dropdown-menu">' +
            'Label: <input type="text" id="labelColumnInput" value="' + oldLabel + '">' +
            'Name: <input type="text" id="nameColumnInput" value="' + oldName + '">' +
            '<li><a class="dropdown-item" id="delButton" >Delete</a></li>' +
            '<li>Width: <input type="text" id="columnWidthInput" value="' + columnWidth +'"></li>' +
            '<li><a class="dropdown-item" type="text" id="swapColumnButton">Swap</a></li>' +
            '<li class="dropright"><a class="dropdown-toggle dropdown-item">style</a>' +
            '<ul class="dropdown-menu">' + styleButtons +
            '</ul></li></div>';
        }
        else
        {
            /* set the label back to the json label*/
            element.innerHTML = jsonVal["opt"][element.id.substr(-1) - 1]["label"];
        }
    }

    function attributeDropdown(element, dropdownOff)
    {
        /* check if the dropdown button needs to be added or removed*/
        if(dropdownOff && element.textContent === jsonVal["attr"][element.getAttribute("id").substr(-1) - 1]["label"])
        {
            // var optionalButtons = dropdownStyleHtml;

            var oldLabel = element.textContent;
            var name = jsonVal["attr"][element.id.substr(-1) - 1]["name"];
            var attriHeight = jsonVal["attr"][element.id.substr(-1) - 1]["height"].slice(0, -2);

            var styleButtons = getStyleButtons();

            /* add the html dropdown  to the div */
            element.innerHTML = '<div class="dropdown">' +
                '<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">' + oldLabel +
                '<span class="caret"></span></button><ul class="dropdown-menu">' +
                'Label: <input type="text" id="labelAttriInput" value="' + oldLabel + '">' +
                'Name: <input type="text" id="varAttriInput" value="' + name + '">' +
                '<li><a class="dropdown-item" id="attriDelButton" >Delete</a></li>' +
                '<li>Height: <input type="text" id="attriHeightInput" value="' + attriHeight +'"></li>' +
                '<li><a class="dropdown-item" type="text" id="swapRowButton">Swap</a></li>' +
                '<li class="dropright"><a class="dropdown-toggle dropdown-item">style</a>' +
                '<ul class="dropdown-menu">' + styleButtons +
                '</ul></li></div>';
        }
        else
        {
            /* set the attribute label back to the json label*/
            element.innerHTML = jsonVal["attr"][element.getAttribute("id").substr(-1) - 1]["label"];
        }
    }

    /** adds the hover button to the box with the given id*/
    function boxDropDown(element, dropdownOff)
    {
        /* check if the dropdown button needs to be added or removed*/
        if(dropdownOff && document.getElementById("boxDropdown") === null)
        {
            // var optionalButtons = dropdownStyleHtml;
            /* get the current values as start text for the input fields, also remove unneeded tags*/
            var innerText = element.firstChild.innerHTML;//removeTag(element.firstChild.innerHTML, "<p>");
            var outerText = element.parentElement.lastChild.firstChild.innerHTML;
            var cell = getCellFromId(element.parentElement.id);
            var varName = cell["var"];

            var styleButtons = getStyleButtons();

            /* add the html dropdown  to the div */
            element.innerHTML = element.innerHTML + '<div class="dropdown" id="boxDropdown">' +
                '<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">' +
                '<span class="caret"></span></button><ul class="dropdown-menu">' +
                'Inner text:<input type="text" id="innerTextInput" value=\'' + innerText + '\'>' +
                'Outer text:<input type="text" id="outerTextInput" value=\'' + outerText + '\'>' +
                'Variable name:<input type="text" id="varNameInput" value=\'' + varName + '\'>' +
                '<li class="dropright"><a class="dropdown-toggle dropdown-item">style</a>' +
                '<ul class="dropdown-menu">' + styleButtons + '</ul></li>' +
                '</ul></li></div>';
            $("#boxDropdown").css({"position": "absolute", "top": "0px", "right": "0px"});
            /* code for the box handle*/
            element.innerHTML = element.innerHTML + '<div id="boxHandle"></div>';
            $("#boxHandle").css({"position": "absolute", "bottom": "0px", "right": "0px", "height":"15px", "width":"15px",
            "background-color":"white"});
        }
        else if(!dropdownOff)
        {
            /* set the attribute label back to the json label*/
            document.getElementById("boxDropdown").remove();
            document.getElementById("boxHandle").remove();
        }
    }


    /** adds the add-button to the label row*/
    function addAddButton()
    {
        $("#headerLabels").append('<button type="button" id="addButton">add</button>');
    }

    /** adds the add-button to the label row*/
    function addAttriButton()
    {
        $("#button0").append('<button type="button" id="attriButton">attri</button>');
    }


    /** Copies the last column and adds it at the end of options */
    function addSameColumn()
    {
        /* copy the last option, change its name and add it to jsonVal*/
        var option = arrayCopy(jsonVal["opt"][jsonVal["opt"].length - 1]);
        var name = newName(option["name"]);
        option["name"] = name;
        // option["label"] = newName(option["label"]);
        jsonVal["opt"].push(option);

        /*copy the last cells and add them to cell*/
        for(var i = 0; i < jsonVal["attr"].length; i++)
        {
            var keys = Object.keys(jsonVal["cell"][i]);
            jsonVal["cell"][i][name] = arrayCopy(jsonVal["cell"][i][keys[keys.length - 1]]);
        }

        /* adds a identical style to styles if needed and update cell style and var en delay var*/
        for(i = 0; i < jsonVal["cell"].length; i++)
        {
            // var newStyle = addStyle();
            jsonVal["cell"][i][name]["style"] = jsonVal["cell"][i][jsonVal["opt"][jsonVal["opt"].length -2]["name"]]["style"];
            var varName = newName(jsonVal["cell"][i][name]["var"]);
            jsonVal["cell"][i][name]["var"] = varName;
            jsonVal["delay"]["var"].push(varName);
        }

        /* updates the delay matrix, copying were possible, adding 0 otherwise*/
        var delayMatrix = jsonVal["delay"]["delays"];
        var numAttri = jsonVal["attr"].length;
        for(i = 0; i < numAttri; i++)
        {
            delayMatrix.push([]);
            for(var j = 0; j < delayMatrix[0].length; j++)
            {
                delayMatrix[delayMatrix.length - 1].push(delayMatrix[delayMatrix.length - 2][j]);
            }
        }
        for(i = 0; i < delayMatrix.length; i++)
        {
            for(j = 0; j < numAttri; j++)
            {
                delayMatrix[i].push(0);
            }
        }

        /* add the new option to the order*/
        jsonVal["optOrders"][0]["opt"].push(name);

        /* updates the screen*/
        updateScreenJson(jsonVal);
    }

    /** deletes a column at the target index*/
    function delTargetColumn(indexTarget)
    {
        /* if no target is specified, take the last column*/
        if(indexTarget === undefined)
        {
            indexTarget = jsonVal["opt"].length - 1;
        }

        /* update the delay vars and matrix and update the names array*/
        for(var i = 0; i < jsonVal["attr"].length; i++)
        {
            var varIndex = jsonVal["delay"]["var"].indexOf(jsonVal["cell"][i][getKey(i, indexTarget)]["var"]);
            jsonVal["delay"]["var"].splice(varIndex, 1);
            jsonVal["delay"]["delays"].splice(varIndex, 1);
            for(var j = 0; j < jsonVal["delay"]["delays"].length; j++)
            {
                jsonVal["delay"]["delays"][j].splice(varIndex, 1);
            }
            deleteName(jsonVal["cell"][i][getKey(i, indexTarget)]["var"]);
        }

        /* update the option order*/
        var optOrderIndex = jsonVal["optOrders"][0]["opt"].indexOf(jsonVal["opt"][indexTarget]["name"]);
        jsonVal["optOrders"][0]["opt"].splice(optOrderIndex, 1);

        /* update the names array*/
        deleteName(jsonVal["opt"][indexTarget]["name"]);
        // deleteName(jsonVal["opt"][indexTarget]["label"]);

        /* remove the column*/
        jsonVal["opt"].splice(indexTarget, 1);

        /* remove the cells*/
        for(i = 0; i < jsonVal["cell"].length; i++)
        {
            delete jsonVal["cell"][i][getKey(i, indexTarget)];
        }

        /* update the screen*/
        updateScreenJson(jsonVal);
    }

    /** Copies the last row of attributes and adds it at the end of options */
    function addSameAttribute()
    {
        /* adds a new attribute with new name to attr*/
        jsonVal["attr"].push(arrayCopy(jsonVal["attr"][jsonVal["attr"].length - 1]));
        jsonVal["attr"]["name"] = newName(jsonVal["attr"][jsonVal["attr"].length - 1]["name"]);

        /* updates the delay matrix, copying were possible, adding 0 otherwise*/
        var numColumn = jsonVal["opt"].length;
        var delayMatrix = jsonVal["delay"]["delays"];
        for(var i = 0; i < numColumn; i++)
        {
            delayMatrix.push([]);
            for(var j = 0; j < delayMatrix[0].length; j++)
            {
                delayMatrix[delayMatrix.length - 1].push(delayMatrix[delayMatrix.length - 2][j]);
            }
        }
        for(i = 0; i < delayMatrix.length; i++)
        {
            for(j = 0; j < numColumn; j++)
            {
                delayMatrix[i].push(0);
            }
        }

        jsonVal["cell"].push(arrayCopy(jsonVal["cell"][jsonVal["cell"].length - 1]));
        for(i = 0; i < jsonVal["opt"].length; i++)
        {
            var curCell = jsonVal["cell"][jsonVal["cell"].length - 1][getKey(jsonVal["cell"].length - 1, i)];
            var newVar = newName(curCell["var"]);
            curCell["var"] = newVar;
            jsonVal["delay"]["var"].push(newVar);
            //curCell["style"] = addStyle()["name"];
        }

        /* update the screen*/
        updateScreenJson(jsonVal);
    }

    /** deletes an attribute at the target index*/
    function delTargetAttri(indexTarget)
    {
        /* if no target is specified, take the last column*/
        if(indexTarget === undefined)
        {
            indexTarget = jsonVal["attr"].length - 1;
        }

        /* deletes the attribute en updates name*/
        deleteName(jsonVal["attr"][indexTarget]["name"]);
        jsonVal["attr"].splice(indexTarget, 1);

        /* delete the attribute for all cells, update the delay matrix and update names*/
        for(var i = 0; i < jsonVal["cell"][indexTarget].length; i++)
        {
            var varIndex = jsonVal["delay"]["var"].indexOf(jsonVal["cell"][indexTarget][getKey(indexTarget, i)]["var"]);
            jsonVal["delay"]["var"].splice(varIndex, 1);
            jsonVal["delay"]["delays"].splice(varIndex, 1);
            for(var j = 0; j < jsonVal["delay"]["delays"].length; j++)
            {
                jsonVal["delay"]["delays"][j].splice(varIndex, 1);
            }
            deleteName(jsonVal["cell"][indexTarget][getKey(indexTarget, i)]["var"]);
        }

        /*deletes the attribute in cells*/
        jsonVal["cell"].splice(indexTarget, 1);

        /* update the screen*/
        updateScreenJson(jsonVal);
    }

    // /** changes the main style of the given cell to the given style*/
    // function ChangeStyle(mainClass, textClass, boxClass, changeBoxType, columnNumber, rowNumber)
    // {
    //     var styleElements = [];
    //     if(columnNumber === undefined && rowNumber === undefined)
    //     {
    //         return
    //     }
    //     else if(rowNumber === undefined)
    //     {
    //         var key = jsonVal["opt"][columnNumber]["name"];
    //         for(var i = 0; i < jsonVal["cell"].length; i++)
    //         {
    //             for(var j = 0; j < jsonVal["styles"].length; j++)
    //             {
    //                 if(jsonVal["styles"][j]["name"] === jsonVal["cell"][i][key]["style"])
    //                 {
    //                     styleElements.push(jsonVal["styles"][j]);
    //                 }
    //             }
    //         }
    //     }
    //     else if(columnNumber === undefined)
    //     {
    //         console.log(jsonVal["cell"][rowNumber]);
    //         for(i = 0; i < Object.keys(jsonVal["cell"][rowNumber]).length; i++)
    //         {
    //             for(j = 0; j < jsonVal["styles"].length; j++)
    //             {
    //                 console.log(jsonVal["cell"][rowNumber][getKey(rowNumber, i)]["style"]);
    //                 if(jsonVal["styles"][j]["name"] === jsonVal["cell"][rowNumber][getKey(rowNumber, i)]["style"])
    //                 {
    //                     styleElements.push(jsonVal["styles"][j]);
    //                     console.log(jsonVal["styles"][j]);
    //                 }
    //             }
    //         }
    //     }
    //     else
    //     {
    //         for(i = 0; i < jsonVal["styles"].length; i++)
    //         {
    //             if(jsonVal["styles"][i]["name"] ===  jsonVal["cell"][rowNumber][getKey(rowNumber, columnNumber)]["styles"])
    //             {
    //                 styleElements.push(jsonVal["styles"][i]);
    //             }
    //         }
    //     }
    //
    //     /* if no style is specified, take the default style*/
    //     if(mainClass === undefined)
    //     {
    //         mainClass = ["w3-white", "w3-center", "w3-padding-4", "w3-margin-left"];
    //     }
    //     if(textClass === undefined)
    //     {
    //         textClass = "default";
    //     }
    //     if(boxClass === undefined)
    //     {
    //         boxClass = "default";
    //     }
    //
    //     for(i = 0; i < styleElements.length; i++)
    //     {
    //         /* if changeBoxType is true change boxType to the next type, else keep it the same*/
    //         if (changeBoxType === true)
    //         {
    //             if (styleElements[i]["boxType"] === "closed")
    //             {
    //                 styleElements[i]["boxType"] = "blur";
    //             }
    //             else if (styleElements[i]["boxType"] === "blur")
    //             {
    //                 styleElements[i]["boxType"] = "open";
    //             }
    //             else if (styleElements[i]["boxType"] === "open")
    //             {
    //                 styleElements[i]["boxType"] = "closed";
    //             }
    //         }
    //
    //         /* changes the styles and update the screen*/
    //         styleElements[i]["mainClass"] = mainClass;
    //         styleElements[i]["textClass"] = textClass;
    //         styleElements[i]["boxClass"] = boxClass;
    //     }
    //
    //     updateScreenJson(jsonVal);
    // }

    /** changes the width and height of the given cell to the given values (in % and px)*/
    function ChangeCellWidth(width, height, cellNumber)
    {
        /* if no cell number is specified or if its impossible, take the first cell*/
        var cell;
        if(cellNumber === undefined || cellNumber < 0 || cellNumber >= jsonVal["cells"].length)
        {
            cell = jsonVal["cells"][0];
        }
        else
        {
            cell = jsonVal["cells"][cellNumber];
        }

        /* if no width is specified, or the width is impossible, use current value*/
        if(width === undefined || parseInt(width) < 0)
        {
            width = parseInt(cell["width"].slice(0, -1));
        }
        if(height === undefined || parseInt(height) < 0)
        {
            height = parseInt(cell["height"].slice(0, -2));
        }

        /* changes the width and update the screen*/
        cell["width"] = width.toString() + "%";
        cell["height"] = height.toString() + "px";

        updateScreenJson(jsonVal);
    }

    /** switches the placement of two options and corresponding order and cells*/
    function swapColumns(optIndex1, optIndex2)
    {
        var storeOptLabel = arrayCopy(jsonVal["opt"][optIndex1]["label"]);
        jsonVal["opt"][optIndex1]["label"] = arrayCopy(jsonVal["opt"][optIndex2]["label"]);
        jsonVal["opt"][optIndex2]["label"] = storeOptLabel;

        var storeOptWidth = arrayCopy(jsonVal["opt"][optIndex1]["width"]);
        jsonVal["opt"][optIndex1]["width"] = arrayCopy(jsonVal["opt"][optIndex2]["width"]);
        jsonVal["opt"][optIndex2]["width"] = storeOptWidth;

        for(var i = 0; i < jsonVal["cell"].length; i++)
        {
            var storeCell = arrayCopy(jsonVal["cell"][i][getKey(i, optIndex1)]);
            jsonVal["cell"][i][getKey(i, optIndex1)] = arrayCopy(jsonVal["cell"][i][getKey(i, optIndex2)]);
            jsonVal["cell"][i][getKey(i, optIndex2)] = storeCell;
        }

        // var storeOrder = jsonVal["optOrders"][0]["opt"][optIndex1];
        // jsonVal["optOrders"][0]["opt"][optIndex1] = jsonVal["optOrders"][0]["opt"][optIndex2];
        // jsonVal["optOrders"][0]["opt"][optIndex2] = storeOrder;

        // if(jsonVal["sets"][0]["styling"] === "byOpt")
        // {
        //     var storeCellFormat = arrayCopy(jsonVal["sets"][0]["cellFormat"][optIndex1]);
        //     jsonVal["sets"][0]["cellFormat"][optIndex1] = arrayCopy(jsonVal["sets"][0]["cellFormat"][optIndex2]);
        //     jsonVal["sets"][0]["cellFormat"][optIndex2] = storeCellFormat;
        //
        //     var storeCell = arrayCopy(jsonVal["cells"][optIndex1]);
        //     jsonVal["cells"][optIndex1] = arrayCopy(jsonVal["cells"][optIndex2]);
        //     jsonVal["cells"][optIndex2] = storeCell;
        // }
        updateScreenJson(jsonVal);
    }

    /** switches the placement of two attributes and corresponding order and cells*/
    function swapRows(attriIndex1, attriIndex2)
    {
        var storeCell = arrayCopy(jsonVal["cell"][attriIndex1]);
        jsonVal["cell"][attriIndex1] = arrayCopy(jsonVal["cell"][attriIndex2]);
        jsonVal["cell"][attriIndex2] = storeCell;

        // var options = jsonVal["options"];
        // for(i = 0; i < options.length; i++)
        // {
        //     var storeAttriTxt = options[i]["attributes"][0]["txt"][attriIndex1];
        //     options[i]["attributes"][0]["txt"][attriIndex1] = options[i]["attributes"][0]["txt"][attriIndex2];
        //     options[i]["attributes"][0]["txt"][attriIndex2] = storeAttriTxt;
        //
        //     var storeAttriBox = options[i]["attributes"][0]["box"][attriIndex1];
        //     options[i]["attributes"][0]["box"][attriIndex1] = options[i]["attributes"][0]["box"][attriIndex2];
        //     options[i]["attributes"][0]["box"][attriIndex2] = storeAttriBox;
        //
        //     var storeAttriVar = options[i]["attributes"][0]["var"][attriIndex1];
        //     options[i]["attributes"][0]["var"][attriIndex1] = options[i]["attributes"][0]["var"][attriIndex2];
        //     options[i]["attributes"][0]["var"][attriIndex2] = storeAttriVar;
        // }
        //
        // var storeLabel = jsonVal["attributes"]["labels"][attriIndex1];
        // jsonVal["attributes"]["labels"][attriIndex1] = jsonVal["attributes"]["labels"][attriIndex2];
        // jsonVal["attributes"]["labels"][attriIndex2] = storeLabel;
        //
        // var storeVar = jsonVal["attributes"]["var"][attriIndex1];
        // jsonVal["attributes"]["var"][attriIndex1] = jsonVal["attributes"]["var"][attriIndex2];
        // jsonVal["attributes"]["var"][attriIndex2] = storeVar;
        //
        // if(jsonVal["sets"][0]["styling"] === "byAtt")
        // {
        //     var storeCellFormat = arrayCopy(jsonVal["sets"][0]["cellFormat"][attriIndex1]);
        //     jsonVal["sets"][0]["cellFormat"][attriIndex1] = arrayCopy(jsonVal["sets"][0]["cellFormat"][attriIndex2]);
        //     jsonVal["sets"][0]["cellFormat"][attriIndex2] = storeCellFormat;
        //
        //     var storeCell = arrayCopy(jsonVal["cells"][attriIndex1]);
        //     jsonVal["cells"][attriIndex1] = arrayCopy(jsonVal["cells"][attriIndex2]);
        //     jsonVal["cells"][attriIndex2] = storeCell;
        // }

        updateScreenJson(jsonVal);
    }

    /** sets the text of the given square, by html id*/
    function setBoxText(squareId, textInside, textOutside)
    {
        /* if no squareId is specified, do nothing*/
        if(squareId === undefined)
        {
            return;
        }

        /* get the correct option corresponding to the id*/
        var cell = getCellFromId(squareId);

        /* if no text is specified, keep text the same, else replace ' with " and add an outer div*/
        if(textInside === undefined)
        {
            textInside =  cell["txt"];
        }
        else
        {
            textInside = textInside.replace(/'/g, '"');
            //textInside = '<div class="w3-display-middle">' + textInside + '</div>';
        }
        if(textOutside === undefined)
        {
            textOutside =  cell["box"];
        }
        else
        {
            textOutside = textOutside.replace(/'/g, '"');
            //textOutside = '<div class="w3-display-middle">' + textOutside + '</div>';
        }

        /* changes the text in the correct attribute and update the screen*/
        cell["txt"] = textInside;
        cell["box"] = textOutside;

        updateScreenJson(jsonVal);
    }

    /** */
    function changeVarName(squareId, varName)
    {
        /* if no squareId is specified, do nothing*/
        if(squareId === undefined)
        {
            return;
        }

        /* get the correct option corresponding to the id*/
        var cell = getCellFromId(squareId);

        /* if no text is specified or if it is the empty string, keep the var name the same*/
        var oldname = cell["var"];
        if(varName === undefined || varName === "")
        {
            varName = oldname;
        }

        jsonVal["delay"]["var"][jsonVal["delay"]["var"].indexOf(oldname)] = varName;

        /* changes the text in the correct attribute and update the screen*/
        cell["var"] = varName;

        updateScreenJson(jsonVal);
    }

    /** changes the settings of an option given by id to the given settings*/
    function changeColumnValues(optId, labelText, newName, width)
    {
        /* if no squareId is specified, do nothing*/
        if(optId === undefined)
        {
            return;
        }

        /* get the correct option corresponding to the id*/
        var option = jsonVal["opt"][optId.substr(-1) - 1];

        /* if no text is specified or if it is the empty string, keep the names the same, otherwise change the names*/
        if(labelText !== undefined && labelText !== "")
        {
            option["label"] = labelText;
        }
        if(newName !== undefined && newName !== "")
        {
            jsonVal["optOrders"][0]["opt"][jsonVal["optOrders"][0]["opt"].indexOf(option["name"])] = newName;
            changeOptKey(newName, option["name"]);
            option["name"] = newName;
        }
        if(width !== undefined && width > 0)
        {
            option["width"] = width.toString() + "%";
        }

        /* Update the screen*/
        updateScreenJson(jsonVal);
    }

    /** changes the names of an option given by id to the given names*/
    function changeAttriValues(squareId, labelText, newName, height)
    {
        /* if no squareId is specified, do nothing*/
        if(squareId === undefined)
        {
            return;
        }

        /* if no text is specified or if it is the empty string, keep the names the same, otherwise change the names*/
        if(labelText !== undefined && labelText !== "")
        {
            jsonVal["attr"][squareId.substr(-1) - 1]["label"] = labelText;
        }
        if(newName !== undefined && newName !== "")
        {
            jsonVal["attr"][squareId.substr(-1) - 1]["name"] = newName;
        }
        if(height !== undefined && height > 0)
        {
            jsonVal["attr"][squareId.substr(-1) - 1]["height"] = height.toString() + "px";
        }

        /* Update the screen*/
        updateScreenJson(jsonVal);
    }

    /** changes the style of the given option, row or cell*/
    function changeStyle(newStyle, optId, attrId, cellId)
    {
        /* check for style*/
        if(newStyle !== undefined)
        {
            /* check which of the three is used*/
            if(optId !== undefined)
            {
                var optNum = optId.substr(-1) - 1;
                for(var i = 0; i < jsonVal["cell"].length; i++)
                {
                    console.log(optNum);
                    console.log(getKey(i, optNum));
                    console.log(jsonVal["cell"][i]);
                    jsonVal["cell"][i][getKey(i, optNum)]["style"] = newStyle
                }
            }
            if(attrId !== undefined)
            {
                var attriNum = attrId.substr(-1) - 1;
                for(i = 0; i < Object.keys(jsonVal["cell"][attriNum]).length; i++)
                {
                    jsonVal["cell"][attriNum][getKey(attriNum, i)]["style"] = newStyle;
                }
            }
            if(cellId !== undefined)
            {
                getCellFromId(cellId)["style"] = newStyle;
            }
        }

        /* Update the screen*/
        updateScreenJson(jsonVal);
    }

    // /** changes the styling based on button input*/
    // function changeStyling(newStlye)
    // {
    //     jsonVal["sets"][0]["styling"] = newStlye;
    //     fixStylingCells(newStlye);
    //     updateScreenJson(jsonVal);
    // }

    // /** adds to cellformat and cells if needed when switching styling options*/
    // function fixStylingCells(newStyling)
    // {
    //     /* check how much new entries are needed*/
    //     var numNeedCells;
    //     if(newStyling === "byAtt")
    //     {
    //         numNeedCells = jsonVal["attributes"]["labels"].length;
    //     }
    //     else if (newStyling === "byOpt")
    //     {
    //         numNeedCells = jsonVal["options"].length;
    //     }
    //
    //     /* adds the new entries*/
    //     for(var i = jsonVal["sets"][0]["cellFormat"].length; i < numNeedCells; i++)
    //     {
    //         addCell();
    //         var sets = jsonVal["sets"][0];
    //         sets["cellFormat"].push(arrayCopy(sets["cellFormat"][sets["cellFormat"].length - 1]));
    //         sets["cellFormat"][sets["cellFormat"].length - 1]["cellType"] = jsonVal["cells"][jsonVal["cells"].length - 3]["name"];
    //     }
    // }

    /** sets the json back to the previous action*/
    function undo()
    {
        if(undoStack.length > 1)
        {
            if(!allowedRedo)
            {
                redoStack = [];
            }
            redoStack.push(arrayCopy(undoStack[undoStack.length - 1]));
            undoStack.pop();
            jsonVal = arrayCopy(undoStack[undoStack.length - 1]);
            updateScreenJson(jsonVal);
            undoStack.pop();
            allowedRedo = true;
        }
    }

    /** reverse the undo action*/
    function redo()
    {
        console.log(redoStack);
        if(allowedRedo && redoStack.length >= 1)
        {
            jsonVal = arrayCopy(redoStack[redoStack.length - 1]);
            redoStack.pop();
            updateScreenJson(jsonVal);
            allowedRedo = true;
        }
    }

    /** loads the json on page load*/
    function loadJson(filepath, json)
    {
        if(filepath !== undefined)
        {
            $.getJSON(filepath, function(result)
            {
                jsonVal = result;
                undoStack.push(arrayCopy(jsonVal));
                addStyleButtons();
            });
        }
        else if(json !== undefined)
        {
            jsonVal = json;
            undoStack.push(arrayCopy(jsonVal));
            addStyleButtons();
        }
    }

    /** adds the butons with style names to the main menu dropdown on page load*/
    function addStyleButtons()
    {
        for(var i = 1; i < jsonVal["styles"].length - 2; i++)
        {
            var value = JSON.stringify(jsonVal["styles"][i]);
            document.getElementById("stylesButton").innerHTML = document.getElementById("stylesButton").innerHTML +
                '<li class="dropright styleClass"><a class="dropdown-toggle dropdown-item">style ' + jsonVal["styles"][i]["name"] + '</a>' +
                '<ul class="dropdown-menu"><textarea rows="4" cols="50" class="changeStyleInput" id="st_' + jsonVal["styles"][i]["name"] + '">' +
                value + '</textarea></ul></li>';
            //<input type="text" class="changeStyleInput" id="' + jsonVal["styles"][i]["name"] + '"' + ' value=\'' + value + '\'>
        }
    }

    /** returns the style buttons for the opt, attri and cell dropdowns */
    function getStyleButtons()
    {
        var styleButtons = "";
        for(var i = 1; i < jsonVal["styles"].length - 2; i++)
        {
            styleButtons = styleButtons + '<li class="dropdown-item styleButton" id="' + jsonVal["styles"][i]["name"] + '">' +
                'Style:' + jsonVal["styles"][i]["name"] + '</li>';
        }
        return styleButtons;
    }

    function addNewStyle()
    {
        jsonVal["styles"].splice(jsonVal["styles"].length - 3, 0, arrayCopy(jsonVal["styles"][jsonVal["styles"].length - 3]));
        var position = jsonVal["styles"].length - 3;
        jsonVal["styles"][position]["name"] = newName(jsonVal["styles"][position]["name"]);
        document.getElementById("stylesButton").innerHTML = document.getElementById("stylesButton").innerHTML +
            '<li class="dropright styleClass"><a class="dropdown-toggle dropdown-item">style ' + jsonVal["styles"][position]["name"] + '</a>' +
            '<ul class="dropdown-menu"><textarea rows="4" cols="50" class="changeStyleInput" id="st_' + jsonVal["styles"][position]["name"]
            + '">' + JSON.stringify(jsonVal["styles"][position]) + '</textarea></ul></li>';
    }

    /** changes the json variable to the inputted variable and updates the screen*/
    function updateScreenJson(newJson)
    {
        json = Object.assign({}, newJson);
        //console.log(arrayCopy(json));
        //$('#editor').jsonEditor(json, { change: updateJSON, propertyclick: showPath });
		printJSON();
		refreshTrial($("#trialid").val(), $("#oNum").val());

        /* regulates the undo/redo functionality*/
        undoStack.push(arrayCopy(jsonVal));
        allowedRedo = false;

        /* adds the add buttons*/
        addAddButton();
        addAttriButton();

        /* make sure that selected elements are correctly shown*/
        changeColorSelected("dashed");
    }

    /** changes the key of an option*/
    function changeOptKey(newKey, oldKey, oldKeyIndex)
    {
        if(oldKey === undefined)
        {
            oldKey = jsonVal["opt"][oldKeyIndex]["name"]
        }
        for(var i = 0; i < jsonVal["cell"].length; i++)
        {
            jsonVal["cell"][i][newKey] = jsonVal["cell"][i][oldKey];
            delete jsonVal["cell"][i][oldKey];
        }
    }

    /** changes the color of the selected elements*/
    function changeColorSelected(borderStyle)
    {
        for(var i = 0; i < selectedElements.length; i++)
        {
            document.getElementById(selectedElements[i].id).style.border = borderStyle;
        }
    }

    /** check if the inputted name is already in use*/
    function checkNameInUse(name)
    {
        for(var i = 0; i < jsonVal["opt"].length; i++)
        {
            if(name === jsonVal["opt"][i]["name"])
            {
                return true;
            }
        }
        return false;
    }

    /** check if the inputted variable is already in use*/
    function checkVarInUse(variable)
    {
        for(var i = 0; i < jsonVal["delay"]["var"].length; i++)
        {
            if(variable === jsonVal["delay"]["var"][i])
            {
                return true;
            }
        }
        return false;
    }

    /** uses html ids to check if an element is already selected*/
    function checkElementInSelected(element)
    {
        var id = element.id;
        for(var i = 0; i < selectedElements.length; i++)
        {
            if(selectedElements[i].id === id)
            {
                return true;
            }
        }
        return false;
    }

    // /** adds a copy of a style element to styles*/
    // function addStyle()
    // {
    //     jsonVal["styles"].splice(jsonVal["styles"].length - 3, 0, arrayCopy(jsonVal["styles"][jsonVal["styles"].length - 3]));
    //     jsonVal["styles"][jsonVal["styles"].length - 3]["name"] = newName(jsonVal["styles"][jsonVal["styles"].length - 3]["name"]);
    //     return  jsonVal["styles"][jsonVal["styles"].length - 3];
    // }

    // /** returns the nth letter of the alphabet in uppercase*/
    // function getLetter(n)
    // {
    //     return String.fromCharCode(n + 65);
    // }

    /** returns a new name based on the inputted name that is not already in the names var*/
    function newName(oldName)
    {
        var count = 1; // counting variable for the while loop
        var endString = -1; // string to append to the end of the name

        /* add the numbers at th end of the name to endstring, if any*/
        while(/^\d+$/.test(oldName.substring(oldName.length - count, oldName.length)))
        {
            endString = parseInt(oldName.substring(oldName.length - count, oldName.length), 10);
            count++;
        }

        /* if the string ended with a number, increase it by 1, else, add "1", repeat in case the name was already in use*/
        var result;
        do
        {
            if(endString !== -1)
            {
                endString++;
                result = oldName.substring(0, oldName.length - (count - 1)) + String(endString);
            }
            else
            {
                result = oldName + "1";
                endString = 1;
            }
        }
        while(names.indexOf(result) !== -1);

        /* update names and return the result*/
        names.push(result);
        return result;
    }

    // function removeTag(string, tag)
    // {
    //     if(string.indexOf(tag) === 0)
    //     {
    //         string = string.substr(tag.length);
    //         string = string.slice(0, -(tag.length + 1));
    //     }
    //     return string;
    // }

    /** gets the cell key from the cake*/
    function getKey(attriNum, optNum)
    {
        return Object.keys(jsonVal["cell"][attriNum])[optNum];
    }

    /** finds the option corresponding to the given html id*/
    function getCellFromId(squareId)
    {
        var cellname=$("#"+squareId).attr("name");
		console.log(cellname)
		
		for (i=0;i<jsonVal["cell"].length;i++)
			{	
			console.log(Object.keys(jsonVal["cell"][i]))
			Object.keys(jsonVal["cell"][i]).forEach(function(k){
				console.log(jsonVal["cell"][i][k]["var"])
			if (jsonVal["cell"][i][k]["var"]==cellname)
			{cellout=jsonVal["cell"][i][k];}
			})
			}
		return cellout;
		/*
		

		var attriNum = squareId.substr(-1) - 1;
		console.log(squareId,attriNum)
	   for(var i = 0; i < Object.keys(jsonVal["cell"][attriNum]).length; i++)
        {
            if(Object.keys(jsonVal["cell"][attriNum])[i] === squareId.slice(0, -1))
            {
                console.log(jsonVal["cell"][attriNum][Object.keys(jsonVal["cell"][attriNum])[i]]);
				return jsonVal["cell"][attriNum][Object.keys(jsonVal["cell"][attriNum])[i]];
            }
        }
	*/
    }

    /** remove the given name from names*/
    function deleteName(name)
    {
        var nameIndex = names.indexOf(name);
        names.splice(nameIndex, 1);
    }

    /** deep copy the given array*/
    function arrayCopy(array)
    {
        return JSON.parse(JSON.stringify(array));
    }