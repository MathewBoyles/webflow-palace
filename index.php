<?php
include('httpful.phar');


$uri = "https://api.webflow.com/collections/$collectionsid/items/?api_version=1.0.0&access_token=$apikey";
$response = \Httpful\Request::get($uri)
    ->send();
echo $response;



?>
<!-- <!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
    <h1>Test</h1>
  </body>
  <script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
  <script type="text/javascript" src="script.js">

  </script>
</html> --> -->
