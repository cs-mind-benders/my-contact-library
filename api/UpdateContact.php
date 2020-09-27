<?php header("Access-Control-Allow-Origin: *");
	$inData = getRequestInfo();
	
	$conn = new mysqli("localhost", "contacts_db_admin", "Team7cop$", "contacts_COP4331");
	    
	$id = $inData["contactID"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$err = "";
	

	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "UPDATE Contacts SET FirstName = '".$firstName."', LastName = '".$lastName."', Email = '".$email."', Phone = '".$phone."' WHERE ID = '".$id."'";
		if( $result = $conn->query($sql) != TRUE)
		{
			returnWithError( $conn->error );
		}
        else 
        {
    
            returnWithInfo($id, $firstName, $lastName);
        }
		$conn->close();
	}
	
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{
	    "error":"There was an error when updating your contact, please try again."
		}';
		sendResultInfoAsJson( $retValue );
	}
	
 	function returnWithInfo( $id, $firstName, $lastName)
 	{
 		$retValue = '{
 		"contactID":"'.$id.'",
 		"firstName":"'.$firstName.'",
 		"lastName":"'.$lastName.'",
 		"message":"Contact updated successfully.",
 		"error":""
 		}';
 		sendResultInfoAsJson( $retValue );
 	}
	

	
?>