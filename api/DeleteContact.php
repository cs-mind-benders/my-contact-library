<?php header("Access-Control-Allow-Origin: *");
	$inData = getRequestInfo();
	
	$conn = new mysqli("localhost", "contacts_db_admin", "Team7cop$", "contacts_COP4331");
	
	$id = "";
	$firstName = "";
	$lastName = "";
	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
	    $id = $inData["contactID"];
	    $sql = "SELECT FirstName,LastName FROM Contacts where ID = '".$id."'";
		$result = $conn->query($sql);
		$row = $result->fetch_assoc();
		$firstName = $row["FirstName"];
		$lastName = $row["LastName"];
		
		$sql = "DELETE FROM Contacts WHERE ID = '".$id."'";
		if( $result = $conn->query($sql) != TRUE )
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
		$retValue = '{"error":"There was an error deleting your contact, please try again"}';
		sendResultInfoAsJson( $retValue );
	}
	
 	function returnWithInfo($id, $firstName, $lastName)
	{
 		$retValue = '{
 		"contactID":"'.$id.'",
 		"firstName":"'.$firstName.'",
 		"lastName":"'.$lastName.'",
 		"message":"Contact deleted successfully.",
 		"error":""
 		}';
 		sendResultInfoAsJson( $retValue );
 	}
	
?>