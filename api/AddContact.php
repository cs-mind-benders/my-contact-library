<?php header("Access-Control-Allow-Origin: *");
	$inData = getRequestInfo();
	
	
	$userId = $inData["userID"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];
	$contactId = "";
	$id = 0;
	
    $conn = new mysqli("localhost", "contacts_db_admin", "Team7cop$", "contacts_COP4331");
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
	    
		$sql = "INSERT INTO Contacts (UserID,FirstName,LastName,Email,Phone) VALUES ('".$userId."','".$firstName."','".$lastName."','".$email."','".$phone."')";
		
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
 		else 
 		{
 		    returnWithInfo($firstName, $lastName, $contactId);
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
	    $err = "There was an error while adding the new contact, please try again.";
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	

	
 	function returnWithInfo($firstName, $lastName, $contactId)
	{
 		$retValue = '{
 		"contactId":"'.$contactId.'",
 		"firstName":"'.$firstName.'",
 		"lastName":"'.$lastName.'",
 		"message":"Contact added successfully.",
 		"error":""
 		}';
 		sendResultInfoAsJson( $retValue );
 	}
	
?>