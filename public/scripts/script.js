/**
 * Created by cjdhein on 2/7/2017.
 */


$(document).ready(setup());

function hideAll(){
	$("#viewManageClients").hide();
}

function setup(){
    $("#tablepanel").append(makeTable());
    //document.body.appendChild(makeTable());
    
	var $actionSelectForm = $("#actionSelector");
	var $tableSelectForm = $("#tableSelector");
	var addClientbtn = document.getElementById("addClientbtn");
	var $addClientModal = $("#addClientModal");
	
	$("#open-addClientbtn").click(function(event){
		$addClientModal.show();
		//getUnownedDogs();
		event.preventDefault();
	});
	
	$("#closeClientForm").click(function(event){
		$addClientModal.hide();
		loadClients();
		resetClientForm();
		event.preventDefault();
	});

	$("#open-viewClientbtn").click(function(event){
        hideAll();
        $("#viewManageClients").show();
        event.preventDefault();
	});
	
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



	$("#dog-search-name-btn").click(function(event){

		var nameSearchData = $("#dog-search-name").val();

		var payload = {
			option : 2,
			searchData : nameSearchData
		}

        $.post("http://flip2.engr.oregonstate.edu:24561/dog-info", payload, function(data){
            console.log("posted");
            populateDogs(data);
        });

		event.preventDefault();
	});

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
	
	$("#addClientbtn").click(function(event){
		var fNameData = $("#fName").val();
		var lNameData = $("#lName").val();
		var phoneData = $("#phone").val();
		var emailData = $("#email").val();
		var houseNumData = $("#houseNum").val();
		var streetData = $("#street").val();
		var cityData = $("#city").val();
		var stateData = $("#state").val();
		var zipData = $("#zip").val();

		var clientPayload = {
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

		$.post("http://flip2.engr.oregonstate.edu:24561/post-client", clientPayload, function(data){
			console.log("posted");
			loadClients();
		});
		
		event.preventDefault();
	});

    $("#addDogbtn").click(function(event){
		var nameData = $("#dogName").val();
		var breedData = $("#dogBreed").val();
		var ownerData = $("#dogOwners").val();
		
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

	$("#addPlanbtn").click(function(event){
		var nameData = $("#planName").val();
		var descData = $("#planDesc").val();
		
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
	
	$("#addSessionbtn").click(function(event){
		var dateData = $("#sessionDate").val();
		var lengthData = $("#sessionLength").val();
		var clientData = $("#sessionClient").val();
		var planData = $("#sessionPlan").val();
		
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

    $.get("http://flip2.engr.oregonstate.edu:24561/get", function(data){
        console.log(data);
        loadClients(data);
    });
}

function resetClientForm(){
		$("#fName").val("");
		$("#lName").val("");
		$("#phone").val("");
		$("#email").val("");
		$("#houseNum").val("");
		$("#street").val("");
		$("#city").val("");
		$("#state").val("");
		$("#zip").val("");	
}

function resetDogForm(){
		$("#dogName").val("");
		$("#dogBreed").val("");
		$("#dogOwners").val("");
}

function resetPlanForm(){
		$("#planName").val("");
		$("#planDesc").val("");
}

function resetPackageForm(){
		$("#packageName").val("");
		$("#packageCost").val("");
		$("#numSessions").val("");
}

function getUnownedDogs(){
	
	var payload = {
		option : 1
	}
	
	$.post("http://flip2.engr.oregonstate.edu:24561/dog-info", payload, function(data){
		console.log(data);
		for(var i = 0; i < data.length; i++){
			var opt = $("<option value='" + data[i].idDog + "'>" + data[i].dog + "</option>");
			$("#unownedDogs").append(opt);
		}        
    });	
	
}

function getClientsForSelection(){
	
	$.get("http://flip2.engr.oregonstate.edu:24561/get-clients-selection", function(data){
		console.log(data);
		for(var i = 0; i < data.length; i++){
			var opt = $("<option value='" + data[i].idClient + "'>" + data[i].Name + "</option>");
			$("#dogOwners").append(opt);
		} 		
	});
	
}

function getClients(){
	
    $.get("http://flip2.engr.oregonstate.edu:24561/get-clients", function(data){
        console.log(data);
		for(var i = 0; i < data.length; i++){
			var opt = $("<option value='" + data[i].idClient + "'>" + data[i].Name + "</option>");
			$("#dogOwners").append(opt);
		}        
    });	
	
}

function populateDogs(data){
    var table = $("#dogSearchResults");
    $("#dogSearchResults tr").remove();
    for(var i = 0; i < data.length; i++) {
        var resultRow = document.createElement("tr");
        var resultCell = document.createElement("td");
        var resultSpan = document.createElement("span");
        var resultLink = document.createElement("button");
        resultSpan.textContent = data[i].name;
        resultLink.id = "result" + (i+1);
        resultLink.textContent = "View";

        resultLink.addEventListener("click", function(event){
        	$("#viewDogModal").show();
			event.preventDefault();
		});

		var hiddenId = document.createElement("input");
        hiddenId.type = "hidden";
        hiddenId.name = "rowId";
        hiddenId.value = data[i].idDog;

        resultCell.appendChild(resultSpan);
        resultCell.appendChild(resultLink);
        resultCell.appendChild(hiddenId);
        resultRow.appendChild(resultCell);
		table.append(resultRow);
    }
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

            document.getElementById("thetable").appendChild(addClient(data[i]));
        }
    });
}

function addClient(payload){
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
