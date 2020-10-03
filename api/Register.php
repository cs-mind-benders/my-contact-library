<?php header("Access-Control-Allow-Origin: *");


$inData = getRequestInfo();
$firstName = "";
$lastName = "";
$login = "";
$password = "";
$email = "";
$conn = new mysqli("localhost", "contacts_db_admin", "Team7cop$", "contacts_COP4331");

if ($conn->connect_error) 
{
    returnWithError( $conn->connect_error );
} 
else
{
    $firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $login = $inData["Login"];
    $password = $inData["Password"];
    $email = $inData["Email"];
    
    if (!$firstName || !$lastName || !$login || !$password || !$email) {
        returnWithError( "Please fill out all the fields." );
		return;
    }

    
	$sql = "INSERT INTO Users (FirstName, LastName, Login, Password, Email) 
	VALUES ('".$firstName."', '".$lastName."', '".$login."', '".$password."', '".$email."')";
	if( $result = $conn->query($sql) != TRUE )
	{
		returnWithError( $conn->error );
		return;
	}
    returnWithInfo();
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
function returnWithInfo()
 	{

        $retValue = '{
                "id":"' .$id. '",
    	        "firstName":"' . $firstName . '",
    	        "lastName":"' . $lastName . '", 
    	        "login":"'. $login .'",
    	        "password":"' . $password . '"
    	        }';
		sendResultInfoAsJson( $retValue );
 	}
?>