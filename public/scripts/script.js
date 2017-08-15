/**
 * Created by cjdhein on 2/7/2017.
 */


$(document).ready(setup());

function hideAll(){
	$("#viewManageClients").hide();
	$("#viewManageDogs").hide();
	
}

function setup(){
    $("#tablepanel").append(makeTable());
    //document.body.appendChild(makeTable());
	
	setupClient();
	setupDog();
	setupPlan();
	setupPackage();
	setupSession();
}

function setupClient(){

		
/********************************************/
/***************** Open/Close ***************/
/********************************************/	
	$("#open-addClientbtn").click(function(event){
		$("#addClientModal").show();
		//getUnownedDogs();
		event.preventDefault();
	});
	
	$("#close-addClientForm").click(function(event){
		$("#addClientModal").hide();
		loadClients();
		resetAddClientForm();
		event.preventDefault();
	});

	$("#open-viewClientbtn").click(function(event){
        hideAll();
        $("#viewManageClients").show();
        event.preventDefault();
	});
	
	$("#close-viewClientbtn").click(function(event){
        hideAll();
        event.preventDefault();
	});		
	
	
	/*submit buttons for add, edit, view*/
	$("#addClientbtn").click(function(event){
		var fNameData = $("#addNewClient > .fName").val();
		var lNameData = $("#addNewClient > .lName").val();
		var phoneData = $("#addNewClient > .phone").val();
		var emailData = $("#addNewClient > .email").val();
		var houseNumData = $("#addNewClient > .houseNum").val();
		var streetData = $("#addNewClient > .street").val();
		var cityData = $("#addNewClient > .city").val();
		var stateData = $("#addNewClient > .state").val();
		var zipData = $("#addNewClient > .zip").val();

		var clientPayload = {
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
		
		console.log(clientPayload);

		$.post("http://flip2.engr.oregonstate.edu:24561/client", clientPayload, function(data){
			console.log("posted");
			loadClients();
		});
		
		event.preventDefault();
	});	
	
}

function runEditClient(id) {
	
	payload = {
		option : 'singleRecord',
		idClient : id
	}
	
	$.post("http://flip2.engr.oregonstate.edu:24561/client", payload, function(data){
		console.log("posted");
		
		$("#editClient > .fName").val(data[0].firstName);
		$("#editClient > .lName").val(data[0].lastName);
		$("#editClient > .phone").val(data[0].phone);
		$("#editClient > .email").val(data[0].email);
		$("#editClient > .houseNum").val(data[0].houseNum);
		$("#editClient > .street").val(data[0].street);
		$("#editClient > .city").val(data[0].city);
		$("#editClient > .state").val(data[0].state);
		$("#editClient > .zip").val(data[0].zip);
		$("#editclient > .idClient").val(data[0].idClient);
		
	});	
	
	$("#editClientbtn").click(function(event){
		
		var idClientData = $("#editclient > .idClient").val();
		var fNameData = $("#editClient > .fName").val();
		var lNameData = $("#editClient > .lName").val();
		var phoneData = $("#editClient > .phone").val();
		var emailData = $("#editClient > .email").val();
		var houseNumData = $("#editClient > .houseNum").val();
		var streetData = $("#editClient > .street").val();
		var cityData = $("#editClient > .city").val();
		var stateData = $("#editClient > .state").val();
		var zipData = $("#editClient > .zip").val();

		var clientPayload = {
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
		
		$.post("http://flip2.engr.oregonstate.edu:24561/client", clientPayload, function(data){
			console.log("posted");
			//loadClients();
		});
		
		
		event.preventDefault();
	});		
}

function setupDog(){

	
/********************************************/
/***************** Open/Close ***************/
/********************************************/
	$("#open-addDogbtn").click(function(event){
		$("#addDogModal").show();
		//getUnownedDogs();
		event.preventDefault();
	});	

	$("#close-addDogbtn").click(function(event){
		$("#addDogModal").hide();
		resetDogForm();
		event.preventDefault();
	});	

	$("#open-viewDogbtn").click(function(event){
        hideAll();
        $("#viewManageDogs").show();
		event.preventDefault();
    });
	
	$("#close-viewDogForm").click(function(event){
		hideAll();
		event.preventDefault();
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
	});	

    $("#addDogbtn").click(function(event){
		var nameData = $("#addNewDog > .dogName").val();
		var breedData = $("#addNewDog > .dogBreed").val();
		var ownerData = $("#addNewDog > .dogOwners").val();
		
		var dogPayload = {
			name : nameData,
			breed : breedData,
			owner : ownerData
		}
		
		console.log(dogPayload);

		$.post("http://flip2.engr.oregonstate.edu:24561/post-dog", dogPayload, function(data){
			console.log("posted");
			//loadClients();
		});
		
		event.preventDefault();
	}); 		
	

	
	function populateDogs(data){
		var div = $("#dogSearchResults");
		$("#dogSearchResults tr").remove();
		for(var i = 0; i < data.length; i++) {
			var resultSpan = document.createElement("span");
			var resultLabel = document.createElement("label");
			var resultLink = document.createElement("button");
			var hiddenId = document.createElement("input");
			
			resultLabel.textContent = data[i].name;
			resultLink.id = "result" + (i+1);
			resultLink.textContent = "View/Edit";
			resultLink.addEventListener("click", function(event){
				$("#editDogModal").show();
				var id = resultLink.nextSibling.value;
				runEditDog(id);
				event.preventDefault();
			});

			hiddenId.type = "hidden";
			hiddenId.name = "rowId";
			hiddenId.value = data[i].idDog;
			
			resultSpan.appendChild(resultLabel);
			resultSpan.appendChild(resultLink);
			resultSpan.appendChild(hiddenId);
		
			div.append(resultSpan);
		}
	}	
	
}

function runEditDog(id) {
	
	payload = {
		option : 'singleRecord',
		idDog : id
	}
	
	$.post("http://flip2.engr.oregonstate.edu:24561/dog", payload, function(data){
		console.log("posted");
		
		$("#editDog > .dogName").val(data[0].name);
		$("#editDog > .dogBreed").val(data[0].breed);
		$("#editDog > .idDog").val(data[0].idDog);
		getClientsForSelection($("#dogOwners-view"));	
		$("#editDog > .dogOwners").val(data[0].idClient);		
	});	
	
	$("#editDogbtn").click(function(event){
		var nameData = $("#editDog > .dogName").val();
		var breedData = $("#editDog > .dogBreed").val();
		var ownerData = $("#editDog > .dogOwners").val();
		var idDogData = $("#editDog > .idDog").val();
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
		
		
		event.preventDefault();
	});		
}

function setupPlan(){

/********************************************/
/***************** Open/Close ***************/
/********************************************/

	$("#open-addPlanbtn").click(function(event){
		$("#addPlanModal").show();
		//getUnownedDogs();
		event.preventDefault();
	});		
	
	$("#close-addPlanbtn").click(function(event){
		$("#addPlanModal").hide();
		resetPlanForm();
		event.preventDefault();
	});			
	
	
	$("#addPlanbtn").click(function(event){
		var nameData = $("#addNewPlan > .planName").val();
		var descData = $("#addNewPlan > .planDesc").val();
		
		var planPayload = {
			name : nameData,
			description : descData
		}
		
		console.log(planPayload);
		
		$.post("http://flip2.engr.oregonstate.edu:24561/post-plan", planPayload, function(data){
			console.log("posted");
			//loadClients();
		});
	});	
}

function setupPackage(){
	
	
/********************************************/
/***************** Open/Close ***************/
/********************************************/	
	$("#open-addPackagebtn").click(function(event){
		$("#addPackageModal").show();
		//getUnownedDogs();
		event.preventDefault();
	});	

	$("#close-addPackagebtn").click(function(event){
		$("#addPackageModal").hide();
		resetPackageForm();
		event.preventDefault();
	});		

	$("#addPackagebtn").click(function(event){
		var nameData = $("#packageName").val();
		var costData = $("#packageCost").val();
		var sessionsData = $("#numSessions").val();
		
		var packagePayload = {
			name : nameData,
			cost : costData,
			numIncludedSessions : sessionsData
		}
		
		console.log(packagePayload);
		
		$.post("http://flip2.engr.oregonstate.edu:24561/post-package", packagePayload, function(data){
			console.log("posted");
			//loadClients();
		});
	});		
	
}

function setupSession(){

/********************************************/
/***************** Open/Close ***************/
/********************************************/
	$("#open-addSessionbtn").click(function(event){
		$("#addSessionModal").show();
		//getUnownedDogs();
		event.preventDefault();
	});		
	
	$("#close-addSessionbtn").click(function(event){
		$("#addSessionModal").hide();
		resetSessionForm();
		event.preventDefault();
	});			
	
	$(function(){
		$("#date").datepicker({dateFormat: 'yy-mm-dd'});
	});	
	
	$("#addSessionbtn").click(function(event){
		var dateData = $("#addNewSession > .sessionDate").val();
		var lengthData = $("#addNewSession > .sessionLength").val();
		var clientData = $("#addNewSession > .sessionClient").val();
		var planData = $("#addNewSession > .sessionPlan").val();
		
		var sessionPayload = {
			date : dateData,
			length : lengthData,
			fk_idClient : clientData,
			fk_idPlanTaught : planData
		}
		
		console.log(sessionPayload);
		
		$.post("http://flip2.engr.oregonstate.edu:24561/post-session", sessionPayload, function(data){
			console.log("posted");
			//loadClients();
		});
	});			
}




function resetAddClientForm(){
	$("#addNewClient > .fName").val("");
	$("#addNewClient > .lName").val("");
	$("#addNewClient > .phone").val("");
	$("#addNewClient > .email").val("");
	$("#addNewClient > .houseNum").val("");
	$("#addNewClient > .street").val("");
	$("#addNewClient > .city").val("");
	$("#addNewClient > .state").val("");
	$("#addNewClient > .zip").val("");	
}

function resetDogForm(){
	$("#addNewDog > .dogName").val("");
	$("#addNewDog > .dogBreed").val("");
	$("#addNewDog > .dogOwners").val("");
}

function resetPlanForm(){
	$("#addNewPlan > .planName").val("");
	$("#addNewPlan > .planDesc").val("");
}

function resetPackageForm(){
	$("#addNewPackage > .packageName").val("");
	$("#addNewPackage > .packageCost").val("");
	$("#addNewPackage > .numSessions").val("");
}

function resetSessionForm(){
	$("#addNewSession > .sessionDate").val("");
	$("#addNewSession > .sessionLength").val("");
	$("#addNewSession > .sessionClient").val("");
	$("#addNewSession > .sessionPlan").val("");
}

function getUnownedDogs(){
	
	var payload = {
		option : 'unowned'
	}
	
	$.post("http://flip2.engr.oregonstate.edu:24561/dog", payload, function(data){
		console.log(data);
		for(var i = 0; i < data.length; i++){
			var opt = $("<option value='" + data[i].idDog + "'>" + data[i].dog + "</option>");
			$("#unownedDogs").append(opt);
		}        
    });	
	
}

function getClientsForSelection(idToApplyTo){
	
	var payload = {
		option : 'nameList'
	}
	
	$.post("http://flip2.engr.oregonstate.edu:24561/client", payload, function(data){
		console.log(data);
		for(var i = 0; i < data.length; i++){
			var opt = $("<option value='" + data[i].idClient + "'>" + data[i].Name + "</option>");
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
