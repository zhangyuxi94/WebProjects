
    //get data from json file
    var namebook=[];
    var xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(xhttp.readyState==4&&xhttp.status==200){
            namebook=xhttp.responseText;
            if(localStorage.getItem("namebook")===null){
                localStorage.setItem("namebook",namebook);
            }
            createTable();
        }
    };
    xhttp.open("GET","dataStorage.json",true);
    xhttp.send();

    // create first table
    function createTable(){
        var myTable=document.createElement("TABLE");
        myTable.setAttribute("id","myTable");
        document.getElementById("allUsers").appendChild(myTable);

        var tableTr=document.createElement("TR");
        tableTr.setAttribute("id","tableHeader");
        myTable.appendChild(tableTr);
        var header=["No.","Name","Email","Location","Phone"," "];
        for(var index=0;index<header.length;index++){
            createTh(header[index]);
        }
        var allNameStr=localStorage.getItem("namebook");
        var allName=JSON.parse(allNameStr);
        for(var i=0;i<allName.length;i++){
            var entry=allName[i];
            var tdTr=document.createElement("TR");
            tdTr.setAttribute("id","tr"+i);
            tdTr.appendChild(createTd(i+1));
            for(var key in entry){
                tdTr.appendChild(createTd(entry[key]));
            }
            var tableTd=document.createElement("TD");
            tableTd.appendChild(createBtn("view",i));
            tableTd.appendChild(createBtn("edit",i));
            tableTd.appendChild(createBtn("delete",i));
            tdTr.appendChild(tableTd);
            myTable.appendChild(tdTr);
        }
    }
    function createTh(headerName){
        var tableTr=document.getElementById("tableHeader");
        var tableTh=document.createElement("TH");
        var t=document.createTextNode(headerName);
        tableTh.appendChild(t);
        tableTr.appendChild(tableTh);
    }
    function createTd(data){
        var tableTd=document.createElement("TD");
        var t=document.createTextNode(data);
        tableTd.appendChild(t);
        return tableTd;
    }
    function createBtn(func,index){
        var tableInput=document.createElement("INPUT");
        tableInput.setAttribute("type","button");
        if(func==="delete"){
            tableInput.setAttribute("id","delItem"+index);
            tableInput.setAttribute("value","x");
            tableInput.setAttribute("class","deleteBtn");
            tableInput.setAttribute("onclick","deleteUser("+index+")");
        }else if(func==="edit"){
            tableInput.setAttribute("id","editItem"+index);
            tableInput.setAttribute("value","Edit");
            tableInput.setAttribute("class","editBtn");
            tableInput.setAttribute("onclick","editUser("+index+")");
        }else if(func==="view"){
            tableInput.setAttribute("id","viewItem"+index);
            tableInput.setAttribute("value","View");
            tableInput.setAttribute("class","viewBtn");
            tableInput.setAttribute("onclick","viewUser("+index+")");
        }
        return tableInput;
    }
    // add new user slide down
    var addUserBtn=document.getElementById("addUserBtn");
    var ifShow=false;
    addUserBtn.addEventListener("click",function(){
            if(ifShow===false){
                jQuery("#formStyle").fadeIn();
                document.getElementById("name").value="";
                document.getElementById("email").value="";
                document.getElementById("location").value="";
                document.getElementById("phone").value="";
                //add new user function
                document.getElementById("submitBtn").addEventListener("click",function(){
                    var nameInput=document.getElementById("name").value;
                    var emailInput=document.getElementById("email").value;
                    var locationInput=document.getElementById("location").value;
                    var phoneInput=document.getElementById("phone").value;
                    if(nameInput==""||emailInput==""||locationInput==""||phoneInput==""){
                        validation(nameInput,emailInput,locationInput,phoneInput);
                    }else{
                        addUser(nameInput,emailInput,locationInput,phoneInput,"new",-1);
                    }
                });
                ifShow=true;
            }else{
                jQuery("#formStyle").fadeOut();
                ifShow=false;
            }
        });
    document.getElementById("removePop").addEventListener("click",function(){
        jQuery("#formStyle").fadeOut();
        ifShow=false;
    });

    //editUser
    function editUser(index){
        if(ifShow===false){
            jQuery("#formStyle").fadeIn();
            var allNameStr1=localStorage.getItem("namebook");
            var allName=JSON.parse(allNameStr1);
            var userInfo=allName[index];
            document.getElementById("name").value=userInfo.name;
            document.getElementById("email").value=userInfo.Email;
            document.getElementById("location").value=userInfo.location;
            document.getElementById("phone").value=userInfo.phone;
            document.getElementById("submitBtn").addEventListener("click",function(){
                var nameInput=document.getElementById("name").value;
                var emailInput=document.getElementById("email").value;
                var locationInput=document.getElementById("location").value;
                var phoneInput=document.getElementById("phone").value;
                if(nameInput==""||emailInput==""||locationInput==""||phoneInput==""){
                    validation(nameInput,emailInput,locationInput,phoneInput);
                }else{
                    addUser(nameInput,emailInput,locationInput,phoneInput,"edit",index);
                }
            });
            ifShow=true;
        }else{
            jQuery("#formStyle").fadeOut();
            ifShow=false;
        }
    }
    //deleteUser
    function deleteUser(index){
        var allNameStr1=localStorage.getItem("namebook");
        var allName=JSON.parse(allNameStr1);
        allName.splice(index,1);
        var allNameStr=JSON.stringify(allName);
        localStorage.removeItem("namebook");
        localStorage.setItem("namebook",allNameStr);
        location.reload();
    }
    //viewUser
    var isViewed=false;
    var nowRowIndex;
    function viewUser(index){
        var thisTr=document.getElementById("tr"+index);
        var allNameStr1=localStorage.getItem("namebook");
        var allName=JSON.parse(allNameStr1);
        var userInfo=allName[index];
        var viewData='<ul style="list-style: none;padding: 0"><li>Username: '+userInfo.name+'</li><li>Email: '+userInfo.Email+
            '</li><li>Location: '+userInfo.location+'</li><li>Phone#: '+userInfo.phone+'</li></ul>';
        if(isViewed===false){
            $(thisTr).after('<tr id="view'+index+'" class="moreInfo"  style="display: none;background-color: #e1d6d0"><td colspan="6"><p>'+viewData+'</p></td></tr>');
            $(".moreInfo").fadeIn();
            nowRowIndex=index;
            isViewed=true;
        }else if(isViewed===true){
            var viewIndex=document.getElementById("view"+index);
            if(viewIndex===null){
                document.getElementById("view"+nowRowIndex).remove();
                $(thisTr).after('<tr id="view'+index+'" class="moreInfo"  style="display: none;background-color: #e1d6d0"><td colspan="6"><p>'+viewData+'</p></td></tr>');
                $(".moreInfo").fadeIn();
                nowRowIndex=index;
                isViewed=true;
            }else{
                viewIndex.remove();
                isViewed=false;
            }
        }
    }

    jQuery(document).on("click","#searchBar",function(){
        var allNameStr=localStorage.getItem("namebook");
        var allName=JSON.parse(allNameStr);
        jQuery(document).on("keyup","#searchBar",function(){
            var inputVal=jQuery(this).val().toLowerCase();
            for(var i=0;i<allName.length;i++){
                var jsonStr=JSON.stringify(allName[i]);
                if(jsonStr.toLowerCase().indexOf(inputVal)> -1){
                    document.getElementById("tr"+i).style.display="";
                }else{
                    document.getElementById("tr"+i).style.display="none";
                }
            }
        });
    });

    //submit btn
    function addUser(nameInput,emailInput,locationInput,phoneInput,type,index){
        var allNameStr1=localStorage.getItem("namebook");
        var allName=JSON.parse(allNameStr1);
        var newUser={
            "name":nameInput,
            "Email":emailInput,
            "location":locationInput,
            "phone":phoneInput
        };
        if(type=="edit"){
            allName.splice(index,1,newUser);
        }else if(type==="new"){
            allName.push(newUser);
        }
        var allNameStr=JSON.stringify(allName);
        localStorage.removeItem("namebook");
        localStorage.setItem("namebook",allNameStr);
        location.reload();
    }

    function validation(nameInput,emailInput,locationInput,phoneInput){
        if(nameInput==""){
            document.getElementById("nameAlert").style.display="block";
        }
        if(emailInput==""){
            document.getElementById("emailAlert").style.display="block";
        }
        if(locationInput==""){
            document.getElementById("locationAlert").style.display="block";
        }
        if(phoneInput==""){
            document.getElementById("phoneAlert").style.display="block";
        }
    }



