<?php header("Access-Control-Allow-Origin: *");

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "contacts_db_admin", "Team7cop$", "contacts_COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
    } 
    else
	{
		$sql = "SELECT * from Contacts Where (FirstName like '%" . $inData["search"] . 
		"%' or LastName like '%". $inData["search"] . 
		    "%' or CONCAT(FirstName,' ',LastName) like '%". $inData["search"].
		    "%'or Phone like '%" . $inData["search"].
		    "%'or Email like '%" . $inData["search"].
		    "%') and UserID=" . $inData["UserID"];
		$result = $conn->query($sql);
		if ($result->num_rows > 0)
		{
			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '{
				"firstName": "' . $row["FirstName"] . '",
				"lastName": "' . $row["LastName"] . '",
				"phone": "' . $row["Phone"] . '",
				"email": "' . $row["Email"] . '"
				}';
				
				// '"' . $row["FirstName"] . ' ' .$row["LastName"] . ' - '. $row["Phone"].' - '. $row["Email"].'"' ;
			}
			returnWithInfo( $searchResults );
		}
		else
		{
			returnWithError( "No Records Found" );
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
	    "results":[],
	    "error":"'
		. $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
