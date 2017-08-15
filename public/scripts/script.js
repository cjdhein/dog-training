/**
 * Created by cjdhein on 2/7/2017.
 */


$(document).ready(setup());

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
	for(var i = 0; i < 4; i++){
		var subCell = document.createElement("td");
		subCell.id = "cell" + i;
		subCell.className = "dataCell";
	/*	if(i > 4){
			var buttonForm = document.createElement("form");
			buttonForm.method = "post";
			
			var editButton = document.createElement("button");
			editButton.textContent = "Edit";
			editButton.name="edit";
			editButton.classList.add("btn");
            editButton.classList.add("btn-default");
            editButton.classList.add("modaltoggle");
			editButton.setAttribute("data-toggle", "modal");
            editButton.setAttribute("data-target", "editModal");

			editButton.addEventListener("click", function(event){
				var temp = event.target.parentNode.parentNode.parentNode.children;
				var fNameData = temp[0].textContent;
				var lNameData = temp[1].textContent;
				var weightData = parseInt(temp[2].textContent);
				var dateData = temp[3].textContent;
				var lbsData = temp[4].textContent;
				var databaseId = parseInt(event.target.parentNode[2].value);

				if(lbsData == "1"){
				    lbsData = true;
                }else{
				    lbsData = false;
                }

				var postData = {
					name : nameData,
					reps : repsData,
					weight : weightData,
					date : dateData,
					lbs : lbsData,
					id : databaseId
				} 
				
				var modal = document.getElementById("editModal");
				var fields = $("#editRecord input");
				
				fields[0].value = postData.name;
				fields[1].value = postData.reps;
				fields[2].value = postData.weight;
				fields[3].value = String(postData.date);
				fields[4].checked = postData.lbs;
				fields[5].value = postData.id;
				modal.style.display = "block";

				
				var submitEditButton = $("#submitEdit");
				submitEditButton.click(function(event){
					var modal = document.getElementById("editModal");
					var fields = $("#editRecord input"); // the input fields in the edit modal
					if(fields[4].checked == true)
					    fields[4].value = 1;
					else
                        fields[4].value = 0;

					var updatedData = {
						name : fields[0].value,
						reps : fields[1].value,
						weight : fields[2].value,
						date : fields[3].value,
						lbs : fields[4].value,
						id : fields[5].value
					}

					console.log(updatedData);

					$.post("http://flip2.engr.oregonstate.edu:24561/edit", updatedData, function(result){
                        modal.style.display = "none";

					    if(result == "ok"){
                            var successModal = document.getElementById("successModal");
                            successModal.style.display = "block";
                            setTimeout(function(){
                                $("#successModal").fadeOut('fast');
                            }, 1500);
                        }else{
                            var errorModal = document.getElementById("errorModal");
                            errorModal.style.display = "block";
                            setTimeout(function(){
                                $("#errorModal").fadeOut('fast');
                            }, 2000);
                        }


                        loadClients();
                    });


					event.preventDefault();
				});	
				
                var cancelEditButton = $("#closeEdit");
                cancelEditButton.click(function(event){
                    var modal = document.getElementById("editModal");
                    modal.style.display = "none";
                    event.preventDefault();
                });

				event.preventDefault();	
			});
			
			var deleteButton = document.createElement("button");
			deleteButton.name = "delete";
			deleteButton.textContent = "Delete";
            deleteButton.classList.add("btn");
            deleteButton.classList.add("btn-default");


			deleteButton.addEventListener("click", function(event){
				var id = deleteButton.parentNode.childNodes[2].value;

			    console.log("delete clicked on " + id);

			    $.post("http://flip2.engr.oregonstate.edu:24561/delete", {id : id}, function(result){

                    if(result == "ok"){
                        var successModal = document.getElementById("successModal");
                        successModal.style.display = "block";
                        setTimeout(function(){
                            $("#successModal").fadeOut('fast');
                        }, 1500);
                    }else{
                        var errorModal = document.getElementById("errorModal");
                        errorModal.style.display = "block";
                        setTimeout(function(){
                            $("#errorModal").fadeOut('fast');
                        }, 2000);
                    }
                    loadClients();
                });

				event.preventDefault();
			});			
			
			var hiddenId = document.createElement("input");
			hiddenId.type = "hidden";
			hiddenId.name = "rowId";
			hiddenId.value = payload.id;
			
			buttonForm.appendChild(editButton);
			buttonForm.appendChild(deleteButton);
			buttonForm.appendChild(hiddenId);
			subCell.appendChild(buttonForm);
			subCell.className = "buttonCell";
		}*/
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

function labelColumns(){
	document.getElementById("head1").textContent = "Name";
	document.getElementById("head1").className = "nameCell";
	document.getElementById("head2").textContent = "Address";
	document.getElementById("head2").className = "addressCell";
	document.getElementById("head3").textContent = "Phone";
	document.getElementById("head3").className = "phoneCell";
	document.getElementById("head4").textContent = "Email";
	document.getElementById("head4").className = "emailCell";
}

function makeTable(){
    var table = document.createElement("table");
    table.classList.add("mytable");
    table.id = "thetable";


    return table;
}
