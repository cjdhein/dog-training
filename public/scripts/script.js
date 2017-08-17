/**
 * Created by cjdhein on 2/7/2017.
 */


$(document).ready(setup());

function hideAll(){
	$("#viewManageClient").hide();
	$("#viewManageDog").hide();
    $("#viewManagePackage").hide();
    $("#viewManagePlan").hide();
    $("#viewManageSession").hide();
	$("#searchResultDiv").hide();
	$("#viewManageDog > #dog-search-name").val("");
	
}

function setup(){
    $("#tablepanel").append(makeTable());

	setupClient();
	setupDog();
	setupPlan();
	setupPackage();
	setupSession();
}


/********************************************/
/****************** Clients *****************/
/********************************************/
function setupClient(){

		

/***************** Open/Close ***************/

	$("#open-addClientbtn").click(function(event){
		$("#addClientModal").show();
		//getUnownedDogs();
		event.preventDefault(); 
event.stopImmediatePropagation();
	});
	
	$("#close-addClientbtn").click(function(event){
        event.preventDefault(); 
event.stopImmediatePropagation();
		resetAddClientForm();
		$("#addClientModal").hide();
	});

	$("#open-viewClientbtn").click(function(event){
        hideAll();
        $("#viewManageClient").show();
        event.preventDefault(); 
event.stopImmediatePropagation();
	});

    $("#close-editClientForm").click(function(event){
        resetEditClientForm();
        $("#editClientModal").hide();
        event.preventDefault(); 
event.stopImmediatePropagation();
    });
	
	
	/*submit buttons for add, edit, view*/
	$("#addClientbtn").click(function(event){
		var fNameData = $("#addClientModal").find(".fName").val();
		var lNameData = $("#addClientModal").find(".lName").val();
		var phoneData = $("#addClientModal").find(".phone").val();
		var emailData = $("#addClientModal").find(".email").val();
		var houseNumData = $("#addClientModal").find(".houseNum").val();
		var streetData = $("#addClientModal").find(".street").val();
		var cityData = $("#addClientModal").find(".city").val();
		var stateData = $("#addClientModal").find(".state").val();
		var zipData = $("#addClientModal").find(".zip").val();

		var payload = {
			option : 'add',
			fName : fNameData,
			lName : lNameData,
			phone : phoneData,
			email : emailData,
			houseNum : houseNumData,
			street : streetData,
			city : cityData,
			state : stateData,
			zip : zipData
		}
		
		console.log(payload);

		$.post("http://flip2.engr.oregonstate.edu:24561/client", payload, function(data){
			console.log("posted");
			//loadClients();
		});

		resetAddClientForm();
		event.preventDefault(); 
event.stopImmediatePropagation();
	});

	/*submit buttons for add, edit, view*/
    $("#client-view-all-btn").click(function(event){

        var payload = {
            option : 'viewAll'
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/client", payload, function(data){
            console.log("posted");
            populateClients(data);
        });

        event.preventDefault(); 
event.stopImmediatePropagation();

    });

    $("#client-search-name-btn").click(function(event){

        var nameSearchData = $("#client-search-name").val();

        var payload = {
            option : 'nameSearch',
            searchData : nameSearchData
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/client", payload, function(data){
            console.log("posted");
            populateClients(data);
        });

        event.preventDefault(); 
event.stopImmediatePropagation();
    });

    function populateClients(data){
        $("#searchResultDiv").show();
        var table = document.getElementById("searchResultTable");
        $("#searchResultTable tr").remove();
        for(var i = 0; i < data.length; i++) {
            var resultRow = document.createElement("tr");
            var resultNameCell = document.createElement("td");
            var resultAddressCell = document.createElement("td");
            var resultPhoneCell = document.createElement("td");
            var resultEmailCell = document.createElement("td");
            var resultLink = document.createElement("button");
            var hiddenId = document.createElement("input");



            resultNameCell.textContent = "";
            resultAddressCell.textContent = "";
            resultPhoneCell.textContent = "";
            resultEmailCell.textContent = "";


            resultNameCell.textContent = data[i].name;
            resultAddressCell.textContent = data[i].address;
            resultLink.id = "result" + (i+1);
            resultLink.textContent = "View/Edit";
            resultPhoneCell.textContent = data[i].phone;
            resultEmailCell.textContent = data[i].email;


            hiddenId.type = "hidden";
            hiddenId.name = "rowId";
            hiddenId.value = data[i].idClient;

            resultLink.addEventListener("click", function(event){
                $("#editClientModal").show();
                var id = event.currentTarget.nextSibling.value;
                runEditClient(id);
                event.preventDefault(); 
event.stopImmediatePropagation();
            });



            resultRow.appendChild(resultNameCell);
            resultRow.appendChild(resultAddressCell);
            resultRow.appendChild(resultPhoneCell);
            resultRow.appendChild(resultEmailCell);
            resultRow.appendChild(resultLink);
            resultRow.appendChild(hiddenId);

            table.appendChild(resultRow);
        }
    }

}

function runEditClient(id) {

    var payload = {
        option : 'singleRecord',
        idClient : id
    }

    $.post("http://flip2.engr.oregonstate.edu:24561/client", payload, function(data){
        console.log("posted");

        $("#editClientModal").find(".fName").val(data[0].firstName);
        $("#editClientModal").find(".lName").val(data[0].lastName);
        $("#editClientModal").find(".phone").val(data[0].phone);
        $("#editClientModal").find(".email").val(data[0].email);
        $("#editClientModal").find(".houseNum").val(data[0].houseNum);
        $("#editClientModal").find(".street").val(data[0].street);
        $("#editClientModal").find(".city").val(data[0].city);
        $("#editClientModal").find(".state").val(data[0].state);
        $("#editClientModal").find(".zip").val(data[0].zip);
        $("#editClientModal").find(".idClient").val(data[0].idClient);

    });

    $("#editClientbtn").click(function(event){

        var idClientData = $("#editClientModal").find(".idClient").val();
        var fNameData = $("#editClientModal").find(".fName").val();
        var lNameData = $("#editClientModal").find(".lName").val();
        var phoneData = $("#editClientModal").find(".phone").val();
        var emailData = $("#editClientModal").find(".email").val();
        var houseNumData = $("#editClientModal").find(".houseNum").val();
        var streetData = $("#editClientModal").find(".street").val();
        var cityData = $("#editClientModal").find(".city").val();
        var stateData = $("#editClientModal").find(".state").val();
        var zipData = $("#editClientModal").find(".zip").val();

        var payload = {
            option : 'edit',
            idClient : idClientData,
            fName : fNameData,
            lName : lNameData,
            phone : phoneData,
            email : emailData,
            houseNum : houseNumData,
            street : streetData,
            city : cityData,
            state : stateData,
            zip : zipData
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/client", payload, function(data){
            console.log("posted");
            //loadClients();
        });

		resetEditClientForm();
		$("#editClientModal").hide();
        event.preventDefault(); 
event.stopImmediatePropagation();
    });

    $("#deleteClientbtn").click(function(event){
        var idClientData = $("#editClientModal").find(".idClient").val();
        payload = {
            option : 'delete',
            idClient : idClientData
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/client", payload, function(data){
            console.log("posted");
            //loadClients();
        });

        resetEditClientForm();
        $("#editClientModal").hide();
        event.preventDefault(); 
event.stopImmediatePropagation();
    });

}

function resetEditClientForm(){
	
    $("#editClientModal").find(".fName").val("");
    $("#editClientModal").find(".lName").val("");
    $("#editClientModal").find(".phone").val("");
    $("#editClientModal").find(".email").val("");
    $("#editClientModal").find(".houseNum").val("");
    $("#editClientModal").find(".street").val("");
    $("#editClientModal").find(".city").val("");
    $("#editClientModal").find(".state").val("");
    $("#editClientModal").find(".zip").val("");
}

function resetAddClientForm(){

    $("#addClientModal").find(".fName").val("");
    $("#addClientModal").find(".lName").val("");
    $("#addClientModal").find(".phone").val("");
    $("#addClientModal").find(".email").val("");
    $("#addClientModal").find(".houseNum").val("");
    $("#addClientModal").find(".street").val("");
    $("#addClientModal").find(".city").val("");
    $("#addClientModal").find(".state").val("");
    $("#addClientModal").find(".zip").val("");
}

/********************************************/
/******************** Dogs ******************/
/********************************************/

function setupDog(){

	

/***************** Open/Close ***************/

	$("#open-addDogbtn").click(function(event){
		$("#addDogModal").show();
		event.preventDefault(); 
event.stopImmediatePropagation();
	});	

	$("#close-addDogbtn").click(function(event){
		resetAddDogForm();
        $("#addDogModal").hide();
		event.preventDefault(); 
event.stopImmediatePropagation();
	});	

	$("#open-viewDogbtn").click(function(event){
        hideAll();
        $("#viewManageDog").show();
		event.preventDefault(); 
event.stopImmediatePropagation();
    });
	
	$("#close-editDogForm").click(function(event){
        resetEditDogForm();
		$("#editDogModal").hide();
		event.preventDefault(); 
event.stopImmediatePropagation();
	});
	
	/*submit buttons for add, edit, view*/
	$("#dog-view-all-btn").click(function(event){
		
		var payload = {
			option : 'viewAll'
		}
		
        $.post("http://flip2.engr.oregonstate.edu:24561/dog", payload, function(data){
            console.log("posted");
            populateDogs(data);
        });

		event.preventDefault(); 
event.stopImmediatePropagation();
		
	});
	
	$("#dog-search-name-btn").click(function(event){

		var nameSearchData = $("#dog-search-name").val();

		var payload = {
			option : 'nameSearch',
			searchData : nameSearchData
		}

        $.post("http://flip2.engr.oregonstate.edu:24561/dog", payload, function(data){
            console.log("posted");
            populateDogs(data);
        });

		event.preventDefault(); 
event.stopImmediatePropagation();
	});	

    $("#addDogbtn").click(function(event){
		var nameData = $("#addNewDog").find(".dogName").val();
		var breedData = $("#addNewDog").find(".dogBreed").val();
		var ownerData = $("#addNewDog").find(".dogOwners").val();
		
		var dogPayload = {
			option : 'add',
			name : nameData,
			breed : breedData,
			owner : ownerData
		}
		
		console.log(dogPayload);

		$.post("http://flip2.engr.oregonstate.edu:24561/dog", dogPayload, function(data){
			console.log("posted");
			//loadClients();
		});
		resetAddDogForm();
		event.preventDefault(); 
event.stopImmediatePropagation();
	}); 		
	

	
	function populateDogs(data){
		$("#searchResultDiv").show();
		var table = document.getElementById("searchResultTable");
        $("#searchResultTable tr").remove();
		for(var i = 0; i < data.length; i++) {
			var resultRow = document.createElement("tr");
			var resultNameCell = document.createElement("td");
			var resultBreedCell = document.createElement("td");
			var resultLink = document.createElement("button");
			var hiddenId = document.createElement("input");

            resultNameCell.textContent = data[i].name;
            resultBreedCell.textContent = data[i].breed;
			resultLink.id = "result" + (i+1);
			resultLink.textContent = "View/Edit";

            hiddenId.type = "hidden";
            hiddenId.name = "rowId";
            hiddenId.value = data[i].idDog;

			resultLink.addEventListener("click", function(event){
				$("#editDogModal").show();
				var id = event.currentTarget.nextSibling.value;
				runEditDog(id);
				event.preventDefault(); 
event.stopImmediatePropagation();
			});



            resultRow.appendChild(resultNameCell);
            resultRow.appendChild(resultBreedCell);
            resultRow.appendChild(resultLink);
            resultRow.appendChild(hiddenId);

            table.appendChild(resultRow);
		}
	}	
	
}

function runEditDog(id) {
	
	var payload = {
		option : 'singleRecord',
		idDog : id
	}

	getClientsForSelection($("#editDogModal").find(".ownedById"));

	$.post("http://flip2.engr.oregonstate.edu:24561/dog", payload, function(data){
		console.log("posted");

        $("#editDogModal").find(".idClient").val(data[0].idClient);
		$("#editDogModal").find(".dogName").val(data[0].name);
		$("#editDogModal").find(".dogBreed").val(data[0].breed);
		$("#editDogModal").find(".idDog").val(data[0].idDog);
        $("#editDogModal").find(".currentOwner").text($("#editDogModal").find(".ownedById").find("option[value=" + data[0].idClient + "]")[0].textContent);
        $("#editDogModal").find(".ownedById").find("option[value=" + ownerId +"]").attr('selected','selected');


	});

	$("#editDogbtn").click(function(event){
		var nameData = $("#editDogModal").find(".dogName").val();
		var breedData = $("#editDogModal").find(".dogBreed").val();
		var ownerData = $("#editDogModal").find(".ownedById").val();
		var idDogData = $("#editDogModal").find(".idDog").val();

		payload = {
			option : 'edit',
			name : nameData,
			breed : breedData,
			idClient : ownerData,
			idDog : idDogData
		}
		
		$.post("http://flip2.engr.oregonstate.edu:24561/dog", payload, function(data){
			console.log("posted");
			//loadClients();
		});
		
		resetEditDogForm();
		$("#editDogModal").hide();
		event.preventDefault(); 
event.stopImmediatePropagation();
	});

    $("#deleteDogbtn").click(function(event){
        var idDogData = $("#editDogModal").find(".idDog").val();
        payload = {
            option : 'delete',
            idDog : idDogData
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/dog", payload, function(data){
            console.log("posted");
            //loadClients();
        });

        resetEditDogForm();
        $("#editDogModal").hide();
        event.preventDefault(); 
event.stopImmediatePropagation();
    });
}

function resetEditDogForm() {
    $("#editDogModal").find(".dogName").val("");
    $("#editDogModal").find(".dogBreed").val("");
    $("#editDogModal").find(".idDog").val("");
    $("#editDogModal").find(".ownedById").find("option").remove();
    $("#editDogModal").find(".currentOwner").text("");
    $("#editDogModal").find(".idClient").val("");
}

function resetAddDogForm(){
    $("#addDogModal").find(".dogName").val("");
    $("#addDogModal").find(".dogBreed").val("");
    $("#addDogModal").find(".dogOwners").val("");
}

/********************************************/
/******************* Plans ******************/
/********************************************/

function setupPlan(){



    /***************** Open/Close ***************/

    $("#open-addPlanbtn").click(function(event){
        $("#addPlanModal").show();
        event.preventDefault(); 
	event.stopImmediatePropagation();
    });

    $("#close-addPlanbtn").click(function(event){
        resetAddPlanForm();
        $("#addPlanModal").hide();
        event.preventDefault(); 
	event.stopImmediatePropagation();
    });

    $("#open-viewPlanbtn").click(function(event){
        hideAll();
        $("#viewManagePlan").show();
        event.preventDefault(); 
	event.stopImmediatePropagation();
    });

    $("#close-editPlanForm").click(function(event){
        resetEditPlanForm();
        $("#editPlanModal").hide();
        event.preventDefault();
        event.stopImmediatePropagation();
    });

	/*submit buttons for add, edit, view*/
    $("#plan-view-all-btn").click(function(event){

        var payload = {
            option : 'viewAll'
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/Plan", payload, function(data){
            console.log("posted");
            populatePlans(data);
        });

        event.preventDefault(); 
		event.stopImmediatePropagation();

    });

    $("#plan-search-name-btn").click(function(event){

        var nameSearchData = $("#plan-search-name").val();

        var payload = {
            option : 'nameSearch',
            searchData : nameSearchData
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/Plan", payload, function(data){
            console.log("posted");
            populatePlans(data);
        });

        event.preventDefault(); 
		event.stopImmediatePropagation();
    });

    $("#addPlanbtn").click(function(event){
        var planNameData= $("#addNewPlan").find(".planName").val();
        var planDescData = $("#addNewPlan").find(".planDesc").val();

        var planPayload = {
            option : 'add',
            name : planNameData,
            description : planDescData
        }

        console.log(planPayload);

        $.post("http://flip2.engr.oregonstate.edu:24561/Plan", planPayload, function(data){
            console.log("posted");
            //loadClients();
        });
        resetAddPlanForm();
        event.preventDefault(); 
		event.stopImmediatePropagation();
    });



    function populatePlans(data){
        $("#searchResultDiv").show();
        var table = document.getElementById("searchResultTable");
        $("#searchResultTable tr").remove();
        for(var i = 0; i < data.length; i++) {
            var resultRow = document.createElement("tr");
            var resultNameCell = document.createElement("td");
            var resultDescCell = document.createElement("td");
            var resultLink = document.createElement("button");
            var hiddenId = document.createElement("input");

            resultNameCell.textContent = data[i].name;
            resultDescCell.textContent = data[i].description;
            resultLink.id = "result" + (i+1);
            resultLink.textContent = "View/Edit";

            hiddenId.type = "hidden";
            hiddenId.name = "rowId";
            hiddenId.value = data[i].idPlan;

            resultLink.addEventListener("click", function(event){
                $("#editPlanModal").show();
                var id = event.currentTarget.nextSibling.value;
                runEditPlan(id);
                event.preventDefault(); 
				event.stopImmediatePropagation();
            });

            resultRow.appendChild(resultNameCell);
            resultRow.appendChild(resultDescCell);
            resultRow.appendChild(resultLink);
            resultRow.appendChild(hiddenId);

            table.appendChild(resultRow);
        }
    }

}

function runEditPlan(id) {

    var payload = {
        option : 'singleRecord',
        idPlan : id
    }

    $.post("http://flip2.engr.oregonstate.edu:24561/Plan", payload, function(data){
        console.log("posted");

        $("#editPlanModal").find(".idPlan").val(data[0].idPlan);
        $("#editPlanModal").find(".planName").val(data[0].name);
        $("#editPlanModal").find(".planDesc").val(data[0].description);
    });

    $("#editPlanbtn").click(function(event){
        var nameData = $("#editPlanModal").find(".planName").val();
        var descData = $("#editPlanModal").find(".planDesc").val();
        var idPlanData = $("#editPlanModal").find(".idPlan").val();

        var payload = {
            option : 'edit',
            name : nameData,
            description : descData,
            idPlan : idPlanData
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/Plan", payload, function(data){
            console.log("posted");
            //loadClients();
        });

        resetEditPlanForm();
        $("#editPlanModal").hide();
        event.preventDefault(); 
		event.stopImmediatePropagation();
    });

    $("#deletePlanbtn").click(function(event){
        var idPlanData = $("#editPlanModal").find(".idPlan").val();
        payload = {
            option : 'delete',
            idPlan : idPlanData
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/Plan", payload, function(data){
            console.log("posted");
            //loadClients();
        });

        resetEditPlanForm();
        $("#editPlanModal").hide();
        event.preventDefault(); 
		event.stopImmediatePropagation();
    });
}

function resetEditPlanForm() {
    $("#editPlanModal").find(".PlanName").val("");
    $("#editPlanModal").find(".PlanBreed").val("");
    $("#editPlanModal").find(".idPlan").val("");
    $("#editPlanModal").find(".ownedById").find("option").remove();
    $("#editPlanModal").find(".currentOwner").text("");
    $("#editPlanModal").find(".idClient").val("");
}

function resetAddPlanForm(){
    $("#addPlanModal").find(".planName").val("");
    $("#addPlanModal").find(".planDesc").val("");
}

/********************************************/
/***************** Packages *****************/
/********************************************/
function setupPackage(){



    /***************** Open/Close ***************/

    $("#open-addPackagebtn").click(function(event){
        $("#addPackageModal").show();
        event.preventDefault(); 
event.stopImmediatePropagation();
    });

    $("#close-addPackagebtn").click(function(event){
        $("#addPackageModal").hide();
        resetAddPackageForm();
        event.preventDefault(); 
event.stopImmediatePropagation();
    });

    $("#open-viewPackagebtn").click(function(event){
        hideAll();
        $("#viewManagePackage").show();
        event.preventDefault(); 
event.stopImmediatePropagation();
    });

    $("#close-editPackageForm").click(function(event){
        resetEditPackageForm();
        $("#editPackageModal").hide();
        event.preventDefault(); 
event.stopImmediatePropagation();
    });

	/*submit buttons for add, edit, view*/
    $("#package-view-all-btn").click(function(event){

        var payload = {
            option : 'viewAll'
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/Package", payload, function(data){
            console.log("posted");
            populatePackages(data);
        });

        event.preventDefault(); 
event.stopImmediatePropagation();

    });

    $("#package-search-name-btn").click(function(event){

        var nameSearchData = $("#package-search-name").val();

        var payload = {
            option : 'nameSearch',
            searchData : nameSearchData
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/Package", payload, function(data){
            console.log("posted");
            populatePackages(data);
        });

        event.preventDefault(); 
event.stopImmediatePropagation();
    });

    $("#addPackagebtn").click(function(event){
        var nameData = $("#addNewPackage").find(".packageName").val();
        var costData = $("#addNewPackage").find(".packageCost").val();
        var sessionData = $("#addNewPackage").find(".numSessions").val();

        var PackagePayload = {
            option : 'add',
            name : nameData,
            cost : costData,
            numIncludedSessions : sessionData
        }

        console.log(PackagePayload);

        $.post("http://flip2.engr.oregonstate.edu:24561/Package", PackagePayload, function(data){
            console.log("posted");
            //loadClients();
        });
        resetAddPackageForm();
        event.preventDefault(); 
		event.stopImmediatePropagation();
    });



    function populatePackages(data){
        $("#searchResultDiv").show();
        var table = document.getElementById("searchResultTable");
        $("#searchResultTable tr").remove();
        for(var i = 0; i < data.length; i++) {
            var resultRow = document.createElement("tr");
            var resultNameCell = document.createElement("td");
            var resultCostCell = document.createElement("td");
            var resultSessionsCell = document.createElement("td");
            var resultLink = document.createElement("button");
            var hiddenId = document.createElement("input");

            resultNameCell.textContent = data[i].name;
            resultCostCell.textContent = data[i].cost;
            resultSessionsCell.textContent = data[i].numSessions;
            resultLink.id = "result" + (i+1);
            resultLink.textContent = "View/Edit";

            hiddenId.type = "hidden";
            hiddenId.name = "rowId";
            hiddenId.value = data[i].idPackage;

            resultLink.addEventListener("click", function(event){
                $("#editPackageModal").show();
                var id = event.currentTarget.nextSibling.value;
                runEditPackage(id);
                event.preventDefault(); 
				event.stopImmediatePropagation();
            });



            resultRow.appendChild(resultNameCell);
            resultRow.appendChild(resultCostCell);
            resultRow.appendChild(resultSessionsCell);
            resultRow.appendChild(resultLink);
            resultRow.appendChild(hiddenId);

            table.appendChild(resultRow);
        }
    }

}

function getIncludedPlans(id) {


    var payload = {
        option: 'inPackage',
        idPackage: id
    }

    $.post("http://flip2.engr.oregonstate.edu:24561/package-contents", payload, function(data){
        console.log('posted');

        var table = $("#editPackageForm").find(".includedPlans")[0];

        for(var i = 0; i < data.length; i++){
            var resultRow = document.createElement("tr");
            var resultName = document.createElement("td");
            var resultRemove = document.createElement("button");
            var hiddenId = document.createElement("input");

            resultName.textContent = data[i].plName;
            resultRemove.textContent = "X";
            hiddenId.type = "hidden";
            hiddenId.value = data[0].fk_idPlan;

            resultRow.appendChild(resultName);
            resultRow.appendChild(resultRemove);
            resultRow.appendChild(hiddenId);
            table.appendChild(resultRow);
        }
    });
}

function runEditPackage(id) {

    var payload = {
        option : 'singleRecord',
        idPackage : id
    }

    $.post("http://flip2.engr.oregonstate.edu:24561/package", payload, function(data){
        console.log("posted");

        $("#editPackageModal").find(".packageName").val(data[0].name);
        $("#editPackageModal").find(".packageCost").val(data[0].cost);
        $("#editPackageModal").find(".idPackage").val(data[0].idPackage);
        $("#editPackageModal").find(".numSessions").val(data[0].numIncludedSessions);
        getIncludedPlans(data[0].idPackage);

    });

    $("#editPackagebtn").click(function(event){
        var nameData = $("#editNewPackage").find(".packageName").val();
        var costData = $("#editNewPackage").find(".packageCost").val();
        var sessionData = $("#editNewPackage").find(".numSessions").val();

        var payload = {
            option : 'edit',
            name : nameData,
            cost : costData,
            numIncludedSessions : sessionData
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/package", payload, function(data){
            console.log("posted");
            //loadClients();
        });

        resetEditPackageForm();
        $("#editPackageModal").hide();
        event.preventDefault(); 
event.stopImmediatePropagation();
    });

    $("#deletePackagebtn").click(function(event){
        var idPackageData = $("#editPackageModal").find(".idPackage").val();
        payload = {
            option : 'delete',
            idPackage : idPackageData
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/package", payload, function(data){
            console.log("posted");
            //loadClients();
        });

        resetEditPackageForm();
        $("#editPackageModal").hide();
        event.preventDefault(); 
event.stopImmediatePropagation();
    });
}

function resetEditPackageForm() {
    $("#editPackageModal").find(".PackageName").val("");
    $("#editPackageModal").find(".PackageBreed").val("");
    $("#editPackageModal").find(".idPackage").val("");
    $("#editPackageModal").find(".ownedById").find("option").remove();
    $("#editPackageModal").find(".currentOwner").text("");
    $("#editPackageModal").find(".idClient").val("");
}

function resetAddPackageForm(){
    $("#addPackageModal").find(".packageName").val("");
    $("#addPackageModal").find(".packageCost").val("");
    $("#addPackageModal").find(".numSessions").val("");
}

/********************************************/
/****************** Session *****************/
/********************************************/
function setupSession(){



    /***************** Open/Close ***************/

    $("#open-addSessionbtn").on('click', function(event){
        event.preventDefault(); 
		event.stopImmediatePropagation();
        $("#addNewSession .sessionDate").datepicker({dateFormat: 'yy-mm-dd'});
    	getClientsForSelection($("#addSessionModal").find(".sessionClient"));
        $("#addSessionModal").show();

    });

    $("#close-addSessionbtn").click(function(event){
        resetAddSessionForm();
        $("#addSessionModal").hide();
        event.preventDefault(); 
		event.stopImmediatePropagation();

    });

    $("#open-viewSessionbtn").click(function(event){
        hideAll();
        $("#viewManageSession").show();
        event.preventDefault(); 
		event.stopImmediatePropagation();

    });

    $("#close-editSessionForm").click(function(event){
        resetEditSessionForm();
        $("#editSessionModal").hide();
        event.preventDefault(); 
		event.stopImmediatePropagation();

    });

	/*submit buttons for add, edit, view*/
    $("#session-view-all-btn").click(function(event){

        var payload = {
            option : 'viewAll'
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/Session", payload, function(data){
            console.log("posted");
            populateSessions(data);
        });

        event.preventDefault(); 
		event.stopImmediatePropagation();

    });

    $("#session-search-name-btn").click(function(event){

        var nameSearchData = $("#session-search-name").val();

        var payload = {
            option : 'nameSearch',
            searchData : nameSearchData
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/Session", payload, function(data){
            console.log("posted");
            populateSessions(data);
        });

        event.preventDefault(); 
event.stopImmediatePropagation();
    });

    $("#addSessionbtn").click(function(event){
        var clientData = $("#addNewSession").find(".sessionClient").val();
        var dateData = $("#addNewSession").find(".sessionDate").val();
        var lengthData = $("#addNewSession").find(".sessionLength").val();
        var planData = $("#addNewSession").find(".sessionPlan").val();

        var SessionPayload = {
            option : 'add',
            date : dateData,
            length : lengthData,
            fk_idClient : clientData,
			fk_idPlanTaught : planData
        }

        console.log(SessionPayload);

        $.post("http://flip2.engr.oregonstate.edu:24561/Session", SessionPayload, function(data){
            console.log("posted");
            //loadClients();
        });
        resetAddSessionForm();
        event.preventDefault(); 
	event.stopImmediatePropagation();
    });



    function populateSessions(data){
        $("#searchResultDiv").show();
        var table = document.getElementById("searchResultTable");
        $("#searchResultTable tr").remove();
        for(var i = 0; i < data.length; i++) {
            var resultRow = document.createElement("tr");
            var resultClientCell = document.createElement("td");
            var resultDateCell = document.createElement("td");
            var resultLengthCell = document.createElement("td");
            var resultLink = document.createElement("button");
            var hiddenId = document.createElement("input");

            resultClientCell.textContent = data[i].client;
            resultDateCell.textContent = data[i].date;
            resultLengthCell.textContent = data[i].duration;
            resultLink.id = "result" + (i+1);
            resultLink.textContent = "View/Edit";

            hiddenId.type = "hidden";
            hiddenId.name = "rowId";
            hiddenId.value = data[i].idSession;

            resultLink.addEventListener("click", function(event){
                $("#editSessionModal").show();
                var id = event.currentTarget.nextSibling.value;
                runEditSession(id);
                event.preventDefault(); 
				event.stopImmediatePropagation();
            });



            resultRow.appendChild(resultClientCell);
            resultRow.appendChild(resultDateCell);
            resultRow.appendChild(resultLengthCell);
            resultRow.appendChild(resultLink);
            resultRow.appendChild(hiddenId);

            table.appendChild(resultRow);
        }
    }

}

function runEditSession(id) {

    var payload = {
        option : 'singleRecord',
        idSession : id
    }
    getClientsForSelection($("#editSessionModal").find(".ownedById"));
    $.post("http://flip2.engr.oregonstate.edu:24561/Session", payload, function(data){
        console.log("posted");

        $("#editSessionModal").find(".idClient").val(data[0].idClient);
        $("#editSessionModal").find(".SessionName").val(data[0].name);
        $("#editSessionModal").find(".SessionBreed").val(data[0].breed);
        $("#editSessionModal").find(".idSession").val(data[0].idSession);
        $("#editSessionModal").find(".currentOwner").text($("#editSessionModal").find(".ownedById").find("option[value=" + data[0].idClient + "]")[0].textContent);
        $("#editSessionModal").find(".ownedById").find("option[value=" + ownerId +"]").attr('selected','selected');


    });

    $("#editSessionbtn").click(function(event){
        var nameData = $("#editSessionModal").find(".SessionName").val();
        var breedData = $("#editSessionModal").find(".SessionBreed").val();
        var ownerData = $("#editSessionModal").find(".ownedById").val();
        var idSessionData = $("#editSessionModal").find(".idSession").val();
        payload = {
            option : 'edit',
            name : nameData,
            breed : breedData,
            idClient : ownerData,
            idSession : idSessionData
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/Session", payload, function(data){
            console.log("posted");
            //loadClients();
        });

        resetEditSessionForm();
        $("#editSessionModal").hide();
        event.preventDefault(); 
		event.stopImmediatePropagation();
    });

    $("#deleteSessionbtn").click(function(event){
        var idSessionData = $("#editSessionModal").find(".idSession").val();
        payload = {
            option : 'delete',
            idSession : idSessionData
        }

        $.post("http://flip2.engr.oregonstate.edu:24561/Session", payload, function(data){
            console.log("posted");
            //loadClients();
        });

        resetEditSessionForm();
        $("#editSessionModal").hide();
        event.preventDefault(); 
		event.stopImmediatePropagation();
    });
}

function resetEditSessionForm() {
    $("#editSessionModal").find(".SessionName").val("");
    $("#editSessionModal").find(".SessionBreed").val("");
    $("#editSessionModal").find(".idSession").val("");
    $("#editSessionModal").find(".ownedById").find("option").remove();
    $("#editSessionModal").find(".currentOwner").text("");
    $("#editSessionModal").find(".idClient").val("");
}
function resetAddSessionForm(){
	$("#addSessionModal").find(".sessionDate").val("");
	$("#addSessionModal").find(".sessionLength").val("");
	$("#addSessionModal").find(".sessionClient").val("");
	$("#addSessionModal").find(".sessionPlan").val("");

}
















function getClientsForSelection(idToApplyTo){

	var payload = {
		option : 'nameList'
	}
	
	$.post("http://flip2.engr.oregonstate.edu:24561/client", payload, function(data){
		console.log(data);
		for(var i = 0; i < data.length; i++){

			var opt = document.createElement("option");
			opt.value = data[i].idClient;
			opt.textContent = data[i].Owner;
			idToApplyTo.append(opt);
		} 		
	});
	
}




function loadClients(){

    $.get("http://flip2.engr.oregonstate.edu:24561/get-clients", function(data){
        console.log(data);
        var table = $("#thetable");
        $("#thetable tr").remove();
        var headerRow = document.createElement("tr");
        for(var i = 0; i < 4; i++){
            var headCell = document.createElement("th");
            headCell.className = "headCell";
            headCell.id = ("head" + (i+1));
            headerRow.appendChild(headCell);

        }
        table.append(headerRow);
        labelColumns();
        for(var i = 0; i < data.length-1; i++) {

            document.getElementById("thetable").appendChild(clientRow(data[i]));
        }
    });
}

function clientRow(payload){
	var newRow = document.createElement("tr");
	for(var i = 0; i < 5; i++){
		var subCell = document.createElement("td");
		subCell.id = "cell" + i;
		var hiddenId = document.createElement("input");
		hiddenId.type = "hidden";
		hiddenId.name = "rowId";
		hiddenId.value = payload.id;
			
		buttonForm.appendChild(hiddenId);
		subCell.appendChild(buttonForm);
		subCell.className = "buttonCell"

		newRow.appendChild(subCell);
	}
	var newCells = newRow.childNodes;
	newCells[0].textContent = payload.Name;
	newCells[1].textContent = payload.Address;
	newCells[2].textContent = payload.phone;
	newCells[3].textContent = payload.email;

	
	resetClientForm();
	return newRow;
}

function labelColumns(type){

	switch(type){
		case 1: //clients
            document.getElementById("head1").textContent = "Name";
            document.getElementById("head1").className = "nameCell";
            document.getElementById("head2").textContent = "Address";
            document.getElementById("head2").className = "addressCell";
            document.getElementById("head3").textContent = "Phone";
            document.getElementById("head3").className = "phoneCell";
            document.getElementById("head4").textContent = "Email";
            document.getElementById("head4").className = "emailCell";
            break;
		case 2: //dogs
	}


}

function makeTable(){

    $("#thetable").remove();
    var table = document.createElement("table");
    table.classList.add("mytable");
    table.id = "thetable";


    return table;
}
